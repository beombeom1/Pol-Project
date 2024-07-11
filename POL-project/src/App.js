<<<<<<< HEAD
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
=======
import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';

>>>>>>> abe968bb4354b5868b6a0f208814e0bda0c1fca0
import Main from './components/Main';
// import Record from './Record';
import Learn from './components/Learn';
import Speak from './components/Speak';
import Listen from './components/Listen';
import Settings from './components/Settings';
import Signup from './Signup';
import Login from './Login';
import StudySetup from './StudySetup';
import './App.css';
import logo from './char.png'; 



function App() {

  const userid = 1;
  return (
    <div className="App">
      <div style={{ display: 'flex' }}>
        <nav>
            <img src={logo} alt="로고" className="logo" />
          <ul>
            <li><Link to="/main">메인 화면</Link></li>
            <li><Link to="/learn">배우기</Link></li>
            <li><Link to="/speak">말하기</Link></li>
            <li><Link to="/listen">듣기</Link></li>
            <li><Link to="/settings">설정</Link></li>
            <li><Link to="/signup">회원가입</Link></li>
            <li><Link to="/login">로그인</Link></li>
            <li><Link to="/StudySetup">학습 설정</Link></li>
          </ul>
        </nav>
        <main>
          <Routes>
            <Route path="/main" element={<Main />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/speak" element={<Speak />} />
            <Route path="/listen" element={<Listen />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/StudySetup" element={<StudySetup />}/>
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
