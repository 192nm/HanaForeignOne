import React from 'react';
import '../../assets/css/Join/Join.css';
import Header from '../../components/Header/Header.js';
import Footer from '../../components/Footer/Footer.js';
import { Link } from 'react-router-dom';

const Join = () => {
  return (
    <div className="join-container">
      <Header />
      <main className="join-content">
        <h1>회원가입</h1>
        <p>뽀송 비즈플러스 회원으로 가입하시면 기존 송금내역 불러오기와 대량송금 등 다양한 기능을 제공받을 수 있습니다.</p>
        <div className="membership-options">
          <Link to="/join-personal" className="membership-option">
            <div className="option-icon">👤</div>
            <div className="option-title">개인</div>
          </Link>
          <Link to="/join-business" className="membership-option">
            <div className="option-icon">🏢</div>
            <div className="option-title">개인사업자</div>
          </Link>
          <Link to="/join-corporate" className="membership-option">
            <div className="option-icon">🏦</div>
            <div className="option-title">법인</div>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Join;
