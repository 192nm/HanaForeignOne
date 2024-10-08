import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/Authentication/AuthSuccess.css';
import Header from '../../components/Header/Header.js';
import Footer from '../../components/Footer/Footer.js';

const AuthSuccess = () => {
  const navigate = useNavigate();

  const goToHome = () => {
    navigate('/');
  };

  return (
    <div className="auth-success-container">
      <Header />
      <div className="auth-success-content">
        <h1>인증이 성공적으로 완료되었습니다!</h1>
        <button className="auth-success-home-btn" onClick={goToHome}>
          홈으로 이동
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default AuthSuccess;
