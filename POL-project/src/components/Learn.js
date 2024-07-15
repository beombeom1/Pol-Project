import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Learn.css'; // CSS 파일을 가져옵니다.

function Learn({ toggleSidebar }) {
    const [response, setResponse] = useState({});
    const [error, setError] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [name, setName] = useState('');
    const [goal, setGoal] = useState('');
    const [level, setLevel] = useState('');

    const userid = localStorage.getItem('userid');

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const res = await axios.get(`http://localhost:3002/userinfo/${userid}`);
                console.log('User Info:', res.data);  // 응답 데이터를 로그에 출력
                setName(res.data.name);
                setGoal(res.data.goal);
                setLevel(res.data.level);
            } catch (error) {
                console.error('사용자 정보를 가져오는 중 오류 발생:', error);
            }
        };
    
        if (userid) {
            fetchUserInfo(); // 사용자 정보를 가져오는 함수 호출
        }
    }, [userid]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const prompt = `${goal} ${level}`;

        try {
            const res = await axios.post('http://localhost:3001/api/openai', { prompt });
            if (res.data) {
                console.log(res.data);  // 응답 데이터를 로그에 출력
                setResponse(res.data);
                setError(''); // 오류 상태 초기화
                setSubmitted(false); // 제출 상태 초기화
                setShowQuestion(true); // 문제를 보여줍니다
            } else {
                console.error('Unexpected response format:', res.data);
                setError('Error: Unexpected response format');
            }
        } catch (error) {
            console.error(error);
            setError('Error: ' + error.message);
        }
    };

    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
    };

    const handleAnswerSubmit = () => {
        if (selectedOption) {
            setIsCorrect(selectedOption === response.answer);
            setSubmitted(true);
        } else {
            alert('문항을 선택해주세요.');
        }
    };

    return (
        <div className="questions">
            <header className="question-header">
                <button className="sidebar-toggle" onClick={toggleSidebar}>
                    ☰
                </button>
                <h2>문제풀기</h2>
                <form onSubmit={handleSubmit} className="questions-line">
                    <input
                        type="hidden"
                        value={`${goal} ${level}`}
                        readOnly
                    />
                    <button type="submit" className="next-question-button">다음문제</button>
                </form>
                
                <div>
                    
                    {error && <p style={{color: 'red'}}>{error}</p>}
                    {response.question && (
                        <div className="check-questions">
                            {response.passage && (
                                <div>
                                    <p><strong>지문</strong></p>
                                    <p>{response.passage}</p>
                                </div>
                            )}
                            <p className='questions-kind'>질문: {response.question}</p>
                            <form>
                                <div>
                                    <input 
                                        type="radio" 
                                        id="optionA" 
                                        name="options" 
                                        value="A"
                                        checked={selectedOption === "A"}
                                        onChange={handleOptionChange}
                                    />
                                    <label htmlFor="optionA">A: {response.options && response.options.A}</label>
                                </div>
                                {submitted && <div>{response.feedback && response.feedback.A}</div>}
                                <div>
                                    <input 
                                        type="radio" 
                                        id="optionB" 
                                        name="options" 
                                        value="B"
                                        checked={selectedOption === "B"}
                                        onChange={handleOptionChange}
                                    />
                                    <label htmlFor="optionB">B: {response.options && response.options.B}</label>
                                </div>
                                {submitted && <div>{response.feedback && response.feedback.B}</div>}
                                <div>
                                    <input 
                                        type="radio" 
                                        id="optionC" 
                                        name="options" 
                                        value="C"
                                        checked={selectedOption === "C"}
                                        onChange={handleOptionChange}
                                    />
                                    <label htmlFor="optionC">C: {response.options && response.options.C}</label>
                                </div>
                                {submitted && <div>{response.feedback && response.feedback.C}</div>}
                                <div>
                                    <input 
                                        type="radio" 
                                        id="optionD" 
                                        name="options" 
                                        value="D"
                                        checked={selectedOption === "D"}
                                        onChange={handleOptionChange}
                                    />
                                    <label htmlFor="optionD">D: {response.options && response.options.D}</label>
                                </div>
                                {submitted && <div>{response.feedback && response.feedback.D}</div>}
                            </form>
                            <button className="submit-button" onClick={handleAnswerSubmit}>제출하기</button>
                            {submitted && (
                                <p className={isCorrect ? 'question-success' : 'question-failure'}>
                                    {isCorrect ? '정답입니다!' : '오답입니다.'}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </header>
        </div>
    );
}

export default Learn;
