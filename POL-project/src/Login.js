import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [userid, setUserid] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/login', { userid, password });
      console.log(response.data); // 로그인 성공 시 메시지
      const { goal, level } = response.data;

      if (goal == null || level == null) {
        localStorage.setItem('userid', userid); // 로그인 성공 후 userid 저장
        alert('학습 설정이 필요합니다.');
        navigate('/study-setup');
      } else {
        localStorage.setItem('userid', userid); // 로그인 성공 후 userid 저장
        alert('로그인 성공');
        navigate('/home');
      }
    } catch (error) {
      console.error(error);
      alert('로그인 실패');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
        <h2>로그인</h2>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="userid">아이디:</label>
          <input
            type="text"
            id="userid"
            value={userid}
            onChange={(e) => setUserid(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', margin: '5px 0' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="password">비밀번호:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', margin: '5px 0' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
          로그인
        </button>
      </form>
      <a href='/Signup'>회원가입</a>
    </div>
  );
};

export default Login;
