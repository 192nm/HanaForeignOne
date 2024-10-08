import React, { useState, useEffect } from 'react';
import axios from 'axios'; // axios를 통해 API 호출
import '../../assets/css/Admin/AdminRatio.css';

const AdminRatio = () => {
  const [rates, setRates] = useState([
    { country: '미국(USD)', rate: 0 },
    { country: '유럽연합(EUR)', rate: 0 },
    { country: '중국(CNY)', rate: 0 },
    { country: '일본(JPY)', rate: 0 },
  ]);

  // API 호출 함수
  const fetchRates = async () => {
    try {
      // 첫 번째 API 호출
      await axios.post('http://localhost:8081/updateRatio');

      // 두 번째 API 호출
      const response = await axios.post('http://localhost:8081/realtime4');

      // 응답 데이터를 가져와서 매매기준율만 rates 상태 업데이트
      if (response.status === 200) {
        const fetchedRates = response.data.map((item) => ({
          country: item.currencyName,
          rate: item.standardRate, // 매매기준율만 사용
        }));

        setRates(fetchedRates); // 매매기준율로 업데이트
      }
    } catch (error) {
      console.error('환율 정보 가져오기 오류:', error);
    }
  };

  useEffect(() => {
    // 컴포넌트가 마운트되면 API 호출
    fetchRates();
  }, []);

  return (
    <div className="admin-ratio-container">
      <h3>주요 4개국 환율</h3>
      <div className="rates">
        {rates.map((rate, index) => (
          <div key={index} className="rate-item">
            <span>{rate.country}</span>
            {/* rate가 존재할 경우에만 toFixed 호출 */}
            <span>{rate.rate ? rate.rate.toFixed(2) : 'N/A'}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminRatio;
