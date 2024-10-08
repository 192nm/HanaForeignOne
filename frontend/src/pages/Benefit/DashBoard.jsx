// src/components/Dashboard.js

import React from "react";
import tax from "../../assets/svg/Benefit/icon_quick01.png";
import exchange from "../../assets/svg/Benefit/icon_quick02.png";
import open_banking from "../../assets/svg/Benefit/icon_quick03.png";
import auth_ccenter from "../../assets/svg/Benefit/icon_quick04.png";
import quick_check from "../../assets/svg/Benefit/icon_quick05.png";
import customer_service from "../../assets/svg/Benefit/icon_quick07.png";

const Dashboard = ({ onRouletteClick, onEventsClick }) => {
  return (
    <div className="flex flex-col">
      <div className="mt-20 mr-20 ml-20 flex flex-col">
        {/* 첫 번째 플렉스 컨테이너: 두 개의 버튼 */}
        <div className="flex gap-4 mb-4 w-full">
          {/* 이벤트 버튼 */}
          <div
            onClick={onEventsClick}
            className="bg-hana text-white rounded-lg py-12 px-4 flex justify-start flex-1 h-[120px] text-left bg-opacity-75 backdrop-blur-sm cursor-pointer shadow-base"
          >
            <div className="text-xl font-semibold text-left pt-8">이벤트</div>
          </div>

          {/* 룰렛 돌리기 버튼 */}
          <div
            className="bg-gray-800 text-white rounded-lg py-12 px-4 flex justify-start cursor-pointer flex-1 h-[120px] shadow-base"
            onClick={onRouletteClick}
          >
            <div className="text-xl font-semibold text-left pt-8">쿠폰</div>
          </div>
        </div>

        {/* 구분선 추가 */}
        <div className="border-b border-slate-400 my-4"></div>

        {/* 두 번째 플렉스 컨테이너: 여섯 개의 아이콘 */}
        <div className="flex flex-wrap -mx-2 mt-6">
          {/* 아이콘들 */}
          <div className="w-1/2 sm:w-1/3 px-1 mb-2 text-center">
            <img
              src={tax}
              alt="공과금"
              className="mx-auto mb-2"
              width="60"
              height="60"
            />
            <span className="text-lg font-medium">공과금</span>
          </div>

          <div className="w-1/2 sm:w-1/3 px-1 mb-2 text-center">
            <img
              src={exchange}
              alt="환율"
              className="mx-auto mb-2"
              width="60"
              height="60"
            />
            <span className="text-lg font-medium">환율</span>
          </div>

          <div className="w-1/2 sm:w-1/3 px-1 mb-2 text-center">
            <img
              src={open_banking}
              alt="오픈뱅킹"
              className="mx-auto mb-2"
              width="60"
              height="60"
            />
            <span className="text-lg font-medium">오픈뱅킹</span>
          </div>

          <div className="w-1/2 sm:w-1/3 px-1 mb-2 text-center">
            <img
              src={auth_ccenter}
              alt="인증센터"
              className="mx-auto mb-2"
              width="60"
              height="60"
            />
            <span className="text-lg font-medium">인증센터</span>
          </div>

          <div className="w-1/2 sm:w-1/3 px-1 mb-2 text-center">
            <img
              src={quick_check}
              alt="빠른조회"
              className="mx-auto mb-2"
              width="60"
              height="60"
            />
            <span className="text-lg font-medium">빠른조회</span>
          </div>

          <div className="w-1/2 sm:w-1/3 px-1 mb-2 text-center">
            <img
              src={customer_service}
              alt="고객센터"
              className="mx-auto mb-2"
              width="60"
              height="60"
            />
            <span className="text-lg font-medium">고객센터</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
