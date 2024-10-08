// AccountRemi.js
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import RemiUpload from "./RemiUpload"; // Adjust the path as needed
import axios from "axios";
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
} from "@chakra-ui/react";

const AccountRemi = () => {
  // 송금 유형 및 예약 기한 상태
  const [remittanceType, setRemittanceType] = useState("즉시 송금");
  const [reservationDate, setReservationDate] = useState("");

  // 송금 정보 상태
  const [currency, setCurrency] = useState("USD");
  const [transferAmount, setTransferAmount] = useState(0.0);
  const [requiredAmount, setRequiredAmount] = useState(0.0);
  const [password, setPassword] = useState("");
  const [branch, setBranch] = useState("");
  const [reason, setReason] = useState(
    "미화 5천불 상당액 이하 증빙서류 미제출 송금"
  );
  const [file, setFile] = useState(null);
  const [targetRate, setTargetRate] = useState(""); // 추가된 상태

  // Exchange rates and loading state
  const [exchangeRates, setExchangeRates] = useState(null);
  const [loading, setLoading] = useState(true);

  // 보내는 분 정보 상태
  const [senderName, setSenderName] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [senderAddress, setSenderAddress] = useState("");

  // 받는 분 정보 상태
  const [receiverName, setReceiverName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState(""); // 추가된 상태
  const [receiverAddress, setReceiverAddress] = useState("");
  const [receiverBank, setReceiverBank] = useState("");
  const [receiverSwiftCode, setReceiverSwiftCode] = useState(""); // SWIFT CODE 상태
  const [receiverBankCode, setReceiverBankCode] = useState(""); // Bank Code 상태
  const [receiverAccount, setReceiverAccount] = useState("");
  const [receiverEmail, setReceiverEmail] = useState("");
  const [currencySelection, setCurrencySelection] = useState(""); // 추가된 상태

  const navigate = useNavigate();
  const finalFocusRef = useRef(null); // 추가된 부분

  // 즐겨찾기 관련 상태
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState([]);

  // 메시지 모달 관련 상태
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageModalContent, setMessageModalContent] = useState("");

  // 송금 사유에 따른 설명 텍스트 반환 함수
  const getReasonText = (selectedReason) => {
    switch (selectedReason) {
      case "미화 5천불 상당액 이하 증빙서류 미제출 송금":
        return "순수한 증여성 송금 이외의 해외부동산 취득, 유학생경비, 재외동포 국내재산반출, 해외차입금 상환 등을 목적으로 송금하실 경우에는 외국환거래규정에 의해 제한되므로 유의하셔야 합니다.";
      case "해외 유학생의 유학경비 송금":
        return "해외 유학생의 유학경비 송금 관련 내용입니다.";
      case "미화 5천불 상당액 초과 증빙서류 미제출 송금":
        return "미화 5천불 상당액 초과 증빙서류 미제출 송금 관련 내용입니다.";
      default:
        return "";
    }
  };

  // 메시지 모달 열기 함수
  const showMessage = (message) => {
    setMessageModalContent(message);
    setIsMessageModalOpen(true);
  };

  // 메시지 모달 닫기 함수
  const closeMessageModal = () => {
    setIsMessageModalOpen(false);
    setMessageModalContent("");
  };

  // 송금 제출 핸들러
  const handleFinalSubmit = () => {
    if (!file) {
      showMessage("파일을 선택해주세요.");
      return;
    }

    if (remittanceType === "송금 예약" && !reservationDate) {
      showMessage("예약 기한을 선택해주세요.");
      return;
    }

    // 송금 예약 시 targetRate 입력 필수
    if (remittanceType === "송금 예약" && !targetRate) {
      showMessage("목표 환율을 입력해주세요.");
      return;
    }

    // 송금 사유 설명 텍스트
    const reasonText = getReasonText(reason);

    // 최종 송금 데이터 객체 생성
    const remittanceData = {
      senderName,
      reason, // 실제 송금 사유 텍스트
      reasonText, // 송금 사유에 대한 상세 설명
      phone: senderPhone,
      email: senderEmail,
      address: senderAddress,
      currency,
      transferAmount,
      requiredAmount,
      branch,
      receiverName,
      receiverPhone, // 추가된 필드
      receiverAddress,
      receiverBank,
      receiverSwiftCode, // SWIFT CODE 추가
      receiverBankCode, // BankCode 추가
      receiverAccount,
      receiverEmail,
      remittanceType,
      reservationDate,
      targetRate: remittanceType === "송금 예약" ? targetRate : "", // 추가된 필드
      currencySelection, // 추가된 필드
      fileName: file ? file.name : "",
    };

    // 상세 조회 페이지로 데이터 전달
    navigate("/detail-remittance", { state: remittanceData });

    // 송금이 성공적으로 처리된 것처럼 메시지 표시
    showMessage(
      remittanceType === "즉시 송금"
        ? "송금이 성공적으로 완료되었습니다."
        : "송금 예약이 성공적으로 완료되었습니다."
    );
  };

  // 즐겨찾기 목록 가져오기 핸들러
  const handleFetchFavorites = () => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
    setShowFavorites(true);
  };

  // 즐겨찾기 선택 시 폼 필드 업데이트 핸들러
  const handleSelectFavorite = (index) => {
    const selectedFavorite = favorites[index];
    if (selectedFavorite) {
      setCurrency(selectedFavorite.currency);
      setRemittanceType(selectedFavorite.remittanceType);
      setReason(selectedFavorite.reason);
      setSenderName(selectedFavorite.name);
      setSenderPhone(selectedFavorite.phone);
      setSenderEmail(selectedFavorite.email);
      setSenderAddress(selectedFavorite.address);
      setReceiverName(selectedFavorite.recipientName);
      setReceiverPhone(selectedFavorite.recipientPhone);
      setReceiverEmail(selectedFavorite.recipientEmail);
      setReceiverAddress(selectedFavorite.recipientAddress);
      setCurrencySelection(selectedFavorite.currencySelection);
      setReceiverBank(selectedFavorite.bankName);
      setReceiverBankCode(selectedFavorite.bankCode);
      setReceiverAccount(selectedFavorite.accountNumber);
      setBranch(selectedFavorite.branch); // 추가된 필드
      setReceiverSwiftCode(selectedFavorite.recipientSwiftCode); // 추가된 필드
      // 필요한 다른 필드도 추가로 설정할 수 있습니다.
    }
    setShowFavorites(false);
  };

  // 즐겨찾기 목록 닫기 핸들러
  const handleCloseFavorites = () => {
    setShowFavorites(false);
  };

  // 로컬스토리지에서 즐겨찾기 삭제 핸들러
  const handleClearFavorites = () => {
    localStorage.removeItem("favorites");
    setFavorites([]);
    showMessage("즐겨찾기 목록이 삭제되었습니다.");
  };

  // Chakra UI의 useDisclosure 훅 사용하여 업로드 모달 제어
  const { isOpen, onOpen, onClose } = useDisclosure();

  // 업로드된 파일을 설정하는 함수
  const handleUploadSuccess = (uploadedFile) => {
    setFile(uploadedFile);
    onClose();
    showMessage("파일이 성공적으로 업로드되었습니다.");
  };

  // 환율 정보 가져오기
  useEffect(() => {
    fetchExchangeRates();
  }, []);

  const fetchExchangeRates = async () => {
    try {
      const response = await axios.post("http://localhost:8081/realtime4All");
      console.log("Exchange rates fetched:", response.data);
      setExchangeRates(response.data);
      setLoading(false);
    } catch (error) {
      console.error("환율 정보를 불러오는 중 오류가 발생했습니다.", error);
      setLoading(false);
    }
  };

  // 필요 원화 금액 계산
  useEffect(() => {
    if (exchangeRates && transferAmount && currency) {
      // 선택된 통화에 대한 환율 정보를 찾습니다.
      const rateInfo = exchangeRates.find(
        (rate) => rate.currencyCode === currency
      );
      if (rateInfo) {
        let sendBuyRate = parseFloat(
          rateInfo.sendBuyRate.toString().replace(/,/g, "")
        );

        // JPY의 경우, 환율이 100엔당 표시되므로 조정합니다.
        if (currency === "JPY") {
          sendBuyRate = sendBuyRate / 100;
        }

        const calculatedAmount = transferAmount * sendBuyRate;
        setRequiredAmount(calculatedAmount);
      } else {
        setRequiredAmount(0);
      }
    } else {
      setRequiredAmount(0);
    }
  }, [exchangeRates, transferAmount, currency]);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md space-y-6">
      <h1 className="mt-4 text-3xl font-bold mb-4">해외송금 보내기</h1>

      {/* 송금 유형 선택 */}
      <div>
        <h2 className="text-lg font-bold text-left">송금 유형 선택</h2>
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">
            송금 유형
          </p>
          <div className="w-[70%] px-3 flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="remittanceType"
                value="즉시 송금"
                checked={remittanceType === "즉시 송금"}
                onChange={(e) => setRemittanceType(e.target.value)}
                className="w-4 h-4"
              />
              <span className="ml-2">즉시 송금</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="remittanceType"
                value="송금 예약"
                checked={remittanceType === "송금 예약"}
                onChange={(e) => setRemittanceType(e.target.value)}
                className="w-4 h-4"
              />
              <span className="ml-2">송금 예약</span>
            </label>
          </div>
        </div>

        {/* 예약일 경우 예약 기간 설정 */}
        {remittanceType === "송금 예약" && (
          <>
            <div className="text-left flex border-y">
              <p className="w-[30%] bg-slate-100 p-3 flex items-center">
                예약 기한
              </p>
              <div className="w-[70%] px-3 flex items-center">
                <input
                  type="date"
                  value={reservationDate}
                  onChange={(e) => setReservationDate(e.target.value)}
                  className="w-full p-2 h-10 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* 목표 환율 입력 필드 추가 */}
            <div className="text-left flex border-y">
              <p className="w-[30%] bg-slate-100 p-3 flex items-center">
                목표 환율
              </p>
              <div className="w-[70%] px-3 flex items-center">
                <input
                  type="number"
                  value={targetRate}
                  onChange={(e) => setTargetRate(e.target.value)}
                  className="w-full p-2 h-10 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="목표 환율을 입력하세요"
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* 보내는 분 정보 */}
      <div>
        <h2 className="text-lg font-bold text-left">보내는 분 정보</h2>

        {/* 영문성명 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">영문성명</p>
          <div className="w-[70%] px-3 flex items-center">
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              className="w-full p-2 h-10 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="보내는 분의 영문성명을 입력하세요"
            />
          </div>
        </div>

        {/* 송금사유 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">송금사유</p>
          <div className="w-[70%] px-3 flex flex-col">
            <div>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="reason"
                  value="미화 5천불 상당액 이하 증빙서류 미제출 송금"
                  checked={
                    reason === "미화 5천불 상당액 이하 증빙서류 미제출 송금"
                  }
                  onChange={(e) => setReason(e.target.value)}
                  className="w-4 h-4"
                />
                <span className="ml-2">
                  미화 5천불 상당액 이하 증빙서류 미제출 송금
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="reason"
                  value="해외 유학생의 유학경비 송금"
                  checked={reason === "해외 유학생의 유학경비 송금"}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-4 h-4"
                />
                <span className="ml-2">해외 유학생의 유학경비 송금</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="reason"
                  value="미화 5천불 상당액 초과 증빙서류 미제출 송금"
                  checked={
                    reason === "미화 5천불 상당액 초과 증빙서류 미제출 송금"
                  }
                  onChange={(e) => setReason(e.target.value)}
                  className="w-4 h-4"
                />
                <span className="ml-2">
                  미화 5천불 상당액 초과 증빙서류 미제출 송금
                </span>
              </label>
            </div>
            <textarea
              className="w-full p-2 h-32 mt-2 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={getReasonText(reason)}
              readOnly
            />
          </div>
        </div>

        {/* 연락가능한 번호 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">
            연락가능한 번호
          </p>
          <div className="w-[70%] px-3 flex items-center">
            <input
              type="text"
              value={senderPhone}
              onChange={(e) => setSenderPhone(e.target.value)}
              className="w-full p-2 h-10 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="보내는 분의 핸드폰 번호를 입력하세요"
            />
          </div>
        </div>

        {/* 이메일주소 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">
            이메일주소
          </p>
          <div className="w-[70%] px-3 flex items-center">
            <input
              type="email"
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
              className="w-full p-2 h-10 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="보내는 분의 이메일주소를 입력하세요"
            />
          </div>
        </div>

        {/* 송금인 주소 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">
            송금인 주소
          </p>
          <div className="w-[70%] px-3 flex items-center">
            <input
              type="text"
              value={senderAddress}
              onChange={(e) => setSenderAddress(e.target.value)}
              className="w-full p-2 h-10 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="보내는 분의 주소를 입력하세요"
            />
          </div>
        </div>

        <div className="mt-8 mb-5 w-full border border-gray-200"></div>

        {/* 송금 금액 정보 */}
        <h2 className="text-lg font-bold text-left">출금 및 송금 금액 정보</h2>

        {/* 통화구분 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">통화구분</p>
          <div className="w-[70%] px-3 flex items-center">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full p-2 h-10 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="USD">미국달러(USD)</option>
              <option value="JPY">일본엔(JPY)</option>
              <option value="CNY">중국위안(CNY)</option>
              <option value="EUR">유럽유로(EUR)</option>
            </select>
          </div>
        </div>

        {/* 송금할 금액 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">
            송금할 금액
          </p>
          <div className="w-[70%] px-3 flex items-center">
            <input
              type="number"
              value={transferAmount}
              onChange={(e) => setTransferAmount(parseFloat(e.target.value))}
              className="w-full p-2 h-10 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="송금할 금액을 입력하세요"
            />
          </div>
        </div>

        {/* 필요 원화 금액 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">
            필요 원화 금액
          </p>
          <div className="w-[70%] px-3 flex items-center">
            <input
              type="text"
              value={
                requiredAmount
                  ? requiredAmount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  : ""
              }
              onChange={(e) => {}}
              className="w-full p-2 h-10 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-gray-100"
              readOnly
            />
          </div>
        </div>

        {/* 계좌 비밀번호 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">
            계좌 비밀번호
          </p>
          <div className="w-[70%] px-3 flex items-center">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 h-10 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="계좌 비밀번호를 입력하세요"
            />
          </div>
        </div>

        {/* 거래 외국환 은행 지정 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">
            거래 외국환 은행 지정
          </p>
          <div className="w-[70%] px-3 flex items-center">
            <input
              type="text"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full p-2 h-10 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="영업점을 입력하세요"
            />
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
            <input
              type="text"
              value={receiverName}
              onChange={(e) => setReceiverName(e.target.value)}
              className="w-full p-2 h-10 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="받는 분의 성함을 입력하세요"
            />
          </div>
        </div>

        {/* 받는 분 전화번호 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">
            받는 분 전화번호
          </p>
          <div className="w-[70%] px-3 flex items-center">
            <input
              type="text"
              value={receiverPhone}
              onChange={(e) => setReceiverPhone(e.target.value)}
              className="w-full p-2 h-10 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="받는 분의 전화번호를 입력하세요"
            />
          </div>
        </div>

        {/* 입금은행/지점주소 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">
            입금은행/지점주소
          </p>
          <div className="w-[70%] px-3 flex items-center">
            <input
              type="text"
              value={receiverBank}
              onChange={(e) => setReceiverBank(e.target.value)}
              className="w-full p-2 h-10 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="받는 분의 은행을 입력하세요"
            />
          </div>
        </div>

        {/* SWIFT CODE */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">
            SWIFT CODE
          </p>
          <div className="w-[70%] px-3 flex items-center">
            <input
              type="text"
              value={receiverSwiftCode}
              onChange={(e) => setReceiverSwiftCode(e.target.value)}
              className="w-full p-2 h-10 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="SWIFT CODE를 입력하세요"
            />
          </div>
        </div>

        {/* BankCode */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">
            Bank Code
          </p>
          <div className="w-[70%] px-3 flex items-center">
            <input
              type="text"
              value={receiverBankCode}
              onChange={(e) => setReceiverBankCode(e.target.value)}
              className="w-full p-2 h-10 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Bank Code를 입력하세요"
            />
          </div>
        </div>

        {/* 입금계좌번호 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">계좌번호</p>
          <div className="w-[70%] px-3 flex items-center">
            <input
              type="text"
              value={receiverAccount}
              onChange={(e) => setReceiverAccount(e.target.value)}
              className="w-full p-2 h-10 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="입금 계좌번호를 입력하세요"
            />
          </div>
        </div>

        {/* 송금받는분 이메일 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">
            송금받는분 이메일
          </p>
          <div className="w-[70%] px-3 flex items-center">
            <input
              type="email"
              value={receiverEmail}
              onChange={(e) => setReceiverEmail(e.target.value)}
              className="w-full p-2 h-10 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="송금받는 분의 이메일을 입력하세요"
            />
          </div>
        </div>

        {/* 즐겨찾기 목록에서 정보 가져오기 버튼 */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleFetchFavorites}
            className="px-4 py-2 bg-slate-700 text-sm text-white shadow-sm duration-200 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-700 rounded-md"
          >
            즐겨찾기 목록에서 정보 가져오기
          </button>
        </div>
      </div>

      {/* 입증서류 제출 */}
      <div className="mt-4">
        <h2 className="text-lg font-bold text-left mb-2">입증서류 제출</h2>

        {/* 파일 선택 */}
        <div className="text-left flex items-center border-y py-3">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">
            파일 선택
          </p>
          <div className="w-[70%] px-3 flex items-center">
            {/* 기존 파일 입력을 제거하고 UploadModal을 여는 버튼으로 대체 */}
            <Button colorScheme="teal" onClick={onOpen}>
              서류 업로드
            </Button>
            <span className="ml-2 whitespace-nowrap">
              {file ? file.name : "파일 없음"}
            </span>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button className="px-4 py-2 bg-slate-700 text-white duration-200 text-sm shadow-sm hover:opacity-80 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-700">
            등록된 서류 불러오기
          </button>
        </div>

        {/* 최종송금하기 버튼 */}
        <div className="mt-6 flex items-center gap-5 justify-end">
          <button
            onClick={() => window.history.back()}
            className="px-20 py-3 bg-gray-400 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 duration-300 hover:opacity-80 rounded-md"
          >
            취소하기
          </button>
          <button
            onClick={handleFinalSubmit}
            className="px-20 py-3 bg-hana text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hana duration-200 hover:opacity-80 rounded-md"
            ref={finalFocusRef} // 추가된 부분
          >
            {remittanceType === "즉시 송금" ? "송금하기" : "예약하기"}
          </button>
        </div>
      </div>

      {/* 즐겨찾기 목록 모달 */}
      {showFavorites && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg w-3/4 max-w-lg p-6">
            <h2 className="text-xl font-bold mb-4">즐겨찾기 목록</h2>
            {favorites.length === 0 ? (
              <p>저장된 즐겨찾기가 없습니다.</p>
            ) : (
              <ul className="space-y-2">
                {favorites.map((fav, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>
                      {fav.senderName} - {fav.receiverBank}
                    </span>
                    <button
                      onClick={() => handleSelectFavorite(index)}
                      className="px-3 py-1 bg-hana text-white rounded-md hover:bg-hana-dark"
                    >
                      선택
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-6 flex justify-between">
              <button
                onClick={handleClearFavorites} // 전체 삭제 버튼
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                전체 삭제
              </button>
              <button
                onClick={handleCloseFavorites}
                className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 서류 업로드 모달 */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
        isCentered
        finalFocusRef={finalFocusRef} // 추가된 부분
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>서류 업로드</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <RemiUpload
              onBackClick={onClose}
              onUploadComplete={handleUploadSuccess}
              setModalSize={() => {}}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* 메시지 모달 */}
      <Modal
        isOpen={isMessageModalOpen}
        onClose={closeMessageModal}
        isCentered
        finalFocusRef={finalFocusRef} // 추가된 부분 (선택사항)
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>알림</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{messageModalContent}</ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={closeMessageModal}>
              닫기
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AccountRemi;
