import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import exchange from '../../assets/svg/Home/exchange.jpg';
import expect from '../../assets/svg/Home/expect.jpg';
import remittance from '../../assets/svg/Home/remittance.jpg';
import Header from '../../components/Header/Header.js';
import Footer from '../../components/Footer/Footer.js';
import LoginBox from "../Login/LoginBox.js";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import AfterLogin from "./AfterLogin.jsx";
import fee from '../../assets/svg/Home/fee.png'; 
import school from '../../assets/svg/Home/school.jpg'; 
import idcard from '../../assets/svg/Home/idcard.png';
import Discount from "./Discount.jsx";
import student from '../../assets/svg/Home/student.png';

import load from '../../assets/svg/Home/load.png';
import perfect from '../../assets/svg/Home/perfect.png';
import qa from '../../assets/svg/Home/qa.png';

const mainArray = [
  {
    url: exchange,
    text1: `쉽고 빠르게, 원하는 외화를 내 손안에.`,
    text2: '환전, 이제 간편하게.'
  }, 
  {
    url: expect,
    text1: "미래의 환율, 간편하게 미리보다.",
    text2: "더 나은 결정을 위해."
  }, 
  {
    url: remittance,
    text1: "한 번의 클릭, 세상을 넘나드는 송금.",
    text2: "간편하게, 바로 지금."
  }
]

const cardArray = [
  {
    src: student,
    h2: "주요 국가 수수료, 졸업 전 최대 할인",
    h3: "졸업 전까지 누리는 주요 국가 수수료 혜택",
    p: "주요 국가 수수료 최대 할인"
  },
  {
    src: student,
    h2: "유학생을 위한 특별 혜택, 즉시 확인",
    h3: "해외에서 공부하는 학생이라면 누구나",
    p: "해외 대학교 학생, 교환학생, 어학연수생"
  },
  {
    src: student,
    h2: "해외 재학생 인증, 서류등록 간편하게",
    h3: "간편하게 재학 인증 받고 혜택",
    p: "간단한 인증 절차로 다양한 혜택을 바로 받아보세요"
  }
]

const Home2 = () => {
  const userId = useSelector((state) => state.auth.userId);
  const [currentImage, setCurrentImage] = useState(0);

  const images = [perfect, load, qa]; // 이미지 파일을 import한 변수들을 배열로 저장

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 3000); // 3초마다 이미지와 텍스트 전환
    return () => clearInterval(interval);
  }, [images.length]);


  useEffect(() => {
    console.log(userId);
  }, [userId])

  return (
    <>
    <main className="relative w-full  h-[calc(100vh-150px)]">
      <Swiper
        modules={[Pagination, Autoplay]}
        autoplay={{ delay: 2500 }}
        loop={true}
        allowTouchMove={false}
        speed={1250}
        className="absolute top-0 left-0 w-full h-full z-[-1]"s
      >
        {
          mainArray.map((item, index) => {
            return (
            <SwiperSlide key={index}>
              <SlideContent url={item.url} text1={item.text1} text2={item.text2}/>
            </SwiperSlide>
            )
          })
        }
      </Swiper>
      { userId === "" ? <LoginBox /> : <AfterLogin  />}
    </main>
    <div className="text-center text-3xl font-bold mt-10">해외 유학생이라면 수수료 할인</div>
    <div className="w-[90%] mt-10 mb-6 mx-auto flex justify-evenly gap-10">
      {
        cardArray.map((card, index) => {
          return <Discount key={index} card={card} /> 
        })}   
    </div>
    <Section1 />
    <Section2 />
    {/* <Section3 images={images} currentImage={currentImage} /> */}
    </>
  );
};

function SlideContent({url, text1, text2}) {
  return (
    <div className="relative">
      <div
        className="w-full h-[calc(100vh-150px)]  bg-cover bg-center"
        style={{ backgroundImage: `url(${url})` }}

      />
      <Overlay text1={text1} text2={text2} />
    </div>
  )
}

function Overlay({text1, text2}) {
  return (
    <>
    <div className="absolute top-0 left-0 z-10 w-full h-[calc(100vh-150px)] bg-black opacity-50 flex justify-center items-center text-4xl font-bold text-white"></div>
    <div className="absolute top-0 left-0 z-10 w-full h-[calc(100vh-150px)]  flex items-center font-bold text-white ml-32 mt-32">
      <div>
      <p className="my-4 text-2xl">{text1}</p><p className="my-4 text-5xl">{text2}</p>
      </div>
      </div>
    </>
  )
}

function Section1() {
  return (
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
            <h3>포인원 수수료</h3>
            <p>13,912 원</p>
          </div>
        </div>
      </section>
  )
}

function Section2() {
  return (
    <section className="w-[70%] mb-10 mx-auto same-day-transfer">
        <h2><span className="highlight">47개국</span> 당일송금, <span className="highlight">5분</span> 안에 송금신청 가능</h2>
        <p className="text-center">현재 오픈 중인 47개국으로 평균 1일만에 송금이 가능하고 5분 안에 송금신청이 가능합니다.</p>
        <div className="country-rates">
          <div className="country-rate"><span>일본</span><span>1 JPY = 9.14 KRW</span></div>
          <div className="country-rate"><span>중국</span><span>1 CNY = 187.51 KRW</span></div>
          <div className="country-rate"><span>미국</span><span>1 USD = 1344.82 KRW</span></div>
          <div className="country-rate"><span>영국</span><span>1 GBP = 1742.56 KRW</span></div>
          <div className="country-rate"><span>유럽</span><span>1 EUR = 1483.51 KRW</span></div>
          <div className="country-rate"><span>호주</span><span>1 AUD = 902.10 KRW</span></div>
        </div>
    </section>
  )
}

function Section3({images, currentImage}) {
  return (
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
  )
}

export default Home2;
