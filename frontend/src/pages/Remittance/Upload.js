import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const Upload = ({ onBackClick, onNextClick }) => {
  const [files, setFiles] = useState([]);
  const [recipientName, setRecipientName] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/jpeg, image/png, application/pdf',
    maxFiles: 20,
    maxSize: 20 * 1024 * 1024, // 20MB
  });

  const handleNameChange = (e) => {
    setRecipientName(e.target.value);
  };

  const handleNextClick = () => {
    onNextClick(recipientName, files);
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-lg w-full max-w-xl mx-auto box-border text-center">
      <h2 className="text-2xl font-bold mb-5">문서 업로드</h2>
      <div
        {...getRootProps()}
        className={`bg-gray-100 p-10 rounded-lg border-2 border-dashed ${
          isDragActive ? 'bg-teal-100 border-teal-400' : 'border-gray-300'
        } flex flex-col items-center justify-center transition-colors duration-300`}
      >
        <input {...getInputProps()} />
        <div className="text-6xl text-gray-500 mb-5">
          <i className="fa fa-upload" aria-hidden="true"></i>
        </div>
        <p>파일탐색창에서 선택하여 인보이스 업로드</p>
        <p>또는 드래그 앤 드롭을 통해 인보이스를 업로드 할 수 있습니다.</p>
        <p>인보이스는 1회 송금당 최대 20개까지 첨부 가능합니다.</p>
        <p>허용되는 파일 형식: PDF, JPG, JPEG, PNG / 파일 제한 크기: 20MB</p>
      </div>
      <div className="mt-5 text-left text-sm text-gray-700">
        {files.map((file) => (
          <div key={file.path}>
            {file.path} - {file.size} bytes
          </div>
        ))}
      </div>
      <div className="mt-10 text-left text-sm text-gray-700">
        <div className="mb-3">
          <label className="font-bold text-base mb-1 block">받는 분 통장에 표시</label>
          <input
            type="text"
            placeholder="받는 분 통장에 표시"
            value={recipientName}
            onChange={handleNameChange}
            className="w-full p-2 text-base border border-gray-300 rounded-md"
          />
        </div>
        <div className="text-xs text-gray-500 space-y-2">
          <p>※ ‘받는 분 통장에 표시’를 입력하지 않는 경우, 개인사업자는 사업자명이 아닌 개인명으로 표기 됩니다.</p>
          <p>※ 수취은행에 따라 받는분 통장에 표시에 입력하신 내용이 나오지 않거나 표기방식이 달라질 수 있습니다.</p>
          <p>※ 개별 코드를 요청하는 학비송금의 경우, 받는 분 통장에 표시영역에 개별코드를 입력해주세요.</p>
          <p>- 개별 코드 예시: student id, customer reference number, transfer reference 등</p>
        </div>
      </div>
      <div className="mt-5 flex justify-between">
        <button
          type="button"
          onClick={onBackClick}
          className="bg-gray-300 text-white py-2 px-4 rounded-md"
        >
          이전 단계
        </button>
        <button
          type="button"
          onClick={handleNextClick}
          className="bg-blue-500 text-white py-2 px-4 rounded-md"
        >
          다음 단계
        </button>
      </div>
    </div>
  );
};

export default Upload;
