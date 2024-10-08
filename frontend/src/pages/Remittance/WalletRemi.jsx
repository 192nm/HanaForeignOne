// WalletRemi.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"; // Redux 상태를 읽어오기 위한 훅
import axios from "axios"; // API 호출을 위한 axios
import {
  Box,
  Spinner,
  Text,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";

const WalletRemi = () => {
  const [currency, setCurrency] = useState("USD"); // 선택한 통화
  const [walletData, setWalletData] = useState([]); // 실제 지갑 데이터
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [fetchError, setFetchError] = useState(""); // 데이터 fetch 오류 메시지

  const [transferAmount, setTransferAmount] = useState(0.0); // 송금 금액
  const [receiverName, setReceiverName] = useState(""); // 받는 분 성함
  const [receiverAccount, setReceiverAccount] = useState(""); // 받는 분 계좌번호
  const [receiverBank, setReceiverBank] = useState(""); // 받는 분 은행
  const [receiverEmail, setReceiverEmail] = useState(""); // 받는 분 이메일
  const [receiverSwiftCode, setReceiverSwiftCode] = useState(""); // 받는 분 SWIFT CODE (추가)
  const [receiverBankCode, setReceiverBankCode] = useState(""); // 받는 분 은행 코드 (추가)
  const [successMessage, setSuccessMessage] = useState(""); // 송금 성공 메시지
  const [errorMessage, setErrorMessage] = useState(""); // 송금 오류 메시지 (추가)

  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅

  // Redux 스토어에서 userId를 가져옵니다.
  const userId = useSelector((state) => state.auth.userId); // 실제 Redux 스토어 구조에 맞게 수정 필요

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const response = await axios.post("http://localhost:8081/walletInfoById", {
          id: userId,
        });
        console.log("Wallet data fetched:", response.data);
        setWalletData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("지갑 정보를 불러오는 중 오류가 발생했습니다.", error);
        setFetchError("지갑 정보를 불러오는 중 오류가 발생했습니다.");
        setLoading(false);
      }
    };

    if (userId) {
      fetchWalletData();
    } else {
      setFetchError("사용자 ID를 찾을 수 없습니다.");
      setLoading(false);
    }
  }, [userId]);

  const handleTransfer = async () => {
    // 입력 필드 검증
    if (
      transferAmount <= 0 ||
      !receiverName ||
      !receiverAccount ||
      !receiverBank ||
      !receiverEmail ||
      !receiverSwiftCode ||
      !receiverBankCode
    ) {
      alert("모든 필드를 올바르게 입력해주세요.");
      return;
    }

    // 선택한 통화의 잔액 확인
    const selectedWallet = walletData.find(
      (wallet) => wallet.currencyCode === currency
    );

    if (!selectedWallet) {
      alert("선택한 통화의 지갑을 찾을 수 없습니다.");
      return;
    }

    // 송금할 금액이 실제 잔액보다 큰지 확인
    const selectedCurrencyAmount =
      currency === "KRW"
        ? selectedWallet.totalKrw
        : currency === "USD"
        ? selectedWallet.totalUsd
        : currency === "EUR"
        ? selectedWallet.totalEur
        : currency === "JPY"
        ? selectedWallet.totalJpy
        : currency === "CNY"
        ? selectedWallet.totalCny
        : 0;

    if (transferAmount > selectedCurrencyAmount) {
      alert("지갑 잔액이 부족합니다.");
      return;
    }

    // 송금 데이터 객체 생성
    const payload = {
      senderId: userId, // Redux에서 가져온 userId 사용
      currencyCode: currency,
      amount: Number(transferAmount),
      receiverAccountNumber: receiverAccount,
      receiverSwiftCode: receiverSwiftCode,
      receiverBankCode: receiverBankCode,
      receiverName: receiverName,
      receiverEmail: receiverEmail,
      receiverBank: receiverBank,
    };

    console.log("송금 요청 페이로드:", JSON.stringify(payload, null, 2));

    try {
      const response = await axios.post("http://localhost:8081/sendFx", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status !== 200) {
        console.error("송금 요청 오류:", response.data);
        setErrorMessage("송금 요청 중 오류가 발생했습니다.");
        return;
      }

      // 송금 성공 시 지갑 데이터 업데이트
      const updatedWalletData = walletData.map((wallet) => {
        if (wallet.currencyCode === currency) {
          const updatedAmount =
            currency === "KRW"
              ? wallet.totalKrw - Number(transferAmount)
              : currency === "USD"
              ? wallet.totalUsd - Number(transferAmount)
              : currency === "EUR"
              ? wallet.totalEur - Number(transferAmount)
              : currency === "JPY"
              ? wallet.totalJpy - Number(transferAmount)
              : currency === "CNY"
              ? wallet.totalCny - Number(transferAmount)
              : 0;

          return {
            ...wallet,
            totalKrw: currency === "KRW" ? updatedAmount : wallet.totalKrw,
            totalUsd: currency === "USD" ? updatedAmount : wallet.totalUsd,
            totalEur: currency === "EUR" ? updatedAmount : wallet.totalEur,
            totalJpy: currency === "JPY" ? updatedAmount : wallet.totalJpy,
            totalCny: currency === "CNY" ? updatedAmount : wallet.totalCny,
          };
        }
        return wallet;
      });

      setWalletData(updatedWalletData);

      // 성공 메시지 설정
      const successMsg = `${receiverName}님에게 ${transferAmount} ${currency} 송금이 완료되었습니다.`;
      setSuccessMessage(successMsg);
      setErrorMessage("");

      // 송금 완료 후 DetailWalletRemi 페이지로 데이터 전달하며 이동
      const remittanceData = {
        senderId: userId,
        currencyCode: currency,
        amount: Number(transferAmount),
        receiverAccountNumber: receiverAccount,
        receiverSwiftCode: receiverSwiftCode,
        receiverBankCode: receiverBankCode,
        receiverName: receiverName, // 받는 분 성함 추가
        receiverEmail: receiverEmail, // 받는 분 이메일 추가
        receiverBank: receiverBank, // 받는 분 은행 추가
      };

      navigate("/detail-wallet-remi", { state: remittanceData });
    } catch (error) {
      console.error("송금 요청 중 오류 발생:", error);
      setErrorMessage("송금 요청 중 오류가 발생했습니다.");
    }
  };

  if (loading) {
    return (
      <Box className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md flex flex-col items-center">
        <Spinner size="xl" />
        <Text className="mt-4 text-center">지갑 정보를 불러오는 중...</Text>
      </Box>
    );
  }

  if (fetchError) {
    return (
      <Box className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md">
        <Alert status="error">
          <AlertIcon />
          {fetchError}
        </Alert>
      </Box>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md">
      <h1 className="text-3xl font-bold mb-4 text-center">지갑에서 송금</h1>

      {/* 지갑 잔액 정보 */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-left">지갑 잔액</h2>
        <div className="">
          {walletData.map((wallet) => (
            <div key={wallet.currencyCode} className="text-left flex border-y">
              <p className="w-[30%] bg-slate-100 p-3 capitalize">
                {wallet.currencyCode} 잔액
              </p>
              <p className="w-[70%] p-3">
                {wallet.currencyCode === "KRW" && wallet.totalKrw.toLocaleString()}
                {wallet.currencyCode === "USD" && wallet.totalUsd.toLocaleString()}
                {wallet.currencyCode === "EUR" && wallet.totalEur.toLocaleString()}
                {wallet.currencyCode === "JPY" && wallet.totalJpy.toLocaleString()}
                {wallet.currencyCode === "CNY" && wallet.totalCny.toLocaleString()}{" "}
                {wallet.currencyCode}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 송금 정보 */}
      <div className="">
        <h2 className="text-lg font-bold text-left">송금 정보 입력</h2>

        {/* 통화 선택 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3">통화 선택</p>
          <div className="w-[70%] px-3 flex items-center">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full p-2 h-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              {walletData.map((wallet) => (
                <option key={wallet.currencyCode} value={wallet.currencyCode}>
                  {wallet.currencyCode}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 송금할 금액 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3">송금할 금액</p>
          <div className="w-[70%] px-3 flex items-center">
            <input
              type="number"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              className="w-full p-2 h-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="송금할 금액을 입력하세요"
              min="0"
            />
          </div>
        </div>

        {/* 받는 분 성함 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3">받는 분 성함</p>
          <div className="w-[70%] px-3 flex items-center">
            <input
              type="text"
              value={receiverName}
              onChange={(e) => setReceiverName(e.target.value)}
              className="w-full p-2 h-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="받는 분의 성함을 입력하세요"
            />
          </div>
        </div>

        {/* 받는 분 계좌번호 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3">받는 분 계좌번호</p>
          <div className="w-[70%] px-3 flex items-center">
            <input
              type="text"
              value={receiverAccount}
              onChange={(e) => setReceiverAccount(e.target.value)}
              className="w-full p-2 h-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="받는 분의 계좌번호를 입력하세요"
            />
          </div>
        </div>

        {/* 받는 분 은행 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3">받는 분 은행</p>
          <div className="w-[70%] px-3 flex items-center">
            <input
              type="text"
              value={receiverBank}
              onChange={(e) => setReceiverBank(e.target.value)}
              className="w-full p-2 h-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="받는 분의 은행을 입력하세요"
            />
          </div>
        </div>

        {/* 받는 분 SWIFT CODE (추가) */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3">받는 분 SWIFT CODE</p>
          <div className="w-[70%] px-3 flex items-center">
            <input
              type="text"
              value={receiverSwiftCode}
              onChange={(e) => setReceiverSwiftCode(e.target.value)}
              className="w-full p-2 h-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="받는 분의 SWIFT CODE를 입력하세요"
            />
          </div>
        </div>

        {/* 받는 분 은행 코드 (추가) */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3">받는 분 은행 코드</p>
          <div className="w-[70%] px-3 flex items-center">
            <input
              type="text"
              value={receiverBankCode}
              onChange={(e) => setReceiverBankCode(e.target.value)}
              className="w-full p-2 h-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="받는 분의 은행 코드를 입력하세요"
            />
          </div>
        </div>

        {/* 받는 분 이메일 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3">받는 분 이메일</p>
          <div className="w-[70%] px-3 flex items-center">
            <input
              type="email"
              value={receiverEmail}
              onChange={(e) => setReceiverEmail(e.target.value)}
              className="w-full p-2 h-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="받는 분의 이메일을 입력하세요"
            />
          </div>
        </div>
      </div>

      {/* 송금 버튼 */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleTransfer}
          className="px-20 py-3 bg-hana text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hana duration-300 hover:opacity-80"
        >
          송금하기
        </button>
      </div>

      {/* 성공 메시지 */}
      {successMessage && (
        <div className="mt-6 text-center text-green-600 font-bold">
          {successMessage}
        </div>
      )}

      {/* 오류 메시지 */}
      {errorMessage && (
        <div className="mt-6 text-center text-red-600 font-bold">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default WalletRemi;
