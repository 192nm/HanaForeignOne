import React, { useState, useEffect } from 'react';
import "../../assets/css/Remittance/to-person.css"; 
import Header from "../../components/Header/Header.js";
import Footer from "../../components/Footer/Footer.js";
import axios from 'axios';
import { useExchangeRate } from '../../context/ExchangeRateContext.js'; 
import currencyList from '../../Data/CurrencyData.js'; 
import RecipientForm from './RecipientForm.js';
import Purpose from './Purpose.js';  
import Upload from './Upload.js';
import RemittanceConfirm from './RemittanceConfirm.js';

const ToPerson = () => {
  const { exchangeRates, setExchangeRates } = useExchangeRate();
  const [amount, setAmount] = useState(10000);
  const [currency, setCurrency] = useState('JPY');
  const [recipientAmount, setRecipientAmount] = useState('0.00');
  const [currentStep, setCurrentStep] = useState(0); 
  const [animationClass, setAnimationClass] = useState('');
  const [senderName, setSenderName] = useState('SeungYup Lee'); 
  const [recipientName, setRecipientName] = useState('');
  const [recipientDetails, setRecipientDetails] = useState({});  // 수취인 정보 상태 추가
  const [uploadedFiles, setUploadedFiles] = useState([]); // 업로드된 파일 상태 추가
  const [displayedRecipientName, setDisplayedRecipientName] = useState(''); // 통장에 표시될 이름 상태 추가
  const [showModal, setShowModal] = useState(false); // 모달 표시 여부 상태 추가

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await axios.get('https://data.fixer.io/api/latest', {
          params: {
            access_key: 'e60f4bd303f3296324e06d0c15e9faf4',
            symbols: currencyList.map(currency => currency.code).join(',')
          }
        });

        const rates = response.data.rates;
        const krwRate = rates['KRW'];

        const currencyInfo = currencyList.map(currency => {
          const rate = krwRate / rates[currency.code];
          return { code: currency.code, rate };
        });

        setExchangeRates(currencyInfo);
      } catch (error) {
        console.error('Error fetching the exchange rate data', error);
      }
    };

    fetchExchangeRates();
  }, [setExchangeRates]);

  useEffect(() => {
    if (exchangeRates) {
      const selectedRate = exchangeRates.find(info => info.code === currency);
      if (selectedRate) {
        setRecipientAmount((amount / selectedRate.rate).toFixed(2));
      }
    }
  }, [amount, currency, exchangeRates]);

  const selectedCurrencyRate = exchangeRates?.find(info => info.code === currency)?.rate || 0;

  const handleNextStep = () => {
    setAnimationClass('slide-out');
    setTimeout(() => {
      setCurrentStep((prevStep) => prevStep + 1);
      setAnimationClass('slide-in');
    }, 500);
  };

  const handlePreviousStep = () => {
    setAnimationClass('slide-out-back');
    setTimeout(() => {
      setCurrentStep((prevStep) => prevStep - 1);
      setAnimationClass('slide-in-back');
    }, 500);
  };

  const handleNextClickRecipientForm = (details) => {
    setRecipientDetails(details);
    setRecipientName(details.name);  // recipientName 상태 설정
    handleNextStep();
  };

  const handleNextClickUpload = (recipientName, files) => {
    setDisplayedRecipientName(recipientName); // 통장에 표시될 이름 설정
    setUploadedFiles(files); // 업로드된 파일 설정
    handleNextStep();
  };

  return (
    <div className="to-person-container">
      <Header />
      <main className={`to-person-main ${animationClass}`}>
        {currentStep === 0 && (
          <>
            <div className="to-person-transfer-section">
              <div className="to-person-input-box">
                <label>You send</label>
                <div className="to-person-input-field">
                  <select>
                    <option value="KRW">KRW</option>
                  </select>
                  <input 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)} 
                  />
                  <div className="to-person-flag-box">
                    <img
                      src="../../assets/svg/Remittance/korea-flag.png"
                      alt="대한민국"
                    />
                    <span>대한민국</span>
                  </div>
                </div>
              </div>

              <div className="to-person-input-box">
                <label>Recipients gets</label>
                <div className="to-person-input-field">
                  <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                    {currencyList.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name_kr}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={recipientAmount}
                    readOnly
                    className="to-person-highlighted"
                  />
                  <div className="to-person-flag-box">
                    <img
                      src={`../../assets/svg/Remittance/${currency.toLowerCase()}-flag.png`}
                      alt={currency}
                    />
                    <span>{currency}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="to-person-details-section">
              <div className="to-person-details-box">
                <p>적용환율</p>
                <p>1 {currency} = {selectedCurrencyRate.toFixed(1)} KRW</p>
              </div>
              <div className="to-person-details-box">
                <p>할인금액</p>
                <p>100% 환율 우대</p>
              </div>
              <div className="to-person-details-box">
                <p>환전 수수료</p>
                <p>0원</p>
              </div>
              <div className="to-person-details-box">
                <p>중계/수취 수수료</p>
                <p>0원</p>
              </div>
              <div className="to-person-details-box">
                <p>전신료</p>
                <p>0원</p>
              </div>
              <div className="to-person-details-box">
                <p>송금 수수료</p>
                <p>9,400원</p>
              </div>
              <div className="to-person-details-box to-person-total">
                <p>총 입금액</p>
                <p>{recipientAmount} {currency}</p>
              </div>
            </div>

            <div className="to-person-info-section">
              <p>
                <span role="img" aria-label="thumbs up">
                  👍
                </span>{" "}
                타행 환율우대 50% 대비 수수료 83,991원을 아낄 수 있습니다.
              </p>
            </div>

            <button 
              className="to-person-transfer-button"
              onClick={handleNextStep}
            >
              송금하기
            </button>

            <a href="#/" className="to-person-terms-link" onClick={() => setShowModal(true)}>
              송금 신청서류 확인
            </a>
          </>
        )}
        {currentStep === 1 && (
          <RecipientForm onBackClick={handlePreviousStep} onNextClick={handleNextClickRecipientForm} currency={currency} />
        )}
        {currentStep === 2 && (
          <Purpose onBackClick={handlePreviousStep} onNextClick={handleNextStep} />
        )}
        {currentStep === 3 && (
          <Upload onBackClick={handlePreviousStep} onNextClick={handleNextClickUpload} />
        )}
        {currentStep === 4 && (
          <RemittanceConfirm 
            senderName={senderName}
            recipientName={recipientName}
            amount={amount}
            currency="KRW"
            recipientAmount={parseFloat(recipientAmount)}
            fee={9400}
            exchangeRate={`100 ${currency} = ${selectedCurrencyRate.toFixed(4)} KRW`}
            onBackClick={handlePreviousStep}
            recipientDetails={recipientDetails}  // 수취인 정보 전달
            uploadedFiles={uploadedFiles}  // 업로드된 파일 전달
            displayedRecipientName={displayedRecipientName} // 통장에 표시될 이름 전달
          />
        )}
      </main>
      <Footer />

      {showModal && (
        <div className="to-person-modal">
          <div className="to-person-modal-content">
            <span className="to-person-close" onClick={() => setShowModal(false)}>&times;</span>
            <h2>송금 신청서류 안내</h2>
            <p>송금 시 아래 정보가 포함된 인보이스가 필요합니다.</p>
            <ul>
              <li>인보이스 발생일(송금 신청일 기준 6개월 이내 발행)</li>
              <li>송금 신청 내용과 일치하는 송금인, 수취인 정보</li>
              <li>수취인 계좌정보</li>
              <li>거래 날짜</li>
              <li>통화 및 금액</li>
              <li>거래 품목</li>
              <li>인보이스 발생한 날인(학교 등 공인기관은 생략가능)</li>
              <li>인보이스 고유번호(생략가능)</li>
            </ul>
            <button onClick={() => setShowModal(false)}>확인</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToPerson;
