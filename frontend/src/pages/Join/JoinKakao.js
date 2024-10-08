import React from 'react';
import '../../assets/css/Join/JoinKakao.css';
import Header from '../../components/Header/Header.js';
import Footer from '../../components/Footer/Footer.js';

const Join = () => {
  return (
    <div className="join-container">
      <Header />
      <section className="kakaoJoin-section">
        <div className="kakaoJoin">
          <h2>카카오 1초 간편가입</h2>
          <button className="kakao-button">카카오로 회원가입</button>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Join;
