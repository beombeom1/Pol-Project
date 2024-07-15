import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import './MemoryGame.css';

function MemoryGame({ toggleSidebar }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matchedCount, setMatchedCount] = useState(0);

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    const wordsData = JSON.parse(localStorage.getItem('words'));
    const cardSet = [];
    for (let i = 1; i <= 8; i++) {
      const word = wordsData[`단어${i}`];
      const meaning = wordsData[`뜻${i}`];
      if (word && meaning) {
        cardSet.push({ id: i * 2 - 1, word, meaning, matched: false });
        cardSet.push({ id: i * 2, word: meaning, meaning: word, matched: false });
      }
    }
    const shuffledCards = [...cardSet].sort(() => Math.random() - 0.5);
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
      {toggleSidebar && <button className="sidebar-toggle" onClick={toggleSidebar}>☰</button>}
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
