import React, { useState } from 'react';

const WalletInfoForm = ({ walletName, onSetWalletName, onNext, onPrevious }) => {
  const [name, setName] = useState(walletName);

  const handleWalletNameChange = (e) => {
    setName(e.target.value);
    onSetWalletName(e.target.value);
  };

  return (
    <div className="form-card">
      <h3>지갑 정보</h3>
      <p>지갑의 이름을 입력해주세요.</p>
      <input
        type="text"
        placeholder="지갑 이름"
        value={name}
        onChange={handleWalletNameChange}
      />
      <div className="buttons">
        <button className="prev-button" onClick={onPrevious}>
          이전
        </button>
        <button className="next-button" onClick={onNext} disabled={!name}>
          다음
        </button>
      </div>
    </div>
  );
};

export default WalletInfoForm;
