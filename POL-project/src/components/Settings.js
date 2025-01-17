import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Settings.css';

const Settings = ({ toggleSidebar }) => {
  const [goal, setGoal] = useState('');
  const [level, setLevel] = useState('');
  const [userInfo, setUserInfo] = useState({});
  const navigate = useNavigate();
  const userid = localStorage.getItem('userid');

  useEffect(() => {
    if (userid) {
      fetchUserInfo();
    }
  }, [userid]);

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`http://localhost:3002/userinfo/${userid}`);
      setUserInfo(response.data);
    } catch (error) {
      console.error('사용자 정보 가져오기 중 에러 발생:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      console.log({ userid, goal, level }); // 전송할 데이터를 로그로 확인합니다.
      const response = await axios.post('http://localhost:3002/setup', { userid, goal, level });
      console.log(response.data); // 서버로부터의 응답을 확인합니다.
      alert('설정이 완료되었습니다.');
      navigate('/'); // 설정 완료 후 메인 페이지로 이동
    } catch (error) {
      console.error(error);
      alert('설정에 실패했습니다.');
    }
  };

  return (
    <div className="settings-container">
      {toggleSidebar && <button className="sidebar-toggle" onClick={toggleSidebar}>☰</button>}
      <div className='settings-profile'>
        <h2>{userid}님 </h2>
        <div className="settings-profile-info">
          <p className='settings-user-info'>
            학교 : {userInfo.school}<br />
            순위 : {userInfo.rank}위<br />
            등급 : {userInfo.tier}<br />
            난이도 : {userInfo.level}<br />
            포인트: {userInfo.point}
          </p>
        </div>
      </div>
      <form className="settings-form" onSubmit={handleSubmit}>
        <h2>학습 설정</h2>
        <div>
          <label htmlFor="goal">학습 목표:</label>
          <select
            id="goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            required
          >
            <option value="">학습 목표를 선택하세요</option>
            <option value="문법">문법</option>
            <option value="독해">독해</option>
          </select>
        </div>
        <div>
          <label htmlFor="level">난이도:</label>
          <select
            id="level"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            required
          >
            <option value="">난이도를 선택하세요</option>
            <option value="상">상</option>
            <option value="중">중</option>
            <option value="하">하</option>
          </select>
        </div>
        <button type="submit">
          설정 완료
        </button>
      </form>
    </div>
  );
};

export default Settings;
