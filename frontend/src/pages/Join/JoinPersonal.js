import React, { useState, useEffect, useCallback } from 'react';
import '../../assets/css/Join/JoinPersonal.css';
import Header from '../../components/Header/Header.js';
import Footer from '../../components/Footer/Footer.js';
import { Link } from 'react-router-dom';

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

const JoinPersonal = () => {
  const [allChecked, setAllChecked] = useState(false);
  const [required1Checked, setRequired1Checked] = useState(false);
  const [required2Checked, setRequired2Checked] = useState(false);
  const [optionalChecked, setOptionalChecked] = useState(false);
  const [showModal, setShowModal] = useState(null);
  const [modalContent, setModalContent] = useState(null);

  const [username, setUsername] = useState('');
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);

  const checkAll = useCallback(() => {
    if (required1Checked && required2Checked && optionalChecked) {
      setAllChecked(true);
    } else {
      setAllChecked(false);
    }
  }, [required1Checked, required2Checked, optionalChecked]);

  const handleAllCheckedChange = () => {
    const newCheckedState = !allChecked;
    if (newCheckedState) {
      setShowModal('all');
      setModalContent("모든 항목에 동의하셨습니다.");
    } else {
      setAllChecked(false);
      setRequired1Checked(false);
      setRequired2Checked(false);
      setOptionalChecked(false);
    }
  };

  const handleRequired1Change = () => {
    if (required1Checked) {
      setRequired1Checked(false);
    } else {
      setShowModal('required1');
      setModalContent("이용약관에 동의하셨습니다.");
    }
  };

  const handleRequired2Change = () => {
    if (required2Checked) {
      setRequired2Checked(false);
    } else {
      setShowModal('required2');
      setModalContent("개인정보 수집에 동의하셨습니다.");
    }
  };

  const handleOptionalChange = () => {
    setOptionalChecked(!optionalChecked);
    checkAll();
  };

  const handleAgree = (type) => {
    if (type === 'required1') setRequired1Checked(true);
    if (type === 'required2') setRequired2Checked(true);
    if (type === 'all') {
      setRequired1Checked(true);
      setRequired2Checked(true);
      setOptionalChecked(true);
      setAllChecked(true);
    }
    setShowModal(null);
  };

  const handleClose = () => {
    setShowModal(null);
    setModalContent(null);
  };

  useEffect(() => {
    checkAll();
  }, [required1Checked, required2Checked, optionalChecked, checkAll]);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const checkUsernameAvailability = () => {
    // 이곳에 실제 중복 확인 로직을 추가해야 합니다.
    // 예시로, 항상 사용 가능하다고 가정
    if (username === "existing_user") {
      setIsUsernameAvailable(false);
      setModalContent("이미 사용 중인 아이디입니다.");
    } else {
      setIsUsernameAvailable(true);
      setModalContent("사용 가능한 아이디입니다.");
    }
    setShowModal('username-check');
  };

  return (
    <div className="join-personal-container">
      <Header />
      <main className="join-personal-content">
        <h1 className="join-title">개인 회원가입</h1>

        <section className="agreement-section">
          <label className="checkbox-container">
            <input 
              type="checkbox" 
              checked={allChecked} 
              onChange={handleAllCheckedChange} 
            />
            <span className="checkmark"></span>
            아래 항목에 모두 동의합니다
          </label>
          <div className="agreements">
            <label className="checkbox-container">
              <input 
                type="checkbox" 
                checked={required1Checked} 
                onChange={handleRequired1Change} 
              />
              <span className="checkmark"></span>
              [필수] 이용약관에 대한 동의
            </label>
            <label className="checkbox-container">
              <input 
                type="checkbox" 
                checked={required2Checked} 
                onChange={handleRequired2Change} 
              />
              <span className="checkmark"></span>
              [필수] 개인정보 수집 동의
            </label>
            <label className="checkbox-container">
              <input 
                type="checkbox" 
                checked={optionalChecked} 
                onChange={handleOptionalChange} 
              />
              <span className="checkmark"></span>
              [선택] 마케팅 SMS, 이메일 수신에 대한 동의
            </label>
          </div>
        </section>

        <section className="email-verification-section">
          <div className="input-group">
            <label>이메일</label>
            <input type="email" placeholder="이메일을 입력하세요" />
            <button className="btn-send-code">인증코드 발송</button>
          </div>
          <div className="input-group">
            <input type="text" placeholder="인증코드를 입력하세요" />
            <button className="btn-verify">확인</button>
          </div>
        </section>

        <section className="username-section">
          <div className="input-group">
            <label>아이디</label>
            <input
              type="text"
              value={username}
              onChange={handleUsernameChange}
              placeholder="아이디를 입력하세요"
            />
            <button className="btn-check-username" onClick={checkUsernameAvailability}>
              중복 확인
            </button>
          </div>
        </section>

        <section className="password-section">
          <div className="input-group">
            <label>비밀번호</label>
            <input type="password" placeholder="비밀번호를 입력하세요" />
          </div>
          <div className="input-group">
            <label>비밀번호 확인</label>
            <input type="password" placeholder="비밀번호를 다시 입력하세요" />
          </div>
        </section>

        <section className="personal-info-section">
          <h2>회원 정보 입력</h2>
          <div className="input-group">
            <label>이름</label>
            <input type="text" placeholder="이름을 입력하세요" />
          </div>
          <div className="input-group">
            <label>영문이름</label>
            <input type="text" placeholder="영문 이름을 입력하세요" />
          </div>
          <div className="input-group">
            <label>영문 성</label>
            <input type="text" placeholder="영문 성을 입력하세요" />
          </div>
          <div className="input-group phone-input-group">
            <label>휴대폰 번호</label>
            <select>
              <option value="+82">+82</option>
              {/* 기타 국가 코드 옵션 추가 가능 */}
            </select>
            <input type="text" placeholder="휴대폰 번호를 입력하세요" />
            <button className="btn-send-code">인증코드 발송</button>
          </div>
          <div className="input-group">
            <input type="text" placeholder="인증코드를 입력하세요" />
            <button className="btn-verify">확인</button>
          </div>
          <div className="input-group">
            <label>가입경로</label>
            <select>
              <option value="app">모인 앱/웹 서비스</option>
              <option value="referral">추천인</option>
              {/* 기타 옵션 추가 가능 */}
            </select>
          </div>
          <div className="input-group">
            <label>주요 송금목적</label>
            <select>
              <option value="family">가족 부양</option>
              <option value="investment">투자</option>
              {/* 기타 옵션 추가 가능 */}
            </select>
          </div>
          <div className="input-group">
            <label>연간예상송금액</label>
            <select>
              <option value="less1">1억원 미만</option>
              <option value="more1">1억원 이상</option>
              {/* 기타 옵션 추가 가능 */}
            </select>
          </div>
        </section>

        <Link to="/join-personal-success" className="btn-next">다음</Link>
      </main>
      <Footer />

      {showModal && (
        <Modal 
          title="알림"
          content={modalContent}
          onClose={handleClose}
        />
      )}

      {showModal === 'required1' && (
        <Modal 
          title="이용약관"
          content={
            <div>
              <p>전자 지급결제대행 서비스 이용약관 요약
1. 목적
이 약관은 전자지급결제대행 서비스를 제공하는 주식회사 모인과 이용자 간의 권리, 의무, 책임사항, 서비스 이용 조건 및 절차 등을 규정합니다.

2. 용어 정의

전자금융거래: 회사가 제공하는 전자지급결제대행 서비스로, 자동화된 방식으로 이루어지는 거래.
전자지급결제대행 서비스: 재화나 용역의 지급결제를 전자적 방법으로 송수신하거나 그 대가를 정산하는 서비스.
이용자: 이 약관에 동의하고 서비스를 이용하는 자.
접근매체: 전자금융거래를 위해 사용되는 수단으로, 전자식 카드, 인증서, 비밀번호 등을 포함.
3. 약관의 명시 및 변경
회사는 약관을 서비스 화면에 게시하며, 변경 시 30일 전에 공지합니다. 이용자는 변경된 약관에 동의하지 않을 경우 계약을 해지할 수 있습니다.

4. 접근매체의 관리
이용자는 접근매체를 제3자에게 제공하거나 노출해서는 안 되며, 분실 시 즉시 회사에 통지해야 합니다. 회사는 분실 통지 이후 발생하는 손해에 대해 배상 책임이 있습니다.

5. 서비스이용계약
서비스 이용계약은 이용자가 신청하고 회사가 이를 승인함으로써 성립됩니다. 실명으로 가입해야 하며, 만 14세 이상만 가입할 수 있습니다.

6. 이용신청 및 승낙
이용자는 사실대로 가입신청을 해야 하며, 회사는 허위 정보나 부적절한 신청을 거부할 수 있습니다.

7. 이용계약의 해지
이용자는 언제든지 계약을 해지할 수 있으며, 회사는 이용자가 약관을 위반할 경우 계약을 해지할 수 있습니다.

8. 오류의 정정
이용자는 오류 발생 시 회사에 정정을 요구할 수 있으며, 회사는 이를 2주 이내에 처리해야 합니다.

9. 서비스 이용 기록의 보존
회사는 거래 내용을 추적할 수 있는 기록을 생성해 5년간 보존합니다.

10. 거래지시의 철회
이용자는 관련 법령에 따라 전자지급거래지시를 철회할 수 있습니다.

11. 전자금융거래정보의 제공금지
회사는 이용자의 정보를 동의 없이 제3자에게 제공하거나 업무 외 목적으로 사용하지 않습니다.

12. 회사의 책임
회사는 접근매체 위조, 거래 지시 오류 등으로 인한 손해를 배상할 책임이 있습니다. 단, 이용자의 중대한 과실이 있을 경우 책임이 제한될 수 있습니다.

13. 이용자의 의무
이용자는 약관을 준수하고, 회사의 영업활동을 방해하거나 타인의 개인정보를 침해해서는 안 됩니다.

14. 분쟁처리
이용자는 분쟁 발생 시 회사의 분쟁처리기구에 해결을 요구할 수 있으며, 회사는 15일 이내에 처리 결과를 통보해야 합니다.

15. 약관 외 준칙 및 관할
이 약관에서 정하지 않은 사항은 대한민국 법령에 따르며, 분쟁 발생 시 민사소송법에 따른 관할 법원을 따릅니다.

부칙
이 약관은 2022년 9월 30일부터 시행됩니다.</p>
              <p>제 1조 (목적) 이 약관은 전자지급결제대행 서비스와 관련하여...</p>
              <p>제 2조 (정의) 이 약관에서 사용하는 용어의 정의는 다음과 같습니다...</p>
              <p>...내용이 많을수록 더 좋습니다...</p>
            </div>
          }
          onAgree={() => handleAgree('required1')}
          onClose={handleClose}
        />
      )}

      {showModal === 'required2' && (
        <Modal 
          title="개인정보 수집 동의"
          content={
            <div>
              <p>(주)모인 개인정보 처리방침 요약
1. 개인정보 수집 및 이용 목적
회사는 이용자의 신분 확인과 최적화된 서비스 제공을 위해 최소한의 개인정보를 수집합니다. 개인정보는 본인 확인, 서비스 제공, 계약 이행, 신규 서비스 개발 및 통계 목적으로 사용됩니다.

2. 개인정보의 제3자 제공
회사는 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않으며, 외환 거래 관리, 자금세탁 방지, 계좌 실명 조회 등의 목적으로 금융당국, 금융결제원, 국내외 금융기관 등에 개인정보를 제공할 수 있습니다.

3. 개인정보 처리위탁
회사는 문자 및 알림톡 전송, 클라우드 서비스 운영, 채팅 시스템 운영 등을 위해 일부 업무를 외부업체에 위탁하며, 개인정보가 안전하게 처리되도록 관리합니다.

4. 개인정보 보유 및 파기
회사는 개인정보를 고지된 기간 동안 보유하며, 이용 목적이 달성되면 지체 없이 파기합니다. 법령에 따라 보관이 필요한 경우 일정 기간 동안 보관하며, 이후 파기합니다.

5. 개인정보 자동 수집 장치
회사는 쿠키를 사용해 이용자의 정보를 저장하고 맞춤형 서비스를 제공합니다. 이용자는 쿠키 설정을 조정할 수 있으며, 쿠키 저장을 거부할 경우 일부 서비스 이용이 어려울 수 있습니다.

6. 이용자의 권리
이용자는 언제든지 개인정보 열람, 정정, 삭제, 처리 정지를 요구할 수 있으며, 동의 철회를 통해 개인정보의 삭제를 요청할 수 있습니다. 단, 법령에 따라 보관이 필요한 경우 제한될 수 있습니다.

7. 이용자의 의무
이용자는 자신의 개인정보를 보호해야 하며, 부주의로 인한 개인정보 유출에 대해 책임을 집니다. 타인의 개인정보 도용 시 법적 처벌을 받을 수 있습니다.

8. 개인정보 보호 대책
회사는 개인정보를 안전하게 보호하기 위해 암호화, 해킹 방지, 내부 관리 계획 수립 및 시행, 개인정보 처리자 교육 등을 실시합니다.

9. 개인정보 보호책임자
개인정보 보호를 위해 회사는 책임자를 지정하며, 이용자는 관련 민원을 전담부서에 신고할 수 있습니다. 필요한 경우 개인정보 침해에 대한 신고는 외부 기관에 할 수 있습니다.

10. 고지의 의무
이 개인정보 처리방침은 정책 변화 시 수정될 수 있으며, 수정된 내용은 홈페이지나 이메일을 통해 공지됩니다.

본 개인정보 처리방침은 2024년 1월 22일부터 적용됩니다.</p>
              <p>이용자는 동의하지 않을 권리가 있으며...</p>
              <p>...내용이 많을수록 더 좋습니다...</p>
            </div>
          }
          onAgree={() => handleAgree('required2')}
          onClose={handleClose}
        />
      )}

      {showModal === 'all' && (
        <Modal 
          title="모두 동의"
          content={
            <div>
              <p>(주)모인 전자 지급결제대행 서비스 이용약관 및 개인정보 처리방침 요약
1. 약관 및 방침 개요
주식회사 모인은 전자지급결제대행 서비스를 제공하며, 이용자와의 계약 조건, 권리 및 의무를 규정합니다. 동시에 이용자의 개인정보를 보호하고, 이를 법령에 따라 안전하게 관리합니다.

2. 서비스 이용

가입 및 계약: 만 14세 이상만 실명으로 가입 가능하며, 회사는 이용자의 요청을 승인한 후 계약이 성립됩니다.
접근매체 관리: 이용자는 접근매체를 안전하게 관리해야 하며, 분실 시 회사에 즉시 통지해야 합니다.
오류 처리: 이용자는 거래 오류 시 정정을 요구할 수 있으며, 회사는 이를 2주 이내에 처리해야 합니다.
3. 개인정보 수집 및 이용

수집 목적: 서비스 제공, 본인 확인, 계약 이행, 맞춤형 서비스 제공 등을 위해 최소한의 개인정보를 수집합니다.
제3자 제공 및 처리위탁: 회사는 금융당국, 국내외 금융기관 등에 개인정보를 제공하며, 일부 업무는 외부 업체에 위탁합니다.
4. 이용자의 권리 및 의무

권리: 이용자는 언제든지 개인정보 열람, 정정, 삭제, 처리 정지를 요구할 수 있습니다.
의무: 개인정보 보호를 위해 자신의 정보를 안전하게 관리해야 하며, 타인의 정보를 도용해서는 안 됩니다.
5. 보안 및 보호 조치
회사는 개인정보 암호화, 해킹 방지 시스템, 내부 관리 계획 등을 통해 이용자의 개인정보를 보호합니다.

6. 약관 및 방침 변경
약관과 개인정보 처리방침은 변경될 수 있으며, 변경 시 사전에 공지됩니다.

이 방침은 2024년 1월 22일부터 적용됩니다.</p>
              <p>이용자는 동의하지 않을 권리가 있으며...</p>
              <p>...내용이 많을수록 더 좋습니다...</p>
            </div>
          }
          onAgree={() => handleAgree('all')}
          onClose={handleClose}
        />
      )}
    </div>
  );
};

export default JoinPersonal;
