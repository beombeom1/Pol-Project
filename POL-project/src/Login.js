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

      if (goal == null || level == null) {
        localStorage.setItem('userid', userid); // 로그인 성공 후 userid 저장
        alert('학습 설정이 필요합니다.');
        navigate('/StudySetup');
      } else {
        localStorage.setItem('userid', userid); // 로그인 성공 후 userid 저장
        alert('로그인 성공');
        navigate('/Main');
      }
    } catch (error) {
      console.error(error);
      alert('로그인 실패');
    }
  };

  return (
    <div className="login-container">
      <h1>로그인</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="userid">아이디:</label>
          <input
            type="text"
            id="userid"
            value={userid}
            onChange={(e) => setUserid(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">비밀번호:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className='lg-btn'type="submit">로그인</button>
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
