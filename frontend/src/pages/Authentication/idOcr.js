const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json({ limit: '50mb' })); // 이미지 데이터가 클 수 있으므로, 본문 크기 제한을 늘립니다.

const CLIENT_ID = 'YOUR_CLIENT_ID';
const CLIENT_SECRET = 'bGlWZEtPRm5nSFdOa0ZsRWtVQVlscmNzUlFyaVdDclU='; // 시크릿 키 (주의: 보안상 안전하게 관리해야 합니다)

app.post('/ocr', async (req, res) => {
  const imageBase64 = req.body.image; // 클라이언트에서 전달된 이미지 데이터 (Base64)

  try {
    const response = await axios.post('https://clovaocr-api-url/ocr', {
      headers: {
        'X-NCP-APIGW-API-KEY-ID': CLIENT_ID,
        'X-NCP-APIGW-API-KEY': CLIENT_SECRET,
        'Content-Type': 'application/json',
      },
      data: {
        version: "V2", // 사용할 OCR 버전
        requestId: "unique_request_id", // 요청 ID (선택 사항)
        timestamp: new Date().getTime(), // 현재 시간 (타임스탬프)
        images: [
          {
            format: "jpg", // 이미지 형식
            name: "image", // 이미지 이름
            data: imageBase64 // Base64로 인코딩된 이미지 데이터
          }
        ]
      }
    });

    // OCR 결과를 클라이언트로 반환
    res.json(response.data);
  } catch (error) {
    console.error('OCR 처리 중 오류가 발생했습니다:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'OCR 처리 중 오류가 발생했습니다.' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
