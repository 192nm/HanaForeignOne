import React, { useState, useEffect } from 'react';
import '../../assets/css/Home/Home.css';
import Header from '../../components/Header/Header.js';
import korea from '../../assets/svg/Home/korea.png'; 
import starboy from '../../assets/svg/Home/starboy.png'; 
import japan from '../../assets/svg/Home/japan.png'; 
import Footer from '../../components/Footer/Footer.js';
import fee from '../../assets/svg/Home/fee.png'; 
import school from '../../assets/svg/Home/school.png'; 
import idcard from '../../assets/svg/Home/idcard.png';

// 새로 가져온 이미지들
import load from '../../assets/svg/Home/load.png';
import perfect from '../../assets/svg/Home/perfect.png';
import qa from '../../assets/svg/Home/qa.png';

// 목업 데이터
const mockData = {
  sendingAmount: 928942, 
  receivingAmount: 100000, 
  fee: 13918, 
  discount: "100% 환율 우대", 
  exchangeRate: "100 JPY = 915.02 KRW"
};

const Home = () => {
  const [currentImage, setCurrentImage] = useState(0);

  const images = [perfect, load, qa]; // 이미지 파일을 import한 변수들을 배열로 저장

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 3000); // 3초마다 이미지와 텍스트 전환
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="home-container">
      <Header />
      <main className="main-content">
        <section className="left-section">
          <img src={starboy} alt="Starboy" className="left-icon" />
          <h2>모두를 위한 쉽고 간편한 해외송금</h2>
          <p>일본, 미국, 유럽, 호주, 중국, 싱가포르 등 47개국으로 언제 어디서나 간편 송금!</p>
          <div className="left-buttons">
            <button>서비스 이용방법</button>
            <button>사용자 리뷰보기</button>
          </div>
        </section>
        <AfterLogin />
      </main>
      <section className="student-discount-section">
        <h2>해외 유학생이라면 수수료 할인</h2>
        <div className="discount-cards">
          <div className="card">
            <img src={fee} alt="할인 아이콘" />
            <h3>졸업할 때까지 주요 국가 수수료 할인</h3>
            <p>일본, 중국은 수수료 최대료 할인</p>
          </div>
          <div className="card">
            <img src={school} alt="학생 아이콘" />
            <h3>해외에서 공부하는 학생이라면 누구나!</h3>
            <p>해외 대학교 학생, 교환학생, 어학연수생</p>
          </div>
          <div className="card">
            <img src={idcard} alt="학생증 아이콘" />
            <h3>해외 학교 이메일, 국제학생증 재학 증빙 서류로 유학생 인증</h3>
            <p>해외 학교 이메일, 국제학생증 재학 증빙 서류로 유학생 인증</p>
          </div>
        </div>
        <button className="certify-button">지금 인증하고 할인 받기</button>
        <p className="student-discount-info">유학생임을 증명하는 서류로 추가 할인 혜택을 받으세요.</p>
      </section>

      <section className="fee-comparison-section">
        <div className="fee-comparison-text">
          <h1>타행보다 <span className="highlight">49,670원</span> 더 절약할 수 있습니다</h1>
          <article>저렴한 수수료로 평균 하루만에 송금이 가능합니다.</article>
        </div>
        <div className="fee-comparison-cards">
          <div className="fee-card">
            <h3>타행 평균 수수료</h3>
            <p>63,026 원</p>
          </div>
          <div className="fee-card cheapest">
            <span className="cheapest-tag">Cheapest</span>
            <h3>하나송금 수수료</h3>
            <p>13,912 원</p>
          </div>
        </div>
      </section>

      <section className="same-day-transfer">
        <h2><span className="highlight">47개국</span> 당일송금, <span className="highlight">5분</span> 안에 송금신청 가능</h2>
        <p>현재 오픈 중인 47개국으로 평균 1일만에 송금이 가능하고 5분 안에 송금신청이 가능합니다.</p>
        <div className="country-rates">
          <div className="country-rate"><span>일본</span><span>1 JPY = 9.14 KRW</span></div>
          <div className="country-rate"><span>중국</span><span>1 CNY = 187.51 KRW</span></div>
          <div className="country-rate"><span>미국</span><span>1 USD = 1344.82 KRW</span></div>
          <div className="country-rate"><span>영국</span><span>1 GBP = 1742.56 KRW</span></div>
          <div className="country-rate"><span>유럽</span><span>1 EUR = 1483.51 KRW</span></div>
          <div className="country-rate"><span>호주</span><span>1 AUD = 902.10 KRW</span></div>
        </div>
        <a href="localhost:3000" className="all-countries-link">송금 가능한 국가 모두보기</a>
      </section>

      <section className="fast-accurate-transfer">
        <h2>빠르고 정확한 해외송금</h2>
        <div className="content-container">
          <div className="image-slider">
            <div className="fixed-image-container">
              <img src={images[currentImage]} alt="해외송금 예시" className="slider-image" />
            </div>
          </div>
          <div className="text-content">
            <h3 className={currentImage === 0 ? 'highlight' : ''}>정확한 수취금액</h3>
            <p className={currentImage === 0 ? 'highlight' : ''}>뽀송은 실시간 환율과 수수료 등을 반영하여 최종 수취금액을 알려줍니다.</p>
            <p className={currentImage === 0 ? 'highlight' : ''}>이제 실제로 받는 금액이 얼마인지 궁금해하지 않아도 됩니다.</p>

            <h3 className={currentImage === 1 ? 'highlight' : ''}>5분 이내 가능한 송금신청</h3>
            <p className={currentImage === 1 ? 'highlight' : ''}>최초 1회 인증으로 간편한 인증 절차와 송금 내역 불러오기를 통해 송금 신청이 가능합니다.</p>

            <h3 className={currentImage === 2 ? 'highlight' : ''}>실시간 상담가능</h3>
            <p className={currentImage === 2 ? 'highlight' : ''}>9시부터 18시까지 실시간으로 상담이 가능하며, 언제든지 도움을 드릴 수 있습니다.</p>
          </div>
        </div>
        <button className="learn-more-button">서비스 더 알아보기</button>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
