import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const Learn = () => {
  const [hearts, setHearts] = useState(3);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const correctAnswer = 1;
  const navigate = useNavigate();

  const handleAnswerClick = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (selectedAnswer !== correctAnswer) {
      setHearts((prevHearts) => {
        const newHearts = Math.max(prevHearts - 1, 0);
        if (newHearts === 0) {
          navigate('/login');
          setTimeout(() => {
            window.location.reload();
          }, 100);
        }
        return newHearts;
      });
    }
  };

  return (
    <div className="app">
      <header>
        <div className="hearts">
          {[...Array(3)].map((_, index) => (
            <span key={index} className={index < hearts ? 'heart full' : 'heart empty'}>♥</span>
          ))}
        </div>
      </header>
      <main>
        <h1>다음을 읽고 답변하세요.</h1>
        <div className="question">
          <span role="img" aria-label="speaker">📢</span> Solo means alone
        </div>
        <p>solo는 어떤 의미인가요?</p>
        <div className="answers">
          <button onClick={() => handleAnswerClick(1)}>1. by yourself</button>
          <button onClick={() => handleAnswerClick(2)}>2. with your friends</button>
          <button onClick={() => handleAnswerClick(3)}>3. with your parents</button>
        </div>
        <button className="submit" onClick={handleSubmit}>확인</button>
      </main>
    </div>
  );
};

export default Learn;