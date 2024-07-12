import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import './MemoryGame.css';

const cardSet1 = [
  { id: 1, word: 'Apple', meaning: '사과', matched: false },
  { id: 2, word: '사과', meaning: 'Apple', matched: false },
  { id: 3, word: 'Dog', meaning: '개', matched: false },
  { id: 4, word: '개', meaning: 'Dog', matched: false },
  { id: 5, word: 'Cat', meaning: '고양이', matched: false },
  { id: 6, word: '고양이', meaning: 'Cat', matched: false },
  { id: 7, word: 'Ice', meaning: '얼음', matched: false },
  { id: 8, word: '얼음', meaning: 'Ice', matched: false },
  { id: 9, word: 'Fish', meaning: '물고기', matched: false },
  { id: 10, word: '물고기', meaning: 'Fish', matched: false },
  { id: 11, word: 'Bird', meaning: '새', matched: false },
  { id: 12, word: '새', meaning: 'Bird', matched: false },
  { id: 13, word: 'Sun', meaning: '태양', matched: false },
  { id: 14, word: '태양', meaning: 'Sun', matched: false },
  { id: 15, word: 'Moon', meaning: '달', matched: false },
  { id: 16, word: '달', meaning: 'Moon', matched: false },
];

const cardSet2 = [
  { id: 1, word: 'Computer', meaning: '컴퓨터', matched: false },
  { id: 2, word: '컴퓨터', meaning: 'Computer', matched: false },
  { id: 3, word: 'Science', meaning: '과학', matched: false },
  { id: 4, word: '과학', meaning: 'Science', matched: false },
  { id: 5, word: 'History', meaning: '역사', matched: false },
  { id: 6, word: '역사', meaning: 'History', matched: false },
  { id: 7, word: 'Literature', meaning: '문학', matched: false },
  { id: 8, word: '문학', meaning: 'Literature', matched: false },
  { id: 9, word: 'Mathematics', meaning: '수학', matched: false },
  { id: 10, word: '수학', meaning: 'Mathematics', matched: false },
  { id: 11, word: 'Geography', meaning: '지리', matched: false },
  { id: 12, word: '지리', meaning: 'Geography', matched: false },
  { id: 13, word: 'Biology', meaning: '생물학', matched: false },
  { id: 14, word: '생물학', meaning: 'Biology', matched: false },
  { id: 15, word: 'Chemistry', meaning: '화학', matched: false },
  { id: 16, word: '화학', meaning: 'Chemistry', matched: false },
];

const cardSet3 = [
  { id: 1, word: 'Physics', meaning: '물리학', matched: false },
  { id: 2, word: '물리학', meaning: 'Physics', matched: false },
  { id: 3, word: 'English', meaning: '영어', matched: false },
  { id: 4, word: '영어', meaning: 'English', matched: false },
  { id: 5, word: 'Music', meaning: '음악', matched: false },
  { id: 6, word: '음악', meaning: 'Music', matched: false },
  { id: 7, word: 'Art', meaning: '미술', matched: false },
  { id: 8, word: '미술', meaning: 'Art', matched: false },
  { id: 9, word: 'Economics', meaning: '경제학', matched: false },
  { id: 10, word: '경제학', meaning: 'Economics', matched: false },
  { id: 11, word: 'Psychology', meaning: '심리학', matched: false },
  { id: 12, word: '심리학', meaning: 'Psychology', matched: false },
  { id: 13, word: 'Philosophy', meaning: '철학', matched: false },
  { id: 14, word: '철학', meaning: 'Philosophy', matched: false },
  { id: 15, word: 'Sociology', meaning: '사회학', matched: false },
  { id: 16, word: '사회학', meaning: 'Sociology', matched: false },
];

const cardSet4 = [
  { id: 1, word: 'Analysis', meaning: '분석', matched: false },
  { id: 2, word: '분석', meaning: 'Analysis', matched: false },
  { id: 3, word: 'Evaluate', meaning: '평가하다', matched: false },
  { id: 4, word: '평가하다', meaning: 'Evaluate', matched: false },
  { id: 5, word: 'Significant', meaning: '중요한', matched: false },
  { id: 6, word: '중요한', meaning: 'Significant', matched: false },
  { id: 7, word: 'Establish', meaning: '설립하다', matched: false },
  { id: 8, word: '설립하다', meaning: 'Establish', matched: false },
  { id: 9, word: 'Identify', meaning: '확인하다', matched: false },
  { id: 10, word: '확인하다', meaning: 'Identify', matched: false },
  { id: 11, word: 'Approach', meaning: '접근하다', matched: false },
  { id: 12, word: '접근하다', meaning: 'Approach', matched: false },
  { id: 13, word: 'Concept', meaning: '개념', matched: false },
  { id: 14, word: '개념', meaning: 'Concept', matched: false },
  { id: 15, word: 'Function', meaning: '기능', matched: false },
  { id: 16, word: '기능', meaning: 'Function', matched: false },
];

