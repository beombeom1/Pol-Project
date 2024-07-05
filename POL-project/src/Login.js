import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [userid, setuserid] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 로그인 로직을 여기에 추가합니다.
    // 데이터베이스 mysql 연동 및 로직 추가
    try {
        const response = await axios.post('http://localhost:3001/login', { userid, password });
        console.log(response.data); // 로그인 성공 시 메시지
        alert('로그인 성공');
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
            type="userid"
            id="userid"
            value={userid}
            onChange={(e) => setuserid(e.target.value)}
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
    </div>
  );
};

export default Login;
