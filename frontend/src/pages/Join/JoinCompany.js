import React from 'react';
import '../../assets/css/Join/JoinCompany.css';
import Header from '../../components/Header/Header.js';
import Footer from '../../components/Footer/Footer.js';

const JoinCompony = () => {
  return (
    <div className="company-join-container">
      <Header />
      <main className="company-join-content">
        <h2>회원가입</h2>
        <p>모인 비즈플러스 회원으로 가입하시면 기존 송금내역 불러오기와 대량송금 등 다양한 기능을 제공받을 수 있습니다.</p>
        <div className="membership-options">
          <div className="option-box">
            <img src="/path-to-icon/individual.png" alt="개인" />
            <p>개인</p>
          </div>
          <div className="option-box">
            <img src="/path-to-icon/business.png" alt="개인사업자" />
            <p>개인사업자</p>
          </div>
          <div className="option-box">
            <img src="/path-to-icon/corporate.png" alt="법인" />
            <p>법인</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default JoinCompony;
