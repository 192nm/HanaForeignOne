import React from 'react';
import '../../assets/css/Join/JoinPersonalSuccess.css';
import Header from '../../components/Header/Header.js';
import Footer from '../../components/Footer/Footer.js';
import check from '../../assets/svg/Join/JoinPersonalSuccess/check.png';
import { Link } from 'react-router-dom';

const JoinPersonalSuccess = () => {
  return (
    <div className="join-success-container">
      <Header />
      <div className="join-success-content">
        <div className="success-icon">
          <img src={check} alt="Success" />
        </div>
        <h1 className="success-title">회원가입이 <span className="highlight">완료</span>되었습니다</h1>
        <p className="success-message">
          송금을 신청하기 위해서 신원인증을 진행하여야 서비스를 원활하게 사용하실 수 있습니다.
        </p>

        <div className="document-guide">
          <h2>신원 인증 시 필요 서류 안내</h2>
          <div className="document-details">
            <div className="document-item">
              <span className="document-label">내국인</span>
              <span className="document-info">신분증(주민등록증 또는 운전면허증)</span>
            </div>
            <div className="document-item">
              <span className="document-label">외국인</span>
              <span className="document-info">외국인 등록증 또는 여권</span>
            </div>
          </div>
          <a href="#details" className="details-link">자세히보기</a>
        </div>

        <Link to="/personal-authentication" className="btn-authenticate">
          신원 인증하기
        </Link>

        <p className="contact-help">
          도움이 필요하거나 문의사항이 있으실 경우, <a href="#contact">고객센터에 연락하세요.</a>
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default JoinPersonalSuccess;
