import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Spinner,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaChartLine } from "react-icons/fa6";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";

export default function DrawerRatio({ closeDrawer }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [exchangeRates, setExchangeRates] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [chartData, setChartData] = useState([]); // 차트 데이터를 저장할 상태
  const [loading, setLoading] = useState(true);
  const [maxRate, setMaxRate] = useState(0); 
  const [minRate, setMinRate] = useState(0);

  const fetchExchangeRates = async () => {
    try {
      const response = await axios.post("http://localhost:8081/realtime4All");
      console.log("Exchange rates fetched:", response.data);
      setExchangeRates(response.data);
      setLoading(false);
    } catch (error) {
      console.error("환율 정보를 불러오는 중 오류가 발생했습니다.", error);
      setLoading(false);
    }
  };

  const getMaxRate = (data) => {
    let max = data[0].exchangeRate;
    data.forEach((item) => {
      if (item.exchangeRate > max) {
        max = item.exchangeRate;
      }
    });
    return parseFloat((max + (max * 0.01)).toFixed(2)); // 소수점 둘째 자리까지 반올림
  }
  
  const getMinRate = (data) => {
    let min = data[0].exchangeRate;
    data.forEach((item) => {
      if (item.exchangeRate < min) {
        min = item.exchangeRate;
      }
    });
    return parseFloat((min - (min * 0.01)).toFixed(2)); // 소수점 둘째 자리까지 반올림
  }
  

  // 사용자가 통화를 선택했을 때 showChart로 데이터를 요청하고 받은 데이터로 차트 그리기
  const fetchChartData = async (currencyCode) => {
    try {
      const response = await fetch('http://localhost:8081/showChart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tableName: currencyCode }),
      });
      const data = await response.json();
      console.log('Chart data:', data);

      // showChart API에서 받은 데이터를 chartData로 설정 (standardRate 기준)
      const formattedData = data.map(item => ({
        date: item.tradeDate,  // 날짜
        exchangeRate: item.exchangeRate,  // standardRate 값
      }));

      setChartData(formattedData);
      setMaxRate(getMaxRate(formattedData));
      setMinRate(getMinRate(formattedData));
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  useEffect(() => {
    fetchExchangeRates();
  }, []);

  useEffect(() => {
    console.log("Selected currency:", selectedCurrency);
    
    // selectedCurrency가 있을 때만 차트 데이터를 가져옵니다
    if (selectedCurrency) {
      fetchChartData(selectedCurrency.currencyCode);
    }
  }, [selectedCurrency]);

  return (
    <>
      <Tooltip
        label={<span style={{ fontSize: "1.25rem" }}>실시간 환율 정보</span>}
        placement="top"
      >
        <div
          className="fixed z-50 bottom-14 right-14 bg-hana text-white rounded-full cursor-pointer hover:opacity-80 duration-200"
          onClick={() => onOpen()}
        >
          <FaChartLine size="65" className="p-4" />
        </div>
      </Tooltip>

      <Drawer isOpen={isOpen} onClose={onClose} size="lg">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>실시간 환율 정보</DrawerHeader>
          <DrawerCloseButton />
          <DrawerBody>
            <div className="h-72 flex items-center justify-center">
              {selectedCurrency === null ? (
                <span className="text-xl font-bold">환율을 선택해주세요</span>
              ) : (
                <>
                  {/* 차트 영역 */}
                  {chartData.length > 0 ? (
                    <div className="w-full mt-4 text-center">
                      <span className="font-bold">{selectedCurrency.currencyName}</span>
                      <ResponsiveContainer width="100%" height={250}>
                        <AreaChart
                          data={chartData}
                          margin={{
                            top: 5, right: 30, left: 20, bottom: 5,
                          }}
                        >
                          <defs>
                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="50%" stopColor="#82ca9d" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.15}/>
                            </linearGradient>
                          </defs>
                          {/* <CartesianGrid strokeDasharray="3 3" /> */}
                          <XAxis dataKey="date" />
                          <YAxis domain={[minRate, maxRate]} />
                          <ChartTooltip />
                          {/* <Legend /> */}
                          <Area type="linear" dataKey="exchangeRate" stroke="#82ca9d" fillOpacity={1} fill="url(#colorUv)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="">
                      <p className="text-xl font-bold mb-3">차트 데이터를 불러오는 중...</p>
                      <div className="text-center">
                      <Spinner />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
            {loading ? (
              <p>환율 정보를 불러오는 중...</p>
            ) : (
              <div className="mt-8">
                <div className="w-[97.65%] text-center flex font-bold bg-slate-100">
                  <div className="w-[15%] py-2 border flex items-center justify-center">
                    통화명
                  </div>
                  <div className="w-[20%] py-2 border-y flex items-center justify-center">
                    매매기준율
                  </div>
                  <div className="w-[25%] py-2 border flex flex-col">
                    <p>현찰</p>
                    <div className="flex">
                      <p className="w-1/2 border-t border-r">구매</p>
                      <p className="w-1/2 border-t">판매</p>
                    </div>
                  </div>
                  <div className="w-[25%] py-2 border-y flex flex-col">
                    <p>송금</p>
                    <div className="flex">
                      <p className="w-1/2 border-t border-r">송금</p>
                      <p className="w-1/2 border-t">수취</p>
                    </div>
                  </div>
                  <div className="w-[15%] py-2 border flex items-center justify-center">
                    미화환산율
                  </div>
                </div>
                <div className="h-72 overflow-y-auto">
                  {exchangeRates.map((rate, index) => (
                    <div
                      key={index}
                      className="text-center text-sm flex cursor-pointer hover:bg-slate-50 duration-200"
                      onClick={() => {
                        setSelectedCurrency(rate);
                      }}
                    >
                      <div className="w-[15%] py-2 border flex items-center justify-center">
                        {rate.currencyCode}
                      </div>
                      <div className="w-[20%] py-2  border-y flex items-center justify-center">
                        {rate.standardRate}
                      </div>
                      <div className="w-[25%] py-2  border flex flex-col">
                        <div className="flex">
                          <p className="w-1/2 border-r">{rate.cashBuyRate}</p>
                          <p className="w-1/2 ">{rate.cashSellRate}</p>
                        </div>
                      </div>
                      <div className="w-[25%] py-2 border-y flex flex-col">
                        <div className="flex">
                          <p className="w-1/2  border-r">{rate.sendBuyRate}</p>
                          <p className="w-1/2 ">{rate.receiveSellRate}</p>
                        </div>
                      </div>
                      <div className="w-[15%] py-2 border flex items-center justify-center">
                        {rate.sellSpread}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
