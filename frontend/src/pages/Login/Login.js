import React, { useState } from 'react';
import { useDispatch } from 'react-redux'; // Redux의 useDispatch 사용
import { login } from '../../redux/authSlice.js'; // login 액션 가져오기
import Header from '../../components/Header/Header.js';
import Footer from '../../components/Footer/Footer.js';
import '../../assets/css/Login/Login.css';
import remittanceGif from '../../assets/gif/Login/remittance.gif'; // 이미지 경로를 임포트
import LoginBox from './LoginBox.js';

const Login = () => {
  return (
    <>
      <Header />
      <main className="login-container">
        <div className="login-left">
          <img src={remittanceGif} alt="Remittance" className="remittance-gif" />
          <h2 className="login-left-title">하나뽀송과 함께하는 야무진 해외송금!</h2>
        </div>
       <LoginBox />
      </main>
      <Footer />
    </>
  );
};

export default Login;
