import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LearningSettings.css';

function LearningSettings() {
  const [wordsData, setWordsData] = useState(() => {
    const storedWords = localStorage.getItem('words');
    if (storedWords) {
      try {
        return JSON.parse(storedWords);
      } catch (error) {
        console.error('Failed to parse stored words:', error);
        return {};
      }
    }
    return {};
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userid = localStorage.getItem('userid');

  const fetchWords = async () => {
    try {
      const response = await axios.get(`http://localhost:3003/recommend-words/${userid}`);
      const wordsData = response.data;
      console.log('Fetched words:', wordsData);
      localStorage.setItem('words', JSON.stringify(wordsData));
      setWordsData(wordsData);
    } catch (error) {
      console.error('Failed to fetch recommended words:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userid && Object.keys(wordsData).length === 0) {
      fetchWords();
    } else {
      setLoading(false);
    }
  }, [userid]);

  const renderWords = () => {
    const words = [];
    for (let i = 1; i <= 8; i++) {
      const word = wordsData[`단어${i}`];
      const meaning = wordsData[`뜻${i}`];
      if (word && meaning) {
        words.push(
          <div key={i}>
            <span>{word}</span> - {meaning}
          </div>
        );
      }
    }
    return words;
  };

  const handleStartMemoryGame = () => {
    navigate('/memorygame');
  };

  return (
    <div className="learning-settings-container">
      <h2>오늘의 암기 추천 단어!</h2>
      {loading ? (
        <p>로딩 중...</p>
      ) : (
        <div className='word'>
          {Object.keys(wordsData).length > 0 ? (
            renderWords()
          ) : (
            <p>단어 데이터를 불러오는 중 오류가 발생했습니다.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default LearningSettings;
