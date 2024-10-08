// ExchangeRateContext.js
import React, { createContext, useContext, useState } from 'react';

const ExchangeRateContext = createContext();

export const useExchangeRate = () => useContext(ExchangeRateContext);

export const ExchangeRateProvider = ({ children }) => {
  const [exchangeRates, setExchangeRates] = useState(null); // 초기 상태를 null로 설정
  
  return (
    <ExchangeRateContext.Provider value={{ exchangeRates, setExchangeRates }}>
      {children}
    </ExchangeRateContext.Provider>
  );
};

