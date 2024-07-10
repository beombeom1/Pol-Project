import React, { useState } from 'react';
import './Settings.css';

const Settings = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [darkMode, setDarkMode] = useState(false);

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleDifficultyChange = (e) => setDifficulty(e.target.value);
  const handleDarkModeChange = () => setDarkMode(!darkMode);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Account Settings:', { username, email, password, difficulty });
    // Additional logic to submit settings (e.g., to backend) can be added here
  };

  return (
    <div className="settings-container">
      <form onSubmit={handleSubmit} className="settings-section">
        <h2>프로필</h2>
        <div className="form-group">
          <label>
            <h3>username</h3>
          
          </label>
        </div>
        <div className="form-group">
          <label>
            <h3>ID</h3>
          
          </label>
        </div>
        <div className="form-group">
        
        </div>
        <div className="form-group">
     
        </div>
        <button type="submit" className="save-button">저장</button>
      </form>
      <div className="settings-section">
      <h2>난이도 </h2>
      <div className="form-group">
      <label>
           
            <select value={difficulty} onChange={handleDifficultyChange}>
              <option value="easy">쉬움</option>
              <option value="medium">보통</option>
              <option value="hard">어려움</option>
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
