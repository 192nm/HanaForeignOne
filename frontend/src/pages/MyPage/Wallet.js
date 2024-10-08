import React, { useState, useEffect } from 'react';
import '../../assets/css/MyPage/Wallet.css';
import Header from '../../components/Header/Header.js';
import Footer from '../../components/Footer/Footer.js';
import koreaIcon from '../../assets/svg/MyPage/korea.png';
import usaIcon from '../../assets/svg/MyPage/usa.png';
import japanIcon from '../../assets/svg/MyPage/japan.jpg';
import europeIcon from '../../assets/svg/MyPage/europe.png';
import axios from 'axios';

const mockWalletData = [
  { currency: 'USD', amount: 1200.50, symbol: '$', icon: usaIcon, description: '미국 달러는 세계에서 가장 많이 사용되는 통화입니다.', accountNumber: 'US123456789' },
  { currency: 'EUR', amount: 850.30, symbol: '€', icon: europeIcon, description: '유로는 유럽 연합의 공식 통화입니다.', accountNumber: 'EU987654321' },
  { currency: 'JPY', amount: 100000, symbol: '¥', icon: japanIcon, description: '일본 엔은 일본의 공식 통화입니다.', accountNumber: 'JP1122334455' },
  { currency: 'KRW', amount: 1500000, symbol: '₩', icon: koreaIcon, description: '한국 원화는 대한민국의 공식 통화입니다.', accountNumber: 'KR9988776655' },
];

const Wallet = () => {
  const [selectedCurrency, setSelectedCurrency] = useState(mockWalletData[0]);
  const [exchangeRates, setExchangeRates] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await axios.get('https://data.fixer.io/api/latest', {
          params: {
            access_key: '910539014ea624ae92f9d61093378e2a',
            symbols: 'USD,EUR,JPY,KRW'
          }
        });

        const rates = response.data.rates;
        const krwRate = rates['KRW'];

        const calculatedRates = {
          USD: krwRate / rates['USD'],
          EUR: krwRate / rates['EUR'],
          JPY: krwRate / rates['JPY'],
          KRW: 1 // KRW는 환율이 1로 고정됩니다.
        };

        setExchangeRates(calculatedRates);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching the exchange rate data', error);
        setLoading(false);
      }
    };

    fetchExchangeRates();
  }, []);

  const handleTabClick = (currency) => {
    const selected = mockWalletData.find(item => item.currency === currency);
    setSelectedCurrency(selected);
  };

  return (
    <div className="wallet-container">
      <Header />
      <main className="wallet-content">
        <h2>다국적 통화 지갑</h2>
        <p>다양한 외화를 한 번에 관리하세요. 필요한 경우 즉시 환전도 가능합니다.</p>
        
        <div className="tabs-container">
          <div className="tabs">
            {mockWalletData.map((wallet, index) => (
              <button 
                key={index} 
                className={`tab ${selectedCurrency.currency === wallet.currency ? 'active' : ''}`}
                onClick={() => handleTabClick(wallet.currency)}
              >
                <img src={wallet.icon} alt={`${wallet.currency} icon`} className="currency-icon" />
                {wallet.currency}
              </button>
            ))}
          </div>

          <div className="tab-content">
            <h3>{selectedCurrency.currency}</h3>
            <img src={selectedCurrency.icon} alt={`${selectedCurrency.currency} icon`} className="currency-icon-large" />
            <p>{selectedCurrency.symbol}{selectedCurrency.amount.toLocaleString()}</p>
            <p>계좌번호: {selectedCurrency.accountNumber}</p>
            <p>{selectedCurrency.description}</p>
            {loading ? (
              <p>환율 정보 로딩 중...</p>
            ) : (
              <p>원화 환산 금액: {exchangeRates[selectedCurrency.currency] ? (selectedCurrency.amount * exchangeRates[selectedCurrency.currency]).toLocaleString() : 'N/A'} KRW</p>
            )}
            <button className="exchange-button" onClick={() => alert(`${selectedCurrency.currency} 환전 기능은 현재 구현 중입니다.`)}>
              환전하기
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Wallet;
