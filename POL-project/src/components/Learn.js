import React, { useState } from 'react';
import axios from 'axios';
import './Learn.css'; // CSS 파일을 가져옵니다.

function Learn({ toggleSidebar }) {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState({});
    const [error, setError] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [showQuestion, setShowQuestion] = useState(false); // 추가된 상태

    const handleSubmit = async (e) => {
        e.preventDefault();

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
                {!showQuestion && (
                    <form onSubmit={handleSubmit} className="questions-line">
                        <p className='start-text'> 영어 문제 풀기를 시작해보세요</p>
                        <p className='start-text'> 언제든, 어디서든! 다양한 영어 문제를 풀며 읽기와 듣기 능력을 평가해보세요.</p>
                        <textarea
                            style={{ display: 'none' }}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="질문을 입력하세요"
                        />
                        <button type="submit" className="next-question-button">
                            START !
                        </button>
                    </form>
                )}

                {showQuestion && (
                    <div>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        {response.question && (
                            <div className="check-questions">
                                <p className='questions-kind'>질문: {response.question}</p><br></br>
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
                                    <p className='question-success'>
                                        {isCorrect ? '정답입니다!' : '오답입니다.'}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </header>
        </div>
    );
}

export default Learn;
