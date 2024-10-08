import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../redux/authSlice";

export default function LoginBox() {
    const [id, setId] = useState(''); // 아이디 상태로 변경
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const dispatch = useDispatch(); // Redux dispatch 함수
    const handleLogin = async (e) => {
        console.log('로그인 함수 호출됨'); // 로그인 함수가 호출되었는지 확인
        e.preventDefault();
      
        try {
          const response = await fetch('http://localhost:8081/userLogin', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: id, // 아이디로 변경
              pw: password,
            }),
          });
      
          console.log('응답 받음:', response); // 응답이 정상적으로 도착했는지 확인
      
          const result = await response.text();
          console.log('서버 응답 내용:', result); // 서버 응답 내용 확인
      
          if (response.ok) {
            console.log('로그인 성공'); // 성공 여부 확인
            dispatch(login({ userId: id })); // 로그인 상태 업데이트
            alert(result);
            // window.location.href = '/'; // 홈 화면으로 리다이렉트
          } else {
            console.log('로그인 실패:', result); // 실패 여부 확인
            setErrorMessage(result || '로그인에 실패했습니다. 다시 시도해주세요.');
          }
        } catch (error) {
          console.error('서버 통신 중 오류 발생:', error); // 오류 메시지 출력
          setErrorMessage('서버와의 통신 중 오류가 발생했습니다.');
        }
      };
    return (
        <section className="w-[350px] absolute text-left login-section right-14 top-0 z-20">
          <h1 className="login-title font-bold text-xl">로그인</h1>
          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="id">아이디</label> {/* 라벨과 입력 필드를 아이디로 변경 */}
              <input
                type="text"
                id="id"
                name="id"
                value={id}
                onChange={(e) => setId(e.target.value)} // 아이디 입력 처리
                placeholder="아이디를 입력해주세요."
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">비밀번호</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력해주세요."
                required
              />
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button type="submit" className="login-button hover:opacity-80 duration-300">로그인</button>
          </form>
          <div className="login-footer">
            <a href="/forgot-password" className="forgot-password">비밀번호를 잊어버리셨나요?</a>
            <div className="social-login">
              <a href="localhost:3000/" className="social-icon facebook">F</a>
              <a href="localhost:3000/" className="social-icon naver">N</a>
              <a href="localhost:3000/" className="social-icon apple">A</a>
            </div>
          </div>
        </section>
    )
}