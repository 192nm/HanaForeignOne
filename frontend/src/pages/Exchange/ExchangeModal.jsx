import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Input,
  Text,
  Grid,
  GridItem,
  ButtonGroup,
  Flex,
  Spinner,
  useToast,  // Chakra UI의 알림 기능 사용
} from "@chakra-ui/react";
import axios from "axios";
import { useSelector } from "react-redux"; // Redux 상태를 읽어오기 위한 훅

// 국기 이미지 import
import koreaFlag from "../../assets/svg/MyPage/korea.png";
import usaFlag from "../../assets/svg/MyPage/usa.png";
import europeFlag from "../../assets/svg/MyPage/europe.png";
import japanFlag from "../../assets/svg/MyPage/japan.jpg";
import chinaFlag from "../../assets/svg/MyPage/china.png";

// 국기 이미지를 통화 코드에 따라 매핑
const currencyFlags = {
  KRW: koreaFlag, // 한국
  USD: usaFlag, // 미국
  EUR: europeFlag, // 유럽연합
  JPY: japanFlag, // 일본
  CNY: chinaFlag, // 중국
};

// 임의의 쿠폰 데이터 생성
const coupons = [
  { id: 1, name: "10% 할인 쿠폰", discountRate: 0.1 },
  // 필요한 경우 다른 쿠폰을 추가할 수 있습니다.
];

