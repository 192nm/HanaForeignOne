import React, { useState, useEffect } from 'react';
import '../../assets/css/Risk/Risk.css';
import Header from '../../components/Header/Header.js';
import Footer from '../../components/Footer/Footer.js';
import axios from 'axios';

const RiskManagement = () => {
  const [riskData, setRiskData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRiskData = async () => {
      try {
        const response = await axios.get('https://api.example.com/risk-analysis', {
          params: {
            base: 'USD',
          }
        });
        setRiskData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching the risk data', error);
        setLoading(false);
      }
    };

    fetchRiskData();
  }, []);

  return (
    <>
      <Header />
      <div className="risk-management-container">
        <main className="risk-content">
          <h2>외환 리스크 관리</h2>
          {loading ? (
            <p>리스크 분석 데이터 로딩 중...</p>
          ) : (
            <div className="risk-table">
              {riskData.map((risk, index) => (
                <div key={index} className="risk-row">
                  <p>{risk.currency}: {risk.recommendation}</p>
                  <p>예상 변동성: {risk.volatility}</p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
};

export default RiskManagement;
