import React, { useState } from 'react';
import Header from '../../components/Header/Header.js';
import Footer from '../../components/Footer/Footer.js';
import '../../assets/css/FAQ/FAQ.css';

const FAQ = () => {
  const [selectedCategory, setSelectedCategory] = useState('가입 및 인증');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'signup', name: '가입 및 인증' },
    { id: 'introduction', name: '뽀송 소개' },
    { id: 'country', name: '국가별 안내' },
    { id: 'transfer', name: '송금 신청' }
  ];

  const faqs = {
    '가입 및 인증': [
      { question: "회원 가입은 어떻게 하나요?", answer: "홈페이지에서 '회원가입' 버튼을 클릭하고 등록 양식을 작성하여 가입할 수 있습니다." },
      { question: "가입 시 필요한 서류는 무엇인가요?", answer: "신분증, 이메일 주소, 전화번호가 필요합니다." },
      { question: "계정 비밀번호를 잊어버렸어요. 어떻게 해야 하나요?", answer: "비밀번호 재설정 페이지에서 이메일 주소를 입력하면 재설정 링크를 보내드립니다." },
      { question: "계정 정보를 변경하려면 어떻게 해야 하나요?", answer: "로그인 후 '내 정보' 페이지에서 계정 정보를 수정할 수 있습니다." },
      { question: "탈퇴 후 재가입이 가능한가요?", answer: "탈퇴 후에는 30일 이내에 재가입이 불가능하며, 이후에 새로 가입하실 수 있습니다." },
      { question: "이중 인증은 어떻게 설정하나요?", answer: "로그인 후 '보안 설정'에서 이중 인증을 설정할 수 있습니다." },
      { question: "이메일 인증이 되지 않아요.", answer: "스팸 폴더를 확인하고, 그래도 인증이 되지 않는다면 고객센터에 연락해주세요." },
      { question: "전화번호를 변경하고 싶어요.", answer: "전화번호 변경은 '내 정보' 페이지에서 가능합니다." },
      { question: "SMS 인증을 받지 못했어요.", answer: "SMS 인증이 안 될 경우 고객센터에 문의하시기 바랍니다." },
      { question: "계정 잠금을 해제하려면 어떻게 해야 하나요?", answer: "계정 잠금 해제는 고객센터에 문의해주시기 바랍니다." }
    ],
    '뽀송 소개': [
      { question: "뽀송이란 무엇인가요?", answer: "뽀송은 해외 송금 서비스를 제공하는 플랫폼입니다." },
      { question: "뽀송의 주요 기능은 무엇인가요?", answer: "뽀송은 저렴한 수수료로 해외 송금을 제공하며, 다양한 국가에 송금이 가능합니다." },
      { question: "뽀송의 수수료는 어떻게 책정되나요?", answer: "뽀송의 수수료는 송금 금액과 국가에 따라 다르며, 송금 전에 정확한 수수료를 확인할 수 있습니다." },
      { question: "뽀송은 안전한가요?", answer: "뽀송은 금융 당국의 규제를 받으며, 고객의 자산을 안전하게 관리합니다." },
      { question: "뽀송을 통해 송금할 수 있는 국가들은 어디인가요?", answer: "뽀송은 전 세계 50개국 이상에 송금을 지원합니다." },
      { question: "뽀송 서비스의 이용 시간은 어떻게 되나요?", answer: "뽀송 서비스는 24시간 이용 가능하지만, 은행 영업시간에 따라 송금 처리가 지연될 수 있습니다." },
      { question: "뽀송 계정은 어떻게 관리되나요?", answer: "뽀송 계정은 안전하게 관리되며, 로그인 기록은 '내 정보' 페이지에서 확인할 수 있습니다." },
      { question: "뽀송의 고객 서비스는 어떻게 이루어지나요?", answer: "뽀송은 24시간 고객 서비스를 제공하며, 이메일과 전화로 문의가 가능합니다." },
      { question: "뽀송에서 제공하는 환율은 어디서 확인하나요?", answer: "뽀송 웹사이트의 '환율 정보' 페이지에서 실시간 환율을 확인할 수 있습니다." },
      { question: "뽀송 서비스 이용 시 주의사항은 무엇인가요?", answer: "송금 시 정확한 정보 입력이 필요하며, 오류 발생 시 고객센터에 즉시 연락해주시기 바랍니다." }
    ],
    '국가별 안내': [
      { question: "미국으로 송금하려면 어떻게 해야 하나요?", answer: "미국으로 송금하려면 뽀송 계정에 로그인한 후, '송금하기'에서 미국을 선택하고 필요한 정보를 입력하면 됩니다." },
      { question: "영국으로 송금할 때 필요한 서류는?", answer: "영국으로 송금 시 수취인의 은행 계좌 정보와 신분증이 필요합니다." },
      { question: "일본으로 송금 시 주의사항은 무엇인가요?", answer: "일본으로 송금 시, 수취인의 이름과 계좌 정보가 정확해야 하며, 일본어로 입력해야 합니다." },
      { question: "유럽 국가로 송금할 때 수수료는 얼마인가요?", answer: "유럽 국가로의 송금 수수료는 고정된 비율로 부과되며, 송금 금액에 따라 다릅니다." },
      { question: "국가별 송금 한도는 어떻게 되나요?", answer: "각 국가마다 송금 한도가 다르며, 자세한 정보는 뽀송 고객센터를 통해 확인할 수 있습니다." },
      { question: "중국으로 송금 시 필요한 정보는?", answer: "중국으로 송금 시 수취인의 은행 이름, 계좌 번호, SWIFT 코드가 필요합니다." },
      { question: "인도로 송금할 때 유의할 점은?", answer: "인도로 송금할 때는 수취인의 PAN 번호가 필요하며, 세금 관련 문제에 유의해야 합니다." },
      { question: "캐나다로 송금 시 소요 시간은?", answer: "캐나다로 송금 시 평균 1~2 영업일이 소요되며, 공휴일에는 지연될 수 있습니다." },
      { question: "호주로 송금할 때 환율 적용 방식은?", answer: "호주로 송금 시 뽀송의 실시간 환율이 적용되며, 송금 완료 시점의 환율이 기준이 됩니다." },
      { question: "브라질로 송금 시 주의사항은?", answer: "브라질로 송금 시 수취인의 CPF 번호가 필요하며, 세금 문제에 유의해야 합니다." }
    ],
    '송금 신청': [
      { question: "송금 신청 후 처리 시간은 얼마나 걸리나요?", answer: "송금 신청 후 평균적으로 1~2일 이내에 처리가 완료됩니다." },
      { question: "송금 취소는 가능한가요?", answer: "송금이 완료되기 전에만 취소가 가능하며, 취소 시에는 고객센터에 즉시 연락해야 합니다." },
      { question: "송금 확인 방법은?", answer: "송금이 완료되면 이메일 또는 문자로 확인 메시지를 받게 됩니다. 또한, 뽀송 계정에서 거래 내역을 확인할 수 있습니다." },
      { question: "송금 한도는 어떻게 되나요?", answer: "송금 한도는 하루 최대 1만 달러로 제한되며, 한도 초과 시 고객센터로 문의해주세요." },
      { question: "송금 시 수수료는 어떻게 책정되나요?", answer: "송금 수수료는 송금 금액의 1%에서 3% 사이로 책정되며, 송금 국가에 따라 달라질 수 있습니다." },
      { question: "송금 신청 시 어떤 정보를 제공해야 하나요?", answer: "송금 신청 시 수취인의 은행 정보, 송금 금액, 그리고 송금 목적을 제공해야 합니다." },
      { question: "송금이 지연되는 경우는 어떤 경우인가요?", answer: "송금이 지연되는 경우는 은행의 내부 처리 시간이나 공휴일 등으로 인해 발생할 수 있습니다." },
      { question: "송금 상태를 어떻게 확인할 수 있나요?", answer: "송금 상태는 '내 거래' 페이지에서 실시간으로 확인할 수 있습니다." },
      { question: "해외 송금 시 발생할 수 있는 문제는?", answer: "해외 송금 시 수취인의 정보 오류나 중개 은행의 지연 등으로 문제가 발생할 수 있으며, 이 경우 즉시 고객센터에 연락해야 합니다." },
      { question: "송금 완료 후 영수증을 받을 수 있나요?", answer: "송금 완료 후 영수증은 이메일로 자동 발송되며, '내 거래' 페이지에서 다운로드할 수도 있습니다." }
    ]
  };

  // 검색어에 맞는 모든 카테고리의 질문을 필터링
  const filteredFAQs = searchTerm
    ? Object.keys(faqs).flatMap(category => 
        faqs[category].filter(faq => faq.question.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : faqs[selectedCategory]; // 검색어가 없으면 선택된 카테고리의 질문만 표시

  return (
    <>
      <Header />
      <div className="faq-container">
        <h2>안녕하세요, 무엇을 도와드릴까요?</h2>
        <input 
          type="text" 
          placeholder="검색어를 입력해주세요." 
          className="faq-search" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="faq-categories">
          {categories.map(category => (
            <button 
              key={category.id} 
              className={`category-button ${selectedCategory === category.name ? 'active' : ''}`} 
              onClick={() => setSelectedCategory(category.name)}
            >
              {category.name}
            </button>
          ))}
        </div>
        <div className="faq-list">
          {filteredFAQs.map((faq, index) => (
            <div key={index} className="faq-item">
              <h4 className="faq-question">
                {faq.question}
              </h4>
              <p className="faq-answer">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FAQ;
