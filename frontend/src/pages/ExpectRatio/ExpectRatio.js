import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header.js";
import Footer from "../../components/Footer/Footer.js";
import "../../assets/css/ExpectRatio/ExpectRatio.css";
import currencyList from "../../Data/CurrencyData.js";
import { Line } from "react-chartjs-2";

const ExpectRatio = () => {
  const [baseCurrency, setBaseCurrency] = useState("KRW");
  const [targetCurrency, setTargetCurrency] = useState("USD");
  const [predictionDate, setPredictionDate] = useState("");
  const [predictedRate, setPredictedRate] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [news, setNews] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // 목업 데이터 (Postman에서 받은 JSON 데이터)
  const mockData = [
    {
      buy: "1,323.40",
      code: "1,359.78",
      country: "미국 USD",
      exchange: "1,336.40",
      sell: "1.000",
    },
    {
      buy: "1,466.79",
      code: "1,511.08",
      country: "유럽연합 EUR",
      exchange: "1,481.60",
      sell: "1.109",
    },
    {
      buy: "922.27",
      code: "947.68",
      country: "일본 JPY (100엔)",
      exchange: "931.39",
      sell: "0.697",
    },
    {
      buy: "186.35",
      code: "197.64",
      country: "중국 CNY",
      exchange: "188.23",
      sell: "0.141",
    },
  ];

  // 실시간 환율 상태에 목업 데이터를 저장
  const [realTimeRates, setRealTimeRates] = useState(mockData);

  // 예측 함수
  const handlePredict = () => {
    const forecastRates = Array.from({ length: 30 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() + index);
      const rate = Math.random() * (1500 - 1000) + 1000; // 임의의 예측 값 생성
      return { date: date.toISOString().split("T")[0], rate };
    });

    setPredictedRate(forecastRates);
  };

  // 즐겨찾기 추가
  const handleFavorite = () => {
    const favoritePair = `${baseCurrency}/${targetCurrency}`;
    if (!favorites.includes(favoritePair)) {
      setFavorites([...favorites, favoritePair]);
    }
  };

  // 예측된 데이터 표 렌더링
  const renderPredictionTable = () => (
    <table className="expectRatio-prediction-table">
      <thead>
        <tr>
          <th>날짜</th>
          <th>예측 환율</th>
        </tr>
      </thead>
      <tbody>
        {predictedRate &&
          predictedRate.map((rate, index) => (
            <tr key={index}>
              <td>{rate.date}</td>
              <td>{rate.rate.toFixed(2)}</td>
            </tr>
          ))}
      </tbody>
    </table>
  );

  // 실시간 환율 표 렌더링
  const renderRealTimeRatesTable = () => (
    <table className="expectRatio-real-time-rates-table">
      <thead>
        <tr>
          <th>국가</th>
          <th>환율</th>
          <th>살 때</th>
          <th>팔 때</th>
        </tr>
      </thead>
      <tbody>
        {realTimeRates.map((rate, index) => (
          <tr key={index}>
            <td>{rate.country}</td>
            <td>{rate.exchange}</td>
            <td>{rate.buy}</td>
            <td>{rate.sell}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="expectRatio-page">
      <Header />
      <main className="expectRatio-container">
        <div className="expectRatio-wrapper">
          <div className="flex-1">
            <h2>환율 예측</h2>
            <div className="expectRatio-form">
              <div className="expectRatio-input">
                <label>기준 통화:</label>
                <select
                  value={baseCurrency}
                  onChange={(e) => setBaseCurrency(e.target.value)}
                >
                  {currencyList.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name_kr}
                    </option>
                  ))}
                </select>
              </div>
              <div className="expectRatio-input">
                <label>대상 통화:</label>
                <select
                  value={targetCurrency}
                  onChange={(e) => setTargetCurrency(e.target.value)}
                >
                  {currencyList.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name_kr}
                    </option>
                  ))}
                </select>
              </div>
              <div className="expectRatio-input">
                <label>예측 날짜:</label>
                <input
                  type="date"
                  value={predictionDate}
                  onChange={(e) => setPredictionDate(e.target.value)}
                />
              </div>
              <div className="btn-wrapper">
                <button
                  className="expectRatio-predict-button flex-1"
                  onClick={handlePredict}
                >
                  예측하기
                </button>
                <button
                  className="expectRatio-favorite-button flex-1"
                  onClick={handleFavorite}
                >
                  즐겨찾기 추가
                </button>
              </div>
            </div>
          </div>

          {/* 실시간 환율 섹션 */}
          <section className="expectRatio-real-time-rate-section flex-1">
            <h3>실시간 환율 (주요 4개국)</h3>
            {renderRealTimeRatesTable()}
          </section>
        </div>

        {/* 과거 데이터 섹션 */}
        <section className="expectRatio-historical-data-section">
          <h3>과거 환율 데이터</h3>
          <Line
            data={{
              labels: historicalData.map((data) => data.date),
              datasets: [
                {
                  label: `과거 환율 (${baseCurrency} -> ${targetCurrency})`,
                  data: historicalData.map((data) => data.rate),
                  borderColor: "rgba(153, 102, 255, 1)",
                  fill: false,
                },
              ],
            }}
          />
        </section>

        {/* 뉴스 섹션 */}
        <section className="expectRatio-news-section">
          <h3>환율 관련 뉴스</h3>
          <ul>
            {news.map((article, index) => (
              <li key={index}>
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  {article.title}
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* 즐겨찾기 섹션 */}
        <section className="expectRatio-favorites-section">
          <h3>즐겨찾기 통화</h3>
          <ul>
            {favorites.map((fav, index) => (
              <li key={index}>{fav}</li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ExpectRatio;