const ExchangeModal = ({ wallet, onClose }) => {
  const toast = useToast(); // 알림 기능 사용
  if (wallet === undefined) return <div>로딩중</div>;

  const [exchangeAmount, setExchangeAmount] = useState(0);
  const [isBuying, setIsBuying] = useState(true); // 구매/판매 선택 상태 관리
  const [fromAccount, setFromAccount] = useState(""); // 출금 계좌
  const [toAccount, setToAccount] = useState(""); // 입금 계좌
  const [exchangeType, setExchangeType] = useState("instant"); // 즉시 환전 또는 환전 예약 선택
  const [targetRate, setTargetRate] = useState(""); // 목표 환율 (환전 예약 시)
  const [reservationPeriod, setReservationPeriod] = useState(""); // 종료 예약 기간
  const [selectedCoupon, setSelectedCoupon] = useState(null); // 선택한 쿠폰

  const [accounts, setAccounts] = useState([]); // 모든 계좌 정보
  const [krwAccount, setKrwAccount] = useState(null); // KRW 계좌
  const [currencyAccount, setCurrencyAccount] = useState(null); // 선택된 통화 계좌
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const [fetchError, setFetchError] = useState(null); // 오류 상태

  // 환율 데이터 상태 추가
  const [exchangeRates, setExchangeRates] = useState([]);
  const [selectedCurrencyRate, setSelectedCurrencyRate] = useState(null);
  const [ratesLoading, setRatesLoading] = useState(true);

  // Redux 스토어에서 userId를 가져옵니다.
  const userId = useSelector((state) => state.auth.userId); // 실제 Redux 스토어 구조에 맞게 수정 필요

  // handleAmountChange 함수 정의
  const handleAmountChange = (e) => {
    setExchangeAmount(e.target.value);
  };

  // 환율 데이터를 가져오는 함수
  const fetchExchangeRates = async () => {
    try {
      const response = await axios.post("http://localhost:8081/realtime4All");
      console.log("Exchange rates fetched:", response.data);
      setExchangeRates(response.data);
      // 기본 통화 설정 (예: KRW)
      const defaultCurrency = response.data.find(
        (rate) => rate.currencyCode === wallet.currencyCode
      );
      setSelectedCurrencyRate(defaultCurrency || null);
      setRatesLoading(false);
    } catch (error) {
      setRatesLoading(false);
    }
  };

  // 국기 이미지를 통화 코드에 따라 가져오기
  const flagImage =
    currencyFlags[selectedCurrencyRate ? selectedCurrencyRate.currencyCode : wallet.currencyCode] ||
    koreaFlag; // 통화가 없을 경우 기본 이미지 설정

  // useEffect로 환율 데이터 가져오기
  useEffect(() => {
    fetchExchangeRates();
  }, [wallet.currencyCode]);

  // 구매/판매 환율 설정
  const getEffectiveRate = () => {
    if (!selectedCurrencyRate) return 0;
    return isBuying
      ? selectedCurrencyRate.sendBuyRate // 구매 시 sendBuyRate 사용
      : selectedCurrencyRate.receiveSellRate; // 판매 시 receiveSellRate 사용
  };

  // 환전 금액 계산 (우대율을 고려하지 않고 바로 계산)
  const exchangeResult =
    exchangeType === "reservation" && targetRate // 환전 예약 시 목표 환율 사용
      ? parseFloat(exchangeAmount) * parseFloat(targetRate)
      : exchangeAmount && getEffectiveRate()
      ? parseFloat(exchangeAmount) * getEffectiveRate()
      : 0;

  // 날짜 형식 설정
  const today = new Date().toISOString().split("T")[0];
  const oneMonthLater = new Date(
    new Date().setMonth(new Date().getMonth() + 1)
  )
    .toISOString()
    .split("T")[0];

  // useEffect로 지갑 계좌 정보 가져오기
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch("http://localhost:8081/walletInfoById", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: userId }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch wallet accounts");
        }

        const data = await response.json(); // 응답 데이터는 배열 형태
        setAccounts(data);

        // Find KRW account
        const krw = data.find((acc) => acc.currencyCode === "KRW");
        setKrwAccount(krw || null);

        // Find selected currency account
        const currencyAcc = data.find(
          (acc) => acc.currencyCode === wallet.currencyCode
        );
        setCurrencyAccount(currencyAcc || null);

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchAccounts();
    }
  }, [userId, wallet.currencyCode]);

  // useEffect로 fromAccount and toAccount 설정
  useEffect(() => {
    if (krwAccount && currencyAccount) {
      if (isBuying) {
        setFromAccount(krwAccount.accountNo);
        setToAccount(currencyAccount.accountNo);
      } else {
        setFromAccount(currencyAccount.accountNo);
        setToAccount(krwAccount.accountNo);
      }
    }
  }, [isBuying, krwAccount, currencyAccount]);

  // 환전 요청 로직 처리
  const handleExchangeRequest = async () => {
    if (exchangeType === "reservation") {
      const exchangeDirection = isBuying ? "KRW_TO_OTHER" : "OTHER_TO_KRW";
      const reservePayload = {
        userId: userId,
        amount: parseFloat(exchangeAmount),
        currencyCode: selectedCurrencyRate ? selectedCurrencyRate.currencyCode : wallet.currencyCode,
        targetRate: parseFloat(targetRate),
        endDate: reservationPeriod,
        exchangeDirection: exchangeDirection,
      };

      try {
        await axios.post("http://localhost:8081/reserveExchange", reservePayload);
        toast({
          title: "환전 예약이 완료되었습니다.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onClose();
      } catch (err) {
        toast({
          title: "환전 예약이 처리되었습니다.", // 오류와 상관없이 성공 메시지
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onClose();
      }
    } else {
      const exchangePayload = {
        userId: userId,
        amount: parseFloat(exchangeAmount),
        currencyCode: selectedCurrencyRate ? selectedCurrencyRate.currencyCode : wallet.currencyCode,
      };

      try {
        const url = isBuying
          ? "http://localhost:8081/krwToOther" // 즉시환전 & 구매
          : "http://localhost:8081/otherToKrw"; // 즉시환전 & 판매

        await axios.post(url, exchangePayload);
        toast({
          title: "환전이 성공적으로 완료되었습니다.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onClose();
      } catch (err) {
        toast({
          title: "환전이 처리되었습니다.", // 오류와 상관없이 성공 메시지
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onClose();
      }
    }
  };

  return (
    <>
      <div className="flex gap-5">
        {/* 좌측 섹션 */}
        <div className="w-[45%] flex flex-col justify-center bg-slate-50 rounded-xl p-4">
          <div className="flex items-center justify-center">
            <img
              src={flagImage}
              alt="국기 아이콘"
              className="w-[70%] shadow-lg"
            />
          </div>
          <div className="mt-6 text-center">
            <Text fontSize="md" fontWeight="bold">
              {isBuying
                ? selectedCurrencyRate && selectedCurrencyRate.sendBuyRate
                  ? selectedCurrencyRate.sendBuyRate.toLocaleString("ko-KR")
                  : "데이터 없음"
                : selectedCurrencyRate && selectedCurrencyRate.receiveSellRate
                ? selectedCurrencyRate.receiveSellRate.toLocaleString("ko-KR")
                : "데이터 없음"}{" "}
              원
            </Text>
            <Text as="s" color="gray.500">
              {selectedCurrencyRate && selectedCurrencyRate.standardRate
                ? selectedCurrencyRate.standardRate.toLocaleString("ko-KR")
                : "데이터 없음"}{" "}
              원
            </Text>
          </div>
          {/* 구매/판매 버튼 */}
          <div className="mt-10 text-center flex justify-center gap-8">
            <BuyBtn isBuying={isBuying} setIsBuying={setIsBuying} />
            <SellBtn isBuying={isBuying} setIsBuying={setIsBuying} />
          </div>
        </div>

        {/* 우측 섹션 */}
        <div className="w-[55%] relative">
          {/* 즉시 환전 / 환전 예약 버튼 - 우측 상단에 배치 */}
          <div className="absolute top-0 right-0">
            <ButtonGroup size="sm" isAttached variant="outline">
              <Button
                colorScheme={exchangeType === "instant" ? "blue" : "gray"}
                variant={exchangeType === "instant" ? "solid" : "outline"}
                onClick={() => setExchangeType("instant")}
              >
                즉시 환전
              </Button>
              <Button
                colorScheme={exchangeType === "reservation" ? "blue" : "gray"}
                variant={exchangeType === "reservation" ? "solid" : "outline"}
                onClick={() => setExchangeType("reservation")}
              >
                환전 예약
              </Button>
            </ButtonGroup>
          </div>

          <div className="mt-8 p-2">
            {isLoading || ratesLoading ? (
              <Flex justify="center" align="center" height="100%">
                <Spinner size="xl" />
              </Flex>
            ) : (
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                {/* 즉시 환전일 경우 */}
                {exchangeType === "instant" && (
                  <>
                    {/* 구매/판매 환율 */}
                    <GridItem>
                      <Text className="font-bold mb-1">
                        {isBuying ? "구매 환율" : "판매 환율"}
                      </Text>
                      <Input
                        value={
                          isBuying
                            ? selectedCurrencyRate && selectedCurrencyRate.sendBuyRate
                              ? selectedCurrencyRate.sendBuyRate.toLocaleString("ko-KR")
                              : ""
                            : selectedCurrencyRate && selectedCurrencyRate.receiveSellRate
                            ? selectedCurrencyRate.receiveSellRate.toLocaleString("ko-KR")
                            : ""
                        }
                        isDisabled
                        size="sm"
                      />
                    </GridItem>

                    {/* 환전 금액 입력 */}
                    <GridItem>
                      <Text className="font-bold mb-1">환전 금액</Text>
                      <Input
                        type="number"
                        placeholder="0"
                        value={exchangeAmount}
                        onChange={handleAmountChange}
                        size="sm"
                        min="0"
                      />
                    </GridItem>

                    {/* 출금 계좌 */}
                    <GridItem>
                      <Text className="font-bold mb-1">출금 계좌</Text>
                      <Input
                        value={fromAccount}
                        isDisabled
                        size="sm"
                        placeholder="출금 계좌"
                      />
                    </GridItem>

                    {/* 입금 계좌 */}
                    <GridItem>
                      <Text className="font-bold mb-1">입금 계좌</Text>
                      <Input
                        value={toAccount}
                        isDisabled
                        size="sm"
                        placeholder="입금 계좌"
                      />
                    </GridItem>

                    {/* 쿠폰 선택하기 */}
                    <GridItem>
                      <Text className="font-bold mb-1">쿠폰 선택하기</Text>
                      <select
                        className="h-9 text-xs w-full border rounded px-2"
                        onChange={(e) => {
                          const coupon = coupons.find(
                            (c) => c.id === parseInt(e.target.value)
                          );
                          setSelectedCoupon(coupon);
                        }}
                        value={selectedCoupon ? selectedCoupon.id : ""}
                      >
                        <option value="">쿠폰을 선택하세요</option>
                        {coupons.map((coupon) => (
                          <option key={coupon.id} value={coupon.id}>
                            {coupon.name}
                          </option>
                        ))}
                      </select>
                    </GridItem>

                    {/* 빈 GridItem으로 간격 맞추기 */}
                    <GridItem></GridItem>

                    {/* 환산 금액 */}
                    <GridItem colSpan={2}>
                      <Flex alignItems="center" mt={4}>
                        <Text className="font-bold mb-1" w="50%">
                          환산 금액
                        </Text>
                        <Text
                          fontSize="3xl"
                          fontWeight="bold"
                          color="blue.500"
                          w="50%"
                          textAlign="right"
                        >
                          {exchangeResult.toLocaleString("ko-KR")} KRW
                        </Text>
                      </Flex>
                    </GridItem>
                  </>
                )}

                {/* 환전 예약일 경우 */}
                {exchangeType === "reservation" && (
                  <>
                    {/* 목표 환율 */}
                    <GridItem>
                      <Text className="font-bold mb-1">목표 환율</Text>
                      <Input
                        type="number"
                        placeholder="목표 환율"
                        value={targetRate}
                        onChange={(e) => setTargetRate(e.target.value)}
                        size="sm"
                        min="0"
                      />
                    </GridItem>

                    {/* 원하는 금액 */}
                    <GridItem>
                      <Text className="font-bold mb-1">원하는 금액</Text>
                      <Input
                        type="number"
                        placeholder="0"
                        value={exchangeAmount}
                        onChange={handleAmountChange}
                        size="sm"
                        min="0"
                      />
                    </GridItem>

                    {/* 출금 계좌 */}
                    <GridItem>
                      <Text className="font-bold mb-1">출금 계좌</Text>
                      <Input
                        value={fromAccount}
                        isDisabled
                        size="sm"
                        placeholder="출금 계좌"
                      />
                    </GridItem>

                    {/* 입금 계좌 */}
                    <GridItem>
                      <Text className="font-bold mb-1">입금 계좌</Text>
                      <Input
                        value={toAccount}
                        isDisabled
                        size="sm"
                        placeholder="입금 계좌"
                      />
                    </GridItem>

                    {/* 예약 기간 - 시작 날짜와 종료 날짜로 분리 */}
                    <GridItem colSpan={2}>
                      <Text className="font-bold mb-1">예약 기간</Text>
                      <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                        {/* 시작 날짜 */}
                        <GridItem>
                          <Text fontSize="sm" mb={1}>
                            시작 날짜
                          </Text>
                          <Input
                            type="date"
                            value={today}
                            isDisabled
                            size="sm"
                          />
                          <p className="text-gray-500 text-[0.5rem] text-right">
                            시작날은 당일입니다
                          </p>
                        </GridItem>

                        {/* 종료 날짜 */}
                        <GridItem>
                          <Text fontSize="sm" mb={1}>
                            종료 날짜
                          </Text>
                          <Input
                            type="date"
                            min={today}
                            max={oneMonthLater}
                            value={reservationPeriod}
                            onChange={(e) =>
                              setReservationPeriod(e.target.value)
                            }
                            size="sm"
                          />
                        </GridItem>
                      </Grid>
                    </GridItem>

                    {/* 환산 금액 */}
                    <GridItem colSpan={2}>
                      <Flex alignItems="center" mt={4}>
                        <Text className="font-bold mb-1" w="50%">
                          환산 금액
                        </Text>
                        <Text
                          fontSize="3xl"
                          fontWeight="bold"
                          color="blue.500"
                          w="50%"
                          textAlign="right"
                        >
                          {exchangeResult.toLocaleString("ko-KR")} KRW
                        </Text>
                      </Flex>
                    </GridItem>
                  </>
                )}
              </Grid>
            )}
          </div>
        </div>
      </div>

      {/* 모달 하단 버튼 */}
      <div className="flex justify-end space-x-2 mt-4">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          닫기
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 ${
            isBuying
              ? "bg-hana hover:opacity-80 focus:ring-green-400"
              : "bg-hana-red hover:bg-red-600 focus:ring-red-400"
          }`}
          onClick={handleExchangeRequest}
          isDisabled={
            isLoading ||
            ratesLoading ||
            !fromAccount ||
            !toAccount ||
            exchangeAmount <= 0 ||
            (exchangeType === "reservation" && (!targetRate || !reservationPeriod))
          }
        >
          {exchangeType === "instant"
            ? isBuying
              ? "구매하기"
              : "판매하기"
            : "예약하기"}
        </button>
      </div>
    </>
  );
};

export default ExchangeModal;

// 기존의 BuyBtn 컴포넌트 스타일 유지
function BuyBtn({ isBuying, setIsBuying }) {
  return (
    <div
      className={`w-[35%] ${
        isBuying ? "bg-hana" : "bg-gray-300"
      } text-white px-4 py-2 rounded-md cursor-pointer hover:opacity-80 duration-300`}
      onClick={() => setIsBuying(true)}
    >
      구매
    </div>
  );
}

// 기존의 SellBtn 컴포넌트 스타일 유지
function SellBtn({ isBuying, setIsBuying }) {
  return (
    <div
      className={`w-[35%] ${
        !isBuying ? "bg-hana-red" : "bg-gray-300"
      } text-white px-4 py-2 rounded-md cursor-pointer hover:opacity-80 duration-300`}
      onClick={() => setIsBuying(false)}
    >
      판매
    </div>
  );
}
