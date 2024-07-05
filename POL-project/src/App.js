import React from 'react';
import Login from './Login';
import Signup from './Signup'; // 추가된 회원가입 컴포넌트
import './App.css';

function App() {
  return (
    <div className="App">
      <Login />
      <Signup />
    </div>
  );
}

export default App;
