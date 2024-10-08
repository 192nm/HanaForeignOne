// DetailRemittance.js
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // useNavigate 추가
import { useSelector } from "react-redux"; // Redux 상태를 읽어오기 위한 훅
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  useDisclosure,
} from "@chakra-ui/react"; // 모달 관련 컴포넌트 추가

const DetailRemittance = () => {
  const location = useLocation();
  const navigate = useNavigate(); // useNavigate 초기화

  const {
    senderName,
    reason,
    reasonText, // 송금 사유에 대한 상세 설명
    phone,
    email,
    address,
    currency,
    transferAmount,
    requiredAmount,
    senderAccount, // 'account'를 'senderAccount'로 변경
    branch,
    receiverName,
    receiverAddress,
    receiverBank,
    receiverBankCode,
    receiverAccount,
    receiverEmail,
    remittanceType,
    reservationDate,
    targetRate, // 추가된 부분
    fileName,
    receiverSwiftCode, // SWIFT CODE 대신 receiverSwiftCode 사용
  } = location.state || {}; // 이전 페이지에서 넘겨받은 데이터

  // Redux 스토어에서 userId를 가져옵니다.
  const userId = useSelector((state) => state.auth.userId); // 실제 Redux 스토어 구조에 맞게 수정 필요

  // 상태 관리: 로딩, 성공 메시지
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(""); // 성공 메시지 상태 추가

  // 모달 제어를 위한 훅
  const {
    isOpen: isSuccessModalOpen,
    onOpen: openSuccessModal,
    onClose: closeSuccessModal,
  } = useDisclosure();

  // 모달 닫기 핸들러
  const handleSuccessModalClose = () => {
    closeSuccessModal();
    navigate("/"); // 모달 닫은 후 루트 경로로 이동
  };

  // API 호출 핸들러
  const handleConfirm = async () => {
    // 필수 필드 검증
    if (
      !senderName ||
      // !senderAccount ||
      !branch ||
      !receiverName ||
      !receiverAccount ||
      !receiverBankCode ||
      !receiverSwiftCode
    ) {
      alert("필수 필드를 모두 입력해주세요.");
      console.warn("필수 필드가 누락되었습니다."); // 경고 로그
      return;
    }

    // 송금 예약 시 필수 필드 검증
    if (remittanceType === "송금 예약") {
      if (!reservationDate || !targetRate) {
        alert("예약 기한과 목표 환율을 모두 입력해주세요.");
        console.warn("송금 예약 시 필수 필드가 누락되었습니다."); // 경고 로그
        return;
      }
    }

    setIsLoading(true);

    let apiUrl = "";
    let payload = {};

    if (remittanceType === "송금 예약") {
      apiUrl = "http://localhost:8081/reserveRemittance";
      payload = {
        userId: userId, // Redux에서 가져온 userId 사용
        amount: Number(transferAmount),
        currencyCode: currency,
        targetRate: Number(targetRate),
        receiverAccount: receiverAccount,
        receiverSwiftCode: receiverSwiftCode, // 올바른 변수 사용
        receiverBankCode: receiverBankCode,
        endDate: reservationDate,
        remittanceType: "SEND_EXCHANGE",
      };
    } else if (remittanceType === "즉시 송금") {
      apiUrl = "http://localhost:8081/sendExchange";
      payload = {
        senderId: userId, // Redux에서 가져온 userId 사용
        currencyCode: currency,
        amount: Number(transferAmount),
        receiverAccountNumber: receiverAccount,
        receiverSwiftCode: receiverSwiftCode, // 올바른 변수 사용
        receiverBankCode: receiverBankCode,
      };
    } else {
      alert("알 수 없는 송금 유형입니다.");
      console.error("알 수 없는 송금 유형:", remittanceType); // 오류 로그
      setIsLoading(false);
      return;
    }

    // 전송할 JSON 데이터를 콘솔에 출력
    console.log("API 요청 URL:", apiUrl);
    console.log("전송할 페이로드:", JSON.stringify(payload, null, 2));

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("API 요청이 완료되었습니다. 상태 코드:", response.status);

      // 송금 유형에 따른 성공 메시지 설정
      const message =
        remittanceType === "송금 예약"
          ? "송금예약이 완료되었습니다."
          : "송금신청이 완료되었습니다.";

      setSuccessMsg(message);
      openSuccessModal(); // 모달 열기

    } catch (error) {
      console.error("송금 요청 중 오류 발생:", error); // 오류 로그
      // 프론트엔드에서 에러 처리하지 않음
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md ">
      <h1 className="text-3xl font-bold mb-6 text-center">상세조회</h1>

      {/* 보내는 분 정보 */}
      <div className="">
        <h2 className="text-lg font-bold text-left">보내는 분 정보</h2>

        {/* 영문성명 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">
            영문성명
          </p>
          <div className="w-[70%] px-3 flex items-center">
            <p>{senderName}</p>
          </div>
        </div>

        {/* 송금사유 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">
            송금사유
          </p>
          <div className="w-[70%] px-3 flex items-center">
            <p>{reason}</p>
          </div>
        </div>

        {/* 송금사유 상세 설명 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">
            송금사유 상세
          </p>
          <div className="w-[70%] px-3 flex items-center">
            <p>{reasonText}</p>
          </div>
        </div>

        {/* 연락가능한 번호 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">
            연락가능한 번호
          </p>
          <div className="w-[70%] px-3 flex items-center">
            <p>{phone}</p>
          </div>
        </div>

        {/* 이메일주소 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">
            이메일주소
          </p>
          <div className="w-[70%] px-3 flex items-center">
            <p>{email}</p>
          </div>
        </div>

        {/* 송금인주소 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">
            송금인주소
          </p>
          <div className="w-[70%] px-3 flex items-center">
            <p>{address}</p>
          </div>
        </div>

        {/* 송금 유형 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">
            송금 유형
          </p>
          <div className="w-[70%] px-3 flex items-center">
            <p>{remittanceType}</p>
          </div>
        </div>

        {/* 예약일자 (송금 유형이 예약인 경우에만 표시) */}
        {remittanceType === "송금 예약" && (
          <>
            <div className="text-left flex border-y">
              <p className="w-[30%] bg-slate-100 p-3 flex items-center">
                예약 기한
              </p>
              <div className="w-[70%] px-3 flex items-center">
                <p>{reservationDate}</p>
              </div>
            </div>

            {/* 목표 환율 표시 */}
            <div className="text-left flex border-y">
              <p className="w-[30%] bg-slate-100 p-3 flex items-center">
                목표 환율
              </p>
              <div className="w-[70%] px-3 flex items-center">
                <p>{targetRate ? targetRate : "미정"}</p>
              </div>
            </div>
          </>
        )}

        <div className="mt-8 mb-6 w-full border border-gray-300"></div>

        {/* 송금 금액 정보 */}
        <h2 className="text-lg font-bold text-left">송금 금액 정보</h2>

        {/* 통화구분 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">
            통화구분
          </p>
          <div className="w-[70%] px-3 flex items-center">
            <p>{currency}</p>
          </div>
        </div>

        {/* 송금할 금액 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">
            송금할 금액
          </p>
          <div className="w-[70%] px-3 flex items-center">
            <p>
              {transferAmount} {currency}
            </p>
          </div>
        </div>

        {/* 필요 원화 금액 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">
            필요 원화 금액
          </p>
          <div className="w-[70%] px-3 flex items-center">
            <p>{requiredAmount} KRW</p>
          </div>
        </div>

        {/* 거래 외국환 은행 지정 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">
            거래 외국환 은행 지정
          </p>
          <div className="w-[70%] px-3 flex items-center">
            <p>{branch}</p>
          </div>
        </div>
      </div>

      {/* 받는 분 정보 추가 */}
      <div className="mt-12">
        <h2 className="text-lg font-bold text-left">받는 분 정보</h2>

        {/* 받는 분 성함 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">
            받는 분 성함
          </p>
          <div className="w-[70%] px-3 flex items-center">
            <p>{receiverName}</p>
          </div>
        </div>

        {/* 입금은행/지점주소 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">
            입금은행/지점주소
          </p>
          <div className="w-[70%] px-3 flex items-center">
            <p>{receiverBank}</p>
          </div>
        </div>

        {/* SWIFT CODE */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">
            SWIFT CODE
          </p>
          <div className="w-[70%] px-3 flex items-center">
            <p>{receiverSwiftCode}</p>
          </div>
        </div>

        {/* Bank Code */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">
            Bank Code
          </p>
          <div className="w-[70%] px-3 flex items-center">
            <p>{receiverBankCode}</p>
          </div>
        </div>

        {/* 입금계좌번호 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">
            계좌번호
          </p>
          <div className="w-[70%] px-3 flex items-center">
            <p>{receiverAccount}</p>
          </div>
        </div>

        {/* 송금받는분 이메일 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">
            송금받는분 이메일
          </p>
          <div className="w-[70%] px-3 flex items-center">
            <p>{receiverEmail}</p>
          </div>
        </div>

        {/* 즐겨찾기 목록에서 정보 가져오기 버튼 */}
        <div className="mt-4 flex justify-end">
          <button className="px-4 py-2 bg-slate-700 text-sm text-white shadow-sm duration-200">
            즐겨찾기 목록에서 정보 가져오기
          </button>
        </div>
      </div>

      {/* 확인 버튼 */}
      <div className="mt-6 flex justify-center gap-5">
        <button
          onClick={() => window.history.back()}
          className="px-20 py-3 bg-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hana duration-300 hover:opacity-80"
        >
          수정
        </button>

        <button
          onClick={handleConfirm}
          className="px-20 py-3 bg-hana text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hana duration-300 hover:opacity-80"
          disabled={isLoading} // 로딩 중일 때 버튼 비활성화
        >
          확인
        </button>
      </div>

      {/* 성공 모달 */}
      <Modal isOpen={isSuccessModalOpen} onClose={handleSuccessModalClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>알림</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>{successMsg}</p>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSuccessModalClose}>
              확인
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default DetailRemittance;
