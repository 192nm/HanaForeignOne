import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import './assets/css/Home/Home.css';
import Home from './pages/Home/Home.js';
import Login from './pages/Login/Login.js';
import Join from './pages/Join/Join.js';
import JoinKakao from './pages/Join/JoinKakao.js';
import JoinCompony from './pages/Join/JoinCompany.js';
import Benefit from './pages/Benefit/Benefit.jsx';
import Ratio from './pages/Ratio/Ratio.js';
import FAQ from './pages/FAQ/FAQ.js';
import MyPage from './pages/MyPage/MyPage.js';
import JoinPersonal from './pages/Join/JoinPersonal.js';
import JoinPersonalSuccess from './pages/Join/JoinPersonalSuccess.js';
import PersonalAuthentication from './pages/Authentication/PersonalAuthentication.js';
import IdAuth from './pages/Authentication/IdAuth.js';
import AuthSuccess from './pages/Authentication/AuthSuccess.js';
import ToCompany from './pages/Remittance/to-company.js';
import Docu from './pages/Docu/Docu.js';
import Wallet from './pages/MyPage/Wallet.js';
import Fx from './pages/Fx/Fx.js';
import Risk from './pages/Risk/Risk.js';
import Personal from './pages/Remittance/RealRemittance.jsx';
import AccountRemi from './pages/Remittance/AccountRemi.jsx';
import ExpectRatio from './pages/ExpectRatio/ExpectRatio.jsx';
import ExpectRatioBefore from './pages/ExpectRatio/ExpectRatio.js';
import Admin from './pages/Admin/Admin.js';
import OCRDetails from './pages/Admin/OCRDetails.js';
import MakeWallet from './pages/makeWallet/makeWallet.js';
import Exchange from './pages/Exchange/Exchange.jsx';
import FavoriteAdd from './pages/Remittance/FavoriteAdd.jsx';
import AfterFavorite from './pages/Remittance/AfterFavorit.jsx';
import DetailRemittance from './pages/Remittance/DetailRemittance.jsx';
import LogRemi from './pages/Remittance/LogRemi.jsx';
import WalletRemi from './pages/Remittance/WalletRemi.jsx';
import DetailWalletRemi from './pages/Remittance/DetailWalletRemi.jsx';
import CreateWallet from './pages/makeWallet/CreateWallet.jsx';
import 'animate.css';
import './App.css';


// Redux 관련 import 추가
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'; // redux-persist의 PersistGate import
import { store, persistor } from './redux/store.js'; // 스토어와 persistor import

// ChakraProvider 추가
import { ChakraProvider } from '@chakra-ui/react';

// Context Provider import
import { ExchangeRateProvider } from './context/ExchangeRateContext.js';
import Home2 from './pages/Home/Home2.jsx';
import DrawerRatio from './components/Drawer/DrawerContent.jsx';
import Header from './components/Header/Header.js';
import Footer from './components/Footer/Footer.js';

function App() {
  return (
    <ChakraProvider> {/* Chakra UI Provider로 감싸줍니다 */}
      <Provider store={store}> {/* Redux Provider로 감싸줍니다 */}
        <PersistGate loading={null} persistor={persistor}> {/* PersistGate로 감싸줍니다 */}
          <Router>
            <ExchangeRateProvider> {/* ExchangeRateProvider로 감싸줍니다 */}
              <div className="App relative">
                <DrawerRatio />
                <Routes>
                  <Route path='/' element={<MainOutlet />}>
                    <Route path="" element={<Home2 />} />
                    <Route path="mypage" element={<MyPage />} />
                    <Route path="personal" element={<Personal />} />
                    <Route path="expect-ratio" element={<ExpectRatio />} />
                    <Route path="account-remi" element={<AccountRemi />} />
                    <Route path="favorite-add" element={<FavoriteAdd />} />
                    <Route path="after-favorite" element={<AfterFavorite />} />
                    <Route path="detail-remittance" element={<DetailRemittance />} />
                    <Route path="log-remittance" element={<LogRemi />} />
                    <Route path="wallet-remittance" element={<WalletRemi />} />
                    <Route path="detail-wallet-remi" element={<DetailWalletRemi />} />
                    <Route path="create-wallet" element={<CreateWallet />} />
                    {/* <Route path="login" element={<Home2 />} /> */}


                  </Route>
                  {/* <Route path="/" element={<Login />} /> */}
                  <Route path="/join" element={<Join />} />
                  <Route path="/join-kakao" element={<JoinKakao />} />
                  <Route path="/join-company" element={<JoinCompony />} />
                  <Route path="/benefit" element={<Benefit />} />
                  <Route path="/ratio" element={<Ratio />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/join-personal" element={<JoinPersonal />} />
                  <Route path="/join-personal-success" element={<JoinPersonalSuccess />} />
                  <Route path="/personal-authentication" element={<PersonalAuthentication />} />
                  <Route path="/id-auth" element={<IdAuth />} />
                  <Route path="/auth-success" element={<AuthSuccess />} />
                  <Route path="/company" element={<ToCompany />} />
                  <Route path="/docu" element={<Docu />} />
                  <Route path="/wallet" element={<Wallet />} />
                  <Route path="/fx" element={<Fx />} />
                  <Route path="/risk" element={<Risk />} />
                  <Route path="/to-company" element={<ToCompany />} />
                  
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/ocr-details" element={<OCRDetails />} />
                  <Route path="/make-wallet" element={<MakeWallet />} />
                  <Route path="/exchange" element={<Exchange />} />
                  <Route path="/expect-ratio-before" element={<ExpectRatioBefore />} />
                  {/* <Route path="/home2" element={<Home2 />} />
                  <Route path="/home" element={<Home />} /> */}
                </Routes>
              </div>
            </ExchangeRateProvider>
          </Router>
        </PersistGate>
      </Provider>
    </ChakraProvider>
  );
}

function MainOutlet() {
  return (
    <>
    <Header />
    <Outlet />
    <Footer />
    </>
  )
}

export default App;
