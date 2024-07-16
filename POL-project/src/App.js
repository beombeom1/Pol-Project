import React, { useState, useEffect } from 'react';
import { Route, Routes, Link, useLocation } from 'react-router-dom';
import Main from './components/Main';
import Learn from './components/Learn';
import Speak from './components/Speak';
import MemoryGame from './components/MemoryGame.js';
import Settings from './components/Settings';
import School from './components/situation/School';
import Airport from './components/situation/Airport';
import Bank from './components/situation/Bank';
import Movie from './components/situation/Movie';
import Mart from './components/situation/Mart';
import Travel from './components/situation/Travel';
import Hospital from './components/situation/Hospital';
import Restauraunt from './components/situation/Restauraunt';
import Hotel from './components/situation/Hotel';
import './App.css';
import logo from './char.png';
import learnIcon from './assets/learn.png';
import speakIcon from './assets/speak.png';
import gameIcon from './assets/game.png';
import settingsIcon from './assets/settings.png';
import Login from './Login.js';
import Signup from './Signup.js';
import StudySetup from './StudySetup.js';
import Intro from './components/Intro.js';
import LearningSettings from './components/LearningSettings.js';
import SchoolRanking from './components/SchoolRanking';

function TimerSetupPopup({ onComplete, totalMinutes, setTotalMinutes }) {
  const handleTotalMinutesChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0) {
      setTotalMinutes(value);
    }
  };

  return (
    <div className="timer-setup-popup">
      <input
        type="number"
        value={totalMinutes}
        onChange={handleTotalMinutesChange}
        placeholder="시간:분"
        className="time-input"
      />
      분
      <button onClick={onComplete} className="start-timer-btn">타이머 시작</button>
    </div>
  );
}

function App() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [time, setTime] = useState(0);
  const [showTimerSetup, setShowTimerSetup] = useState(false);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
      setSidebarVisible(false);
    } else if(location.pathname === '/main'){
      setSidebarVisible(true);
    } else{
      setSidebarVisible(false);
    }
  }, [location]);

  useEffect(() => {
    const storedTimer = JSON.parse(localStorage.getItem('timer'));
    if (storedTimer) {
      const now = Date.now();
      const elapsedTime = Math.floor((now - storedTimer.startTime) / 1000);
      const remainingTime = storedTimer.totalTime - elapsedTime;
      if (remainingTime > 0) {
        setTime(remainingTime);
        setIsActive(storedTimer.isActive);
      } else {
        setTime(0);
        setIsActive(false);
        localStorage.removeItem('timer');
      }
    }
  }, []);

  useEffect(() => {
    let timer;
    if (isActive && time > 0) {
      timer = setInterval(() => {
        setTime(prevTime => prevTime - 1);
      }, 1000);
    } else if (time === 0 && isActive) {
      setIsActive(false);
      alert('타이머가 종료되었습니다.');
      localStorage.removeItem('timer');
    }

    if (isActive) {
      localStorage.setItem('timer', JSON.stringify({ totalTime: time, isActive, startTime: Date.now() }));
    }

    return () => clearInterval(timer);
  }, [isActive, time]);

  const handleTimeSetupComplete = () => {
    const totalSeconds = totalMinutes * 60;
    setTime(totalSeconds);
    setIsActive(true);
    setShowTimerSetup(false);
    localStorage.setItem('timer', JSON.stringify({ totalTime: totalSeconds, isActive: true, startTime: Date.now() }));
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const toggleSidebar = () => {
    setSidebarVisible(prevState => !prevState);
  };

  const toggleTimer = () => {
    setIsActive(prevState => !prevState);
  };

  return (
    <div className="App">
      {sidebarVisible && location.pathname !== '/main' && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
      <div className={`sidebar ${sidebarVisible ? 'visible' : ''}`}>
        <nav>
          <Link to="/main" onClick={() => setSidebarVisible(true)}>
            <img src={logo} alt="로고" className="logo" />
          </Link>
          <ul>
            <li>
              <Link to="/learn" onClick={() => setSidebarVisible(false)}>
                <img src={learnIcon} alt="배우기" className="menu-icon" />배우기
              </Link>
            </li>
            <li>
              <Link to="/speak" onClick={() => setSidebarVisible(false)}>
                <img src={speakIcon} alt="말하기" className="menu-icon" />말하기
              </Link>
            </li>
            <li>
              <Link to="/MemoryGame" onClick={() => setSidebarVisible(false)}>
                <img src={gameIcon} alt="게임하기" className="menu-icon" />게임하기
              </Link>
            </li>
            <li>
              <Link to="/settings" onClick={() => setSidebarVisible(false)}>
                <img src={settingsIcon} alt="설정" className="menu-icon" />설정
              </Link>
            </li>
          </ul>
        </nav>
        <div className="timer-container">
          {showTimerSetup && (
            <TimerSetupPopup
              onComplete={handleTimeSetupComplete}
              totalMinutes={totalMinutes}
              setTotalMinutes={setTotalMinutes}
            />
          )}
          {!showTimerSetup && (
            <>
            <button onClick={() => setShowTimerSetup(true)} className="setup-timer-btn">타이머 설정</button>
              <div className="remaining-time">남은 시간: {formatTime(time)}</div>
              <button onClick={toggleTimer} className="toggle-timer-btn">
                {isActive ? '타이머 중지' : '타이머 시작'}
              </button>
            </>
          )}
        </div>
      </div>
      <main className={sidebarVisible ? 'main-with-sidebar' : 'main-full'}>
        <Routes>
          <Route path='/' element={<Intro />}/>
          <Route path='/main' element={<Main />} />
          <Route path="/learn" element={<Learn toggleSidebar={toggleSidebar} />} />
          <Route path="/speak" element={<Speak toggleSidebar={toggleSidebar} />} />
          <Route path="/memorygame" element={<MemoryGame toggleSidebar={toggleSidebar} />} />
          <Route path="/settings" element={<Settings toggleSidebar={toggleSidebar} />} />
          <Route path="/school" element={<School toggleSidebar={toggleSidebar} />} />
          <Route path="/movie" element={<Movie toggleSidebar={toggleSidebar} />} />
          <Route path="/travel" element={<Travel toggleSidebar={toggleSidebar} />} />
          <Route path="/restauraunt" element={<Restauraunt toggleSidebar={toggleSidebar} />} />
          <Route path="/hotel" element={<Hotel toggleSidebar={toggleSidebar} />} />
          <Route path="/hospital" element={<Hospital toggleSidebar={toggleSidebar} />} />
          <Route path="/mart" element={<Mart toggleSidebar={toggleSidebar} />} />
          <Route path="/bank" element={<Bank toggleSidebar={toggleSidebar} />} />
          <Route path="/airport" element={<Airport toggleSidebar={toggleSidebar} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/StudySetup" element={<StudySetup />} />
          <Route path="/learning-settings" element={<LearningSettings />} />
          <Route path="/school-ranking" element={<SchoolRanking toggleSidebar={toggleSidebar} />} />
         </Routes>
      </main>
    </div>
  );
}

export default App;
