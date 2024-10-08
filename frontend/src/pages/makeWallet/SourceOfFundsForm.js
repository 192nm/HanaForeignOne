import React, { useState } from 'react';

const SourceOfFundsForm = ({ selectedSource, onSelectSource, onNext, onPrevious }) => {
  const [source, setSource] = useState(selectedSource);

  const handleSourceChange = (e) => {
    setSource(e.target.value);
    onSelectSource(e.target.value);
  };

  return (
    <div className="form-card">
      <h3>자금 출처</h3>
      <p>지갑에 사용할 자금 출처를 선택해주세요.</p>
      <select value={source} onChange={handleSourceChange}>
        <option value="">선택해주세요</option>
        <option value="Salary">급여</option>
        <option value="Investment">투자</option>
        <option value="Business">사업</option>
      </select>
      <div className="buttons">
        <button className="prev-button" onClick={onPrevious}>
          이전
        </button>
        <button className="next-button" onClick={onNext} disabled={!source}>
          다음
        </button>
      </div>
    </div>
  );
};

export default SourceOfFundsForm;
