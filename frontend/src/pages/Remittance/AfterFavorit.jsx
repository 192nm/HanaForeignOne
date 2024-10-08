// AfterFavorite.js
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AfterFavorite = () => {
  const location = useLocation(); // useLocation 훅을 사용하여 전달된 데이터 받기
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅

  const {
    currency,
    remittanceType,
    reason,
    name,
    phone,
    email,
    address,
    recipientName,
    recipientPhone,
    recipientEmail,
    recipientAddress,
    currencySelection,
    recipientSwiftCode, // 수정된 부분: SWIFT 코드 추가
    bankName,
    bankCode,
    accountNumber,
  } = location.state || {}; // state에서 데이터를 받기

  const renderRemittanceType = (type) => {
    return type === "overseas" ? "해외 송금" : "국내 송금";
  };

  const renderReason = (reason) => {
    switch (reason) {
      case "reason1":
        return "미화 5천불 상당액 이하 증빙서류 미제출 송금(구.증여송금)";
      case "reason2":
        return "미화 5천불 상당액 초과 증빙서류 미제출 송금(구.증여송금)";
      case "reason3":
        return "해외 유학생의 유학경비 송금";
      case "reason4":
        return "해외 체재자의 해외 체재비 송금";
      default:
        return "";
    }
  };

  const handleGoToRealRemittance = () => {
    navigate("/personal"); // RealRemittance 페이지로 이동
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md">
      <h1 className="text-3xl font-bold mb-4">즐겨찾기 등록 완료</h1>

      {/* 보내는 분 정보 */}
      <div className="">
        <h2 className="ml-2 text-lg font-bold text-left">보내는 분 정보</h2>

        {/* 영문성명 */}
        <div className="mt-2 text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">
            영문성명
          </p>
          <div className="w-[70%] px-3 flex items-center">
            <p>{name}</p>
          </div>
        </div>

        {/* 송금구분 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">
            송금구분
          </p>
          <div className="w-[70%] px-3 flex items-center">
            <p>{renderRemittanceType(remittanceType)}</p>
          </div>
        </div>

        {/* 송금사유 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">
            송금사유
          </p>
          <div className="w-[70%] px-3 flex items-center">
            <p>{renderReason(reason)}</p>
          </div>
        </div>

        {/* 핸드폰번호 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">
            핸드폰번호
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

        {/* 영문주소 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">
            영문주소
          </p>
          <div className="w-[70%] px-3 flex items-center">
            <p>{address}</p>
          </div>
        </div>

        <div className="mt-8 mb-6 w-full border border-gray-300"></div>

        {/* 받는 분 정보 */}
        <h2 className=" ml-2 text-lg font-bold text-left">받는 분 정보</h2>

        {/* 영문성명 */}
        <div className="mt-2 text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">
            영문성명
          </p>
          <div className="w-[70%] px-3 flex items-center">
            <p>{recipientName}</p>
          </div>
        </div>

        {/* 전화번호 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">
            전화번호
          </p>
          <div className="w-[70%] px-3 flex items-center">
            <p>{recipientPhone}</p>
          </div>
        </div>

        {/* 이메일 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">
            이메일
          </p>
          <div className="w-[70%] px-3 flex items-center">
            <p>{recipientEmail}</p>
          </div>
        </div>

        {/* 통화선택 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">
            통화선택
          </p>
          <div className="w-[70%] px-3 flex items-center">
            <p>{currencySelection}</p>
          </div>
        </div>

        {/* SWIFT CODE */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">
            SWIFT CODE
          </p>
          <div className="w-[70%] px-3 flex items-center">
            <p>{recipientSwiftCode}</p> {/* 수정된 부분: SWIFT 코드 표시 */}
          </div>
        </div>

        {/* 입금은행 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">
            입금은행
          </p>
          <div className="w-[70%] px-3 flex items-center">
            <p>{bankName}</p>
          </div>
        </div>

        {/* 은행코드 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">
            은행코드
          </p>
          <div className="w-[70%] px-3 flex items-center">
            <p>{bankCode}</p>
          </div>
        </div>

        {/* 입금 계좌번호 */}
        <div className="text-left flex border-y">
          <p className="w-[30%] bg-slate-100 p-3 flex items-center">
            입금계좌번호
          </p>
          <div className="w-[70%] px-3 flex items-center">
            <p>{accountNumber}</p>
          </div>
        </div>
      </div>
      {/* 홈으로 돌아가기 버튼 */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleGoToRealRemittance}
          className="px-6 py-3 bg-hana text-white rounded-md shadow-sm hover:opacity-80 duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hana"
        >
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default AfterFavorite;
