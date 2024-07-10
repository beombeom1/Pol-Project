import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Main.css';
import LearningSettings from './LearningSettings';

const localizer = momentLocalizer(moment);

function Main({ setSidebarVisible }) {
  const [events, setEvents] = useState([]);
  const [isSettingsDone, setIsSettingsDone] = useState(false);

  useEffect(() => {
    setSidebarVisible(true); // 메인 화면에서는 사이드바를 항상 보이게 설정
  }, [setSidebarVisible]);

  const handleCheckAttendance = () => {
    alert('출석체크 되었습니다.');
  };

  const handleSettingsComplete = () => {
    setIsSettingsDone(true);
  };

  return (
    <div className="main-container">
      <h1>
        <a href='/login' className='login'>로그인</a>
        <a href='/signup' className='signup'>회원가입</a>
      </h1>
      <div className="content-container">
        <div className="calendar-container">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            className="custom-calendar"
          />
          <button className="check-attendance-btn" onClick={handleCheckAttendance}>
            출석체크
          </button>
        </div>
        <div className="settings-container">
          {!isSettingsDone ? (
            <LearningSettings onComplete={handleSettingsComplete} />
          ) : (
            <p>학습 설정이 완료되었습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Main;
