// src/components/Admin/Admin.js

import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Axios 임포트
import Header from '../../components/Header/Header.js';
import Footer from '../../components/Footer/Footer.js';
import AdminRatio from './AdminRatio.js'; // AdminRatio 컴포넌트 임포트
import '../../assets/css/Admin/Admin.css';

const Admin = () => {
  const [transferRequests, setTransferRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;

  // Result modal state
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultMessage, setResultMessage] = useState('');

  // Fetch transactions when component mounts
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.post('http://localhost:8081/admin/transactions', {}); // 필요한 경우 request body 추가
        console.log('Fetched transactions:', response.data); // 데이터 구조 확인을 위한 로그
        setTransferRequests(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError('데이터를 불러오는 데 실패했습니다.');
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const handleSelectRequest = (request) => {
    if (request.tranStatus === '대기') { // 상태가 '대기'인 경우에만 선택 가능
      setSelectedRequest(request);
    }
  };

  const handleApprove = async () => {
    try {
      // JSON 형태로 TRANSACTION_ID 전송
      const requestBody = { transactionId: selectedRequest.transactionId };
      const response = await axios.post('http://localhost:8081/admin/transactions/approve', requestBody);
      
      console.log(response.data); // "거래가 성공적으로 승인되었습니다."
      
      setTransferRequests(prevRequests =>
        prevRequests.map(request =>
          request.transactionId === selectedRequest.transactionId ? { ...request, tranStatus: '완료' } : request
        )
      );
      setSelectedRequest(null);
      setResultMessage('거래가 성공적으로 승인되었습니다.');
      setShowResultModal(true);
    } catch (err) {
      console.error('Error approving transaction:', err);
      if (err.response && err.response.data) {
        setResultMessage(err.response.data);
      } else {
        setResultMessage('승인 처리 중 오류가 발생했습니다.');
      }
      setShowResultModal(true);
    }
  };

  const handleReject = async () => {
    try {
      // JSON 형태로 TRANSACTION_ID 전송
      const requestBody = { transactionId: selectedRequest.transactionId };
      const response = await axios.post('http://localhost:8081/admin/transactions/reject', requestBody);
      
      console.log(response.data); // "거래가 성공적으로 반려되었습니다."
      
      setTransferRequests(prevRequests =>
        prevRequests.map(request =>
          request.transactionId === selectedRequest.transactionId ? { ...request, tranStatus: '반려' } : request
        )
      );
      setSelectedRequest(null);
      setResultMessage('거래가 성공적으로 반려되었습니다.');
      setShowResultModal(true);
    } catch (err) {
      console.error('Error rejecting transaction:', err);
      if (err.response && err.response.data) {
        setResultMessage(err.response.data);
      } else {
        setResultMessage('거절 처리 중 오류가 발생했습니다.');
      }
      setShowResultModal(true);
    }
  };

  const handleClose = () => {
    setSelectedRequest(null);
  };

  // 상태를 한글로 변환하는 함수
  const translateStatus = (status) => {
    switch (status) {
      case '대기':
        return '대기';
      case '완료':
        return '완료';
      case '반려':
        return '반려';
      default:
        return '알 수 없음';
    }
  };

  // 상태에 따른 CSS 클래스 매핑 함수
  const getStatusClass = (status) => {
    switch (status) {
      case '대기':
        return 'pending';
      case '완료':
        return 'approved';
      case '반려':
        return 'rejected';
      default:
        return '';
    }
  };

  // 날짜와 시간을 줄바꿈하여 포맷하는 함수
  const formatTransactionDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('ko-KR');
    const formattedTime = date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    return (
      <>
        {formattedDate}
        <br />
        {formattedTime}
      </>
    );
  };

  // 페이지네이션 로직
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transferRequests.slice(indexOfFirstTransaction, indexOfLastTransaction);
  const totalPages = Math.ceil(transferRequests.length / transactionsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  return (
    <>
      <Header />
      <main className="admin-page-container">
        <aside className="admin-sidebar">
          <div className="admin-profile">
            {/* <img src="profile.jpg" alt="Admin Profile" /> */}
            <p>Admin 관리자님!</p>
          </div>
          <nav className="admin-menu">
            <a href="#">대시보드</a>
            <a href="#">심사리스트</a>
            <a href="#">메일 보내기</a>
            <a href="#">기타</a>
          </nav>
        </aside>
        <section className="admin-main">
          <AdminRatio /> {/* 4대 주요 국가 환율 */}
          <div className="admin-table">
            {/* <h3>심사 리스트</h3> */}
            {loading ? (
              <p>데이터를 로딩 중입니다...</p>
            ) : error ? (
              <p className="error-message">{error}</p>
            ) : (
              <>
                <table>
                  <thead>
                    <tr>
                      <th>아이디</th>
                      <th>송금인 성명</th> {/* 송금인 이름 */}
                      <th>송금인 계좌번호</th>
                      <th>수취인 성명</th> {/* 수취인 이름 */}
                      <th>수취인 계좌번호</th>
                      <th>통화</th>
                      <th>거래액</th>
                      <th>신청일</th>
                      <th>승인상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTransactions.length > 0 ? (
                      currentTransactions.map(request => (
                        <tr key={request.transactionId} onClick={() => handleSelectRequest(request)}>
                          <td>{request.id || '-'}</td> {/* 사용자 ID 표시 */}
                          <td>{request.senderName || '-'}</td> {/* 송금인 이름 표시 */}
                          <td>{request.sdAccount || '-'}</td>
                          <td>{request.receiverName || '-'}</td> {/* 수취인 이름 표시 */}
                          <td>{request.rcAccount || '-'}</td>
                          <td>{request.currencyCode || '-'}</td>
                          <td>
                            {request.amount !== null && request.amount !== undefined
                              ? request.amount.toLocaleString()
                              : '-'}
                          </td>
                          <td className="transaction-date">
                            {formatTransactionDate(request.transactionDate)}
                          </td>
                          <td>
                            <span className={`status-label ${getStatusClass(request.tranStatus)}`}>
                              {translateStatus(request.tranStatus)}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" style={{ textAlign: 'center' }}>
                          데이터가 없습니다.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                {/* 페이지네이션 컨트롤 */}
                <div className="pagination-controls">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="pagination-button"
                  >
                    이전
                  </button>
                  <span className="pagination-info">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="pagination-button"
                  >
                    다음
                  </button>
                </div>
              </>
            )}
          </div>
        </section>

        {/* 거래 승인/반려 모달 */}
        {selectedRequest && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="close-button" onClick={handleClose}>X</button>
              <h2>거래 승인/거절</h2>
              <table className="modal-table">
                <tbody>
                  <tr>
                    <th>아이디</th>
                    <td>{selectedRequest.id || '-'}</td>
                  </tr>
                  <tr>
                    <th>송금인 성명</th>
                    <td>{selectedRequest.senderName || '-'}</td>
                  </tr>
                  <tr>
                    <th>통화 코드</th>
                    <td>{selectedRequest.currencyCode || '-'}</td>
                  </tr>
                  <tr>
                    <th>거래일</th>
                    <td>{formatTransactionDate(selectedRequest.transactionDate)}</td>
                  </tr>
                  <tr>
                    <th>거래액</th>
                    <td>{selectedRequest.amount !== null && selectedRequest.amount !== undefined ? selectedRequest.amount.toLocaleString() : '-'}</td>
                  </tr>
                  <tr>
                    <th>KRW 거래액</th>
                    <td>{selectedRequest.amountInKrw !== null && selectedRequest.amountInKrw !== undefined ? selectedRequest.amountInKrw.toLocaleString() : '-'}</td>
                  </tr>
                  <tr>
                    <th>수취인 계좌번호</th>
                    <td>{selectedRequest.rcAccount || '-'}</td>
                  </tr>
                  <tr>
                    <th>송금인 계좌번호</th>
                    <td>{selectedRequest.sdAccount || '-'}</td>
                  </tr>
                  <tr>
                    <th>수취인 성명</th>
                    <td>{selectedRequest.receiverName || '-'}</td>
                  </tr>
                  <tr>
                    <th>승인 상태</th>
                    <td>{translateStatus(selectedRequest.tranStatus)}</td>
                  </tr>
                </tbody>
              </table>
              <div className="modal-actions">
                <button onClick={handleApprove} className="approve-button">승인</button>
                <button onClick={handleReject} className="reject-button">거절</button>
              </div>
            </div>
          </div>
        )}

        {/* 결과 모달 */}
        {showResultModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
              <h2 className="text-xl font-semibold mb-4">알림</h2>
              <p className="mb-6">{resultMessage}</p>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                onClick={() => setShowResultModal(false)}
              >
                확인
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default Admin;
