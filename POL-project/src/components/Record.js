import React, { useState, useRef } from 'react';
import axios from 'axios';

function App() {
    const [transcript, setTranscript] = useState('');
    const [audioUrl, setAudioUrl] = useState(null);
    const [gptResponse, setGptResponse] = useState('');
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
ㅊ
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
                setTranscript(response.data.text);
                
                
                // GPT API 호출
                const prompt = response.data.text;
                console.log('Prompt for GPT:', response.data.text);
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
                setGptResponse(gptResponse);

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

    return (
        <div className="App">
            <h1>Google Cloud STT, GPT, and TTS Example</h1>
            <div className="record_btn">
                <button type="button" onClick={startRecord}>⏺️</button>
                <button type="button" onClick={endRecord}>🛑</button>
            </div>
            <p>Transcript: {transcript}</p>
            <p>GPT Response: {gptResponse}</p>
            {audioUrl && <audio controls src={audioUrl}></audio>}
        </div>
    );
}

export default App;