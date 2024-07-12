import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Speak.css'; 
import travelImg from './images/travel.png';
import restaurantImg from './images/restaurant.png';
import schoolImg from './images/school.png';
import airportImg from './images/airport.png';
import hotelImg from './images/hotel.png';
import hospitalImg from './images/hospital.png';
import bankImg from './images/bank.png';
import martImg from './images/mart.png';
import movieImg from './images/movie.png';

function Speak({ toggleSidebar }) {
  const navigate = useNavigate();

  return (
    <div className='situation'>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        ☰
      </button>
      <p>상황에 맞는 영어 회화 배우기</p>
      <h3>상황을 선택해주세요</h3>
      <div className="button-kind">
        <button onClick={() => navigate('/travel')}>
          <img src={travelImg} alt="여행" /><br></br>
          여행갈 때
        </button>
        <button onClick={() => navigate('/restauraunt')}>
          <img src={restaurantImg} alt="식당" /><br></br>
          식당에서
        </button>
        <button onClick={() => navigate('/school')}>
          <img src={schoolImg} alt="학교" /><br></br>
          학교에서
        </button>
        <button onClick={() => navigate('/airport')}>
          <img src={airportImg} alt="공항" /><br></br>
          공항에서
        </button>
        <button onClick={() => navigate('/hotel')}>
          <img src={hotelImg} alt="호텔" /><br></br>
          호텔에서
        </button>
        <button onClick={() => navigate('/hospital')}>
          <img src={hospitalImg} alt="병원" /><br></br>
          병원에서
        </button>
        <button onClick={() => navigate('/bank')}>
          <img src={bankImg} alt="은행" /><br></br>
          은행에서
        </button>
        <button onClick={() => navigate('/mart')}>
          <img src={martImg} alt="마트" /><br></br>
          마트에서
        </button>
        <button onClick={() => navigate('/movie')}>
          <img src={movieImg} alt="영화관" /><br></br>
          영화관에서
        </button>
      </div>
    </div>
  );
}

export default Speak;
