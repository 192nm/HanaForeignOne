import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Header from "../../components/Header/Header.js";
import Footer from "../../components/Footer/Footer.js";
import currencyList from "../../Data/CurrencyData.js";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  Tooltip,
  LabelList,
} from "recharts";
import styled from "styled-components";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  IconButton,
  Tooltip as ChakraTooltip,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { FaHeart, FaRegHeart, FaChartBar } from "react-icons/fa";

const ExpectRatio = () => {
  const [baseCurrency, setBaseCurrency] = useState("USD"); // 기본값을 "USD"로 변경
  const [targetCurrency, setTargetCurrency] = useState("USD");
  const [predictionDate, setPredictionDate] = useState("");
  const [predictedRate, setPredictedRate] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [news, setNews] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [maxRate, setMaxRate] = useState(null);
  const [minRate, setMinRate] = useState(null);
  const [currentRate, setCurrentRate] = useState(null); // Changed from [] to null
  const [isLoadingRate, setIsLoadingRate] = useState(false);
  const [chartType, setChartType] = useState("Area"); // 새로운 상태 변수 추가

  const { isOpen, onOpen, onClose } = useDisclosure();

  // Chakra UI Toast
  const toast = useToast();

  // Fetch chart data
  const fetchChartData = async (currencyCode) => {
    setIsLoadingRate(true);
    try {
      const response = await axios.post(
        "http://localhost:8081/showChart",
        { tableName: currencyCode },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;

      const formattedData = data.map((item) => ({
        date: item.tradeDate,
        exchangeRate: parseFloat(item.exchangeRate), // Ensure exchangeRate is a number
      }));

      setChartData(formattedData);
      setMaxRate(getMaxRate(formattedData));
      setMinRate(getMinRate(formattedData));
    } catch (error) {
      console.error("Error fetching chart data:", error);
    } finally {
      setIsLoadingRate(false);
    }
  };

  const getMaxRate = (data) => {
    let max = data[0].exchangeRate;
    data.forEach((item) => {
      if (item.exchangeRate > max) {
        max = item.exchangeRate;
      }
    });
    return parseFloat((max + max * 0.01).toFixed(2));
  };

  const getMinRate = (data) => {
    let min = data[0].exchangeRate;
    data.forEach((item) => {
      if (item.exchangeRate < min) {
        min = item.exchangeRate;
      }
    });
    return parseFloat((min - min * 0.01).toFixed(2));
  };

  // Fetch current rate
  const fetchCurrentRate = async () => {
    setIsLoadingRate(true);
    try {
      const response = await axios.post("http://localhost:8081/realtime4");
      console.log("Current exchange rate fetched:", response.data);
      setCurrentRate(response.data);
    } catch (error) {
      console.error("환율 정보를 불러오는 중 오류가 발생했습니다.", error);
    } finally {
      setIsLoadingRate(false);
    }
  };

  // Handle currency selection
  const handleCurrencyChange = (e) => {
    const selected = e.target.value;
    setSelectedCurrency(
      currencyList.find((currency) => currency.code === selected)
    );
    setBaseCurrency(selected);
  };

  useEffect(() => {
    if (selectedCurrency) {
      fetchChartData(selectedCurrency.code);
      fetchCurrentRate();
    }
  }, [selectedCurrency]);

  useEffect(() => {
    fetchChartData("USD"); // 기본 통화를 "USD"로 설정
    fetchCurrentRate();
  }, []);

  // Fetch news
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8081/api/news",
          targetCurrency,
          {
            headers: {
              "Content-Type": "text/plain",
            },
          }
        );
        console.log("Response data:", response.data);
        setNews(response.data.items);
      } catch (error) {
        console.error("뉴스 데이터를 가져오는 중 오류 발생:", error);
      }
    };

    fetchNews();
  }, [targetCurrency]);

  // Handle favorite toggle
  const handleToggleFavorite = (article) => {
    const isFavorited = favorites.some((fav) => fav.link === article.link);
    let updatedFavorites;

    if (isFavorited) {
      updatedFavorites = favorites.filter((fav) => fav.link !== article.link);
      toast({
        title: "즐겨찾기 해제됨",
        description: `${article.title}`,
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
    } else {
      updatedFavorites = [...favorites, article];
      toast({
        title: "즐겨찾기 추가됨",
        description: `${article.title}`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }

    setFavorites(updatedFavorites);
  };

  // Handle chart type change
  const handleChartTypeChange = (type) => {
    setChartType(type);
  };

  // Render historical data section
  const renderHistoricalDataSection = () => {
    if (isLoadingRate)
      return (
        <div className="max-w-[1024px] h-[350px] flex items-center justify-center text-center mx-auto">
          <Spinner />
        </div>
      );
    if (chartData.length === 0) {
      return (
        <div className="max-w-[1024px] h-[350px] flex items-center justify-center text-center mx-auto">
          통화를 선택해주세요
        </div>
      );
    }
    return (
      <section className="expectRatio-historical-data-section mt-6 px-4 relative">
        <h3 className="font-bold mb-4 text-center text-2xl">
          과거 환율 데이터
        </h3>
        {/* 그래프 유형 전환 버튼 추가 */}
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<FaChartBar />}
            size="sm"
            variant="ghost"
            position="absolute"
            top="10px"
            right="10px"
            aria-label="Change Chart Type"
          />
          <MenuList>
            <MenuItem onClick={() => handleChartTypeChange("Area")}>
              영역 그래프
            </MenuItem>
            <MenuItem onClick={() => handleChartTypeChange("Line")}>
              선 그래프
            </MenuItem>
            <MenuItem onClick={() => handleChartTypeChange("Bar")}>
              막대 그래프
            </MenuItem>
          </MenuList>
        </Menu>
        <div className="max-w-[1024px] mx-auto">
          <ResponsiveContainer width="100%" height={350}>
            {chartType === "Area" && (
              <AreaChart
                data={chartData}
                margin={{ top: 40, right: 30, left: 20, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="50%" stopColor="#82ca9d" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.15} />
                  </linearGradient>
                </defs>
                {/* CartesianGrid 제거 */}
                {/* <CartesianGrid strokeDasharray="3 3" /> */}
                <XAxis
                  dataKey="date"
                  interval={Math.floor(chartData.length / 10)}
                />{" "}
                {/* X축 라벨 간격 조정 */}
                <YAxis domain={[minRate, maxRate]} />
                <ChartTooltip />
                <Area
                  type="monotone"
                  dataKey="exchangeRate"
                  stroke="#82ca9d"
                  fillOpacity={1}
                  fill="url(#colorUv)"
                />
              </AreaChart>
            )}
            {chartType === "Line" && (
              <LineChart
                data={chartData}
                margin={{ top: 40, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />{" "}
                {/* 필요 시 유지하거나 제거 */}
                <XAxis
                  dataKey="date"
                  interval={Math.floor(chartData.length / 10)}
                />{" "}
                {/* X축 라벨 간격 조정 */}
                <YAxis domain={[minRate, maxRate]} />
                <ChartTooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="exchangeRate"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            )}
            {chartType === "Bar" && (
              <BarChart
                data={chartData}
                margin={{ top: 40, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />{" "}
                {/* 필요 시 유지하거나 제거 */}
                <XAxis
                  dataKey="date"
                  interval={Math.floor(chartData.length / 10)}
                />{" "}
                {/* X축 라벨 간격 조정 */}
                <YAxis domain={[minRate, maxRate]} />
                <ChartTooltip />
                <Legend />
                <Bar dataKey="exchangeRate" fill="#8884d8" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </section>
    );
  };

  return (
    <SwiperContainer>
      <div className="expectRatio-page mt-0 flex flex-col min-h-screen bg-gray-100">
        {/* Header 추가 가능 */}
        {/* Historical data section */}
        {renderHistoricalDataSection()}

        <div className="btn-wrapper flex gap-5 justify-center mt-6">
          <select
            onChange={handleCurrencyChange}
            className="expectRatio-favorite-button flex-1 px-6 py-3 border border-gray-600 cursor-pointer  text-lg max-w-[400px] max-h-[50px] text-center"
            value={baseCurrency} // 기본값을 "USD"로 설정
          >
            {currencyList.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.code} - {currency.name_kr}
              </option>
            ))}
          </select>
          <button
            className="expectRatio-predict-button flex-1 px-6 py-3 bg-hana text-white  hover:opacity-80 duration-300 text-lg max-w-[400px] max-h-[50px]"
            onClick={onOpen}
          >
            예측하기
          </button>
        </div>
        <div className="mt-10 w-[85%] mx-auto border"></div>
        <main className="expectRatio-container flex-1 py-4 w-full max-w-screen-lg mx-auto bg-white">
          {/* News section */}
          <section
            className="expectRatio-news-section px-4 py-4 border-gray-300 "
            style={{ height: "300px" }}
          >
            <h3 className="text-2xl font-bold mb-4">환율 관련 뉴스</h3>
            <div className="mt-6">
              {news && news.length > 0 ? (
                <Swiper
                  spaceBetween={10}
                  slidesPerView={2.6}
                  pagination={{ clickable: true }}
                  loop={true}
                  autoplay={{ delay: 3000 }}
                  modules={[Pagination, Autoplay]}
                >
                  {news.map((article, index) => (
                    <SwiperSlide key={index} 
                    >
                      {" "}
                      {/* 뉴스 카드 가로 크기 증가 */}
                      <div
                        className="news-card relative border  p-4 shadow-lg bg-white flex flex-col w-full overflow-hidden"
                        style={{
                          height: "200px",
                          border: "3px solid #e5e7eb",
                          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                          borderRadius: "8px",
                          marginBottom: "16px",
                        }}
                      >
                        {/* 하트 버튼을 우하단으로 이동 */}
                        <IconButton
                          icon={
                            favorites.some(
                              (fav) => fav.link === article.link
                            ) ? (
                              <FaHeart color="#e53e3e" />
                            ) : (
                              <FaRegHeart color="#a0aec0" />
                            )
                          }
                          variant="ghost"
                          aria-label="Favorite"
                          position="absolute"
                          bottom="10px"
                          right="10px"
                          onClick={() => handleToggleFavorite(article)}
                        />

                        {/* 제목 툴팁 추가 및 한 줄 표시 */}
                        <ChakraTooltip
                          label={article.title}
                          aria-label="A tooltip"
                        >
                          <h4 className="text-lg font-semibold mb-1 text-gray-800 hover:text-teal-500 overflow-hidden line-clamp-1 text-left">
                            <a
                              href={article.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              dangerouslySetInnerHTML={{
                                __html: article.title,
                              }}
                              className="hover:underline"
                            />
                          </h4>
                        </ChakraTooltip>

                        {/* 내용 왼쪽 정렬 및 일정한 잘림 */}
                        <p className="text-gray-600 text-sm flex-1 overflow-hidden text-ellipsis text-left">
                          {article.description
                            .replace(/<[^>]+>/g, "")
                            .substring(0, 150)}
                        </p>

                        {/* 날짜를 좌하단으로 이동 */}
                        <div className="mt-2 flex justify-start text-xs text-gray-500">
                          <span>
                            {new Date(article.pubDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <p>뉴스 데이터를 불러오는 중입니다...</p>
              )}
            </div>
          </section>
        </main>
        {/* Footer 추가 가능 */}
      </div>
      <PredictModal
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        predictedRate={predictedRate}
        setPredictedRate={setPredictedRate}
        currentRate={currentRate}
        setCurrentRate={setCurrentRate}
      />
    </SwiperContainer>
  );
};

const SwiperContainer = styled.div`
  .swiper-pagination {
    position: relative;
    bottom: 10px;
    text-align: center;
    display: flex !important;
    left: -50%;
    display: flex;
  }

  .swiper-pagination-bullet {
    width: 12px;
    height: 12px;
    margin: 0 5px;
    display: inline-block;
    background: #1abc9c;
    border-radius: 50%;
    opacity: 0.7;
    cursor: pointer;

    &.swiper-pagination-bullet-active {
      background: #1abc9c;
    }
  }
`;

// PredictModal 컴포넌트는 변경사항이 없으므로 그대로 유지
function PredictModal({
  isOpen,
  onClose,
  predictedRate,
  setPredictedRate,
  currentRate,
  setCurrentRate,
}) {
  const [baseCurrency, setBaseCurrency] = useState("KRW");
  const [targetCurrency, setTargetCurrency] = useState("USD");
  const [predictionDate, setPredictionDate] = useState("");
  const [modalSize, setModalSize] = useState("md");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStandardRate, setCurrentStandardRate] = useState(null);

  const handlePredict = async () => {
    if (!predictionDate) {
      alert("예측 날짜를 선택해주세요.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", {
        currency: targetCurrency,
        date: predictionDate,
      });
      console.log("Response:", response.data);
      // Ensure the predicted rate is a number with two decimal places
      const predicted = parseFloat(
        response.data.predicted_exchange_rate
      ).toFixed(2);
      setPredictedRate(predicted);
      setModalSize("5xl");
    } catch (error) {
      console.error("Error predicting exchange rate:", error);
      alert("환율 예측에 실패했습니다. 나중에 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const filterCurrency = () => {
    if (currentRate && Array.isArray(currentRate)) {
      const rateObj = currentRate.find(
        (data) => data.currencyName.split(" ")[1] === targetCurrency
      );
      if (rateObj) {
        setCurrentStandardRate(parseFloat(rateObj.standardRate).toFixed(2));
      } else {
        setCurrentStandardRate(null);
      }
    } else if (currentRate && typeof currentRate === "object") {
      setCurrentStandardRate(parseFloat(currentRate.standardRate).toFixed(2));
    }
  };

  useEffect(() => {
    filterCurrency();
  }, [targetCurrency, currentRate]);

  // Calculate dynamic XAxis domain based on current and predicted rates
  const xDomain = useMemo(() => {
    if (currentStandardRate !== null && predictedRate !== null) {
      const current = parseFloat(currentStandardRate);
      const predictedVal = parseFloat(predictedRate);
      const min = Math.min(current, predictedVal);
      const max = Math.max(current, predictedVal);
      const padding = (max - min) * 0.8; // 5% padding
      return [min - padding, max + padding];
    }
    return [0, 0];
  }, [currentStandardRate, predictedRate]);

  // Custom label renderer to format labels to two decimal places
  const renderCustomizedLabel = ({ x, y, width, height, value }) => {
    return (
      <text
        x={x + width + 5}
        y={y + height / 2}
        fill="#000"
        textAnchor="start"
        dominantBaseline="middle"
        fontSize={14}
      >
        {parseFloat(value).toFixed(2)}
      </text>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size={modalSize}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontSize="2xl">환율 예측</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className="flex gap-5">
            <section
              className={`expectRatio-prediction-section flex-1 border-gray-300 bg-white ${
                modalSize === "5xl" ? "w-1/2" : "w-full"
              }`}
              style={{ backgroundColor: "#ffffff" }}
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                환율 예측
              </h2>
              <div className="expectRatio-form flex flex-col gap-4 text-left">
                <div className="expectRatio-input w-full flex justify-between text-base flex-col">
                  <label className="flex-1">기준 통화</label>
                  <select
                    value={baseCurrency}
                    onChange={(e) => setBaseCurrency(e.target.value)}
                    className="flex-2 px-3 py-2 border border-gray-300 "
                  >
                    {currencyList.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name_kr}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="expectRatio-input flex justify-between text-base flex-col">
                  <label className="flex-1">대상 통화</label>
                  <select
                    value={targetCurrency}
                    onChange={(e) => setTargetCurrency(e.target.value)}
                    className="flex-2 px-3 py-2 border border-gray-300 "
                  >
                    {currencyList.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name_kr}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="expectRatio-input flex justify-between text-base flex-col">
                  <label className="flex-1">예측 날짜</label>
                  <input
                    type="date"
                    value={predictionDate}
                    onChange={(e) => setPredictionDate(e.target.value)}
                    className="flex-2 px-3 py-2 border border-gray-300 "
                  />
                </div>
                <div className="flex justify-between text-base flex-col">
                  <label className="border-gray-300">현재 환율</label>
                  <div className="border p-2 ">
                    {currentStandardRate !== null ? (
                      <p>{currentStandardRate}</p>
                    ) : (
                      "불러오는 중..."
                    )}
                  </div>
                </div>
                <div className="flex justify-between text-base flex-col">
                  <label className="border-gray-300">예측 환율</label>
                  <div className="border p-2 ">
                    {predictedRate ? predictedRate : "예측값 없음"}
                  </div>
                </div>
              </div>
            </section>
            {modalSize === "5xl" ? (
              <div className="w-1/2 border-l pl-3">
                <h2 className="text-center text-2xl font-bold">예측 결과</h2>
                <div className="flex flex-col items-center mt-4">
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart
                      layout="vertical" // Set layout to vertical for horizontal bars
                      data={[
                        {
                          name: targetCurrency,
                          현재가: currentStandardRate, // Use the filtered current rate
                          예측가: predictedRate,
                        },
                      ]}
                      barGap={20} // Adjusted barGap for better spacing
                      barCategoryGap="40%" // Adjusted barCategoryGap for more spacing
                    >
                      <XAxis
                        type="number"
                        domain={xDomain}
                        tickFormatter={(value) => parseFloat(value).toFixed(2)} // Format XAxis labels
                      />
                      <YAxis type="category" dataKey="name" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="현재가" fill="#ff4d4f" barSize={30}>
                        <LabelList content={renderCustomizedLabel} />
                      </Bar>
                      <Bar dataKey="예측가" fill="#1890ff" barSize={30}>
                        <LabelList content={renderCustomizedLabel} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>

                  <Accordion width="100%" className="mt-6">
                    <AccordionItem>
                      <h2>
                        <AccordionButton>
                          <Box as="span" flex="1" textAlign="left">
                            금리
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4}>
                      미국 고용지표가 예상보다 좋게 나오면서 연준의 금리 인하 기대가 사라지고 금리 상승 가능성이 커졌습니다. 이에 따라 미 국채 금리가 급등하고, 달러 강세로 원/달러 환율이 상단을 테스트하고 있습니다.
                      </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem>
                      <h2>
                        <AccordionButton>
                          <Box as="span" flex="1" textAlign="left">
                            뉴스
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4}>
                      미국 고용지표 서프라이즈로 인해 달러 강세가 지속되며, 글로벌 통화 가치에 영향을 미치고 있습니다. 이로 인해 환율 상승 압력이 가중되고 있으며, 특히 지정학적 리스크나 원자재 상승 뉴스가 추가적인 상승을 유발할 수 있습니다.
                      </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem>
                      <h2>
                        <AccordionButton>
                          <Box as="span" flex="1" textAlign="left">
                            원자재
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4}>
                      국제 유가 상승과 같은 원자재 가격 상승은 환율을 상승시키는 주요 요인이며, 이러한 원자재 가격 상승이 계속되면 달러/원 환율 상단 돌파를 유발할 가능성이 있습니다.
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            ) : null}
          </div>
          <div className="flex flex-start gap-5">
            <div
              className="w-full text-center my-4 py-2 cursor-pointer hover:opacity-75 duration-300 bg-hana text-white font-bold"
              onClick={handlePredict}
            >
              {isLoading ? <Spinner /> : "예측하기"}
            </div>
            {modalSize === "5xl" ? (
              <div
                className="w-full bg-slate-300 text-center my-4 py-2 cursor-pointer hover:bg-slate-400 duration-300"
                onClick={() => {
                  setModalSize("md"); // Reset modal size when closing
                  onClose();
                }}
              >
                닫기
              </div>
            ) : null}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default ExpectRatio;
