// src/pages/Benefit/Benefit.jsx

import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header.js";
import Footer from "../../components/Footer/Footer.js";
import japan from "../../assets/svg/Benefit/japan.svg";
import china from "../../assets/svg/Benefit/china.svg";
import europe from "../../assets/svg/Benefit/europe.svg";
import usa from "../../assets/svg/Benefit/usa.svg";
import canada from "../../assets/svg/Benefit/canada.jpg";
import australia from "../../assets/svg/Benefit/australia.png";
import azn from "../../assets/svg/Benefit/azn.png";
import earth from "../../assets/svg/Benefit/earth.png";
import Dashboard from "./DashBoard.jsx";

// Swiper 관련 모듈
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import "swiper/css";
import { Autoplay, Pagination } from "swiper/modules";
import SwiperCore from "swiper";

// 스와이퍼 이미지
import airport from "../../assets/svg/Benefit/airport.png";
import discount from "../../assets/svg/Benefit/discount.png";
import exc from "../../assets/svg/Benefit/exc.png";
import gold from "../../assets/svg/Benefit/gold.jpg";
import soccer from "../../assets/svg/Benefit/soccer.png";
import taxi from "../../assets/svg/Benefit/taxi.png";

// React Custom Roulette
import { Wheel } from "react-custom-roulette";

// EventModal 컴포넌트 임포트
import EventModal from "./EventModal.jsx";
// AllEventsModal 컴포넌트 임포트
import AllEventsModal from "./AllEventsModal.jsx";

SwiperCore.use([Autoplay, Pagination]); // Navigation 제거

// Placeholder 이미지 URL (필요시 실제 이미지로 교체)
const placeholderImage = "https://via.placeholder.com/300x200";

// 국가 목록
const countries = [
  { name: "전체", flag: earth },
  { name: "일본", flag: japan },
  { name: "중국", flag: china },
  { name: "유럽", flag: europe },
  { name: "미국", flag: usa },
  { name: "캐나다", flag: canada },
  { name: "호주", flag: australia },
  { name: "동남아시아", flag: azn },
];

// 초기 이벤트 데이터 (국가별로 할당)
const initialEventsData = [
  {
    title: "HANA FOREIGNONE 계좌 송금 수수료 할인 이벤트",
    description: "지금 계좌 송금을 이용하고 수수료를 할인받으세요!",
    status: "진행중",
    date: "2024.09.01 - 2024.12.31",
    views: 350,
    image: placeholderImage,
    country: "전체",
  },
  {
    title: "일본 전용 송금 혜택 이벤트",
    description: "일본으로 송금 시 특별 혜택을 누리세요!",
    status: "진행중",
    date: "2024.09.15 - 2024.10.15",
    views: 420,
    image: placeholderImage,
    country: "일본",
  },
  {
    title: "중국 송금 특별 이벤트",
    description: "중국으로 송금하고 특별 혜택을 받으세요.",
    status: "진행중",
    date: "2024.09.01 - 2024.11.30",
    views: 500,
    image: placeholderImage,
    country: "중국",
  },
  {
    title: "유럽 송금 페스티벌",
    description: "유럽으로 송금 시 다양한 혜택을 제공합니다.",
    status: "예정",
    date: "2024.12.01 - 2024.12.31",
    views: 0,
    image: placeholderImage,
    country: "유럽",
  },
  {
    title: "미국 송금 기프트 카드 증정 이벤트",
    description: "미국으로 송금하시면 기프트 카드를 드립니다.",
    status: "종료",
    date: "2024.06.01 - 2024.09.15",
    views: 600,
    image: placeholderImage,
    country: "미국",
  },
  {
    title: "캐나다 비즈니스 송금 특별 혜택",
    description: "캐나다 비즈니스 계정을 통해 송금 시 추가 혜택을 누리세요.",
    status: "진행중",
    date: "2024.08.01 - 2024.12.31",
    views: 480,
    image: placeholderImage,
    country: "캐나다",
  },
  {
    title: "호주 송금 금액별 리워드 이벤트",
    description: "호주로 송금 금액에 따라 다양한 리워드를 제공합니다.",
    status: "진행중",
    date: "2024.09.10 - 2024.11.30",
    views: 530,
    image: placeholderImage,
    country: "호주",
  },
  {
    title: "동남아시아 모바일 앱 송금 할인",
    description: "동남아시아로 모바일 앱을 통해 송금 시 추가 할인 혜택!",
    status: "진행중",
    date: "2024.09.20 - 2024.12.31",
    views: 610,
    image: placeholderImage,
    country: "동남아시아",
  },
  {
    title: "장기 고객 감사 이벤트",
    description: "장기 이용 고객을 위한 특별 감사 이벤트.",
    status: "진행중",
    date: "2024.07.01 - 2024.12.31",
    views: 700,
    image: placeholderImage,
    country: "전체",
  },
  {
    title: "국제 송금 무료 체험 이벤트",
    description: "국제 송금을 무료로 체험해보세요.",
    status: "진행중",
    date: "2024.09.25 - 2024.10.25",
    views: 150,
    image: placeholderImage,
    country: "전체",
  },
];

