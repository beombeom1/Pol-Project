import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import Home from './Home';
import StudySetup from './StudySetup'; // 추가된 StudySetup 컴포넌트
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/study-setup" element={<StudySetup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
