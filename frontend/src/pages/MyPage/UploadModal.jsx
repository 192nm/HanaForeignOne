// src/components/UploadModal.js

import {
  Button,
  Box,
  Flex,
  Text,
  Image,
  Spinner,
  VStack,
  Divider,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from "@chakra-ui/react";
import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { readBase64 } from "../../js/imgOCR";
import { useSelector } from "react-redux";

const UploadModal = ({ onBackClick, onNextClick, setModalSize }) => {
  const [files, setFiles] = useState([]);
  const [ocrResults, setOcrResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // 두 번째 API 호출 로딩 상태

  // Redux 스토어에서 userId 가져오기 (auth 슬라이스 사용)
  const userId = useSelector((state) => state.auth.userId);

  // 전체 상태를 콘솔에 출력하여 구조 확인
  const state = useSelector((state) => state);
  useEffect(() => {
    console.log("Redux State:", state);
    console.log("User ID:", userId);
  }, [state, userId]);

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles);
    setOcrResults([]);
    setIsLoading(true);
    readBase64(acceptedFiles, setOcrResults, setIsLoading); // OCR 처리 로직 호출
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "application/pdf": [".pdf"],
    },
    maxFiles: 20,
    maxSize: 20 * 1024 * 1024, // 20MB
  });

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setOcrResults([]);
    setIsLoading(true);
    readBase64(e.target, setOcrResults, setIsLoading);
  };

  const handleNextClick = () => {
    onNextClick(files);
  };

  // ocrResults를 하나의 문자열로 결합
  const ocrText = useMemo(
    () => ocrResults.map((result) => result.inferText).join(" "),
    [ocrResults]
  );

  // Chakra UI의 useDisclosure 훅 사용하여 모달 제어
  const {
    isOpen: isSuccessOpen,
    onOpen: onSuccessOpen,
    onClose: onSuccessClose,
  } = useDisclosure();

  const {
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onClose: onConfirmClose,
  } = useDisclosure();

  // "등록하기" 버튼 클릭 시 첫 번째 API 호출 (/upload) 후 모달 열기
  const handleRegisterClick = async () => {
    if (!userId) {
      alert("사용자 ID를 찾을 수 없습니다.");
      return;
    }

    const data = { userId, ocrText };

    try {
      const response = await fetch("http://localhost:8081/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("서버 응답이 올바르지 않습니다.");
      }

      // 첫 번째 API 호출 성공 시 확인 모달 열기
      onConfirmOpen();
    } catch (error) {
      console.error("서류 등록 중 오류 발생:", error);
      alert("서류 등록 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  // 모달에서 "확인" 버튼 클릭 시 두 번째 API 호출 (/update)
  const handleModalConfirm = async () => {
    onConfirmClose();

    if (files.length === 0) {
      alert("첨부할 파일이 없습니다.");
      return;
    }

    setIsSubmitting(true); // 로딩 상태 시작

    const formData = new FormData();
    formData.append("id", userId);
    formData.append("attachedImage", files[0]); // 첫 번째 파일만 첨부

    try {
      const response = await fetch("http://localhost:8081/update", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("서버 응답이 올바르지 않습니다.");
      }

      // 두 번째 API 호출 성공 시 성공 모달 열기
      onSuccessOpen();
    } catch (error) {
      console.error("서류 업데이트 중 오류 발생:", error);
      alert("서류 업데이트 중 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false); // 로딩 상태 종료
    }
  };

  // 성공 모달에서 "확인" 버튼 클릭 시 처리
  const handleSuccessConfirm = () => {
    onSuccessClose();
    onBackClick();
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="center" p={4}>
      <Box
        bg="white"
        p={6}
        w="full"
        maxW="5xl"
        mx="auto"
        boxSizing="border-box"
        textAlign="center"
        position="relative"
        borderRadius="md"
        boxShadow="lg"
      >
        <Button
          position="absolute"
          top="4"
          right="4"
          variant="ghost"
          colorScheme="gray"
          onClick={onBackClick}
        >
          <i className="fas fa-times"></i>
        </Button>

        {/* 파일 업로드 전: 간단한 업로드 인터페이스 */}
        {files.length === 0 && !isLoading && (
          <>
            <Text fontSize="2xl" fontWeight="bold" mb={5}>
              서류 업로드
            </Text>
            <Box
              {...getRootProps()}
              bg={isDragActive ? "teal.100" : "gray.100"}
              p={10}
              border="2px dashed"
              borderColor={isDragActive ? "teal.400" : "gray.300"}
              borderRadius="lg"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              transition="background-color 0.3s, border-color 0.3s"
              cursor="pointer"
            >
              <input {...getInputProps()} />
              <Box fontSize="6xl" color="gray.500" mb={5}>
                <i className="fa fa-upload" aria-hidden="true"></i>
              </Box>
              <Text>파일 탐색창에서 선택하여 서류를 업로드</Text>
              <Text>
                또는 드래그 앤 드롭을 통해 서류를 업로드 할 수 있습니다.
              </Text>
              <Text>
                허용되는 파일 형식: PDF, JPG, JPEG, PNG / 파일 제한 크기: 20MB
              </Text>
            </Box>
            <Box mt={5} textAlign="left" fontSize="sm" color="gray.700">
              {files.map((file) => (
                <Box key={file.path}>
                  {file.path} - {(file.size / 1024).toFixed(2)} KB
                </Box>
              ))}
            </Box>
            <Box mt={10} textAlign="left" fontSize="sm" color="gray.700">
              <VStack align="start" spacing={2} fontSize="xs" color="gray.500">
                <Text>
                  ※ 서류를 업로드하실 때, 정확한 정보를 입력해 주시기 바랍니다.
                </Text>
                <Text>
                  ※ 서류에 따라 추가 정보가 필요할 수 있으니, 필요한 경우 추가
                  서류를 제출해 주세요.
                </Text>
                <Text>※ 개별 코드가 필요한 경우, 정확히 입력해 주세요.</Text>
                <Text>
                  - 개별 코드 예시: 학생 번호, 고객 참조 번호, 서류 참조 번호 등
                </Text>
              </VStack>
            </Box>
            <Flex justify="center" mt={6}>
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/jpeg, image/png, image/jpg, application/pdf"
                multiple
                style={{ display: "none" }}
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button colorScheme="teal" as="span">
                  파일 선택
                </Button>
              </label>
            </Flex>
          </>
        )}

        {/* 파일 업로드 후: 이미지 렌더링 및 요약된 OCR 결과 줄글 표시 */}
        {files.length > 0 && (
          <>
            <Flex
              direction={["column", "row"]}
              align="flex-start"
              justify="space-between"
              mb={5}
            >
              {/* 왼쪽: 업로드된 서류 텍스트와 이미지 */}
              <Box flex="1" mr={5} mb={[5, 0]} position="relative">
                <Text fontSize="2xl" fontWeight="bold" mb={3}>
                  업로드된 서류
                </Text>
                {files.map((file, index) => (
                  <Box key={index} mb={4} position="relative" height="300px">
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={`Uploaded ${file.name}`}
                      width="100%"
                      height="300px"
                      objectFit="contain"
                      borderRadius="md"
                      shadow="md"
                    />
                    {/* 스캔 애니메이션 */}
                    {isLoading && (
                      <Box
                        position="absolute"
                        top="0"
                        left="0"
                        width="100%"
                        height="100%"
                        pointerEvents="none"
                      >
                        <Box
                          position="absolute"
                          top="0"
                          left="0"
                          width="100%"
                          height="2px"
                          bg="teal.400"
                          className="scan-animation"
                        />
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>

              {/* 세로 구분선 추가 */}
              <Divider
                orientation="vertical"
                borderColor="slate.500"
                height="auto"
              />

              {/* 오른쪽: OCR 요약 결과 텍스트와 OCR 결과 */}
              <Box flex="1" ml={5}>
                <Text fontSize="2xl" fontWeight="bold" mb={3}>
                  OCR 요약 결과
                </Text>
                {isLoading ? (
                  <Flex alignItems="center">
                    <Spinner mr={2} />
                    <Text>OCR 처리 중...</Text>
                  </Flex>
                ) : ocrResults.length > 0 ? (
                  <Box
                    p={4}
                    borderWidth="1px"
                    borderRadius="md"
                    shadow="sm"
                    bg="gray.50"
                    maxH="300px"
                    overflowY="auto"
                    width="100%"
                  >
                    {/* OCR 결과를 하나의 줄글 형태로 표시 */}
                    <Text fontSize="sm" whiteSpace="pre-wrap">
                      {ocrText}
                    </Text>
                  </Box>
                ) : (
                  <Text>OCR 결과가 없습니다.</Text>
                )}
              </Box>
            </Flex>

            {/* 추가 안내 및 네비게이션 버튼 */}
            <Box mt={10} textAlign="center">
              <Text fontSize="lg" mb={4}>
                OCR 결과를 확인하고 맞다면 등록하기를 눌러주세요
              </Text>
              <Flex justify="center" mt={4} gap={4}>
                <Button onClick={onBackClick} colorScheme="gray">
                  닫기
                </Button>
                <Button
                  onClick={handleRegisterClick} // 등록하기 버튼 클릭 시 첫 번째 API 호출
                  colorScheme="teal"
                  isDisabled={isLoading || !userId} // userId가 없을 때 버튼 비활성화
                >
                  등록하기
                </Button>
              </Flex>
            </Box>
          </>
        )}

        {/* 스캔 애니메이션 추가 */}
        <style jsx>{`
          @keyframes scan {
            0% {
              top: 0;
            }
            100% {
              top: 100%;
            }
          }
          .scan-animation {
            animation: scan 2s linear infinite;
          }
        `}</style>

        {/* 확인 모달 추가 */}
        <Modal isOpen={isConfirmOpen} onClose={onConfirmClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>등록 완료</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>서류 등록이 완료되었습니다! 첨부 파일을 업데이트하시겠습니까?</Text>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onConfirmClose}>
                취소
              </Button>
              <Button
                colorScheme="teal"
                onClick={handleModalConfirm}
                isLoading={isSubmitting} // 로딩 상태 표시
              >
                확인
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* 성공 등록 모달 추가 */}
        <Modal isOpen={isSuccessOpen} onClose={handleSuccessConfirm} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>업데이트 완료</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>서류 업데이트가 완료되었습니다!</Text>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="teal" mr={3} onClick={handleSuccessConfirm}>
                확인
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
};

export default UploadModal;