const Benefit = () => {
  const [selectedCountry, setSelectedCountry] = useState("전체");
  const [isFixed, setIsFixed] = useState(false);
  const [sortOption, setSortOption] = useState("최신순");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showOngoing, setShowOngoing] = useState(true);
  const [events, setEvents] = useState(initialEventsData);

  // React Custom Roulette States
  const [isRouletteOpen, setIsRouletteOpen] = useState(false); // 룰렛 모달 상태
  const [mustSpin, setMustSpin] = useState(false); // 룰렛 돌리는 상태
  const [prizeNumber, setPrizeNumber] = useState(0); // 당첨 번호
  const [coupon, setCoupon] = useState(null); // 당첨된 쿠폰 상태

  // Event Modal States
  const [isEventModalOpen, setIsEventModalOpen] = useState(false); // 이벤트 모달 상태
  const [selectedEvent, setSelectedEvent] = useState(null); // 선택된 이벤트

  // All Events Modal States
  const [isAllEventsModalOpen, setIsAllEventsModalOpen] = useState(false); // 모든 이벤트 모달 상태

  // 룰렛 데이터
  const rouletteData = [
    {
      option: "5% 우대쿠폰",
      style: { backgroundColor: "#3e3e3e", textColor: "#ffffff" },
    },
    {
      option: "2% 우대쿠폰",
      style: { backgroundColor: "#df3428", textColor: "#ffffff" },
    },
    {
      option: "3% 우대쿠폰",
      style: { backgroundColor: "#f1c40f", textColor: "#000000" },
    },
    {
      option: "4% 우대쿠폰",
      style: { backgroundColor: "#2ecc71", textColor: "#ffffff" },
    },
    {
      option: "10% 우대쿠폰",
      style: { backgroundColor: "#9b59b6", textColor: "#ffffff" },
    },
    {
      option: "재도전",
      style: { backgroundColor: "#34495e", textColor: "#ffffff" },
    },
  ];

  // 스와이퍼 이미지와 문구
  const swiperImages = [
    {
      image: airport,
      title: "인천국제공항으로",
      title2: "어서오시월(10月)!",
      hashtags:
        "#가을해외여행 1줄 추억' SNS 댓글 달고 선물 받기\n#어서오시월 #인천국제공항지점 환전 이벤트",
    },
    {
      image: discount,
      title: "K-직장인",
      title2: "월급 절약 프로젝트",
      hashtags: "금리쿠폰으로 적금 가입하고\n30만 하나머니까지!",
    },
    {
      image: exc,
      title: "다(多)통화 환전 이벤트 3",
      title2: "가을에 물들다. 환전에 물들다.",
      hashtags: "다(多)통화 환전하고, 호텔 숙박권 득템하자!",
    },
    {
      image: gold,
      title: "진짜 18K 금을 준다고?",
      title2: "황금베개 응모 꾹~",
      hashtags: "가을 돈기운 상점\n진열대를 구경해 보세요~",
    },
    {
      image: soccer,
      title: "경기 스코어 예측하고",
      title2: "원큐볼 100% 받자!",
      hashtags:
        "10월 15일(화) 대한민국 vs 이라크\n스코어 맞히면 원큐볼 최대 3백만개!",
    },
    {
      image: taxi,
      title: "10월 1일은 하나데이",
      hashtags:
        "카카오T포인트 3만원권 111명\n하나머니 랜덤 100% 당첨!\n10월 21일은 한번 더 기회!",
    },
  ];

  // 룰렛 결과 로직
  const spinRoulette = () => {
    const fixedPrizeNumber = rouletteData.findIndex(
      (item) => item.option === "10% 우대쿠폰"
    );
    setPrizeNumber(fixedPrizeNumber);
    setMustSpin(true);
  };

  // 룰렛 돌리기 완료 핸들러
  const handleSpinComplete = () => {
    setMustSpin(false);
    const wonPrize = rouletteData[prizeNumber].option;
    if (wonPrize !== "재도전") {
      setCoupon(wonPrize);
    } else {
      setCoupon("재도전 해보세요!");
    }
  };

  // 이벤트 상태 업데이트 로직
  useEffect(() => {
    const updateEventStatus = () => {
      const today = new Date();

      const updatedEvents = initialEventsData.map((event) => {
        const [startStr, endStr] = event.date.split(" - ");
        const startDate = new Date(startStr.replace(/\./g, "-"));
        const endDate = new Date(endStr.replace(/\./g, "-"));

        let status = event.status;

        if (today < startDate) {
          status = "예정";
        } else if (today > endDate) {
          status = "종료";
        } else {
          status = "진행중";
        }

        return { ...event, status };
      });

      setEvents(updatedEvents);
    };

    updateEventStatus();
  }, []);

  // 스크롤 시 헤더 고정 로직
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      const selectorOffset =
        document.querySelector(".country-selector")?.offsetTop || 0;

      if (offset > selectorOffset) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // 국가 선택 핸들러
  const handleCountryClick = (country) => {
    setSelectedCountry(country);
  };

  // 정렬 옵션 변경 핸들러
  const handleSortOptionChange = (option) => {
    setSortOption(option);
    setIsDropdownOpen(false);
  };

  // 드롭다운 토글 핸들러
  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // 진행중 이벤트 체크박스 핸들러
  const handleShowOngoingChange = () => {
    setShowOngoing(!showOngoing);
  };

  // 필터링 및 정렬된 이벤트 데이터
  const sortedAndFilteredEvents = events
    .filter((event) => {
      // 국가 필터링
      if (selectedCountry === "전체") {
        return true;
      }
      return event.country === selectedCountry;
    })
    .filter((event) => {
      // 진행중 이벤트 필터링
      if (showOngoing) {
        return event.status === "진행중";
      }
      return true;
    })
    .sort((a, b) => {
      if (sortOption === "최신순") {
        return (
          new Date(b.date.split(" - ")[0].replace(/\./g, "-")) -
          new Date(a.date.split(" - ")[0].replace(/\./g, "-"))
        );
      } else if (sortOption === "조회순") {
        return b.views - a.views;
      } else if (sortOption === "오래된 순") {
        return (
          new Date(a.date.split(" - ")[0].replace(/\./g, "-")) -
          new Date(b.date.split(" - ")[0].replace(/\./g, "-"))
        );
      }
      return 0;
    });

  return (
    <div className="text-center px-5 bg-white">
      <Header />
      {/* 스와이퍼 및 대시보드 추가 */}
      <div className="flex justify-evenly w-full h-full">
        <div className="ml-20">
          <Swiper
            spaceBetween={50}
            slidesPerView={1}
            loop={true} // 무한 반복 설정
            autoplay={{ delay: 3000 }}
            pagination={{ clickable: true }}
            // navigation 제거
            className="w-[760px] h-[440px] object-cover mt-10 mb-5"
          >
            {swiperImages.map((slide, index) => (
              <SwiperSlide key={index}>
                <div className="relative flex">
                  {/* 문구를 이미지 왼쪽에 배치 */}
                  {slide.title && (
                    <div className="absolute left-10 top-[40%] transform -translate-y-1/2 p-4 rounded w-[450px] text-left">
                      {/* 이벤트 버튼 */}
                      <button
                        onClick={() => {
                          setSelectedEvent(slide);
                          setIsEventModalOpen(true);
                        }}
                        className="mb-2 px-3 py-1 border border-slate-500 rounded text-sm text-slate-700 hover:bg-slate-200 transition duration-300"
                      >
                        이벤트
                      </button>
                      {/* 큰 타이틀 텍스트 */}
                      <h2 className="text-black text-4xl font-bold text-left">
                        {slide.title}
                        <br />
                        {slide.title2}
                      </h2>
                      {/* 해시태그 텍스트 */}
                      <p className="text-gray-600 text-base mt-2 text-left">
                        {slide.hashtags.split("\n").map((line, i) => (
                          <React.Fragment key={i}>
                            {line}
                            <br />
                          </React.Fragment>
                        ))}
                      </p>
                      {/* 자세히보기 버튼 */}
                      <button
                        onClick={() => {
                          setSelectedEvent(slide);
                          setIsEventModalOpen(true);
                        }}
                        className="mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-blue-600 transition duration-300"
                      >
                        자세히보기
                      </button>
                    </div>
                  )}

                  <img
                    src={slide.image}
                    alt={slide.title || "이벤트 이미지"}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="flex flex-col items-center">
          <Dashboard
            onRouletteClick={() => setIsRouletteOpen(true)}
            onEventsClick={() => setIsAllEventsModalOpen(true)}
          />
          {/* "모든 이벤트 보기" 버튼 삭제 */}
        </div>
      </div>

      {/* 룰렛 모달 */}
      {isRouletteOpen && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg relative z-50 size-lg">
            <button
              onClick={() => {
                setIsRouletteOpen(false);
                setCoupon(null);
              }}
              className="absolute top-2 right-2 text-2xl font-bold text-gray-700 hover:text-gray-900"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-5 text-center ">
              룰렛 돌리기
            </h2>
            <div className="flex justify-center items-center">
              <Wheel
                mustStartSpinning={mustSpin}
                prizeNumber={prizeNumber}
                data={rouletteData}
                backgroundColors={[
                  "#008485",
                  "#005f5f",
                  "#00b3b3",
                  "#ffffff",
                  "#333333",
                  "#f2f2f2",
                ]}
                textColors={["#ffffff", "#000000"]}
                onStopSpinning={handleSpinComplete}
                outerBorderColor={"#000"}
                outerBorderWidth={5}
                innerRadius={10}
                radiusLineColor={"#ffffff"}
                radiusLineWidth={2}
                fontSize={16}
              />
            </div>
            <div className="mt-5 text-center">
              {coupon ? (
                <div className="text-xl font-semibold text-green-600">
                  {coupon}
                </div>
              ) : (
                <button
                  onClick={spinRoulette}
                  className="bg-hana hover:bg-green-600 text-white px-6 py-3 rounded-lg shadow-md transition duration-300"
                >
                  돌리기
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 이벤트 모달 */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        event={selectedEvent}
      />

      {/* 모든 이벤트 모달 */}
      <AllEventsModal
        isOpen={isAllEventsModalOpen}
        onClose={() => setIsAllEventsModalOpen(false)}
        slides={swiperImages} // swiperImages를 slides prop으로 전달
      />

      {/* 국가 선택 섹션 */}
      <div
        className={`flex justify-center bg-white py-2 shadow-md ${
          isFixed ? "fixed top-0 left-0 right-0 z-50" : "relative"
        } country-selector`}
      >
        {countries.map((country, index) => (
          <div
            key={index}
            className={`flex flex-col items-center mx-2 cursor-pointer relative ${
              selectedCountry === country.name
                ? "text-blue-500"
                : "text-gray-700"
            }`}
            onClick={() => handleCountryClick(country.name)}
          >
            <img
              src={country.flag}
              alt={country.name}
              className="w-12 h-12 rounded-full object-cover bg-white border border-gray-300 mb-2"
            />
            <p className="text-sm">{country.name}</p>
            {selectedCountry === country.name && (
              <div className="absolute bottom-0 w-5 h-1 bg-blue-500 rounded-full"></div>
            )}
          </div>
        ))}
      </div>

      {/* 이벤트 섹션 */}
      <section className="py-10 bg-white">
        <div className="flex flex-col md:flex-row justify-between items-center mb-5 px-5">
          <div className="flex items-center mb-4 md:mb-0">
            <input
              type="checkbox"
              id="ongoing-events"
              checked={showOngoing}
              onChange={handleShowOngoingChange}
              className="mr-2"
            />
            <label htmlFor="ongoing-events" className="text-lg text-gray-700">
              진행중 이벤트
            </label>
          </div>
          <div className="relative">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md focus:outline-none"
              onClick={handleDropdownToggle}
            >
              {sortOption}
            </button>
            {isDropdownOpen && (
              <ul className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                {["최신순", "조회순", "오래된 순"].map((option) => (
                  <li
                    key={option}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSortOptionChange(option)}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-5 px-5">
          {sortedAndFilteredEvents.length > 0 ? (
            sortedAndFilteredEvents.map((event, index) => (
              <article
                key={index}
                className="bg-white rounded-lg shadow-md p-5 w-80 text-left"
              >
                <div className="w-full h-40 bg-gray-300 rounded-lg mb-4 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="mt-3">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded ${
                        event.status === "진행중"
                          ? "bg-green-500 text-white"
                          : event.status === "예정"
                          ? "bg-yellow-500 text-white"
                          : "bg-gray-300 text-gray-700"
                      }`}
                    >
                      {event.status}
                    </span>
                    <span className="text-xs text-gray-500">{event.date}</span>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      조회수: {event.views}
                    </span>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <p className="text-gray-700">
              선택한 조건에 맞는 이벤트가 없습니다.
            </p>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Benefit;
