// DetailWalletRemi.js
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux"; // Redux 상태를 읽어오기 위한 훅
import { useLocation, useNavigate } from "react-router-dom";

const DetailWalletRemi = () => {
  const location = useLocation();
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅

  // Redux 스토어에서 userId를 가져옵니다.
  const userId = useSelector((state) => state.auth.userId); // 실제 Redux 스토어 구조에 맞게 수정 필요

  // WalletRemi.js에서 전달된 데이터 구조에 맞게 필드 이름 변경
  const {
    currencyCode,
    amount,
    receiverAccountNumber,
    receiverSwiftCode,
    receiverBankCode,
  } = location.state || {}; // 이전 페이지에서 넘겨받은 데이터

  const [isModalOpen, setIsModalOpen] = useState(true); // 모달 상태 관리
  const [fetchedWalletBalance, setFetchedWalletBalance] = useState(null); // 서버에서 가져온 지갑 잔액
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [fetchError, setFetchError] = useState(null); // 오류 상태

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // 송금내역 확인하기 핸들러
  const handleCheckLog = () => {
    navigate("/log-remittance"); // LogRemi.jsx로 이동
  };

  // 송금 관련 추가 정보가 없는 경우 기본값 설정
  const receiverName = location.state?.receiverName || "";
  const receiverEmail = location.state?.receiverEmail || "";
  const receiverBank = location.state?.receiverBank || "";

  // useEffect로 지갑 잔여 금액 가져오기
  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const response = await fetch("http://localhost:8081/walletInfoById", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: userId }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch wallet balance");
        }

        const data = await response.json(); // 응답 데이터는 배열 형태

        // 송금에 사용된 통화 코드에 해당하는 지갑 정보 찾기
        const wallet = data.find((item) => item.currencyCode === currencyCode);

        if (wallet) {
          setFetchedWalletBalance(wallet);
        } else {
          setFetchedWalletBalance(null);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching wallet balance:", error);
        setFetchError("지갑 잔여 금액을 가져오는 중 오류가 발생했습니다.");
        setLoading(false);
      }
    };

    if (userId && currencyCode) {
      fetchWalletBalance();
    }
  }, [userId, currencyCode]);

  // 필수 데이터가 누락된 경우 처리
  if (
    !currencyCode ||
    !amount ||
    !receiverAccountNumber ||
    !receiverSwiftCode ||
    !receiverBankCode
  ) {
    return (
      <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">데이터 오류</h1>
        <p className="text-center">필수 송금 정보가 누락되었습니다.</p>
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-20 py-3 bg-hana text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hana duration-300 hover:opacity-80"
          >
            뒤로가기
          </button>
        </div>
      </div>
    );
  }

  // Map for currencyCode to total field
  const totalMap = {
    KRW: "totalKrw",
    USD: "totalUsd",
    EUR: "totalEur",
    JPY: "totalJpy",
    CNY: "totalCny",
  };

  // Get total amount in selected currency
  const totalAmount =
    fetchedWalletBalance && totalMap[currencyCode] in fetchedWalletBalance
      ? fetchedWalletBalance[totalMap[currencyCode]]
      : null;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">지갑 송금 상세 조회</h1>

      {/* 지갑 정보 */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-left">지갑 정보</h2>

        {/* 선택한 통화 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3">선택한 통화</p>
          <div className="w-[70%] px-3 flex items-center">
            <p>{currencyCode}</p>
          </div>
        </div>

        {/* 송금할 금액 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3">송금 금액</p>
          <div className="w-[70%] px-3 flex items-center">
            <p>
              {amount} {currencyCode}
            </p>
          </div>
        </div>

        {/* 잔여 지갑 잔액 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3">지갑 잔여 금액</p>
          <div className="w-[70%] px-3 flex items-center">
            <p>
              {loading
                ? "로딩 중..."
                : totalAmount !== null
                ? `${totalAmount} ${currencyCode}`
                : ""}
            </p>
          </div>
        </div>
      </div>

      {/* 받는 분 정보 추가 */}
      <div className="space-y-4 mt-12">
        <h2 className="text-lg font-bold text-left">받는 분 정보</h2>

        {/* 받는 분 성함 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3">받는 분 성함</p>
          <div className="w-[70%] px-3 flex items-center">
            <p>{receiverName}</p>
          </div>
        </div>

        {/* 받는 분 계좌번호 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3">받는 분 계좌번호</p>
          <div className="w-[70%] px-3 flex items-center">
            <p>{receiverAccountNumber}</p>
          </div>
        </div>

        {/* 받는 분 은행 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3">받는 분 은행</p>
          <div className="w-[70%] px-3 flex items-center">
            <p>{receiverBank}</p>
          </div>
        </div>

        {/* 받는 분 SWIFT CODE */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3">받는 분 SWIFT CODE</p>
          <div className="w-[70%] px-3 flex items-center">
            <p>{receiverSwiftCode}</p>
          </div>
        </div>

        {/* 받는 분 은행 코드 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3">받는 분 은행 코드</p>
          <div className="w-[70%] px-3 flex items-center">
            <p>{receiverBankCode}</p>
          </div>
        </div>

        {/* 받는 분 이메일 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3">받는 분 이메일</p>
          <div className="w-[70%] px-3 flex items-center">
            <p>{receiverEmail}</p>
          </div>
        </div>
      </div>

      {/* 모달 (송금 완료 메시지) */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-white rounded-lg p-6 max-w-md w-full text-center space-y-6">
            {/* 우측 상단 X 버튼 */}
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none text-2xl"
              aria-label="닫기"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold">외화 송금 신청이 완료되었습니다</h2>
            <p>
              {receiverName}님에게 {amount} {currencyCode} 송금신청이 완료되었습니다.
              <br />
              잔여 지갑 금액은{" "}
              {loading
                ? "로딩 중..."
                : totalAmount !== null
                ? `${totalAmount} ${currencyCode}`
                : ""}{" "}
              입니다.
            </p>
            <div className="flex justify-end mt-6 gap-3">
              {/* 송금내역 확인하기 버튼 */}
              <button
                onClick={handleCheckLog}
                className="px-6 py-3 bg-hana text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hana hover:opacity-80 duration-200"
              >
                송금내역 확인하기
              </button>
              {/* 닫기 버튼 */}
              <button
                onClick={handleCloseModal}
                className="px-6 py-3 bg-gray-300 text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 hover:opacity-80"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 확인 버튼 */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => navigate(-1)}
          className="px-20 py-3 bg-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hana duration-300 hover:opacity-80"
        >
          확인
        </button>
      </div>

      {/* 오류 메시지 */}
      {fetchError && (
        <div className="mt-6 text-center text-red-600 font-bold">
          {fetchError}
        </div>
      )}
    </div>
  );
};

export default DetailWalletRemi;
