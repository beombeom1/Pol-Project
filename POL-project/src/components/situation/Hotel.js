import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Situations.css';
import RecordImage from './record.png';
import SpeakerImage from './speaker.png';

function Hotel({ toggleSidebar }) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  const handleClick = () => {
    console.log('이미지를 클릭했습니다!');
    // 원하는 동작 추가
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSendMessage = () => {
    if (inputText.trim() !== '') {
      setMessages([...messages, inputText]);
      setInputText('');
    }
  };

  return (
    <div className="container">
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        ☰
      </button>
      <div className="head-screen">
        <p>pol과 대화를 해보세요</p>

        <div className="image-container">
          <img
            src={RecordImage}
            alt="Record"
            className="record-image"
            onClick={handleClick}
          />
          <img
            src={SpeakerImage}
            alt="Speaker"
            className="speaker-image"
            onClick={handleClick}
          />
        </div>

        <div className="chat-container">
          <div className="chat-box">
            {messages.map((msg, index) => (
              <div key={index} className="message">
                {msg}
              </div>
            ))}
          </div>
          <div className="input-area">
            <input
              type="text"
              value={inputText}
              onChange={handleInputChange}
              placeholder="메시지를 입력하세요"
            />
            <button onClick={handleSendMessage}>전송</button>
          </div>
        </div>

        <div className="navigation-buttons">
          <button onClick={() => navigate('/speak')}>주제변경</button>
        </div>
      </div>
    </div>
  );
}

export default Hotel;