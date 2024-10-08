import React from 'react';
import '../../assets/css/Admin/OCRDetails.css';

const OCRDetails = ({ ocrData, onApprove, onReject, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="Admin-modal-content">
          <h2 className="ocr-details-title">입증서류 심사</h2>
          <div className="ocr-details-content">
            <div className="ocr-image">
              <img src={ocrData.imageUrl} alt="OCR Document" />
            </div>
            <div className="ocr-info">
              <h3>입증서류 정보</h3>
              <ul>
                <li><strong>성명:</strong> {ocrData.name}</li>
                <li><strong>studies at:</strong> {ocrData.studies}</li>
                <li><strong>Born:</strong> {ocrData.birth}</li>
                <li><strong>ISIC Validity:</strong> {ocrData.validity}</li>
                <li><strong>카드번호:</strong> {ocrData.cardNumber}</li>
                <li><strong>Month/year:</strong> {ocrData.expiry}</li>
              </ul>
            </div>
          </div>
          <div className="ocr-details-actions">
            <button className="btn-approve" onClick={onApprove}>승인</button>
            <button className="btn-reject" onClick={onReject}>반려</button>
            <button className="btn-cancel" onClick={onClose}>취소</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OCRDetails;
