import React, { useState } from 'react';

const CurrencySelection = ({ selectedCurrencies, onSelectCurrencies, onNext, onPrevious }) => {
  const [selected, setSelected] = useState(selectedCurrencies);

  const toggleCurrency = (currency) => {
    setSelected((prev) =>
      prev.includes(currency)
        ? prev.filter((cur) => cur !== currency)
        : [...prev, currency]
    );
  };

  const handleNext = () => {
    onSelectCurrencies(selected);
    onNext();
  };

  return (
    <div className="form-card">
      <h3>통화 선택</h3>
      <div className="currency-options">
        {['USD', 'EUR', 'JPY', 'CNY'].map((currency) => (
          <label key={currency}>
            <input
              type="checkbox"
              checked={selected.includes(currency)}
              onChange={() => toggleCurrency(currency)}
            />
            {currency}
          </label>
        ))}
      </div>
      <div className="buttons">
        <button className="prev-button" onClick={onPrevious}>
          이전
        </button>
        <button className="next-button" onClick={handleNext} disabled={selected.length === 0}>
          다음
        </button>
      </div>
    </div>
  );
};

export default CurrencySelection;
