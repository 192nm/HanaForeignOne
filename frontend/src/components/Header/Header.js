import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // useLocation 추가
import { useSelector, useDispatch } from 'react-redux';
import { logout, login } from '../../redux/authSlice.js'; // Redux 액션 가져오기
import axios from 'axios'; // Axios를 사용하여 API 요청 처리
import './Header.css';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // 현재 경로를 얻기 위해 useLocation 훅 사용
  const { isLoggedIn, userId, userName } = useSelector((state) => state.auth);
  const [activePage, setActivePage] = useState(location.pathname); // 현재 선택된 페이지 상태

  useEffect(() => {
    setActivePage(location.pathname); // 경로가 변경될 때마다 activePage 업데이트
  }, [location.pathname]);

  const fetchUserName = async () => {
    try {
      const response = await axios.post("http://localhost:8081/selectUserById", {
        id: userId,
      });
    
      dispatch(login({ userId, userName: response.data }));
    } catch (error) {
      console.error("사용자 이름을 불러오지 못했습니다:", error);
    }
  };
  
  useEffect(() => {
    if (isLoggedIn && userId && !userName) { 
      fetchUserName();
    }
  }, [isLoggedIn, userId, userName]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleUpdateRatioAndNavigate = async () => {
    try {
      await axios.post("http://localhost:8081/updateRatio");
      console.log("updateRatio 호출 성공");
      navigate('/mypage');
    } catch (error) {
      console.error("updateRatio 호출 중 오류가 발생했습니다:", error);
    }
  };

  return (
    <header className="header">
      <div className="header-top">
        <a
          href="https://www.kebhana.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          하나은행
        </a>
      </div>
      <div className="header-bottom">
        <Link to="/" className="logo">
          하나포인원
        </Link>
        <nav className="nav-links">
          <ul>
            <li>
              <Link
                to="/personal"
                className={`${activePage === '/personal' ? 'text-blue-500 border-b-2 border-blue-500' : ''}`}
              >
                해외송금
              </Link>
            </li>
            <li>
              <Link
                to="/expect-ratio"
                className={`${activePage === '/expect-ratio' ? 'text-blue-500 border-b-2 border-blue-500' : ''}`}
              >
                환율예측
              </Link>
            </li>
            {/* <li>
              <Link
                to="/ratio"
                className={`${activePage === '/ratio' ? 'text-blue-500 border-b-2 border-blue-500' : ''}`}
              >
                실시간환율
              </Link>
            </li> */}
            <li>
              <Link
                to="/benefit"
                className={`${activePage === '/benefit' ? 'text-blue-500 border-b-2 border-blue-500' : ''}`}
              >
                혜택존
              </Link>
            </li>
            <li>
              <Link
                to="#"
                onClick={handleUpdateRatioAndNavigate}
                className={`${activePage === '/mypage' ? 'text-blue-500 border-b-2 border-blue-500' : ''}`}
              >
                마이페이지
              </Link>
            </li>
            <li>
              <Link
                to="/faq"
                className={`${activePage === '/faq' ? 'text-blue-500 border-b-2 border-blue-500' : ''}`}
              >
                FAQ
              </Link>
            </li>
          </ul>
        </nav>
        <div className="header-actions">
          {isLoggedIn ? (
            <>
              <span>{userName ? `${userName}님, 안녕하세요!` : null}</span>
              &nbsp;|&nbsp;
              <Link to="/" onClick={handleLogout}>로그아웃</Link>
            </>
          ) : (
            <>
              <Link to="/">로그인</Link>&nbsp;|&nbsp;
              <Link to="/join">회원가입</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
