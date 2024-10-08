import React, { useEffect } from 'react';
import './Footer.css';

const Footer = () => {

  // 주기적으로 POST 요청 보내기
  useEffect(() => {
    const interval = setInterval(() => {
      fetch('http://localhost:8081/updateRatio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: 'Updating ratio' }),  // 요청에 보낼 데이터
      })
      .then(response => response.text())  // 서버 응답을 텍스트로 처리
      .then(data => console.log('Success:', data))
      .catch((error) => console.error('Error:', error));
    }, 60000); // 60초(60000ms)마다 실행

    // 컴포넌트 언마운트 시 interval 정리
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="footer-container">
      <div className="footer-links-sections">
        <div className="footer-column">
          <h4>서비스 알아보기</h4>
          <ul>
            <li><a href="#about">회사 소개</a></li>
            <li><a href="#send">해외 송금 서비스</a></li>
            <li><a href="#exchange-rates">실시간 환율</a></li>
            <li><a href="#fees">송금 수수료</a></li>
            <li><a href="#faq">FAQ</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>고객 센터</h4>
          <ul>
            <li><a href="#support">고객 지원</a></li>
            <li><a href="#contact">문의하기</a></li>
            <li><a href="#tracking">송금 내역 추적</a></li>
            <li><a href="#hours">운영 시간</a></li>
            <li><a href="#security">보안 정책</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>이용 안내</h4>
          <ul>
            <li><a href="#privacy">개인정보 처리방침</a></li>
            <li><a href="#terms">이용 약관</a></li>
            <li><a href="#disclaimer">책임 한계</a></li>
            <li><a href="#refunds">환불 정책</a></li>
            <li><a href="#news">공지사항</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>기타</h4>
          <ul>
            <li><a href="#careers">채용 정보</a></li>
            <li><a href="#partnerships">제휴 문의</a></li>
            <li><a href="#media">미디어 자료</a></li>
            <li><a href="#blog">블로그</a></li>
            <li><a href="#events">이벤트</a></li>
          </ul>
        </div>
      </div>

      <hr className="footer-divider" />

      <div className="footer-bottom">
        <p>© 2024 Kopo Remittance, Inc. All Rights Reserved.</p>
        <p>서울특별시 강남구 테헤란로 123, 10층 | 대표이사: 홍길동 | 사업자등록번호: 123-45-67890</p>
        <p>고객센터: 02-1234-5678 | 이메일: support@koporemittance.com</p>
        <p>해외송금업등록번호: 2022-01 | 은행제휴: 하나은행</p>
      </div>
    </footer>
  );
};

export default Footer;
