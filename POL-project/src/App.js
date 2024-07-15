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
import homeIcon from './assets/home.png';
import learnIcon from './assets/learn.png';
import speakIcon from './assets/speak.png';
import gameIcon from './assets/game.png';
import settingsIcon from './assets/settings.png';
import Login from './Login.js';
import Signup from './Signup.js';
import StudySetup from './StudySetup.js';
import LearningSettings from './components/LearningSettings.js';
import SchoolRanking from './components/SchoolRanking';


function App() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== '/') {
      setSidebarVisible(false); // 페이지 이동 시 사이드바 닫기
    } else {
      setSidebarVisible(true); // 메인 페이지에서는 항상 사이드바 표시
    }
  }, [location]);

  const toggleSidebar = () => {
    setSidebarVisible(prevState => !prevState);
  };

  return (
    <div className="App">
      {sidebarVisible && location.pathname !== '/' && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
      <div className={`sidebar ${sidebarVisible ? 'visible' : ''}`}>
        <nav>

          <Link to="/" onClick={() => setSidebarVisible(true)}>
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
            <li>
              <Link to="/school-ranking" onClick={() => setSidebarVisible(false)}>
                <img src={settingsIcon} alt="학교 순위" className="menu-icon" />학교 순위
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <main className={sidebarVisible ? 'main-with-sidebar' : 'main-full'}>
        <Routes>
          <Route path="/" element={<Main setSidebarVisible={setSidebarVisible} />} />
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
