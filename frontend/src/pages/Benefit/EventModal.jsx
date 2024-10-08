// src/components/EventModal/EventModal.jsx

import React from "react";
// Swiper 관련 임포트는 현재 사용되지 않으므로 제거해도 무방합니다.
// 하지만 필요하다면 유지하셔도 됩니다.
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/autoplay";
// import "swiper/css/pagination";
// import { Autoplay, Pagination } from "swiper/modules";

const EventModal = ({ isOpen, onClose, event }) => {
  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative bg-white rounded-lg p-0 max-w-3xl w-full max-h-full overflow-hidden">
        {/* 배경 이미지 설정 */}
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-96 object-cover rounded-lg"
        />
        {/* 오버레이 레이어 */}
        <div className="absolute inset-0 rounded-lg"></div>
        {/* 텍스트 컨텐츠 */}
        <div className="absolute inset-0 flex flex-col justify-between p-6 text-base text-left">
          {/* 상단 닫기 버튼 */}
          <button
            onClick={onClose}
            className="self-end text-3xl font-bold text-gray-700 hover:text-gray-300"
            aria-label="닫기"
          >
            &times;
          </button>
          {/* 중앙 내용 */}
          <div className="text-left">
            <h2 className="text-3xl font-bold mb-2 text-left">{event.title}</h2>
            {event.title2 && (
              <h3 className="text-2xl mb-2 text-left">{event.title2}</h3>
            )}
            <p className="text-lg whitespace-pre-line text-left">{event.hashtags}</p>
          </div>
          {/* 하단 닫기 버튼 */}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2 bg-hana text-white rounded hover:bg-hana-dark transition duration-300"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
