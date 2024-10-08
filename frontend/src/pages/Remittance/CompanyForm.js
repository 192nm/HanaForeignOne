import React, { useState, useEffect } from "react";
import "../../assets/css/Remittance/CompanyForm.css";
import currencyList from '../../Data/CurrencyData.js';

const RecipientForm = ({ onBackClick, onNextClick, currency }) => {
  const [country, setCountry] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [bank, setBank] = useState('');
  const [branchCode, setBranchCode] = useState('');
  const [accountType, setAccountType] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [addressRegion, setAddressRegion] = useState('');
  const [addressCity, setAddressCity] = useState('');
  const [addressStreet, setAddressStreet] = useState('');
  const [addressBuilding, setAddressBuilding] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [contactNumber, setContactNumber] = useState('');

  useEffect(() => {
    const selectedCurrency = currencyList.find(item => item.code === currency);
    if (selectedCurrency) {
      setCountry(selectedCurrency.name);
      setPhoneCode(selectedCurrency.phoneCode);
    }
  }, [currency]);

  const handleNextClick = () => {
    const recipientDetails = {
      country,
      currency,
      email,
      name: `${name} ${surname}`,
      bank,
      branchCode,
      accountType,
      accountNumber,
      address: `${addressRegion}, ${addressCity}, ${addressStreet}, ${addressBuilding}`,
      postalCode,
      contact: `${phoneCode} ${contactNumber}`
    };
    onNextClick(recipientDetails);
  };

  return (
    <div className="recipient-form">
      <h2>받는 분</h2>
      <form>
        <div className="recipient-form-row">
          <label>이메일</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="이메일" />
        </div>
        <div className="recipient-form-row">
          <label>회사명</label>
          <div className="recipient-form-name">
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="기업명" />
          </div>
        </div>
        <div className="recipient-form-row">
          <label>송금은행</label>
          <select value={bank} onChange={e => setBank(e.target.value)}>
            <option value="">은행을 선택하세요</option>
            <option value="은행1">은행1</option>
            <option value="은행2">은행2</option>
            {/* 은행 목록 추가 */}
          </select>
        </div>
        <div className="recipient-form-row">
          <label>은행 지점코드</label>
          <select value={branchCode} onChange={e => setBranchCode(e.target.value)}>
            <option value="">지점 코드를 선택하세요</option>
            <option value="지점1">지점1</option>
            <option value="지점2">지점2</option>
            {/* 지점 목록 추가 */}
          </select>
        </div>
        <div className="recipient-form-row">
          <label>계좌 종류</label>
          <div className="recipient-form-account-type">
            <label><input type="radio" name="accountType" value="보통" onChange={e => setAccountType(e.target.value)} /> 보통</label>
            <label><input type="radio" name="accountType" value="저축" onChange={e => setAccountType(e.target.value)} /> 저축</label>
            <label><input type="radio" name="accountType" value="당좌" onChange={e => setAccountType(e.target.value)} /> 당좌</label>
          </div>
        </div>
        <div className="recipient-form-row">
          <label>계좌 번호</label>
          <input type="text" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} placeholder="계좌 번호" />
        </div>
        <div className="recipient-form-row">
          <label>주소</label>
          <div className="recipient-form-address">
            <input type="text" value={addressRegion} onChange={e => setAddressRegion(e.target.value)} placeholder="지역(Region)" />
            <input type="text" value={addressCity} onChange={e => setAddressCity(e.target.value)} placeholder="도시(City)" />
            <input type="text" value={addressStreet} onChange={e => setAddressStreet(e.target.value)} placeholder="상세 주소1(Street address)" />
            <input type="text" value={addressBuilding} onChange={e => setAddressBuilding(e.target.value)} placeholder="상세 주소 2(Building name, House no., etc) (선택)" />
          </div>
        </div>
        <div className="recipient-form-row">
          <label>우편 번호</label>
          <input type="text" value={postalCode} onChange={e => setPostalCode(e.target.value)} placeholder="우편 번호" />
        </div>
        <div className="recipient-form-row">
          <label>연락처</label>
          <div className="recipient-form-contact">
            <select value={phoneCode} onChange={e => setPhoneCode(e.target.value)}>
              <option value="+82">+82 (대한민국)</option>
              <option value="+81">+81 (일본)</option>
              {/* 다른 국가 코드 추가 */}
            </select>
            <input type="text" value={contactNumber} onChange={e => setContactNumber(e.target.value)} placeholder="전화번호" />
          </div>
        </div>
        <div className="recipient-form-buttons">
          <button type="button" onClick={onBackClick}>이전 단계</button>
          <button type="button" onClick={handleNextClick}>다음 단계</button> {/* 여기서 다음 단계로 이동 */}
        </div>
      </form>
    </div>
  );
};

export default RecipientForm;
