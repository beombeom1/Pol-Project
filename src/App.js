import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import Main from './components/Main';
import Learn from './components/Learn';
import Speak from './components/Speak';
import Listen from './components/Listen';
import Settings from './components/Settings';
import './App.css';
import logo from './char.png'; 

function App() {
  return (
    <div className="App">
      <div style={{ display: 'flex' }}>
        <nav>
            <img src={logo} alt="로고" className="logo" />
          <ul>
            <li><Link to="/">메인 화면</Link></li>
            <li><Link to="/learn">배우기</Link></li>
            <li><Link to="/speak">말하기</Link></li>
            <li><Link to="/listen">듣기</Link></li>
            <li><Link to="/settings">설정</Link></li>
          </ul>
        </nav>
        <main>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/speak" element={<Speak />} />
            <Route path="/listen" element={<Listen />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
