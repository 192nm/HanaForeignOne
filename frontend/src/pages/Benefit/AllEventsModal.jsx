// src/pages/Benefit/AllEventsModal.jsx

import React from "react";

const AllEventsModal = ({ isOpen, onClose, slides }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50 overflow-auto">
      <div className="bg-white rounded-lg shadow-lg max-w-6xl w-full max-h-screen overflow-y-auto relative p-6">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl font-bold text-gray-700 hover:text-gray-900"
        >
          &times;
        </button>

        {/* 모달 헤더 */}
        <h2 className="text-2xl font-bold mb-6 text-center">모든 이벤트</h2>

        {/* 이벤트 카드 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {slides.map((slide, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
            >
              {/* 이벤트 이미지 */}
              <div className="w-full h-40 bg-gray-300 overflow-hidden">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 이벤트 세부 정보 */}
              <div className="p-4 flex flex-col flex-grow">
                {/* 이벤트 타이틀 */}
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {slide.title}
                </h3>
                {/* 이벤트 서브 타이틀 */}
                {slide.title2 && (
                  <h4 className="text-md text-gray-700 mb-2">{slide.title2}</h4>
                )}
                {/* 해시태그 */}
                <p className="text-gray-600 text-sm mb-4 whitespace-pre-line">
                  {slide.hashtags}
                </p>

                {/* 자세히보기 버튼 */}
                <button
                  onClick={() => {
                    // 이벤트 상세보기 로직을 추가할 수 있습니다.
                    alert(`자세히보기: ${slide.title}`);
                  }}
                  className="mt-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
                >
                  자세히보기
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllEventsModal;
