import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post('http://localhost:3001/api/openai', { prompt });
            setResponse(res.data.choices[0].message.content);
            //res.data.choices[0].message.content 얘가 text임 반환값
        } catch (error) {
            console.error(error);
            setResponse('Error: ' + error.message);
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>OpenAI API와 통신하기</h1>
                <form onSubmit={handleSubmit}>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="질문을 입력하세요"
                    />
                    <button type="submit">전송</button>
                </form>
                <div>
                    <h2>응답:</h2>
                    <p>{response}</p>
                </div>
            </header>
        </div>
    );
}

export default App;



//테스트코드