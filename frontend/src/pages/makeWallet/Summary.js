// src/components/Summary.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios'; // API 요청을 위한 axios
import { setShowWallet } from '../../redux/authSlice'; // setShowWallet 액션 가져오기

const Summary = ({ formData, onPrevious }) => {
  const [isWalletCreated, setIsWalletCreated] = useState(false); // 지갑 생성 완료 상태
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Redux dispatch 가져오기
  const userId = useSelector((state) => state.auth.userId); // Redux에서 userId 가져오기

  // 지갑 생성 완료 후 일정 시간 후에 리다이렉트
  useEffect(() => {
    if (isWalletCreated) {
      // 지갑 생성 완료 시 showWallet을 true로 설정
      dispatch(setShowWallet(true));

      const timer = setTimeout(() => {
        navigate('/mypage'); // 마이페이지로 리다이렉트
      }, 3000); // 3초 후 리다이렉트

      return () => clearTimeout(timer); // 타이머 클리어
    }
  }, [isWalletCreated, navigate, dispatch]);

  // "지갑 생성 완료" 버튼 클릭 시
  const handleWalletCreation = async () => {
    try {
      // userId와 "Y" 값을 담은 데이터 생성
      const requestData = {
        id: userId, 
        walletExist: 'Y',
      };

      // API 요청 보내기
      const response = await axios.post('http://localhost:8081/insertWalletOk', requestData);

      // 응답 확인 및 상태 업데이트
      if (response.data === '지갑 생성에 성공하였습니다') {
        setIsWalletCreated(true);
      } else {
        alert('지갑 생성에 실패하였습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('지갑 생성 중 오류 발생:', error);
      alert('지갑 생성 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="form-card">
      {isWalletCreated ? (
        <div>
          <h3>지갑 생성이 완료되었습니다!</h3>
          <p>잠시 후 마이페이지로 이동합니다...</p>
        </div>
      ) : (
        <>
          <h3>지갑 생성 요약</h3>
          <p><strong>동의:</strong> {formData.agreed ? '동의함' : '동의 안 함'}</p>
          <p><strong>자금 출처:</strong> {formData.sourceOfFunds}</p>
          <p><strong>지갑 이름:</strong> {formData.walletName}</p>
          <p><strong>선택한 통화:</strong> {formData.selectedCurrencies.join(', ')}</p>
          <p><strong>계좌 정보:</strong></p>
          <div className="account-summary-container">
            {formData.accountInfo.map((accountNo, index) => (
              <div key={index} className="account-summary-card">
                <p>계좌 번호: {accountNo}</p>
              </div>
            ))}
          </div>
          <div className="buttons">
            <button className="prev-button" onClick={onPrevious}>
              이전
            </button>
            <button className="next-button" onClick={handleWalletCreation}>
              지갑 생성 완료
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Summary;
