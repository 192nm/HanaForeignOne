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
import axios from 'axios';
import currencyList from '../../Data/CurrencyData.js';  // 이 부분을 추가합니다.


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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://data.fixer.io/api/timeseries', {
          params: {
            access_key: 'e60f4bd303f3296324e06d0c15e9faf4',
            start_date: '2023-08-01', // 한 달 전 날짜
            end_date: '2023-08-31', // 현재 날짜
            symbols: selectedCurrency,
          }
        });
        const rates = response.data.rates;
        const dates = Object.keys(rates);
        const rateData = dates.map(date => rates[date][selectedCurrency]);

        setExchangeData(rateData);
        setLabels(dates);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching the exchange rate data', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCurrency]);

  const data = {
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
      },
    ],
  };

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: isKorean ? '날짜' : 'Date',
          font: {
            size: 14
          }
        }
      },
      y: {
        title: {
          display: true,
          text: isKorean ? '환율 (KRW)' : 'Exchange Rate (KRW)',
          font: {
            size: 14
          }
        },
        ticks: {
          stepSize: 1, // 필요에 따라 세분화 크기 조정
        },
        beginAtZero: false,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
      },
    },
  };

  return (
    <>
      <Header />
      <div className="ratio-container">
        <h2>{isKorean ? '환율 차트' : 'Exchange Rate Chart'}</h2>
        {loading ? (
          <p>{isKorean ? '로딩 중...' : 'Loading...'}</p>
        ) : (
          <Line data={data} options={options} />
        )}
        <div className="currency-selection">
          <div className="toggle-container">
            <button onClick={() => setIsKorean(!isKorean)}>
              {isKorean ? 'Show in English' : '한글로 보기'}
            </button>
          </div>
          <p>{isKorean ? '통화를 선택하세요:' : 'Select a currency:'}</p>
          <ul>
            {currencyList.map((currency) => (
              <li
                key={currency.code}
                onClick={() => setSelectedCurrency(currency.code)}
                className={currency.code === selectedCurrency ? 'active' : ''}
              >
                {isKorean ? currency.name_kr : currency.name_en} ({currency.code})
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Ratio;
