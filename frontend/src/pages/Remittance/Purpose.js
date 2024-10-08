import React from 'react';
import "../../assets/css/Remittance/Purpose.css"; 

const Purpose = ({ onBackClick, onNextClick }) => {
  return (
    <div className="purpose-form">
      <h2>송금 목적</h2>
      <form>
        <div className="purpose-form-row">
          <label>송금 목적</label>
          <select>
            <option value="">선택해주세요.</option>
            <option value="목적1">교육비</option>
            <option value="목적2">주거 임대비</option>
            <option value="목적3">제품 구매비용</option>
            <option value="목적4">서비스 이용료</option>
            {/* 송금 목적 추가 */}
          </select>
        </div>
        <div className="purpose-form-row">
          <label>직업 정보</label>
          <select>
            <option value="">선택해주세요</option>
            <option value="정보1">학생</option>
            <option value="정보2">직장인</option>
            <option value="정보3">프리랜서</option>
            <option value="정보4">사업가</option>
            <option value="정보5">주부</option>
            <option value="정보6">무직(은퇴)</option>
            {/* 직업 정보 추가 */}
          </select>
        </div>
        <div className="purpose-form-row">
          <label>받는 분과의 관계</label>
          <select>
            <option value="">선택해주세요</option>
            <option value="관계1">본인</option>
            <option value="관계2">가족</option>
            <option value="관계3">친척</option>
            <option value="관계4">사업관계자</option>
            <option value="관계5">학교/유학원</option>
            <option value="관계6">지인(친구)</option>
            {/* 관계 정보 추가 */}
          </select>
        </div>
        <div className="purpose-form-row">
          <label>자금 출처</label>
          <select>
            <option value="">선택해주세요</option>
            <option value="출처1">월급</option>
            <option value="출처2">사업소득</option>
            <option value="출처3">생활비</option>
            <option value="출처4">용돈</option>
            <option value="출처5">금융소득</option>
            <option value="출처6">퇴직금</option>
            <option value="출처7">임대소득</option>
            {/* 자금 출처 추가 */}
          </select>
        </div>
        <div className="purpose-form-buttons">
          <button type="button" onClick={onBackClick}>이전 단계</button>
          <button type="button" onClick={onNextClick}>다음 단계</button> {/* 다음 단계로 이동 */}
        </div>
      </form>
    </div>
  );
};

export default Purpose;
