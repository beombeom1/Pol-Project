import React, { useState } from 'react';
import axios from 'axios';

const Signup = () => {
  const [userid, setUserid] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // 이름 state 추가

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/signup', { userid, password, name });
      console.log(response.data); // 회원가입 성공 시 메시지
      alert('회원가입 성공');
    } catch (error) {
      console.error(error);
      alert('회원가입 실패');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
        <h2>회원가입</h2>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="userid">아이디:</label>
          <input
            type="text" // type을 text로 수정
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
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="name">이름:</label> {/* id를 name으로 수정 */}
          <input
            type="text" // type을 text로 수정
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)} // setName으로 수정
            required
            style={{ width: '100%', padding: '8px', margin: '5px 0' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
          회원가입
        </button>
      </form>
    </div>
  );
};

export default Signup;
