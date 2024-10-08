import { useState, useEffect } from "react";
import axios from "axios"; // axios를 이용하여 API 요청
import JPY from "../../assets/svg/MyPage/japan.jpg";
import CNY from "../../assets/svg/MyPage/china.png";
import EUR from "../../assets/svg/MyPage/europe.png";
import USD from "../../assets/svg/MyPage/usa.png";
import KRW from "../../assets/svg/MyPage/korea.png"; // 한국 국기

const exchangeRates = {
  JPY: { fee: 500, discount: 50 },
  USD: { fee: 300, discount: 30 },
  EUR: { fee: 400, discount: 40 },
  CNY: { fee: 200, discount: 20 },
};

export default function AfterLogin() {
  const [sendAmount, setSendAmount] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState("USD"); // 기본 통화를 USD로 설정
  const [currentRate, setCurrentRate] = useState(0); // 현재 환율 상태
  const [isLoadingRate, setIsLoadingRate] = useState(false); // 환율 로딩 상태

  // 현재 환율 API 요청
  const fetchCurrentRate = async () => {
    setIsLoadingRate(true);
    try {
      const response = await axios.post("http://localhost:8081/realtime4");
      console.log("Current exchange rates fetched:", response.data); // 로그 출력

      // 선택된 통화에 따라 해당 통화의 standardRate를 설정
      const selectedData = response.data.find(
        (item) => {
          if (selectedCurrency === "JPY") return item.currencyName.includes("JPY");
          if (selectedCurrency === "USD") return item.currencyName.includes("USD");
          if (selectedCurrency === "EUR") return item.currencyName.includes("EUR");
          if (selectedCurrency === "CNY") return item.currencyName.includes("CNY");
        }
      );

      if (selectedData) {
        let rate = selectedData.standardRate;
        // JPY의 경우 100엔 기준이므로, 환율을 100으로 나누어 조정
        if (selectedCurrency === "JPY") {
          rate = rate / 100;
        }
        setCurrentRate(rate); // 현재 환율 상태 업데이트
      }

      setIsLoadingRate(false);
    } catch (error) {
      console.error("환율 정보를 불러오는 중 오류가 발생했습니다.", error);
      setIsLoadingRate(false);
    }
  };

  // 통화 선택이 변경될 때마다 환율 정보를 가져옴
  useEffect(() => {
    fetchCurrentRate();
  }, [selectedCurrency]);

  // 현재 선택된 통화에 맞는 수수료 및 할인 정보 가져오기
  const { fee, discount } = exchangeRates[selectedCurrency];

  // 선택된 통화에 따른 이미지 설정
  const getCurrencyImage = () => {
    if (selectedCurrency === "JPY") return JPY;
    if (selectedCurrency === "USD") return USD;
    if (selectedCurrency === "EUR") return EUR;
    if (selectedCurrency === "CNY") return CNY;
  };

  return (
    <aside className="absolute top-0 right-14 z-20 login-section flex flex-col justify-center">
        <div className="mt-4 font-bold text-center text-2xl">간편 환전 알아보기</div>

        {/* 보내는 금액: 외화 */}
        <div className="flex flex-col">
          <label htmlFor="sendingAmount" className="mt-4 text-base font-bold mr-1 text-left">
            보내는 금액
          </label>
          <div className="mt-3 flex justify-between">
          <img src={getCurrencyImage()} alt={`${selectedCurrency} Flag`} className="w-14 shadow-md dropdown-icon" />
          <div>
          <input
            type="number"
            id="sendingAmount"
            onChange={(e) => setSendAmount(e.target.value)}
            className="amount-input h-10"
          />
          <span className="currency-label">{selectedCurrency}</span>
          </div>
          </div>
        </div>
        
        <hr className="divider" />

        {/* 실수령 금액: 원화 */}
        <div className="flex flex-col">
          <label htmlFor="receivingAmount" className="text-base text-left font-bold mr-1">
            실수령 금액
          </label>
          <div className="mt-3 flex items-center justify-between">
            <img src={KRW} alt="KR Flag" className="w-14 shadow-md dropdown-icon" />
            <div>
            <input
              type="number"
              id="receivingAmount"
              value={sendAmount * currentRate} // 백엔드에서 받은 환율 적용 (JPY는 100엔 기준 환율 적용됨)
              className="amount-input h-10"
              readOnly
            />
          <span className="currency-label">KRW</span>
          </div>
          </div>
        </div>

        {/* 통화 선택 드롭다운 */}
        <div className="mt-6 currency-select-box">
          <label htmlFor="currency" className="text-lg font-bold mr-1">통화 선택</label>
          <select
            id="currency"
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="currency-dropdown"
          >
            <option value="JPY">JPY (일본 엔화)</option>
            <option value="USD">USD (미국 달러)</option>
            <option value="EUR">EUR (유로)</option>
            <option value="CNY">CNY (중국 위안)</option>
          </select>
        </div>

        {/* 로딩 상태를 보여주기 위한 메시지 */}
        {isLoadingRate ? <p>환율 정보를 불러오는 중...</p> : (
          <div className="transfer-info">
            <p><span>송금 수수료:</span> {fee} KRW</p>
            <p>할인 금액: {discount} KRW</p>
            <p>환율: {currentRate}</p>
          </div>
        )}
    </aside>
  );
}
