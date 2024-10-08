import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../assets/css/MyPage/MyPage.css";
import "../../assets/css/MyPage/Wallet.css";
import Header from "../../components/Header/Header.js";
import Footer from "../../components/Footer/Footer.js";
import noprofile from "../../assets/svg/MyPage/noprofile.png";
import { setShowWallet } from "../../redux/authSlice"; // Redux 액션 추가

import USD from "../../assets/svg/MyPage/usa.png";
import EUR from "../../assets/svg/MyPage/europe.png";
import JPY from "../../assets/svg/MyPage/japan.jpg";
import CNY from "../../assets/svg/MyPage/china.png";
import KRW from "../../assets/svg/MyPage/korea.png";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import ExchangeModal from "../Exchange/ExchangeModal.jsx";
import UploadModal from "./UploadModal.jsx"; // UploadModal에 onClose 전달
import SetAlertModal from "./SetAlert.jsx"; // 이 파일을 ExchangeRateAlertModal.jsx로 수정합니다.
import CouponListModal from "./CouponList.jsx";

// ExchangeRateAlertModal 컴포넌트 import
import ExchangeRateAlertModal from "./SetAlert.jsx";

const MyPage = () => {
  const [userProfile, setUserProfile] = useState({
    name: "홍길동",
    email: "honggildong@example.com",
    phone: "010-1234-5678",
    address: "서울특별시 강남구 테헤란로 123",
    profileImage: noprofile,
  });

  const currencyImages = {
    USD: USD,
    EUR: EUR,
    JPY: JPY,
    CNY: CNY,
    KRW: KRW,
  };

  const getCurrencyImage = (currencyCode) => {
    return currencyImages[currencyCode] || noprofile;
  };

  const [walletData, setWalletData] = useState([]); // API로 받아온 데이터 저장
  const [selectedCurrency, setSelectedCurrency] = useState(null); // 선택된 통화 데이터
  const [exchangeRates, setExchangeRates] = useState([]);
  const [exchangeTransactions, setExchangeTransactions] = useState([]); // Exchange transactions state
  const [transferTransactions, setTransferTransactions] = useState([]); // Transfer transactions state
  const [loading, setLoading] = useState(true);
  const [walletExists, setWalletExists] = useState(null); // 초기값을 null로 설정 (명확한 상태 확인)
  const [currentIndex, setCurrentIndex] = useState(0);

  const userId = useSelector((state) => state.auth.userId);
  const dispatch = useDispatch(); // Redux dispatch 추가
  const showWallet = useSelector((state) => state.auth.showWallet); // Redux에서 showWallet 상태 가져오기
  const navigate = useNavigate();

  const { onOpen, isOpen, onClose } = useDisclosure();

  const [selectModal, setSelectModal] = useState(0);

  const [modalSize, setModalSize] = useState("2xl");

  const [transactionType, setTransactionType] = useState("exchange");

  useEffect(() => {
    console.log("userId:", userId);

    if (!userId) {
      navigate("/");
      return;
    }

    const fetchUserProfile = async () => {
      console.log(userId);
      try {
        const response = await axios.post("http://localhost:8081/getUserProfile", {
          id: userId,
        });

        const userData = response.data[0];
        console.log("User data fetched:", userData);

        const profileImage = userData.profile
          ? `data:image/jpeg;base64,${userData.profile}`
          : noprofile;
        setUserProfile((prevState) => ({
          ...prevState,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          address: userData.address,
          profileImage: profileImage,
        }));
      } catch (error) {
        console.error("유저 정보를 불러오는 중 오류가 발생했습니다.", error);
      }
    };

    const fetchWalletData = async () => {
      try {
        const response = await axios.post("http://localhost:8081/walletInfoById", {
          id: userId,
        });
        console.log("Wallet data fetched:", response.data);
        setWalletData(response.data);
        setSelectedCurrency(response.data[0]?.currencyCode || null);
      } catch (error) {
        console.error("지갑 정보를 불러오는 중 오류가 발생했습니다.", error);
      }
    };

    const fetchExchangeRates = async () => {
      try {
        const response = await axios.post("http://localhost:8081/realtime4");
        console.log("Exchange rates fetched:", response.data);
        setExchangeRates(response.data);
        setLoading(false);
      } catch (error) {
        console.error("환율 정보를 불러오는 중 오류가 발생했습니다.", error);
        setLoading(false);
      }
    };

    const fetchExchangeTransactions = async () => {
      try {
        const response = await axios.post(
          `http://localhost:8081/getFxLogById?id=${userId}`
        );
        console.log("Exchange transactions fetched:", response.data);
        setExchangeTransactions(response.data);
      } catch (error) {
        console.error("환전 내역을 불러오는 중 오류가 발생했습니다.", error);
      }
    };

    const fetchTransferTransactions = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8081/getRemiLogById",
          null,
          {
            params: { id: userId },
          }
        );
        console.log("Transfer transactions fetched:", response.data);
        setTransferTransactions(response.data);
      } catch (error) {
        console.error("송금 내역을 불러오는 중 오류가 발생했습니다.", error);
      }
    };

    const checkWalletExistence = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8081/walletOkExist",
          userId,
          {
            headers: {
              "Content-Type": "text/plain",
            },
          }
        );
        console.log("walletExists 값:", response.data);
        setWalletExists(parseInt(response.data));
      } catch (error) {
        console.error("지갑 정보를 확인하는 중 오류가 발생했습니다.", error);
      }
    };

    fetchUserProfile();
    fetchWalletData();
    fetchExchangeRates();
    fetchExchangeTransactions(); // Fetch exchange transactions
    fetchTransferTransactions(); // Fetch transfer transactions
    checkWalletExistence();
  }, [userId, navigate]);

  useEffect(() => {
    if (showWallet) {
      alert("지갑 생성이 완료되었습니다.");
      dispatch(setShowWallet(false));
    }
  }, [showWallet, dispatch]);

  const handleProfileClick = () => {
    document.getElementById("profileInput").click();
  };

  const handleProfileUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("id", userId);
    formData.append("profileImage", file);

    try {
      await axios.post("http://localhost:8081/updateUserProfile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const reader = new FileReader();
      reader.onload = () => {
        setUserProfile((prevState) => ({
          ...prevState,
          profileImage: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("프로필 이미지를 업로드하는 중 오류가 발생했습니다.", error);
    }
  };

  useEffect(() => {
    console.log(currentIndex);
  }, [currentIndex]);

  const handleTabChange = (currency, index) => {
    setSelectedCurrency(currency);
    setCurrentIndex(index);
  };

  const handleAccountCreation = () => {
    console.log("handleAccountCreation triggered with userId:", userId);
    if (!userId) {
      alert("로그인 후 이용가능한 서비스입니다.");
      navigate("/login");
    } else {
      navigate("/create-wallet");
    }
  };

  const currentWalletData = walletData.find(
    (wallet) => wallet.currencyCode === selectedCurrency
  );

  const handleModal = (idx) => {
    setSelectModal(idx);
    setModalSize("4xl");
    onOpen();
  };

  // 표시할 거래 내역을 선택
  const displayedTransactions =
    transactionType === "exchange"
      ? exchangeTransactions
      : transferTransactions;

  // 총 자산을 계산하는 useMemo 훅 추가
  const totalAssets = useMemo(() => {
    return walletData.reduce((sum, wallet) => {
      const amount = parseFloat(wallet.amountInKrw);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
  }, [walletData]);

  return (
    <>
      <main className="flex p-5 justify-center">
        <section className="myPage-content">
          <div className="myPage-profileSection">
            <div className="flex flex-col gap-4">
              <div className="profile-info">
                <div
                  className="profile-image-container"
                  onClick={handleProfileClick}
                >
                  <img
                    src={userProfile.profileImage}
                    alt="프로필 사진"
                    className="profile-image-mypage"
                  />
                  <input
                    type="file"
                    id="profileInput"
                    style={{ display: "none" }}
                    onChange={handleProfileUpload}
                  />
                </div>
                <div>
                  <h2 className="profile-name">{userProfile.name}</h2>
                  <p className="profile-email">{userProfile.email}</p>
                  <p className="profile-phone">{userProfile.phone}</p>
                  <p className="profile-address">{userProfile.address}</p>
                </div>
              </div>
              <div className="profile-buttons">
                <button
                  className="profile-button"
                  onClick={() => {
                    handleModal(3);
                  }}
                >
                  환율알림
                </button>
                <button
                  className="profile-button"
                  onClick={() => {
                    handleModal(2);
                  }}
                >
                  쿠폰목록
                </button>
                <button
                  className="profile-button"
                  onClick={() => {
                    handleModal(0);
                  }}
                >
                  서류등록
                </button>
                <button
                  className="profile-button"
                  onClick={handleAccountCreation}
                >
                  지갑생성
                </button>
              </div>
            </div>
          </div>

          <div className="myPage-exchangeRatesSection">
            {loading ? (
              <p>환율 정보를 불러오는 중...</p>
            ) : (
              <table className="exchange-rates-table">
                <thead>
                  <tr>
                    <th>통화명</th>
                    <th>매매기준율</th>
                    <th>현찰 사실 때</th>
                    <th>현찰 파실 때</th>
                  </tr>
                </thead>
                <tbody>
                  {exchangeRates.length > 0 ? (
                    exchangeRates.map((rate, index) => (
                      <tr key={index}>
                        <td>{rate.currencyName}</td>
                        <td>
                          {rate.standardRate
                            .toFixed(2)
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </td>
                        <td>
                          {rate.cashBuyRate
                            .toFixed(2)
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </td>
                        <td>
                          {rate.cashSellRate
                            .toFixed(2)
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4">환율 데이터를 불러오는 중...</td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="4" className="flex justify-center text-xs">
                      <h3>실시간 환율 정보 (KRW 기준)</h3>
                    </td>
                  </tr>
                </tfoot>
              </table>
            )}
          </div>

          <div className="myPage-assetsSection flex flex-col justify-center">
            <div>
              <div className="flex items-center justify-center gap-5 ">
                <h3>총 자산</h3>
                <p className="total-assets">
                  {totalAssets.toLocaleString("ko-KR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  KRW
                </p>
              </div>

              <div className="transaction-type-buttons flex gap-4 my-4">
                <button
                  className={`px-4 py-2 rounded-lg shadow-md transition transform hover:scale-105 ${
                    transactionType === "exchange"
                      ? "bg-hana text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  onClick={() => setTransactionType("exchange")}
                >
                  환전 내역
                </button>
                <button
                  className={`px-4 py-2 rounded-lg shadow-md transition transform hover:scale-105 ${
                    transactionType === "transfer"
                      ? "bg-hana text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  onClick={() => setTransactionType("transfer")}
                >
                  송금 내역
                </button>
              </div>

              <h4 className="text-left" style={{ fontSize: "1.5rem" }}>
                {transactionType === "exchange"
                  ? "외화 거래 내역"
                  : "송금 내역"}
              </h4>
              <ul className="recent-transactions">
                {displayedTransactions.length > 0 ? (
                  displayedTransactions.map((data, index) => (
                    <TempRow
                      key={index}
                      data={data}
                      transactionType={transactionType}
                    />
                  ))
                ) : (
                  <li className="text-center">
                    {transactionType === "exchange"
                      ? "내역을 불러오는 중..."
                      : "내역이 없습니다."}
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div
            className={
              walletExists === 1 ? "myPage-walletInfo" : "wallet-blur-overlay"
            }
          >
            {walletExists !== null && (
              <div
                className={`${
                  walletExists === 1
                    ? "wallet-blur-overlay"
                    : "wallet-blur-content"
                }`}
              >
                <div className="flex justify-around items-center">
                  {walletData.map((wallet, index) => (
                    <button
                      key={wallet.currencyCode}
                      onClick={() =>
                        handleTabChange(wallet.currencyCode, index)
                      }
                      className={`w-16 py-2 bg-gray-200 rounded-md cursor-pointer ${
                        selectedCurrency === wallet.currencyCode
                          ? "text-white bg-hana"
                          : "hover:bg-teal-600 hover:text-white duration-200"
                      }`}
                    >
                      {wallet.currencyCode}
                    </button>
                  ))}
                </div>

                {currentWalletData && (
                  <div className="wallet-content">
                    <div className="flex justify-between my-5">
                      <div className="w-[40%] wallet-info-title flex items-center">
                        <img
                          src={getCurrencyImage(
                            currentWalletData.currencyCode
                          )}
                          alt={currentWalletData.currencyCode}
                          className="w-[175px] shadow-md"
                        />
                      </div>
                      <div className="w-[55%]">
                        <div>
                          <p className="text-left font-bold text-sm">잔액</p>
                          <p className="text-gray-400 text-right text-2xl">
                            {currentWalletData.symbol}
                            {(
                              currentWalletData.totalUsd ||
                              currentWalletData.totalEur ||
                              currentWalletData.totalJpy ||
                              currentWalletData.totalCny ||
                              currentWalletData.totalKrw
                            )
                              .toFixed(2)
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                            {currentWalletData.currencyCode}
                          </p>
                        </div>
                        <div className="text-left">
                          <p className="text-left font-bold text-sm">
                            현재 환율로 원화
                          </p>
                          <p className="text-gray-400 text-right text-lg">
                            {currentWalletData.amountInKrw
                              ?.toFixed(2)
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                            KRW
                          </p>
                        </div>
                        <div className="">
                          <p className="text-left font-bold text-sm">
                            계좌 번호
                          </p>
                          <p className="text-gray-400 text-right">
                            {currentWalletData.accountNo}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="w-full text-center bg-hana text-white py-2 rounded-md font-bold cursor-pointer hover:opacity-80 duration-300">
                      <div
                        onClick={() => {
                          handleModal(1);
                        }}
                      >
                        환전하기
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {walletExists === 0 && (
              <div className="wallet-disabled-message-overlay">
                통화지갑 생성 후 이용할 수 있습니다!
              </div>
            )}
          </div>
        </section>
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          size={modalSize}
          isCentered={true}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <HandleModalHeader selectModal={selectModal} />
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <HandleModal
                selectModal={selectModal}
                wallet={walletData[currentIndex]}
                setModalSize={setModalSize}
                onClose={onClose} // onClose를 각 모달로 전달
                userId={userId} // userId를 각 모달로 전달
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      </main>
      {/* Include Footer */}
      <Footer />
    </>
  );
};

function HandleModalHeader({ selectModal }) {
  return ["서류 등록", "환전하기", "쿠폰목록", "환율알림"][selectModal];
}

function HandleModal({ selectModal, wallet, setModalSize, onClose, userId }) {
  return [
    <UploadModal
      setModalSize={setModalSize}
      onClose={onClose}
      onBackClick={onClose}
    />,
    <ExchangeModal wallet={wallet} onClose={onClose} />,
    <CouponListModal />,
    <ExchangeRateAlertModal onClose={onClose} userId={userId} />, // userId와 onClose를 전달
  ][selectModal];
}

function TempRow({ data, transactionType }) {
  if (transactionType === "exchange") {
    const isSale = data.transactionType.includes("판매");

    const textColor = isSale ? "text-red-500" : "text-green-500";
    const transactionLabel = `${data.transactionType}`;

    return (
      <li className="text-center flex items-center justify-between py-2 border-b">
        <span
          className="transaction-date"
          style={{ width: "30%", whiteSpace: "nowrap" }}
        >
          {new Date(data.transactionDate).toLocaleString()}
        </span>
        <span
          className={`transaction-type ${textColor}`}
          style={{ width: "15%" }}
        >
          {transactionLabel}
        </span>
        <span className="transaction-currency" style={{ width: "15%" }}>
          {data.currencyCode}
        </span>
        <span
          className="transaction-amount"
          style={{ width: "40%", textAlign: "right" }}
        >
          {data.amount
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
          {data.currencyCode} (
          {data.amountInKrw.toLocaleString("ko-KR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{" "}
          KRW)
        </span>
      </li>
    );
  } else if (transactionType === "transfer") {
    // 송금 내역의 받는 사람 부분 제거 및 줄바꿈 제거
    const amountInKrw = data.amountInKrw !== undefined ? data.amountInKrw : 0;

    const formattedDate = new Date(data.transactionDate);
    const dateString = formattedDate.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
    const timeString = formattedDate.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    return (
      <li className="text-center flex items-center justify-between py-2 border-b">
        <span
          className="transaction-date"
          style={{ width: "30%", whiteSpace: "nowrap" }}
        >
          {dateString} {timeString}
        </span>
        <span
          className="transaction-type transfer text-blue-500"
          style={{ width: "15%" }}
        >
          {data.transactionType}
        </span>
        <span
          className="transaction-currency"
          style={{ width: "10%", textAlign: "center" }}
        >
          {data.currencyCode}
        </span>
        <span
          className="transaction-amount"
          style={{
            width: "40%",
            textAlign: "right",
            whiteSpace: "nowrap",
          }}
        >
          {data.amount
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
          {data.currencyCode} (
          {amountInKrw.toLocaleString("ko-KR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{" "}
          KRW)
        </span>
      </li>
    );
  } else {
    return null;
  }
}

export default MyPage;
