import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Speak.css'; 

function Speak() {
  const navigate = useNavigate();

  return (
    <div>
      <p>상황을 선택해주세요</p>
      <div className="button-grid">
        <button onClick={() => navigate('/travel')}>여행</button>
        <button onClick={() => navigate('/restauraunt')}>식당</button>
        <button onClick={() => navigate('/school')}>학교</button>
        <button onClick={() => navigate('/airport')}>공항</button>
        <button onClick={() => navigate('/hotel')}>호텔</button>
        <button onClick={() => navigate('/hospital')}>병원</button>
        <button onClick={() => navigate('/bank')}>은행 </button>
        <button onClick={() => navigate('/mart')}>마트</button>
        <button onClick={() => navigate('/movie')}>영화관</button>
      </div>
    </div>
  );
}

export default Speak;
