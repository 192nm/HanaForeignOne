import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import {
  Box,
  Flex,
  Text,
  Container,
  Center,
  Button,
  Heading,
} from '@chakra-ui/react';

import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import WalletCard from './WalletCard';
import ExchangeModal from './ExchangeModal'; // 이전에 만든 모달 컴포넌트

const Exchange = () => {
  const location = useLocation();
  const { walletData } = location.state || {};
  
  const [selectedWallet, setSelectedWallet] = useState(null); // 선택된 지갑 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리

  // 모달 열기 핸들러
  const openModal = (wallet) => {
    setSelectedWallet(wallet); // 선택된 지갑 설정
    setIsModalOpen(true); // 모달 열기
  };

  // 모달 닫기 핸들러
  const closeModal = () => {
    setIsModalOpen(false); // 모달 닫기
    setSelectedWallet(null); // 선택된 지갑 초기화
  };

  return (
    <>
      <Header />
      <Container maxW="1200px" py={4}>
        <Heading as="h2" size="xl" mb={6} textAlign="center">
          나의 통화지갑
        </Heading>

        <Flex justify="center">
          {/* 메인 컨텐츠 */}
          <Box
            flex={1}
            bg="white"
            p={6}
            borderRadius="lg"
            boxShadow="lg"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            maxW="800px"
            w="100%"
          >
            {walletData && walletData.length > 0 ? (
              <Center>
                <Swiper
                  spaceBetween={10}
                  slidesPerView={1}
                  loop={true}
                  navigation={true}
                  modules={[Navigation]}
                  style={{ height: '100%', width: '100%' }}
                >
                  {walletData.map((wallet, index) => (
                    <SwiperSlide
                      key={index}
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        textAlign: 'center',
                      }}
                    >
                      <WalletCard wallet={wallet} />
                      {/* 환전하기 버튼 */}
                      {/* <Button
                        colorScheme="teal"
                        mt={4}
                        onClick={() => openModal(wallet)}
                      >
                        환전하기
                      </Button> */}
                    </SwiperSlide>
                  ))}
                </Swiper>
              </Center>
            ) : (
              <Text textAlign="center" color="gray.500">
                통화지갑 데이터가 없습니다.
              </Text>
            )}
          </Box>
        </Flex>
      </Container>

      {/* 모달이 열릴 때만 ExchangeModal을 보여줍니다 */}
      {isModalOpen && (
        <ExchangeModal wallet={selectedWallet} onClose={closeModal} />
      )}

      <Footer />
    </>
  );
};

export default Exchange;
