import React, { useState, useEffect } from 'react';

const AccountInfoForm = ({ onSetAccountInfo, onNext, onPrevious, userId }) => {
  const [accountList, setAccountList] = useState([]);
  const [selectedAccounts, setSelectedAccounts] = useState([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch('http://localhost:8081/accountSelectById', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: userId }),
        });
        const data = await response.json();
        setAccountList(data);
      } catch (error) {
        console.error('계좌 정보를 불러오는 중 오류 발생:', error);
      }
    };

    fetchAccounts();
  }, [userId]);

  const toggleAccount = (accountNumber) => {
    setSelectedAccounts((prevSelected) =>
      prevSelected.includes(accountNumber)
        ? prevSelected.filter((acc) => acc !== accountNumber)
        : [...prevSelected, accountNumber]
    );
  };

  const selectAllAccounts = () => {
    setSelectedAccounts(accountList.map((account) => account.accountNo));
  };

  const deselectAllAccounts = () => {
    setSelectedAccounts([]);
  };

  return (
    <div>
      <h2>계좌 정보 선택</h2>
      <div className="account-options">
        {accountList.map((account) => (
          <div key={account.accountNo} className="account-card">
            <div className="account-info">
              <h3>{account.bank}</h3>
              <p>계좌 번호: {account.accountNo}</p>
              <p>계좌 종류: {account.accountType}</p>
            </div>
            <input
              type="checkbox"
              checked={selectedAccounts.includes(account.accountNo)}
              onChange={() => toggleAccount(account.accountNo)}
            />
          </div>
        ))}
      </div>

      <div className="buttons">
        <button className="prev-button" onClick={onPrevious}>이전</button>
        <button className="next-button" onClick={() => onSetAccountInfo(selectedAccounts)}>다음</button>
      </div>

      <div className="select-buttons">
        <button className="select-all-button" onClick={selectAllAccounts}>모두 선택</button>
        <button className="deselect-all-button" onClick={deselectAllAccounts}>모두 선택 취소</button>
      </div>
    </div>
  );
};

export default AccountInfoForm;
