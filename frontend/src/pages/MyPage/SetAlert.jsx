import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import koLocale from "@fullcalendar/core/locales/ko";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import {
  Box,
  Checkbox,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { useSelector } from "react-redux"; // Redux에서 userId 가져오기

// 국기 이미지 import
import usaFlag from "../../assets/svg/MyPage/usa.png";
import europeFlag from "../../assets/svg/MyPage/europe.png";
import japanFlag from "../../assets/svg/MyPage/japan.jpg";
import chinaFlag from "../../assets/svg/MyPage/china.png";

// 국기 이미지를 통화 코드에 따라 매핑
const currencyFlags = {
  USD: usaFlag, // 미국
  EUR: europeFlag, // 유럽연합
  JPY: japanFlag, // 일본
  CNY: chinaFlag, // 중국
};

const ExchangeRateAlertModal = ({ onClose }) => {
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [currentRate, setCurrentRate] = useState(null);
  const [alertRate, setAlertRate] = useState("");
  const [isLoadingRate, setIsLoadingRate] = useState(false);
  const [predictionDates, setPredictionDates] = useState([]);
  const [message, setMessage] = useState("");
  const [isRecommend, setIsRecommend] = useState(null); // null: no recommendation, true: recommend, false: not recommend
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [alertMethod, setAlertMethod] = useState({
    SMS: false,
    Email: false,
  });
  const [isLoadingPrediction, setIsLoadingPrediction] = useState(false); // 로딩 상태 추가
  const [alertCondition, setAlertCondition] = useState("higher"); // "higher" or "lower"

  const userId = useSelector((state) => state.auth.userId); // Redux에서 userId 가져오기

  // 추가된 state 변수
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");

  // FullCalendar reference
  const calendarRef = useRef(null);

  // 선택된 통화의 현재 환율 가져오기 (API 요청)
  useEffect(() => {
    const fetchExchangeRate = async () => {
      setIsLoadingRate(true);
      try {
        const response = await axios.post("http://localhost:8081/realtime4");
        console.log("Current exchange rates fetched:", response.data);

        // 선택된 통화에 따라 해당 통화의 standardRate를 설정
        const selectedData = response.data.find((item) => {
          if (selectedCurrency === "JPY")
            return item.currencyName.includes("JPY");
          if (selectedCurrency === "USD")
            return item.currencyName.includes("USD");
          if (selectedCurrency === "EUR")
            return item.currencyName.includes("EUR");
          if (selectedCurrency === "CNY")
            return item.currencyName.includes("CNY");
        });

        if (selectedData) {
          let rate = selectedData.standardRate;
          // JPY의 경우 100엔 기준이므로, 환율을 100으로 나누어 조정
          if (selectedCurrency === "JPY") {
            rate = rate / 100;
          }
          setCurrentRate(rate); // 현재 환율 상태 업데이트
        } else {
          setCurrentRate(null);
        }

        setIsLoadingRate(false);
      } catch (error) {
        console.error("환율 정보를 불러오는 중 오류가 발생했습니다.", error);
        setIsLoadingRate(false);
        setCurrentRate(null);
      }
    };

    fetchExchangeRate();
  }, [selectedCurrency]);

  const handleCurrencyChange = (e) => {
    setSelectedCurrency(e.target.value);
    setAlertRate(""); // 통화 변경 시 알림 환율 초기화
    setPredictionDates([]);
    setMessage("");
    setIsRecommend(null);
    setEvents([]);
  };

  const handleAlertRateChange = (e) => {
    setAlertRate(e.target.value);
  };

  const handlePredictDate = async () => {
    if (!alertRate) {
      alert("알림 받을 환율을 입력하세요.");
      return;
    }

    try {
      setIsLoadingPrediction(true); // 로딩 시작
      const today = new Date().toISOString().split("T")[0]; // 오늘 날짜 (YYYY-MM-DD)
      const data = {
        currency: selectedCurrency,
        date: today,
        targetRatio: Number(alertRate),
        condition: alertCondition, // 추가된 조건
      };

      // 서버에 POST 요청 보내기
      const response = await axios.post(
        "http://localhost:8081/adviceplz",
        data
      );

      console.log("Prediction dates received:", response.data);

      if (response.data && response.data.length > 0) {
        // 날짜 배열이 있을 경우
        setPredictionDates(response.data);

        // 첫 번째 날짜 가져오기
        const firstDate = response.data[0];
        setSelectedDate(firstDate);

        // 메시지 업데이트
        setMessage(`${firstDate}에 목표 환율에 도달할 것 같아요!`);

        // 추천 버튼 활성화
        setIsRecommend(true);

        // 캘린더에 이벤트 추가
        const newEvents = response.data.map((date) => ({
          title: "도달",
          start: date,
          display: "list-item", // 이벤트를 목록 형태로 표시
          backgroundColor: "#009793", // 연한 초록색
          textColor: "#fff", // 텍스트 색상 설정
        }));
        setEvents(newEvents);

        // 캘린더 이동
        if (calendarRef.current) {
          const calendarApi = calendarRef.current.getApi();
          calendarApi.gotoDate(firstDate); // 캘린더를 첫 번째 날짜로 이동
        }
      } else {
        // 빈 배열일 경우
        setPredictionDates([]);
        setMessage("앞으로 한달간 목표 환율에 도달하지 못할 것 같아요!");
        setIsRecommend(false);
      }
    } catch (error) {
      console.error("예측 정보를 불러오는 중 오류가 발생했습니다.", error);
      setMessage("예측 정보를 불러오는 중 오류가 발생했습니다.");
      setIsRecommend(null);
    } finally {
      setIsLoadingPrediction(false); // 로딩 종료
    }
  };

  // 알람 설정 함수 수정
  const handleRegisterAlert = async () => {
    if (!alertRate) {
      alert("알림 받을 환율을 입력하세요.");
      return;
    }

    if (!userId) {
      alert("로그인이 필요한 서비스입니다.");
      return;
    }

    try {
      const alertData = {
        userId: userId,
        currencyCode: selectedCurrency,
        targetRate: parseFloat(alertRate),
        alertCondition: alertCondition,
      };

      const response = await axios.post(
        "http://localhost:8081/api/alert/register",
        alertData
      );

      console.log("Alert registration response:", response.data);

      // 모달로 결과 표시
      setConfirmationMessage("알림 설정이 완료되었습니다.");
      setIsConfirmationModalOpen(true);
      // onClose(); // 메인 모달을 닫지 않음
    } catch (error) {
      console.error("알림 설정 중 오류가 발생했습니다.", error);
      setConfirmationMessage("알림 설정 중 오류가 발생했습니다.");
      setIsConfirmationModalOpen(true);
    }
  };

  const handleAlertMethodChange = (method) => {
    setAlertMethod((prev) => ({
      ...prev,
      [method]: !prev[method],
    }));
  };

  const flagImage = currencyFlags[selectedCurrency];

  // 이벤트 콘텐츠 커스터마이징 함수
  const renderEventContent = (eventInfo) => {
    return (
      <div
        style={{
          backgroundColor: eventInfo.backgroundColor,
          color: eventInfo.textColor,
          borderRadius: "4px",
          padding: "2px",
          fontSize: "10px",
          textAlign: "center",
        }}
      >
        {eventInfo.event.title}
      </div>
    );
  };

  return (
    <div className="p-6 bg-white shadow-md max-w-[1024px] relative">
      {/* 로딩 중일 때 모달 중앙에 Spinner와 메시지 표시 */}
      {isLoadingPrediction && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-75 z-50">
          <Spinner size="xl" color="blue.500" />
          <p className="mt-4 text-lg font-semibold">
            딥러닝 모델을 통해 예측을 진행중입니다
          </p>
        </div>
      )}

      <div className="flex items-start space-x-8">
        {/* Left Side: Existing Elements */}
        <div className="flex-1">
          <div className="text-center">
            <img
              src={flagImage}
              alt={`${selectedCurrency} Flag`}
              className="w-20 h-20 mx-auto mb-4"
            />
            <p className="text-lg font-bold">{selectedCurrency}</p>
          </div>
          <div className="mt-4">
            <p className="mb-2">통화 선택</p>
            <select
              value={selectedCurrency}
              onChange={handleCurrencyChange}
              className="w-full p-2 border border-gray-300  "
            >
              <option value="USD">USD - 미국 달러</option>
              <option value="EUR">EUR - 유로</option>
              <option value="JPY">JPY - 일본 엔</option>
              <option value="CNY">CNY - 중국 위안</option>
            </select>
          </div>
          <div className="mt-4">
            <p className="mb-2">현재 환율</p>
            <input
              type="text"
              value={
                isLoadingRate
                  ? "로딩 중..."
                  : currentRate !== null
                  ? `${currentRate.toLocaleString()} 원`
                  : "환율 정보 없음"
              }
              readOnly
              className="w-full p-2 border border-gray-300   bg-gray-100"
            />
          </div>
          <div className="mt-4">
            <p className="mb-2">알림 설정 환율</p>
            <input
              type="number"
              placeholder="알림 받을 환율을 입력하세요"
              value={alertRate}
              onChange={handleAlertRateChange}
              className="w-full p-2 border border-gray-300  "
            />
          </div>
          {/* 추가된 버튼 섹션 */}
          <div className="mt-4">
            <p className="mb-2">알림 조건 선택</p>
            <div className="flex gap-5">
              <button
                className={`w-full px-4 py-2 text-white ${
                  alertCondition === "higher"
                    ? "bg-hana cursor-not-allowed"
                    : "bg-gray-300 hover:bg-hana duration-200"
                }`}
                onClick={() => setAlertCondition("higher")}
                disabled={alertCondition === "higher"}
              >
                높을 때
              </button>
              <button
                className={`w-full px-4 py-2 text-white ${
                  alertCondition === "lower"
                    ? "bg-hana cursor-not-allowed"
                    : "bg-gray-300 hover:bg-hana duration-200"
                }`}
                onClick={() => setAlertCondition("lower")}
                disabled={alertCondition === "lower"}
              >
                낮을 때
              </button>
            </div>
          </div>
          <div className="mt-4 text-center flex justify-end">
            <button
              onClick={handlePredictDate}
              className={`px-4 py-2 text-white justify-end  ${
                isLoadingPrediction
                  ? "bg-hana cursor-not-allowed"
                  : "bg-hana duration-200"
              } `}
              disabled={isLoadingPrediction}
            >
              날짜 예측
            </button>
          </div>
        </div>

        {/* Right Side: Calendar and Recommendations */}
        <div className="flex-1">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            locales={[koLocale]}
            locale="ko" // Korean locale
            height="400px"
            events={events}
            eventContent={renderEventContent} // 이벤트 콘텐츠 커스터마이징 함수 추가
          />
          <div className="mt-4">
            <hr className="my-4" />
            <div className="flex mt-4 gap-5">
              <button
                className={`w-full px-4 py-2 text-white   ${
                  isRecommend === false
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
                disabled={isRecommend !== false}
              >
                비추천
              </button>
              <button
                className={`w-full px-4 py-2 text-white   ${
                  isRecommend === true
                    ? "bg-hana cursor-not-allowed"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
                disabled={isRecommend !== true}
              >
                추천
              </button>
            </div>
            <div className="mt-4">
              <span className="text-lg font-semibold">{message}</span>
            </div>
            <div className="flex items-center gap-5 mt-4">
              <Box>알림 수신 방법</Box>
              <Checkbox
                isChecked={alertMethod.SMS}
                onChange={() => handleAlertMethodChange("SMS")}
              >
                SMS
              </Checkbox>
              <Checkbox
                isChecked={alertMethod.Email}
                onChange={() => handleAlertMethodChange("Email")}
              >
                Email
              </Checkbox>
            </div>
            <div className="mt-4 text-center flex justify-evenly gap-5">
              <button
                onClick={onClose}
                className={`px-4 py-2 text-white   ${
                  isLoadingPrediction
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-gray-500 hover:opacity-80 duration-200"
                }`}
                disabled={isLoadingPrediction}
              >
                닫기
              </button>
              <button
                onClick={handleRegisterAlert}
                className={`px-4 py-2 text-white   ${
                  isLoadingPrediction
                    ? "bg-hana cursor-not-allowed"
                    : "bg-hana hover:opacity-80 duration-200"
                }`}
                disabled={isLoadingPrediction}
              >
                알람설정
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isConfirmationModalOpen}
        onClose={() => {
          setIsConfirmationModalOpen(false);
          onClose();
        }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>알림</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>{confirmationMessage}</p>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={() => {
                setIsConfirmationModalOpen(false);
                onClose();
              }}
            >
              확인
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ExchangeRateAlertModal;
