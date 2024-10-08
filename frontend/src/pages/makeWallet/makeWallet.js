import React, { useState } from 'react';
import TermsAgreement from './TermsAgreement';
import SourceOfFundsForm from './SourceOfFundsForm';
import WalletInfoForm from './WalletInfoForm';
import CurrencySelection from './CurrencySelection';
import AccountInfoForm from './AccountInfoForm'; // 계좌 정보 폼 추가
import Summary from './Summary';
import '../../assets/css/makeWallet/makeWallet.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { useSelector } from 'react-redux';

const MakeWallet = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    agreed: false,
    sourceOfFunds: '',
    walletName: '',
    selectedCurrencies: [],
    accountInfo: [], // 계좌 정보
  });

  const userId = useSelector((state) => state.auth.userId); // Redux에서 userId 가져오기

  const nextStep = () => {
    if (step < 5) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleFormDataChange = (key, value) => {
    console.log(`Setting ${key} to`, value); // 디버깅 로그 추가
    setFormData({ ...formData, [key]: value });
  };

  // 진행도 계산
  const stepsTotal = 5;
  const progressPercent = ((step + 1) / (stepsTotal + 1)) * 100;

  return (
    <>
      <Header />
      <div className="make-wallet-container">
        <div className="progress-bar">
          <div style={{ width: `${progressPercent}%` }}></div>
        </div>

        {/* 진행도 퍼센트 텍스트 추가 */}
        <div className="progress-text">
          {Math.floor(progressPercent)}%
        </div>

        {step === 0 && (
          <TermsAgreement
            agreed={formData.agreed}
            onAgree={() => handleFormDataChange('agreed', true)}
            onNext={nextStep}
          />
        )}
        {step === 1 && (
          <SourceOfFundsForm
            selectedSource={formData.sourceOfFunds}
            onSelectSource={(source) => handleFormDataChange('sourceOfFunds', source)}
            onNext={nextStep}
            onPrevious={prevStep}
          />
        )}
        {step === 2 && (
          <WalletInfoForm
            walletName={formData.walletName}
            onSetWalletName={(name) => handleFormDataChange('walletName', name)}
            onNext={nextStep}
            onPrevious={prevStep}
          />
        )}
        {step === 3 && (
          <CurrencySelection
            selectedCurrencies={formData.selectedCurrencies}
            onSelectCurrencies={(currencies) => handleFormDataChange('selectedCurrencies', currencies)}
            onNext={nextStep}
            onPrevious={prevStep}
          />
        )}
        {step === 4 && (
          <AccountInfoForm
            userId={userId}
            onSetAccountInfo={(info) => {
              handleFormDataChange('accountInfo', info);
              nextStep(); // 여기서 다음 스텝으로 이동
            }}
            onPrevious={prevStep}
          />
        )}
        {step === 5 && <Summary formData={formData} onPrevious={prevStep} />}
      </div>
      <Footer />
    </>
  );
};

export default MakeWallet;
