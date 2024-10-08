import React from 'react';
import "../../assets/css/Remittance/RemittanceDone.css";

const RemittanceDone = ({ amount, deadline, email }) => {
  return (
    <div className="remittance-done-container">
      <img className="remittance-done-icon" src="../../assets/svg/Remittance/complete-icon.png" alt="완료 아이콘" />
      <h2 className="remittance-done-title">송금신청이 완료되었습니다</h2>
      <p className="remittance-done-info">제출하신 서류를 검토한 후 가입하신 <a href={`mailto:${email}`}>{email}</a>으로 입금 계좌를 발송해 드리겠습니다.</p>
      <div className="remittance-done-info">
        <div>
          <span>입금 금액</span>
          <span>{amount.toLocaleString()} KRW</span>
        </div>
        <div>
          <span>입금 시한</span>
          <span>{deadline}</span>
        </div>
      </div>
      <div className="remittance-done-notice">
        <p>※ 입금 금액은 정확한 금액을 보내주세요.</p>
        <p><span style={{ color: 'green' }}>가능</span> 한 송금 신청에 대해서 입금 금액을 나눠서 입금</p>
        <p><span style={{ color: 'red' }}>불가</span> 여러 송금 신청에 대한 입금 금액을 한 번에 입금</p>
      </div>
      <div className="remittance-done-notice">
        <p>서류 검토 시간 안내</p>
        <p>※ 평일 오후 6시 이전 신청 송금에 한해 당일 검토 후 입금계좌를 발송해 드립니다.</p>
        <p>※ 평일 오후 6시 이후 신청 송금은 익영업일 검토 후 입금계좌를 발송해 드립니다.</p>
      </div>
      <div className="remittance-done-buttons">
        <button onClick={() => window.location.href = '/main'}>메인으로</button>
        <button onClick={() => window.location.href = '/history'}>신청내역</button>
      </div>
    </div>
  );
};

export default RemittanceDone;
