import React, { useState, useEffect } from 'react';
import { Route, Routes, Link, useLocation } from 'react-router-dom';
import Main from './components/Main';
import Learn from './components/Learn';
import Speak from './components/Speak';
import MemoryGame from './components/MemoryGame';
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
          <img src={logo} alt="로고" className="logo" />
          <ul>
            <li><Link to="/" onClick={() => setSidebarVisible(true)}>메인 화면</Link></li>
            <li><Link to="/learn" onClick={() => setSidebarVisible(false)}>배우기</Link></li>
            <li><Link to="/speak" onClick={() => setSidebarVisible(false)}>말하기</Link></li>
            <li><Link to="/MemoryGame" onClick={() => setSidebarVisible(false)}>게임하기</Link></li>
            <li><Link to="/settings" onClick={() => setSidebarVisible(false)}>설정</Link></li>
          </ul>
        </nav>
      </div>
      <main className={sidebarVisible ? 'main-with-sidebar' : 'main-full'}>
        <Routes>
          <Route path="/" element={<Main setSidebarVisible={setSidebarVisible} />} />
          <Route path="/learn" element={<Learn toggleSidebar={toggleSidebar} />} />
          <Route path="/speak" element={<Speak />} />
          <Route path="/memorygame" element={<MemoryGame toggleSidebar={toggleSidebar} />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/school" element={<School />} />
          <Route path="/movie" element={<Movie />} />
          <Route path="/travel" element={<Travel />} />
          <Route path="/restauraunt" element={<Restauraunt />} />
          <Route path="/hotel" element={<Hotel />} />
          <Route path="/hospital" element={<Hospital />} />
          <Route path="/mart" element={<Mart />} />
          <Route path="/bank" element={<Bank />} />
          <Route path="/airport" element={<Airport />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