const cardSet5 = [
  { id: 1, word: 'Context', meaning: '맥락', matched: false },
  { id: 2, word: '맥락', meaning: 'Context', matched: false },
  { id: 3, word: 'Indicate', meaning: '나타내다', matched: false },
  { id: 4, word: '나타내다', meaning: 'Indicate', matched: false },
  { id: 5, word: 'Consequence', meaning: '결과', matched: false },
  { id: 6, word: '결과', meaning: 'Consequence', matched: false },
  { id: 7, word: 'Distribute', meaning: '분배하다', matched: false },
  { id: 8, word: '분배하다', meaning: 'Distribute', matched: false },
  { id: 9, word: 'Factor', meaning: '요인', matched: false },
  { id: 10, word: '요인', meaning: 'Factor', matched: false },
  { id: 11, word: 'Major', meaning: '주요한', matched: false },
  { id: 12, word: '주요한', meaning: 'Major', matched: false },
  { id: 13, word: 'Period', meaning: '기간', matched: false },
  { id: 14, word: '기간', meaning: 'Period', matched: false },
  { id: 15, word: 'Require', meaning: '요구하다', matched: false },
  { id: 16, word: '요구하다', meaning: 'Require', matched: false },
];

const cardSet6 = [
  { id: 1, word: 'Theory', meaning: '이론', matched: false },
  { id: 2, word: '이론', meaning: 'Theory', matched: false },
  { id: 3, word: 'Data', meaning: '데이터', matched: false },
  { id: 4, word: '데이터', meaning: 'Data', matched: false },
  { id: 5, word: 'Method', meaning: '방법', matched: false },
  { id: 6, word: '방법', meaning: 'Method', matched: false },
  { id: 7, word: 'Variable', meaning: '변수', matched: false },
  { id: 8, word: '변수', meaning: 'Variable', matched: false },
  { id: 9, word: 'Procedure', meaning: '절차', matched: false },
  { id: 10, word: '절차', meaning: 'Procedure', matched: false },
  { id: 11, word: 'Interpret', meaning: '해석하다', matched: false },
  { id: 12, word: '해석하다', meaning: 'Interpret', matched: false },
  { id: 13, word: 'Evidence', meaning: '증거', matched: false },
  { id: 14, word: '증거', meaning: 'Evidence', matched: false },
  { id: 15, word: 'Issue', meaning: '문제', matched: false },
  { id: 16, word: '문제', meaning: 'Issue', matched: false },
];

const cardSets = [cardSet1, cardSet2, cardSet3, cardSet4, cardSet5, cardSet6];

  
function MemoryGame({ toggleSidebar }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matchedCount, setMatchedCount] = useState(0);

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    const randomCardSet = cardSets[Math.floor(Math.random() * cardSets.length)];
    const shuffledCards = [...randomCardSet].sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setFlipped([]);
    setMatchedCount(0);
  };

  const handleFlip = (index) => {
    if (flipped.length === 2 || cards[index].matched || flipped.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [firstIndex, secondIndex] = newFlipped;
      if (cards[firstIndex].meaning === cards[secondIndex].word || cards[firstIndex].word === cards[secondIndex].meaning) {
        setTimeout(() => {
          const newCards = cards.map((card, i) => 
            i === firstIndex || i === secondIndex ? { ...card, matched: true } : card
          );
          setCards(newCards);
          setMatchedCount(matchedCount + 1);
          setFlipped([]);
          if (matchedCount + 1 === cards.length / 2) {
            Swal.fire({
              title: '축하합니다!',
              text: '모든 짝을 맞추셨습니다!',
              icon: 'success',
              confirmButtonText: '다시하기'
            }).then(() => {
              resetGame();
            });
          }
        }, 1000);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  const handleResetClick = () => {
    Swal.fire({
      title: '정말 다시 하시겠습니까?',
      text: '현재 진행 상황이 초기화됩니다.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '네, 다시 할래요!',
      cancelButtonText: '아니요'
    }).then((result) => {
      if (result.isConfirmed) {
        resetGame();
      }
    });
  };

  return (
    <div className="memory-game-container">
      <button className="sidebar-toggle" onClick={toggleSidebar}>☰</button>
      <h1>단어 카드 맞추기 게임</h1><br></br><br></br>
      <div className="cards">
        {cards.map((card, index) => (
          <div 
            key={index} 
            className={`card ${flipped.includes(index) || card.matched ? 'flipped' : ''}`} 
            onClick={() => handleFlip(index)}
          >
            <div className="card-inner">
              <div className="card-front">{card.matched ? card.word : ''}</div>
              <div className="card-back">{card.word}</div>
            </div>
          </div>
        ))}
      </div><br></br><br></br>
      <button className="reset-button check-attendance-btn" onClick={handleResetClick}>다시하기</button>
    </div>
  );
}

export default MemoryGame;
