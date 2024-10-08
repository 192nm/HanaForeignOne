import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/Authentication/PersonalAuthentication.css';
import Header from '../../components/Header/Header.js';
import Footer from '../../components/Footer/Footer.js';

const countryOptions = [
  '대한민국', '미국', '캐나다', '일본', '중국', '영국', '프랑스', '독일', '호주', '러시아', '브라질', '인도', '멕시코', '이탈리아', '스페인'
  // 추가적으로 원하는 나라들을 여기에 추가할 수 있습니다.
];

const PersonalAuthentication = () => {
  const navigate = useNavigate(); // React Router의 useNavigate 훅 사용
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [name, setName] = useState('SeungYup Lee');
  const [phone, setPhone] = useState('+82 01053080874');
  const [address, setAddress] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [nationality, setNationality] = useState('대한민국'); // 국적 상태
  const [residenceCountry, setResidenceCountry] = useState('대한민국'); // 거주 국가 상태
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditName = () => {
    setIsEditingName(!isEditingName);
  };

  const handleEditPhone = () => {
    setIsEditingPhone(!isEditingPhone);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };

  const openPostcodeModal = () => {
    new window.daum.Postcode({
      oncomplete: function(data) {
        setAddress(data.address);
        setZipCode(data.zonecode);
        closePostcodeModal();
      },
      onclose: function() {
        closePostcodeModal();
      } 
    }).open();
    setIsModalOpen(true);
  };

  const closePostcodeModal = () => {
    setIsModalOpen(false);
  };

  const handleNationalityChange = (e) => {
    setNationality(e.target.value);
  };

  const handleResidenceCountryChange = (e) => {
    setResidenceCountry(e.target.value);
  };

  const handleNextStep = () => {
    navigate('/id-auth'); // IdAuth.js로 이동
  };

  return (
    <div className="authentication-container">
      <Header />
      <h1 className="section-title">시작하기</h1>

      <div className="info-section">
        <h2 className="section-subtitle">내 정보</h2>
        <div className="info-row">
          <span className="info-label">영문 이름</span>
          <div className="info-value-wrapper">
            {isEditingName ? (
              <>
                <input 
                  type="text" 
                  value={name} 
                  onChange={handleNameChange} 
                  className="info-value editable" 
                />
                <button className="btn-edit" onClick={handleEditName}>완료</button>
              </>
            ) : (
              <>
                <span className="info-value">{name}</span>
                <button className="btn-edit" onClick={handleEditName}>수정</button>
              </>
            )}
          </div>
        </div>
        <div className="info-row">
          <span className="info-label">이메일</span>
          <div className="info-value-wrapper">
            <span className="info-value">yxp@kakao.com</span>
            <span className="verification-status">인증됨</span>
          </div>
        </div>
        <div className="info-row">
          <span className="info-label">휴대폰 번호</span>
          <div className="info-value-wrapper">
            {isEditingPhone ? (
              <>
                <input 
                  type="text" 
                  value={phone} 
                  onChange={handlePhoneChange} 
                  className="info-value editable" 
                />
                <button className="btn-edit" onClick={handleEditPhone}>완료</button>
              </>
            ) : (
              <>
                <span className="info-value">{phone}</span>
                <button className="btn-edit" onClick={handleEditPhone}>수정</button>
              </>
            )}
            <span className="verification-status">인증됨</span>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h2 className="section-subtitle">송금 정보</h2>
        <div className="info-row">
          <span className="info-label">국적</span>
          <select className="info-value" value={nationality} onChange={handleNationalityChange}>
            {countryOptions.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
        <div className="info-row">
          <span className="info-label">거주 국가</span>
          <select className="info-value" value={residenceCountry} onChange={handleResidenceCountryChange}>
            {countryOptions.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
        <div className="info-row">
          <span className="info-label">송금인 주소</span>
          <div className="info-value-wrapper address-grid">
            <button 
              onClick={openPostcodeModal} 
              className="address-search full-width"
            >
              지번/도로명 검색
            </button>
            <input 
              type="text" 
              value={address.split(' ')[0] || ''} 
              readOnly 
              className="address-input" 
              placeholder="지역 (Province)"
            />
            <input 
              type="text" 
              value={address.split(' ')[1] || ''} 
              readOnly 
              className="address-input" 
              placeholder="도시 (City)"
            />
            <input 
              type="text" 
              value={address.split(' ').slice(2).join(' ') || ''} 
              readOnly 
              className="address-input full-width" 
              placeholder="상세 주소1 (Street Address)"
            />
            <input 
              type="text" 
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              placeholder="상세 주소2 (House No.) (선택)" 
              className="address-input full-width"
            />
            <input 
              type="text" 
              value={zipCode} 
              placeholder="우편 번호 (Zip Code)" 
              className="address-input full-width"
              readOnly 
            />
          </div>
        </div>
      </div>

      <button className="proceed-button" onClick={handleNextStep}>다음 단계</button>
      <Footer />
    </div>
  );
};

export default PersonalAuthentication;
