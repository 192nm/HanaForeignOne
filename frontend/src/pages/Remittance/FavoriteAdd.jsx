// FavoriteAdd.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const FavoriteAdd = () => {
  const [currency, setCurrency] = useState("USD");
  const [remittanceType, setRemittanceType] = useState("overseas");
  const [reason, setReason] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [currencySelection, setCurrencySelection] = useState("");
  const [recipientSwiftCode, setRecipientSwiftCode] = useState(""); // SWIFT 코드 상태
  const [bankName, setBankName] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  const navigate = useNavigate();

  const handleSubmit = () => {
    // 입력된 즐겨찾기 데이터 객체 생성
    const favoriteData = {
      currency,
      remittanceType,
      reason,
      name,
      phone,
      email,
      address,
      addressDetail,
      recipientName,
      recipientPhone,
      recipientEmail,
      recipientAddress,
      currencySelection,
      recipientSwiftCode, // 수정된 부분: SWIFT 코드 추가
      bankName,
      bankCode,
      accountNumber,
    };

    // 기존 즐겨찾기 목록 불러오기
    const existingFavorites =
      JSON.parse(localStorage.getItem("favorites")) || [];

    // 새로운 즐겨찾기 추가
    existingFavorites.push(favoriteData);

    // 업데이트된 즐겨찾기 목록 저장
    localStorage.setItem("favorites", JSON.stringify(existingFavorites));

    // AfterFavorite 페이지로 이동
    navigate("/after-favorite", {
      state: favoriteData,
    });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white rounded-xl shadow-md">
      <h1 className="text-3xl font-bold mb-4">즐겨찾기 등록</h1>

      {/* 보내는 분 정보 */}
      <div className="">
        <h2 className="ml-1 text-lg font-bold text-left">보내는 분 정보</h2>

        {/* 영문성명 */}
        <div className="mt-2 text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">영문성명</p>
          <div className="w-[70%] px-3 flex items-center">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 h-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="영문성명을 입력하세요"
            />
          </div>
        </div>

        {/* 송금구분 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">송금구분</p>
          <div className="w-[70%] px-3 flex items-center justify-start space-x-4">
            <label className="inline-flex items-center space-x-1">
              <input
                type="radio"
                value="overseas"
                checked={remittanceType === "overseas"}
                onChange={() => setRemittanceType("overseas")}
                className="form-radio"
              />
              <span className="whitespace-nowrap">해외 송금</span>
            </label>
            <label className="inline-flex items-center space-x-1">
              <input
                type="radio"
                value="domestic"
                checked={remittanceType === "domestic"}
                onChange={() => setRemittanceType("domestic")}
                className="form-radio"
              />
              <span className="whitespace-nowrap">국내 송금</span>
            </label>
          </div>
        </div>

        {/* 송금사유 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">송금사유</p>
          <div className="w-[70%] px-3 flex flex-col items-start">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="reason1"
                checked={reason === "reason1"}
                onChange={() => setReason("reason1")}
                className="form-radio"
              />
              <span className="whitespace-nowrap">
                미화 5천불 상당액 이하 증빙서류 미제출 송금(구.증여송금)
              </span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="reason2"
                checked={reason === "reason2"}
                onChange={() => setReason("reason2")}
                className="form-radio"
              />
              <span className="whitespace-nowrap">
                미화 5천불 상당액 초과 증빙서류 미제출 송금(구.증여송금)
              </span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="reason3"
                checked={reason === "reason3"}
                onChange={() => setReason("reason3")}
                className="form-radio"
              />
              <span className="whitespace-nowrap">
                해외 유학생의 유학경비 송금
              </span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="reason4"
                checked={reason === "reason4"}
                onChange={() => setReason("reason4")}
                className="form-radio"
              />
              <span className="whitespace-nowrap">
                해외 체재자의 해외 체재비 송금
              </span>
            </label>
          </div>
        </div>

        {/* 핸드폰번호 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">
            핸드폰번호
          </p>
          <div className="w-[70%] px-3 flex items-center">
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 h-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="핸드폰번호 입력"
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 h-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="이메일주소 입력"
            />
          </div>
        </div>

        {/* 영문주소 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">영문주소</p>
          <div className="w-[70%] px-3 flex items-center">
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2 h-20 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="영문주소 입력"
            />
          </div>
        </div>

        <div className="mt-8 mb-5 w-full border border-gray-200"></div>

        {/* 추가된 입력 항목들 */}
        <h2 className="ml-1 text-lg font-bold text-left">받는 분 정보</h2>

        {/* 영문성명 */}
        <div className="mt-2 text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">영문성명</p>
          <div className="w-[70%] px-3 flex items-center">
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="w-full p-2 h-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="영문성명을 입력하세요"
            />
          </div>
        </div>

        {/* 전화번호 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">전화번호</p>
          <div className="w-[70%] px-3 flex items-center">
            <input
              type="text"
              value={recipientPhone}
              onChange={(e) => setRecipientPhone(e.target.value)}
              className="w-full p-2 h-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="전화번호 입력"
            />
          </div>
        </div>

        {/* 이메일 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">이메일</p>
          <div className="w-[70%] px-3 flex items-center">
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className="w-full p-2 h-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="이메일 입력"
            />
          </div>
        </div>

        {/* 통화선택 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">통화선택</p>
          <div className="w-[70%] px-3 flex items-center">
            <select
              value={currencySelection}
              onChange={(e) => setCurrencySelection(e.target.value)}
              className="w-full p-2 h-10 border-gray-300 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">통화를 선택하세요</option>
              <option value="USD">미국 달러 (USD)</option>
              <option value="EUR">유럽 유로 (EUR)</option>
              <option value="JPY">일본 엔 (JPY)</option>
              <option value="CNY">중국 위안 (CNY)</option>
            </select>
          </div>
        </div>

        {/* SWIFT CODE */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">
            SWIFTCODE
          </p>
          <div className="w-[70%] px-3 flex items-center">
            <input
              type="text"
              value={recipientSwiftCode}
              onChange={(e) => setRecipientSwiftCode(e.target.value)} // Correct state update
              className="w-full p-2 h-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="SWIFT CODE 입력"
            />
          </div>
        </div>

        {/* 입금은행 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">입금은행</p>
          <div className="w-[70%] px-3 flex items-center">
            <input
              type="text"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="w-full p-2 h-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="입금 은행 입력"
            />
          </div>
        </div>

        {/* 은행코드 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">은행코드</p>
          <div className="w-[70%] px-3 flex items-center">
            <input
              type="text"
              value={bankCode}
              onChange={(e) => setBankCode(e.target.value)}
              className="w-full p-2 h-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="은행 코드를 입력하세요"
            />
          </div>
        </div>

        {/* 입금 계좌번호 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">
            입금계좌번호
          </p>
          <div className="w-[70%] px-3 flex items-center">
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full p-2 h-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="입금 계좌번호 입력"
            />
          </div>
        </div>
      </div>

      {/* 즐겨찾기 등록 버튼 */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleSubmit}
          className="px-6 py-3 bg-hana text-white duration-200 rounded-md shadow-sm hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hana"
        >
          즐겨찾기 등록
        </button>
      </div>
    </div>
  );
};

export default FavoriteAdd;
