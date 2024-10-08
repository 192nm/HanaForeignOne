const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 4000;

app.use(cors());

app.get('/api/exchange', async (req, res) => {
  try {
    const { searchdate, authkey, data } = req.query;
    
    // 요청 파라미터 로그 출력
    console.log('Request Parameters:', { searchdate, authkey, data });

    const response = await axios.get('https://www.koreaexim.go.kr/site/program/financial/exchangeJSON', {
      params: {
        searchdate,
        authkey,
        data
      }
    });

    // API 응답 로그 출력
    console.log('API Response:', response.data);

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data from API:', error);

    // 상세한 오류 메시지를 클라이언트에 전달
    res.status(500).json({ message: 'Failed to fetch data from API', error: error.toString() });
  }
});

app.listen(port, () => {
  console.log(`Proxy server running on http://localhost:${port}`);
});
