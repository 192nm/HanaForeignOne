import React from "react";
import { Link } from "react-router-dom";
import personal from "../../assets/svg/Remittance/personal.webp";
import company from "../../assets/svg/Remittance/company.webp";
import account from "../../assets/svg/Remittance/account.svg";
import wallet from "../../assets/svg/Remittance/wallet.png";
import search from "../../assets/svg/Remittance/search.svg";
import favorite from "../../assets/svg/Remittance/favorite.svg";
import wallet1 from "../../assets/svg/Remittance/wallet1.svg";

const RealRemittance = () => {
  return (
    <div className="flex flex-col min-h-screen items-center bg-gray-100">
      <main className="flex-1 flex flex-col items-center mt-0 w-full max-w-5xl p-5 bg-white shadow-lg">
        <h1 className="text-2xl font-semibold text-gray-800 mb-8">
          송금 유형을 선택해주세요
        </h1>
        <div className="flex justify-evenly gap-4 mb-8 w-full ">
          <Link
            to="/account-remi"
            className="flex flex-col items-center bg-gray-100 p-5 rounded-lg shadow-md transform transition-transform hover:translate-y-[-5px] w-1/2"
          >
            <img src={account} alt="개인에게 송금" className="h-20 mb-4" />
            <h2 className="text-lg text-blue-500 mb-1">계좌에서 송금</h2>
            <p className="text-sm text-gray-600">
              간편한 서류등록, 계좌에서 바로 송금
            </p>
          </Link>
          <Link
            to="/wallet-remittance"
            className="flex flex-col items-center bg-gray-100 p-5 rounded-lg shadow-md transform transition-transform hover:translate-y-[-5px] w-1/2"
          >
            <img
              src={wallet1}
              alt="법인(학교)에게 송금"
              className="h-20 mb-4"
            />
            <h2 className="text-lg text-blue-500 mb-1">지갑에서 송금</h2>
            <p className="text-sm text-gray-600">
              환전할 필요 없이 보유 외화 즉시 송금
            </p>
          </Link>
        </div>
        <div className="flex justify-evenly gap-4 mb-8 w-full ">
          <Link
            to="/log-remittance"
            className="flex flex-col items-center bg-gray-100 p-5 rounded-lg shadow-md transform transition-transform hover:translate-y-[-5px] w-1/2"
          >
            <img src={search} alt="개인에게 송금" className="h-20 mb-4" />
            <h2 className="text-lg text-blue-500 mb-1">송금내역 조회</h2>
            <p className="text-sm text-gray-600">
              송금내역 조회, 송금 상태 확인
            </p>
          </Link>
          <Link
            to="/favorite-add"
            className="flex flex-col items-center bg-gray-100 p-5 rounded-lg shadow-md transform transition-transform hover:translate-y-[-5px] w-1/2"
          >
            <img
              src={favorite}
              alt="법인(학교)에게 송금"
              className="h-20 mb-4"
            />
            <h2 className="text-lg text-blue-500 mb-1">즐겨찾기 등록</h2>
            <p className="text-sm text-gray-600">
              송금정보 저장, 즐겨찾기로 간편하게
            </p>
          </Link>
        </div>

        <div className="bg-white w-full p-4 rounded-lg shadow-md">
          <div className="flex items-center mb-2">
            <span className="inline-block bg-blue-500 text-white text-xs font-semibold rounded-full px-3 py-1 mr-3">
              가능
            </span>
            <p className="text-sm text-gray-800">
              월요일 오전 4시 ~ 금요일 오후 6시 (공휴일 휴무)
            </p>
          </div>
          <div className="flex items-center">
            <span className="inline-block bg-red-500 text-white text-xs font-semibold rounded-full px-3 py-1 mr-3">
              불가
            </span>
            <p className="text-sm text-gray-800">
              금요일 오후 6시 ~ 월요일 오전 4시 송금 신청 제한
            </p>
          </div>
        </div>
        <div className="mt-8 w-full max-w-md">
          <h3 className="text-2xl font-semibold text-gray-800 mb-8">
            뉴스레터 구독
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            최신 소식과 혜택을 받아보세요.
          </p>
          <form className="flex">
            <input
              type="email"
              placeholder="이메일 입력"
              className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none"
            />
            <button className="bg-blue-500 text-white px-4 rounded-r-md hover:bg-blue-600">
              구독
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default RealRemittance;
