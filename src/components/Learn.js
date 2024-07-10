import React, { useEffect } from 'react';
import './Learn.css';

function Learn({ toggleSidebar }) {
  return (
    <div className="learn-container">
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        ☰
      </button>
      <div className="content">
        <div className="question-section">
          <p>1. solo는 어떤 의미인가요?</p><br></br>
          <div className="audio-prompt">
            <span role="img" aria-label="megaphone">📣</span> Solo means alone.
          </div>
        </div>
        <div className="options">
          <button>1. by yourself</button>
          <button>2. with your friends</button>
          <button>3. with your parents</button>
          <button>4. 최정우 qttR</button>
        </div>
      </div>
      <div className="navigation-buttons">
        <button>건너뛰기</button>
        <button>확인</button>
      </div>
    </div>
  );
}

export default Learn;
