import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { readURL } from './readURL.js'; // readURL 함수 import
import '../../assets/css/Authentication/IdAuth.css';
import Header from '../../components/Header/Header.js';
import Footer from '../../components/Footer/Footer.js';

const IdAuth = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [name, setName] = useState('SeungYup');
  const [lastName, setLastName] = useState('Lee');
  const [engName, setMiddleName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [idSuffix, setIdSuffix] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedBank, setSelectedBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [idType, setIdType] = useState('resident');
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    readURL(e.target); // 파일 미리보기를 위한 함수 호출
  };

  const goToNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step) => {
    setCurrentStep(step);
  };

  const handleIdTypeChange = (e) => {
    setIdType(e.target.value);
  };

  const handleVerifyAccount = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSubmit = () => {
    navigate('/auth-success');
  };

  return (
    <div className="id-auth-container-custom">
      <Header />
      <h1 className="id-auth-title">인증하기</h1>

      <div className="id-auth-progress-bar">
        <div
          className={`id-auth-step ${currentStep === 1 ? 'active' : ''}`}
          onClick={() => goToStep(1)}
          style={{ cursor: 'pointer' }}
        >
          1. 신원인증
        </div>
        <div
          className={`id-auth-step ${currentStep === 2 ? 'active' : ''}`}
          onClick={() => goToStep(2)}
          style={{ cursor: 'pointer' }}
        >
          2. 문서 업로드
        </div>
        <div
          className={`id-auth-step ${currentStep === 3 ? 'active' : ''}`}
          onClick={() => goToStep(3)}
          style={{ cursor: 'pointer' }}
        >
          3. 계좌등록
        </div>
      </div>

      {currentStep === 1 && (
        <div className="id-auth-info-section">
          <div className="id-auth-info-row">
            <span className="id-auth-info-label">이름</span>
            <div className="id-auth-name-section">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="id-auth-input"
                placeholder="이름"
              />
              <input
                type="text"
                value={engName}
                onChange={(e) => setMiddleName(e.target.value)}
                className="id-auth-input"
                placeholder="영문이름"
              />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="id-auth-input"
                placeholder="영문성"
              />
            </div>
          </div>
          <div className="id-auth-info-row">
            <span className="id-auth-info-label">주민등록번호</span>
            <div className="id-auth-id-number-section">
              <input
                type="text"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                className="id-auth-input"
                placeholder="000000"
              />
              <span className="id-auth-separator">-</span>
              <input
                type="password"
                value={idSuffix}
                onChange={(e) => setIdSuffix(e.target.value)}
                className="id-auth-input"
                placeholder="0000000"
              />
            </div>
          </div>
          <div className="id-auth-info-row">
            <span className="id-auth-info-label">생년월일</span>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="id-auth-input"
            />
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="id-auth-info-section">
          <div className="id-auth-info-row">
            <span className="id-auth-info-label">신원인증 유형</span>
            <div className="id-auth-radio-wrapper">
              <div>
                <input
                  type="radio"
                  id="resident"
                  name="idType"
                  value="resident"
                  checked={idType === 'resident'}
                  onChange={handleIdTypeChange}
                />
                <div>주민등록증</div>
              </div>
              <div>
                <input
                  type="radio"
                  id="driver"
                  name="idType"
                  value="driver"
                  checked={idType === 'driver'}
                  onChange={handleIdTypeChange}
                />
                <div>운전면허증</div>
              </div>
            </div>
          </div>
          <div className="id-auth-info-row">
            <span className="id-auth-info-label">{idType === 'resident' ? '주민등록증' : '운전면허증'}</span>
            <div className="id-auth-file-upload-wrapper">
              <img id="preview" alt="" className="w-36" style={{ marginRight: '10px' }} />
              <label className="id-auth-file-upload">
                <input type="file" onChange={handleFileChange} style={{ display: 'none' }} />
                파일 선택
              </label>
              <span className="id-auth-file-info">{selectedFile ? selectedFile.name : '선택된 파일 없음'}</span>
            </div>
          </div>
          <div className="id-auth-info-row">
            <p className="id-auth-note">※ 해당 문서는 비대면 금융거래 시 필요한 법적 필수사항에 근거하여 요청하는 것이며, 회원의 정보를 인증하는 것 이외에 다른 용도로는 활용되지 않습니다.</p>
            <p className="id-auth-note">※ 허용되는 파일 형식: PDF, JPG, JPEG, PNG / 파일 제한 크기: 20MB</p>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="id-auth-info-section">
          <div className="id-auth-info-row">
            <span className="id-auth-info-label">송금 방식</span>
            <div className="id-auth-radio-wrapper">
              <div>
                <input type="radio" id="account" name="transferMethod" value="account" defaultChecked />
                <div>계좌 입금</div>
              </div>
              <div>
                <input type="radio" id="auto" name="transferMethod" value="auto" />
                <div>자동 출금</div>
              </div>
            </div>
          </div>
          <div className="id-auth-info-row">
            <span className="id-auth-info-label">송금 은행</span>
            <select
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
              className="id-auth-input"
            >
              <option value="">은행을 선택해주세요</option>
              <option value="하나은행">하나은행</option>
              <option value="KB국민은행">KB국민은행</option>
              <option value="신한은행">신한은행</option>
              <option value="우리은행">우리은행</option>
              <option value="농협은행">농협은행</option>
            </select>
          </div>
          <div className="id-auth-info-row">
            <span className="id-auth-info-label">계좌 번호</span>
            <div className="id-auth-account-number-wrapper">
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="id-auth-input"
              />
              <button className="id-auth-btn-verify" onClick={handleVerifyAccount}>인증</button>
            </div>
          </div>
          <div className="id-auth-info-row">
            <p className="id-auth-note">※ 한번 등록한 입금계좌는 변경이 불가능하며 등록된 계좌로만 입금이 가능합니다.</p>
            <p className="id-auth-note">※ 등록하는 입금계좌 명의는 신분증 명의와 동일해야 합니다.</p>
            <p className="id-auth-note">※ 농협계좌는 농협은행, 농협회원조합 두 가지 모두 시도해주세요.</p>
          </div>
        </div>
      )}

      <div className="id-auth-button-group">
        <button className="id-auth-btn-prev" onClick={goToPreviousStep} disabled={currentStep === 1}>
          이전 단계
        </button>
        {currentStep === 3 ? (
          <button className="id-auth-btn-next" onClick={handleSubmit}>
            제출하기
          </button>
        ) : (
          <button className="id-auth-btn-next" onClick={goToNextStep}>
            다음 단계
          </button>
        )}
      </div>

      {showModal && (
        <div className="id-auth-modal-overlay">
          <div className="id-auth-modal-content">
            <h2>인증이 완료되었습니다!</h2>
            <button className="id-auth-modal-close-btn" onClick={closeModal}>
              닫기
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default IdAuth;
