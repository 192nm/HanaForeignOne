import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const LogRemi = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("3months");
  const [currentPage, setCurrentPage] = useState(1);
  const [remittanceData, setRemittanceData] = useState([]);
  const itemsPerPage = 10; // 한 페이지에 보여줄 항목 수

  // 리덕스에서 userId와 isLoggedIn 가져오기
  const { userId, isLoggedIn } = useSelector((state) => state.auth);

  // API 요청 함수
  const fetchRemittanceData = async () => {
    if (!userId) return; // userId가 없으면 API 호출을 중지
    try {
      const response = await axios.post(
        "http://localhost:8081/remiLogGet",
        { id: userId }, // POST 요청 데이터
        {
          headers: {
            "Content-Type": "application/json", // 명시적으로 JSON 요청임을 알림
          },
        }
      );
      setRemittanceData(response.data);
    } catch (error) {
      console.error("Failed to fetch remittance data", error);
    }
  };

  // 컴포넌트가 마운트될 때와 userId가 변경될 때마다 API 호출
  useEffect(() => {
    if (isLoggedIn) {
      fetchRemittanceData();
    }
  }, [userId, isLoggedIn]);

  // 현재 페이지에 해당하는 데이터 가져오기
  const currentData = remittanceData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 총 페이지 수 계산
  const totalPages = Math.ceil(remittanceData.length / itemsPerPage);

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white rounded-xl shadow-md">
      <h1 className="text-3xl font-bold mb-4 text-center">송금거래내역</h1>

      {/* 조회 기간 버튼 */}
      <div className="flex justify-end gap-5 mb-6">
        <button
          className={`px-4 py-2 ${
            selectedPeriod === "3months"
              ? "bg-hana text-white hover:opacity-80 duration-200"
              : "bg-gray-200 hover:opacity-80 duration-200"
          }`}
          onClick={() => handlePeriodChange("3months")}
        >
          지난3개월
        </button>
        <button
          className={`px-4 py-2 ${
            selectedPeriod === "6months" ? "bg-hana text-white" : "bg-gray-200"
          }`}
          onClick={() => handlePeriodChange("6months")}
        >
          지난6개월
        </button>
        <button
          className={`px-4 py-2 ${
            selectedPeriod === "1year" ? "bg-hana text-white" : "bg-gray-200"
          }`}
          onClick={() => handlePeriodChange("1year")}
        >
          지난1년
        </button>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">송금인</th>
              <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">송금인 계좌번호</th>
              <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">수취인</th>
              <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">수취인 계좌번호</th>
              <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">통화</th>
              <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">송금액</th>
              <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">신청일</th>
              <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">승인상태</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((data, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">{data.senderName}</td>
                  <td className="border border-gray-300 px-4 py-2">{data.senderAccount}</td>
                  <td className="border border-gray-300 px-4 py-2">{data.recipientName}</td>
                  <td className="border border-gray-300 px-4 py-2">{data.recipientAccount}</td>
                  <td className="border border-gray-300 px-4 py-2">{data.currencyCode}</td>
                  <td className="border border-gray-300 px-4 py-2">{data.amount}</td>
                  <td className="border border-gray-300 px-4 py-2">{new Date(data.transactionDate).toLocaleString()}</td>
                  <td className="border border-gray-300 px-4 py-2">{data.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="border border-gray-300 px-4 py-2 text-center">
                  송금 내역이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-20 items-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-4 py-2 bg-gray-200"
          disabled={currentPage === 1}
        >
          이전
        </button>
        <span className="text-gray-600">{currentPage}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-4 py-2 bg-gray-200"
          disabled={currentPage === totalPages}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default LogRemi;
