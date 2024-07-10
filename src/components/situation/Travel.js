import React, { useState } from 'react';
import './Travel.css';
import { useNavigate } from 'react-router-dom';
import RecordImage from './record.png'; 
import SpeakerImage from './speaker.png';

function Travel() {
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
    <div className="question-screen">
      <p>다음 문장을 말해보세요</p>
  
      <div className="image-container">
        {/* 이미지 추가 */}
        <img
          src={RecordImage}
          alt="Record"
          className="record-image"
          onClick={handleClick}
        />
        <img
          src={SpeakerImage}
          alt="Speaker"
          className='speaker-image'
          onClick={handleClick}
          />
      </div>

      <div className="chat-container">
        <div className="chat-box">
          {messages.map((msg, index) => (
            <div key={index} className="message">{msg}</div>
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
  );
}

export default Travel;
