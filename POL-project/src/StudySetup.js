import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StudySetup = () => {
  const [goal, setGoal] = useState('');
  const [level, setLevel] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userid = localStorage.getItem('userid');
  
    try {
      console.log({ userid, goal, level }); // 전송할 데이터를 로그로 확인합니다.
      const response = await axios.post('http://localhost:3002/setup', { userid, goal, level });
      console.log(response.data); // 서버로부터의 응답을 확인합니다.
      alert('설정이 완료되었습니다.');
      navigate('/main'); // 설정 완료 후 메인 페이지로 이동
    } catch (error) {
      console.error(error);
      alert('설정에 실패했습니다.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
        <h2>학습 설정</h2>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="goal">학습 목표:</label>
          <select
            id="goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', margin: '5px 0' }}
          >
            <option value="">학습 목표를 선택하세요</option>
            <option value="문법">문법</option>
            <option value="독해">독해</option>
          </select>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="level">난이도:</label>
          <select
            id="level"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', margin: '5px 0' }}
          >
            <option value="">난이도를 선택하세요</option>
            <option value="상">상</option>
            <option value="중">중</option>
            <option value="하">하</option>
          </select>
        </div>
        <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
          설정 완료
        </button>
      </form>
    </div>
  );
};

export default StudySetup;
