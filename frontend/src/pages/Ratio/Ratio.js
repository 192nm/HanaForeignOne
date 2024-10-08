import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Header from '../../components/Header/Header.js';
import Footer from '../../components/Footer/Footer.js';
import '../../assets/css/Ratio/Ratio.css';
import currencyList from '../../Data/CurrencyData.js';  // 통화 목록 데이터 가져오기
import axios from 'axios';
import { useExchangeRate } from '../../context/ExchangeRateContext.js'; // Context 가져오기

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Ratio = () => {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [exchangeData, setExchangeData] = useState([]);
  const [labels, setLabels] = useState([]); // 날짜 레이블 저장
  const [loading, setLoading] = useState(true);
  const [isKorean, setIsKorean] = useState(true); // 한글명/영문명 토글 상태
  const [alertThreshold, setAlertThreshold] = useState(''); // 알림 임계값
  const [showModal, setShowModal] = useState(false); // 모달 상태
  const { exchangeRates, setExchangeRates } = useExchangeRate(); // Context에서 exchangeRates와 setExchangeRates 가져오기

  useEffect(() => {
    const fetchData = async () => {
      try {
        // API 요청으로 환율 데이터 가져오기
        const response = await axios.get('https://data.fixer.io/api/latest', {
          params: {
            access_key: '350ec0bd5e4d8c1fc8d83599ab79ce84',
            symbols: currencyList.map(currency => currency.code).join(',')
          }
        });

        const rates = response.data.rates;
        const krwRate = rates['KRW']; // 원화에 대한 환율

        const currencyInfo = currencyList.map(currency => {
          const rate = krwRate / rates[currency.code]; // 원화를 기준으로 한 환율 계산
          
          // 변동률 및 변동 계산을 위한 임시 이전 값 생성
          const previousRate = rate * (1 + (Math.random() * 0.02 - 0.01)); 
          const change = rate - previousRate;
          const changePercentage = ((change / previousRate) * 100).toFixed(2);

          return {
            code: currency.code,
            rate: rate,
            change: change.toFixed(2),
            changePercentage: changePercentage,
            isPositive: change > 0,
          };
        });

        setExchangeRates(currencyInfo); // 환율 데이터를 Context에 저장

        // 선택된 통화에 대해 차트 데이터를 생성
        const { historicalData, dates } = generateMockHistoricalData(krwRate / rates[selectedCurrency]);
        setExchangeData(historicalData);
        setLabels(dates);

        setLoading(false);

      } catch (error) {
        console.error('Error fetching the exchange rate data', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCurrency, setExchangeRates]);

  const generateMockHistoricalData = (currentRate) => {
    const data = [];
    const dates = [];
    const currentDate = new Date();
    for (let i = 0; i < 100; i++) {
      const variation = Math.random() * 0.01 - 0.005;
      currentRate = currentRate * (1 + variation);
      data.push(parseFloat(currentRate.toFixed(2)));

      const date = new Date();
      date.setDate(currentDate.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return { historicalData: data.reverse(), dates: dates.reverse() };
  };

  const handleSetAlert = () => {
    if (alertThreshold) {
      alert(`${selectedCurrency}의 환율이 ${alertThreshold}에 도달하면 알림이 설정됩니다.`);
    }
  };

  return (
    <>
      <Header />
      <div className="ratio-container">
        <div className="alert-setting">
          <button onClick={() => setShowModal(true)}>
            {isKorean ? '환율 알림 설정' : 'Set Exchange Rate Alert'}
          </button>
        </div>

        <div className="marquee-container">
          <div className="marquee">
            {Array.isArray(exchangeRates) && exchangeRates.map((currency, index) => ( // 조건문 추가
              <div className="marquee-item" key={index}>
                <span>{currency.code}</span>
                <span className={currency.isPositive ? 'positive' : 'negative'}>
                  {currency.rate.toFixed(2)} {currency.isPositive ? '▲' : '▼'}
                  {currency.change} ({currency.changePercentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="toggle-container">
          <button onClick={() => setIsKorean(!isKorean)}>
            {isKorean ? 'Show in English' : '한글로 보기'}
          </button>
        </div>

        <div className="currency-selection">
          <p>{isKorean ? '통화를 선택하세요:' : 'Select a currency:'}</p>
          <select 
            value={selectedCurrency} 
            onChange={(e) => setSelectedCurrency(e.target.value)} 
            className="currency-dropdown"
          >
            {currencyList.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {isKorean ? currency.name_kr : currency.name_en} ({currency.code})
              </option>
            ))}
          </select>
        </div>

        <h2>{isKorean ? '환율 차트' : 'Exchange Rate Chart'}</h2>
        {loading ? (
          <p>{isKorean ? '로딩 중...' : 'Loading...'}</p>
        ) : (
          <Line data={{
            labels: labels,
            datasets: [
              {
                label: `${selectedCurrency} to KRW`,
                data: exchangeData,
                fill: false,
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderColor: 'rgba(75,192,192,1)',
                pointBackgroundColor: 'rgba(75,192,192,1)',
                pointHoverRadius: 7,
              }
            ],
          }} options={{
            scales: {
              x: {
                title: {
                  display: true,
                  text: isKorean ? '날짜' : 'Date',
                  font: { size: 14 }
                }
              },
              y: {
                title: {
                  display: true,
                  text: isKorean ? '환율 (KRW)' : 'Exchange Rate (KRW)',
                  font: { size: 14 }
                },
                beginAtZero: false,
              },
            },
            plugins: {
              legend: { display: true, position: 'top' },
              tooltip: {
                enabled: true,
                mode: 'index',
                intersect: false,
                callbacks: {
                  label: function(tooltipItem) {
                    const index = tooltipItem.dataIndex;
                    const previousValue = index > 0 ? tooltipItem.dataset.data[index - 1] : null;
                    const currentValue = tooltipItem.raw;
                    const change = previousValue !== null ? (currentValue - previousValue).toFixed(2) : 'N/A';
                    const changePercentage = previousValue !== null ? ((change / previousValue) * 100).toFixed(2) : 'N/A';

                    return [
                      `${isKorean ? '환율' : 'Rate'}: ${currentValue}`,
                      `${isKorean ? '변동' : 'Change'}: ${change} (${changePercentage}%)`,
                      `${isKorean ? '날짜' : 'Date'}: ${tooltipItem.label}`
                    ];
                  }
                }
              }
            }
          }} />
        )}

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={() => setShowModal(false)}>&times;</span>
              <h2>{selectedCurrency} {isKorean ? '알림 설정' : 'Set Alert'}</h2>
              <div className="modal-chart">
                <Line data={{
                  labels: labels.slice(-10),
                  datasets: [
                    {
                      label: `${selectedCurrency} to KRW`,
                      data: exchangeData.slice(-10),
                      fill: false,
                      backgroundColor: 'rgba(75,192,192,0.2)',
                      borderColor: 'rgba(75,192,192,1)',
                      pointBackgroundColor: 'rgba(75,192,192,1)',
                      pointHoverRadius: 7,
                    }
                  ],
                }} options={{
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: isKorean ? '날짜' : 'Date',
                        font: { size: 12 }
                      },
                      grid: {
                        display: true
                      }
                    },
                    y: {
                      title: {
                        display: true,
                        text: isKorean ? '환율 (KRW)' : 'Exchange Rate (KRW)',
                        font: { size: 12 }
                      },
                      beginAtZero: false,
                      grid: {
                        display: true
                      }
                    },
                  },
                  plugins: { 
                    legend: { display: false } 
                  }
                }} />
              </div>
              <div className="modal-alert-setting">
                <p>{isKorean ? '현재 환율: ' : 'Current Rate: '} {exchangeData[exchangeData.length - 1]} KRW</p>
                <input 
                  type="number" 
                  value={alertThreshold} 
                  onChange={(e) => setAlertThreshold(e.target.value)} 
                  placeholder={isKorean ? '환율' : 'Rate'} 
                />
                <button onClick={handleSetAlert}>
                  {isKorean ? '알림 설정' : 'Set Alert'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Ratio;
