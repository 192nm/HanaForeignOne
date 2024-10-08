import axios from "axios";
const OCR_URL ="https://e7ql6u6gvo.apigw.ntruss.com/custom/v1/33926/8b02ad24a0d7d652d58a93e9881b3a15b4a66c942a7b8c97baa29195764129d2/general";

let base64String = "";

export const readURL = (input, imgRef) => {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      if (imgRef.current) {
        imgRef.current.src = e.target.result; // useRef로 이미지 요소에 접근
      }
    };
    reader.readAsDataURL(input.files[0]);
  } else {
    if (imgRef.current) {
      imgRef.current.src = "";
    }
  }
};
export const readBase64 = (input, callback, setIsLoading) => {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const result = e.target.result;
      base64String = result.split(",")[1];
      handleSubmit(callback, setIsLoading); // handleSubmit에 setIsLoading 전달
    };
    reader.onerror = function (error) {
      setIsLoading(false); // 에러 발생 시 로딩 종료
      callback(null);
    };
    reader.readAsDataURL(input.files[0]);
  } else {
    setIsLoading(false); // 파일 없을 경우 로딩 종료
    callback(null);
  }
};
const handleSubmit = async (callback, setIsLoading) => {
  try {
    const response = await axios.post(
      OCR_URL,
      {
        version: "V2",
        requestId: "string",
        timestamp: Date.now(),
        lang: "ko",
        images: [
          {
            format: "png",
            data: base64String,
            name: "string",
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-OCR-SECRET": "Z1hKdklITFNERWJCVFdBd3NaZUZiS3lWb2xOVXByTlU=",
        },
      }
    );
    // callback(findSchoolName(response.data.images[0].fields));
    callback(response.data.images[0].fields);
  } catch (error) {
    console.log(error);
  } finally {
    setTimeout(() => {
      setIsLoading(false); // 요청 완료 후 1.5초 후에 로딩 종료
    }, 1000);
  }
};

const findSchoolName = (data) => {
  // 데이터를 순회하며 inferText 속성에서 "학교"로 끝나는 문자열을 찾음
  for (const item of data) {
    if (item.inferText.endsWith("학교")) {
      return item.inferText;
    }
  }
  return null; // "학교"로 끝나는 문자열이 없을 경우
};