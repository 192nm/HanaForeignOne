import React, { useState } from 'react';
import ExchangeModal from './ExchangeModal'; // 모달 컴포넌트 가져오기
import {
  Box,
  Button,
  Heading,
  Text,
  Stack,
} from '@chakra-ui/react';

const WalletCard = ({ wallet }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <Box
      bg="white"
      p={5}
      borderRadius="lg"
      boxShadow="lg"
      w="100%"
      maxW="500px"
      textAlign="center"
    >
      <Stack spacing={3}>
        <Heading size="md">{wallet.currencyCode}</Heading>
        <Text>
          잔액: {wallet.symbol} {wallet.amountInKrw?.toLocaleString()} {wallet.currencyCode}
        </Text>
        <Text>계좌 번호: {wallet.accountNo}</Text>
        <Text>
          현재 환율로 원화: {wallet.amountInKrw?.toLocaleString()} KRW
        </Text>

        <Button
                        colorScheme="teal"
                        mt={4}
                        onClick={() => openModal(wallet)}
                      >
                        환전하기
                      </Button>

        {isModalOpen && <ExchangeModal wallet={wallet} onClose={closeModal} />}
      </Stack>
    </Box>
  );
};

export default WalletCard;
