import React, { useEffect, useState } from 'react';
import "../../assets/css/Remittance/RemittanceHistory.css";

const RemittanceHistory = () => {
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    // 여기에 데이터를 가져오는 API 호출 로직을 추가할 수 있습니다.
    // 예시 데이터:
    const fetchData = async () => {
      const data = [
        {
          id: 1,
          country: 'JP',
          flag: 'japan-flag.png',
          name: 'sad asd asdasd',
          type: '개인',
          amountKRW: 1000000,
          amountJPY: 108021,
          fileCount: 1,
          fileSize: '531KB',
          status: '서류 검토중',
          date: '2024-09-02 14:36'
        }
      ];
      setHistoryData(data);
    };

    fetchData();
  }, []);

  return (
    <div className="remittance-history-container">
      <h2>송금 내역</h2>
      <div className="remittance-history-filters">
        <input type="date" />
        <input type="date" />
        <input type="text" placeholder="받는 분 이름 혹은 회사명으로 검색" />
        <button>검색</button>
      </div>

      <table className="remittance-history-table">
        <thead>
          <tr>
            <th></th>
            <th>수취인</th>
            <th>송금 금액</th>
            <th>첨부 파일</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          {historyData.length > 0 ? historyData.map((item) => (
            <tr key={item.id}>
              <td>
                <input type="checkbox" />
              </td>
              <td>
                <div className="remittance-recipient-info">
                  <img src={`../../assets/svg/Remittance/${item.flag}`} alt={`${item.country} flag`} />
                  <div>
                    <p>{item.name}</p>
                    <p>{item.type}</p>
                  </div>
                </div>
              </td>
              <td>
                <p>{item.amountKRW.toLocaleString()} KRW</p>
                <p>{item.amountJPY.toLocaleString()} JPY</p>
              </td>
              <td>
                <p>첨부파일 {item.fileCount} 개</p>
                <p>{item.fileSize}</p>
              </td>
              <td>
                <p>{item.status}</p>
                <p>{item.date}</p>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="5">신청 내역이 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="remittance-history-pagination">
        <button>&lt;</button>
        <span>1 / 1</span>
        <button>&gt;</button>
      </div>
    </div>
  );
};

export default RemittanceHistory;
