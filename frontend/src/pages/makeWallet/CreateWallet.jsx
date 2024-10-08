import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'; // Redux에서 state 가져오기
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// 모달 컴포넌트 추가
const Modal = ({ title, content, onAgree, onClose }) => {
  const [isScrollable, setIsScrollable] = useState(false);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      setIsScrollable(true);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>{title}</h2>
        <div className="modal-body" onScroll={handleScroll}>
          {content}
        </div>
        {onAgree && (
          <button
            className="agree-button"
            onClick={onAgree}
            disabled={!isScrollable}
          >
            동의합니다
          </button>
        )}
        <button className="close-button" onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

// 계좌 선택 컴포넌트
const AccountInfoForm = ({ accountList, selectedAccounts, onSelectAccount, selectAllAccounts, deselectAllAccounts }) => {
  return (
    <div className="account-selection">
      <h2 className="ml-1 text-lg font-bold text-left">계좌 정보 선택</h2>

      {/* 계좌 카드 스타일 */}
      <div className="account-card-grid">
        {accountList.map((account) => (
          <div key={account.accountNo} className="account-card flex justify-between items-center p-4 bg-gray-100 rounded-md shadow-sm mb-3">
            <div className="account-info">
              <p className="font-bold text-hana">{account.bank}</p>
              <p className="text-sm">계좌 번호: {account.accountNo}</p>
              <p className="text-sm">계좌 종류: {account.accountType}</p>
            </div>
            <div className="account-select">
              <input
                type="checkbox"
                checked={selectedAccounts.includes(account.accountNo)}
                onChange={() => onSelectAccount(account.accountNo)}
                className="form-checkbox h-5 w-5"
              />
            </div>
          </div>
        ))}
      </div>

      {/* 모두 선택 및 해제 버튼 */}
      <div className="flex justify-between mt-4">
        <button className="px-4 py-2 bg-gray-200 rounded-md" onClick={selectAllAccounts}>모두 선택</button>
        <button className="px-4 py-2 bg-gray-200 rounded-md" onClick={deselectAllAccounts}>모두 선택 취소</button>
      </div>
    </div>
  );
};

const CreateWallet = () => {
  const [agreedToTerms, setAgreedToTerms] = useState(false); // 약관1 동의 상태
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false); // 약관2 동의 상태
  const [fundSource, setFundSource] = useState(''); // 자금 출처
  const [walletName, setWalletName] = useState(''); // 지갑 이름(별명)
  const [selectedAccounts, setSelectedAccounts] = useState([]); // 선택된 계좌들
  const [accountList, setAccountList] = useState([]); // 계좌 목록
  const [modalOpen, setModalOpen] = useState(false); // 입력 정보 확인 모달 상태
  const [showTermsModal, setShowTermsModal] = useState(false); // 약관1 모달 상태
  const [showPrivacyModal, setShowPrivacyModal] = useState(false); // 약관2 모달 상태

  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.userId); // Redux에서 userId 가져오기

  // 약관1 동의 처리
  const handleTermsAgreementChange = () => {
    if (!agreedToTerms) {
      setShowTermsModal(true);
    } else {
      setAgreedToTerms(false);
    }
  };

  // 약관2 동의 처리
  const handlePrivacyAgreementChange = () => {
    if (!agreedToPrivacy) {
      setShowPrivacyModal(true);
    } else {
      setAgreedToPrivacy(false);
    }
  };

  // 자금 출처 선택 처리
  const handleFundSourceChange = (e) => {
    setFundSource(e.target.value);
  };

  // 지갑 이름 입력 처리
  const handleWalletNameChange = (e) => {
    setWalletName(e.target.value);
  };

  // 계좌 선택 처리
  const toggleAccount = (accountNumber) => {
    setSelectedAccounts((prevSelected) =>
      prevSelected.includes(accountNumber)
        ? prevSelected.filter((acc) => acc !== accountNumber)
        : [...prevSelected, accountNumber]
    );
  };

  // 모든 계좌 선택
  const selectAllAccounts = () => {
    setSelectedAccounts(accountList.map((account) => account.accountNo));
  };

  // 선택한 계좌 해제
  const deselectAllAccounts = () => {
    setSelectedAccounts([]);
  };

  // 지갑 생성 버튼 클릭 시 실행
  const handleCreateWallet = () => {
    if (!agreedToTerms || !agreedToPrivacy || !fundSource || !walletName || selectedAccounts.length === 0) {
      alert("모든 항목을 입력해주세요.");
      return;
    }
    setModalOpen(true);
  };

  // API로 지갑 생성 요청 보내기
  const handleConfirmCreation = async () => {
    try {
      const requestData = {
        id: userId,
        walletName: walletName,
        walletExist: 'Y',
        sourceOfFunds: fundSource,
        accountInfo: selectedAccounts
      };

      const response = await axios.post('http://localhost:8081/insertWalletOk', requestData);

      if (response.data === '지갑 생성에 성공하였습니다') {
        alert('지갑이 성공적으로 생성되었습니다!');
        navigate('/mypage');
      } else {
        alert('지갑 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('지갑 생성 중 오류 발생:', error);
      alert('지갑 생성 중 오류가 발생했습니다.');
    }

    setModalOpen(false); // 모달 닫기
  };

  // 계좌 목록 API 요청
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch('http://localhost:8081/accountSelectById', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: userId }), // Redux에서 가져온 userId 사용
        });
        const data = await response.json();
        setAccountList(data);
      } catch (error) {
        console.error('계좌 정보를 불러오는 중 오류 발생:', error);
      }
    };

    fetchAccounts();
  }, [userId]);

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white rounded-xl shadow-md space-y-6">
      <h1 className="text-3xl font-bold mb-4">통화지갑 생성하기</h1>

      {/* 약관 동의 */}
      <div className="border-b pb-4 text-left">
        <h2 className="text-xl font-bold text-left">약관 동의</h2>
        <div className="mt-4">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={handleTermsAgreementChange}
            className="mr-2"
          />
          <span>지갑 생성 이용약관에 동의합니다.</span>
        </div>
        <div className="mt-4">
          <input
            type="checkbox"
            checked={agreedToPrivacy}
            onChange={handlePrivacyAgreementChange}
            className="mr-2"
          />
          <span>개인정보 수집 및 이용에 동의합니다.</span>
        </div>
      </div>

      {/* 자금 정보 */}
      <div className="text-left border-b">
        <h2 className="ml-1 text-lg font-bold text-left">자금 정보</h2>

        {/* 자금 출처 선택 */}
        <div className="mt-2 text-left flex border-y">
          <p className="w-[30%] bg-hana text-white p-3 flex items-center">
            자금 출처
          </p>
          <div className="w-[70%] px-3 flex items-center">
            <select
              value={fundSource}
              onChange={handleFundSourceChange}
              className="w-full p-2 h-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">자금 출처를 선택하세요</option>
              <option value="salary">월급</option>
              <option value="business">사업 소득</option>
              <option value="investment">투자 소득</option>
            </select>
          </div>
        </div>

        {/* 지갑 이름 입력 */}
        <div className="text-left flex border-y mb-4">
          <p className="w-[30%] bg-hana text-white p-3 flex items-center">
            지갑 이름
          </p>
          <div className="w-[70%] px-3 flex items-center">
            <input
              type="text"
              value={walletName}
              onChange={handleWalletNameChange}
              className="w-full p-2 h-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="지갑 이름을 입력하세요"
            />
          </div>
        </div>
      </div>

      {/* 계좌 선택 폼 */}
      <AccountInfoForm
        accountList={accountList}
        selectedAccounts={selectedAccounts}
        onSelectAccount={toggleAccount}
        selectAllAccounts={selectAllAccounts}
        deselectAllAccounts={deselectAllAccounts}
      />

      {/* 생성하기 버튼 */}
      <div className="flex justify-end mt-6">
        <button
          onClick={handleCreateWallet}
          className="px-6 py-3 bg-hana text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hana duration-300 hover:opacity-80"
        >
          생성하기
        </button>
      </div>

      {/* 입력 정보 확인 모달 */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-left">
            <h2 className="text-lg font-bold mb-4">입력 정보 확인</h2>
            <p>지갑 이름: {walletName}</p>
            <p>자금 출처: {fundSource}</p>
            <p>선택한 계좌: {selectedAccounts.join(', ')}</p>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-md"
              >
                닫기
              </button>
              <button
                onClick={handleConfirmCreation}
                className="px-4 py-2 bg-hana text-white rounded-md"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 약관1 모달 */}
      {showTermsModal && (
        <Modal
          title="이용약관"
          content={
            <div>
              <p>전자 지급결제대행 서비스 이용약관 요약</p>
              <p>서비스 이용: 실명 가입 필요, 만 14세 이상 이용 가능.</p>
              <p>계약 해지: 언제든지 가능.</p>
              <p>접근매체 관리: 제3자 제공 불가.</p>
              <p>오류로 인한 손해 배상.</p>
            </div>
          }
          onAgree={() => {
            setAgreedToTerms(true);
            setShowTermsModal(false);
          }}
          onClose={() => setShowTermsModal(false)}
        />
      )}

      {/* 약관2 모달 */}
      {showPrivacyModal && (
        <Modal
          title="개인정보 수집 및 이용 동의"
          content={
            <div>
              <p>(주)모인 개인정보 처리방침 요약</p>
              <p>개인정보는 본인 확인, 서비스 제공, 신규 서비스 개발에 사용됩니다.</p>
              <p>금융 기관 및 관련 당국에 제공될 수 있습니다.</p>
              <p>개인정보 보호 위한 보안 조치.</p>
              <p>개인정보 열람, 정정, 삭제 요청 가능.</p>
            </div>
          }
          onAgree={() => {
            setAgreedToPrivacy(true);
            setShowPrivacyModal(false);
          }}
          onClose={() => setShowPrivacyModal(false)}
        />
      )}
    </div>
  );
};

export default CreateWallet;
