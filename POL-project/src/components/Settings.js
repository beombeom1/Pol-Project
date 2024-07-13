import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Settings.css';

const Settings = ({ toggleSidebar }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [goal, setGoal] = useState('grammar');
  const [darkMode, setDarkMode] = useState(false);

  const userid = localStorage.getItem('userid'); // Assuming userid is stored in localStorage
  const navigate = useNavigate(); // useNavigate 훅을 사용합니다.

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await axios.get(`http://localhost:3002/userinfo/${userid}`);
        setName(res.data.name);
        setEmail(res.data.email);
        setGoal(res.data.goal);
        setDifficulty(res.data.level);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, [userid]);

  const handleNameChange = (e) => setName(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleDifficultyChange = (e) => setDifficulty(e.target.value);
  const handleGoalChange = (e) => setGoal(e.target.value);
  const handleDarkModeChange = () => setDarkMode(!darkMode);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:3002/update-settings`, {
        userid,
        difficulty,
        goal
      });
      console.log('Settings updated successfully');
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  return (
    <div className="settings-container">
      <form onSubmit={handleSubmit} className="settings-section">
        <h2>프로필</h2>
        <div className="form-group">
          <label>
            <h3>Username</h3>
            <input type="text" value={name} onChange={handleNameChange} readOnly />
          </label>
        </div>
        <div className="form-group">
          <label>
            <h3>Email</h3>
            <input type="email" value={email} onChange={handleEmailChange} readOnly />
          </label>
        </div>
        <button type="submit" className="save-button">저장</button>
      </form>

      <div className="settings-section">
        <h2>난이도</h2>
        <div className="form-group">
          <label>
            <select value={difficulty} onChange={handleDifficultyChange}>
              <option value="하">쉬움</option>
              <option value="중">보통</option>
              <option value="상">어려움</option>
            </select>
          </label>
        </div>
      </div>

      <div className="settings-section">
        <h2>목표</h2>
        <div className="form-group">
          <label>
            <select value={goal} onChange={handleGoalChange}>
              <option value="문법">문법</option>
              <option value="독해">독해</option>
            </select>
          </label>
        </div>
      </div>

      <div className="settings-section">
        <h2>테마 설정</h2>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={handleDarkModeChange}
            />
            다크 모드
          </label>
        </div>
      </div>
    </div>
  );
};

export default Settings;
