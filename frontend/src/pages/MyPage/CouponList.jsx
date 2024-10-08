import { Button, Modal, ModalContent, ModalOverlay } from "@chakra-ui/react";
import React from "react";

const CouponModal = ({ onClose, isOpen }) => {
  // 샘플 쿠폰 데이터
  const coupons = [
    {
      number: "COUPON123",
      expiryDate: "2023-12-31",
      content: "우대율 10% 할인",
    },
    {
      number: "COUPON456",
      expiryDate: "2024-01-31",
      content: "우대율 10% 할인",
    },
    // 추가 쿠폰 정보를 원하시면 여기에 더 추가하실 수 있습니다.
  ];

  return (
        <div className="p-5">
          <h2 className="text-2xl font-bold mb-5">내 쿠폰함</h2>
          <div className="space-y-4">
            {coupons.map((coupon, index) => (
              <div key={index} className="p-4 border rounded-md">
                <p>
                  <strong>쿠폰번호:</strong> {coupon.number}
                </p>
                <p>
                  <strong>유효기간:</strong> {coupon.expiryDate}
                </p>
                <p>
                  <strong>내용:</strong> {coupon.content}
                </p>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={onClose}>닫기</Button>
          </div>
        </div>
  );
};

export default CouponModal;
