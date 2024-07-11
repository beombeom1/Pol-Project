import React, { useState } from 'react';
import axios from 'axios';

function Learn() {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState({});
    const [error, setError] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post('http://localhost:3001/api/openai', { prompt });
            if (res.data) {
                console.log(res.data);  // 응답 데이터를 로그에 출력
                setResponse(res.data);
                setError(''); // 오류 상태 초기화
                setSubmitted(false); // 제출 상태 초기화
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
        <div className="App">
            <header className="App-header">
                <h1>OpenAI API와 통신하기</h1>
                <form onSubmit={handleSubmit}>
                    <textarea
                        style={{ display: 'none' }}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="질문을 입력하세요"
                    />
                    <button type="submit">다음문제</button>
                </form>
                <div>
                    <h2>응답:</h2>
                    {error && <p style={{color: 'red'}}>{error}</p>}
                    {response.question && (
                        <div>
                            <p>질문: {response.question}</p>
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
                            <button onClick={handleAnswerSubmit}>제출하기</button>
                            {submitted && (
                                <p>
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
