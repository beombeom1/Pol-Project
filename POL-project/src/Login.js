import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = ({ login }) => {
  const [userid, setUserid] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3002/login', { userid, password });
      console.log(response.data); // 로그인 성공 시 메시지
      const { goal, level } = response.data;
      console.log('Goal:', goal, 'Level:', level);

      // 이전 로그인 데이터 초기화
      localStorage.removeItem('words');
      localStorage.setItem('userid', userid); // 로그인 성공 후 userid 저장

      if (goal == null || level == null) {
        alert('학습 설정이 필요합니다.');
        navigate('/StudySetup');
      } else {
        // 로그인 성공 후 단어를 가져와서 저장
        const wordsResponse = await axios.get(`http://localhost:3003/recommend-words/${userid}`);
        localStorage.setItem('words', JSON.stringify(wordsResponse.data.words));
        alert('로그인 성공');
        navigate('/main');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert('아이디 또는 비밀번호가 잘못되었습니다.');
      } else {
        alert('로그인 실패');
      }
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <h1>로그인</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="userid"></label>
          <input
          placeholder='ID'
            type="text"
            id="userids"
            value={userid}
            onChange={(e) => setUserid(e.target.value)}
            required
            aria-label="아이디 입력"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password"></label>
          <input
          placeholder='PASSWORD'
            type="password"
            id="passwords"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-label="비밀번호 입력"
          />
        </div>
        <button className='lg-btn' type="submit">로그인</button>
      </form>
      <div className="additional-links">
        <a href="#">아이디 찾기</a> |
        <a href="#">비밀번호 찾기</a> |
        <Link to="/Signup">회원가입</Link>
      </div>
    </div>
  );
};

export default Login;
