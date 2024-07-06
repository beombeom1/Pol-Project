import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Main.css';



const localizer = momentLocalizer(moment);

function Main() {
  const [events, setEvents] = useState([
    
  ]);

  const handleCheckAttendance = () => {
    // user의 정보 = 데이터베이스에 저장되어있는 유저 정보를 가져와서 getDate해당 날짜에 
    // setImage? 이미지 도장 찍어주기
    setEvents('');
    alert('출석체크 되었습니다.');
  };

  return (
    <div>
      <h1>name님 환영합니다.</h1>
      <div className="calendar-container">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          className="custom-calendar" // CSS 클래스 적용
        />
        <button className="check-attendance-btn" onClick={handleCheckAttendance}>
          출석체크
        </button>
      </div>
    </div>
  );
}

export default Main;
