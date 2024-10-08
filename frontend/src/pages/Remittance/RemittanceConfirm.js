import React, { useState } from 'react';
import "../../assets/css/Remittance/RemittanceConfirm.css"; 
import RemittanceDone from './RemittanceDone.js'; // RemittanceDone 컴포넌트 임포트

const RemittanceConfirm = ({
  senderName,
  recipientName,
  amount,
  currency,
  recipientAmount,
  fee,
  exchangeRate,
  onBackClick,
  recipientDetails,
  uploadedFiles = [],
  displayedRecipientName = ''
}) => {
  const [isConfirmed, setIsConfirmed] = useState(false); // 송금 완료 여부 상태 추가

  const handleConfirmClick = () => {
    // 확인 버튼 클릭 시 송금 완료 상태로 전환
    setIsConfirmed(true);
  };

  if (isConfirmed) {
    // 송금 완료 상태일 때 RemittanceDone 컴포넌트 렌더링
    return (
      <RemittanceDone 
        amount={amount}
        deadline={new Date().toLocaleString()} // 예시로 현재 시간 사용
        email="example@example.com" // 이메일 예시, 실제 데이터로 변경 필요
      />
    );
  }

  return (
    <div className="remittance-confirm-container">
      <h2>입력하신 정보가 맞나요?</h2>
      <div className="remittance-summary-container">
        <div className="remittance-summary-item">
          <div className="remittance-summary-info">
            <div className="remittance-flag">
              <img src="../../assets/svg/Remittance/korea-flag.png" alt="대한민국" />
            </div>
            <div className="remittance-sender">{senderName}</div>
            <div className="remittance-amount">{amount.toLocaleString()} KRW</div>
          </div>
        </div>
        <div className="remittance-summary-item">
          <div className="remittance-summary-info">
            <div className="remittance-flag">
              <img src={`../../assets/svg/Remittance/${recipientDetails.currency.toLowerCase()}-flag.png`} alt={recipientDetails.country} />
            </div>
            <div className="remittance-recipient">{recipientName}</div>
            <div className="remittance-amount-highlighted">{recipientAmount.toLocaleString()} {recipientDetails.currency}</div>
          </div>
        </div>
      </div>

      <div className="remittance-details-container">
        <div className="remittance-detail-item">
          <span>최종 수취금액</span>
          <span>{recipientAmount.toLocaleString()} {recipientDetails.currency}</span>
        </div>
        <div className="remittance-detail-item">
          <span>보내는 돈</span>
          <span>{amount.toLocaleString()} KRW</span>
        </div>
        <div className="remittance-detail-item">
          <span>총 수수료</span>
          <span>{fee.toLocaleString()} KRW</span>
        </div>
        <div className="remittance-detail-item">
          <span>적용 환율</span>
          <span>{exchangeRate}</span>
        </div>
      </div>

      <div className="remittance-recipient-info-container">
        <h3>수취인 정보</h3>
        <div className="remittance-recipient-info">
          <div className="recipient-info-item">
            <span>수취 국가</span>
            <span>{recipientDetails.country || 'N/A'}</span>
          </div>
          <div className="recipient-info-item">
            <span>수취 통화</span>
            <span>{recipientDetails.currency || 'N/A'}</span>
          </div>
          <div className="recipient-info-item">
            <span>실명 이름</span>
            <span>{recipientDetails.name || 'N/A'}</span>
          </div>
          <div className="recipient-info-item">
            <span>이메일</span>
            <span>{recipientDetails.email || 'N/A'}</span>
          </div>
          <div className="recipient-info-item">
            <span>송금 대상</span>
            <span>{recipientDetails.target || recipientName || 'N/A'}</span>
          </div>
          <div className="recipient-info-item">
            <span>계좌 종류</span>
            <span>{recipientDetails.accountType || 'N/A'}</span>
          </div>
          <div className="recipient-info-item">
            <span>송금은행</span>
            <span>{recipientDetails.bank || 'N/A'}</span>
          </div>
          <div className="recipient-info-item">
            <span>은행 지점코드</span>
            <span>{recipientDetails.branchCode || 'N/A'}</span>
          </div>
          <div className="recipient-info-item">
            <span>계좌 번호</span>
            <span>{recipientDetails.accountNumber || 'N/A'}</span>
          </div>
          <div className="recipient-info-item">
            <span>연락처</span>
            <span>{recipientDetails.contact || 'N/A'}</span>
          </div>
          <div className="recipient-info-item">
            <span>주소</span>
            <span>{recipientDetails.address || 'N/A'}</span>
          </div>
          <div className="recipient-info-item">
            <span>우편 번호</span>
            <span>{recipientDetails.postalCode || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* 추가된 부분: 첨부 서류 및 받는 분 통장에 표시 */}
      <div className="remittance-extra-info-container">
        <h3>첨부 서류</h3>
        <div className="remittance-files-info">
          {uploadedFiles.length > 0 ? (
            uploadedFiles.map((file, index) => (
              <div key={index} className="remittance-file-item">
                <span>{file.name}</span>
              </div>
            ))
          ) : (
            <p>첨부된 파일이 없습니다.</p>
          )}
        </div>

        <h3>추가 정보</h3>
        <div className="remittance-additional-info">
          <div className="remittance-additional-item">
            <span>받는 분 통장에 표시</span>
            <span>{displayedRecipientName || 'N/A'}</span>
          </div>
        </div>
      </div>
      
      <div className="remittance-confirm-buttons-container">
        <button type="button" onClick={onBackClick}>이전 단계</button>
        <button type="submit" onClick={handleConfirmClick}>확인</button>
      </div>
    </div>
  );
};

export default RemittanceConfirm;
