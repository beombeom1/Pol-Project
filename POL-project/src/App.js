import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleButtonClick = async () => {
    try {
      const res = await axios.post('http://localhost:3001/api/openai', { userMessage: input });
      setResponse(res.data.message);
    } catch (error) {
      console.error('API 호출 중 오류가 발생했습니다:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="주제를 입력하세요"
        />
        <button onClick={handleButtonClick}>문제 생성</button>
        {response && <div><h3>Generated Question:</h3><p>{response}</p></div>}
      </header>
    </div>
  );
}

export default App;


// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Login from './Login';
// import Signup from './Signup';
// import Home from './Home';
// import StudySetup from './StudySetup'; // 추가된 StudySetup 컴포넌트
// import './App.css';

// function App() {
//   return (
//     <Router>
//       <div className="App">
//         <Routes>
//           <Route path="/" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />
//           <Route path="/home" element={<Home />} />
//           <Route path="/study-setup" element={<StudySetup />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;
