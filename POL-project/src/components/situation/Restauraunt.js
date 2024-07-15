import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Situations.css';
import RecordImage from './record2.png';
import SpeakerImage from './record3.png';
import SpeakerImage2 from './speaker2.png';


function Restaurant({ toggleSidebar }) {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [transcript, setTranscript] = useState('');
    const [audioUrl, setAudioUrl] = useState(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const audioRef = useRef(null); // 오디오 태그를 참조하기 위한 ref

    useEffect(() => {
        const startConversation = async () => {
            try {
                const response = await axios.post('http://localhost:5000/startConversation', { situation: 'restaurant' });
                const initialMessage = response.data.message;
                setMessages([{ sender: 'gpt', text: initialMessage }]);
            } catch (error) {
                console.error('Failed to start conversation:', error);
            }
        };

        startConversation();
    }, []);

    const startRecord = () => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                mediaRecorderRef.current = new MediaRecorder(stream);
                mediaRecorderRef.current.start();
                mediaRecorderRef.current.ondataavailable = (event) => {
                    audioChunksRef.current.push(event.data);
                };
                console.log("Recording started");
            })
            .catch(error => {
                console.error("Error accessing microphone:", error);
            });
    };

    const endRecord = async () => {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.onstop = async () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            const formData = new FormData();
            formData.append('file', audioBlob, 'recording.webm');

            try {
                const response = await axios.post('http://localhost:5000/transcribe', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                const transcriptText = response.data.text;
                setTranscript(transcriptText);

                // 메시지에 유저의 말을 추가
                setMessages(prevMessages => [...prevMessages, { sender: 'you', text: transcriptText }]);

                // GPT API 호출
                const prompt = transcriptText;
                console.log('Prompt for GPT:', transcriptText);
                const callGptApi = async (prompt) => {
                    try {
                        const response = await axios.post('http://localhost:5000/api/openai', { prompt });
                        return response.data.choices[0].message.content;
                    } catch (error) {
                        console.error('Error calling GPT API:', error);
                        return 'Failed to get response from GPT.';
                    }
                };
                const gptResponse = await callGptApi(prompt);
                setMessages(prevMessages => [...prevMessages, { sender: 'gpt', text: gptResponse }]);

                // TTS로 GPT 응답 변환
                await synthesizeSpeech(gptResponse);
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to process audio.');
            }
        };
        audioChunksRef.current = [];
        console.log("Recording stopped");
    };

    const synthesizeSpeech = async (text) => {
        try {
            const response = await axios.post('http://localhost:5000/synthesize', { text: text }, {
                responseType: 'arraybuffer',
            });
            const audioBlob = new Blob([response.data], { type: 'audio/mp3' });
            const audioUrl = URL.createObjectURL(audioBlob);
            setAudioUrl(audioUrl);
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to synthesize speech.');
        }
    };

    const handleSpeakerClick = () => {
        if (audioUrl && audioRef.current) {
            audioRef.current.play();
        }
    };

    const handleInputChange = (e) => {
        setInputText(e.target.value);
    };

    const handleSendMessage = async () => {
        if (inputText.trim() !== '') {
            // 메시지에 유저의 입력을 먼저 추가
            setMessages(prevMessages => [...prevMessages, { sender: 'you', text: inputText }]);

            try {
                const response = await axios.post('http://localhost:5000/api/openai', { prompt: inputText });
                const gptResponse = response.data.choices[0].message.content;
                setMessages(prevMessages => [...prevMessages, { sender: 'gpt', text: gptResponse }]);
                setInputText('');

                // TTS로 GPT 응답 변환
                await synthesizeSpeech(gptResponse);
            } catch (error) {
                console.error('Error calling GPT API:', error);
                alert('Failed to get response from GPT.');
            }
        }
    };

    return (
        <div className="container">
            <button className="sidebar-toggle" onClick={toggleSidebar}>
                ☰
            </button>
            <div className="head-screen">
                <p>pol과 대화를 해보세요</p>

                <div className="image-container">
                    <img
                        src={RecordImage}
                        alt="Record"
                        className="record-image"
                        onClick={startRecord}
                    />
                    <img
                        src={SpeakerImage}
                        alt="Speaker"
                        className="speaker-image"
                        onClick={endRecord}
                    />
                    <img
                        src={SpeakerImage2}
                        alt="Speaker2"
                        className="speaker-image2"
                        onClick={handleSpeakerClick} // 오디오 재생
                    />
                </div>

                <div className="chat-container">
                    <div className="chat-box">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.sender}`}>
                                <div className="message-content">
                                    {msg.text}
                                </div>
                            </div>
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
                <audio ref={audioRef} src={audioUrl} style={{ display: 'none' }}></audio>
            </div>
        </div>
    );
}

export default Restaurant;
