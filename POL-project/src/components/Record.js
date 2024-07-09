import React, { useState, useRef } from 'react';
import axios from 'axios';

function App() {
    const [transcript, setTranscript] = useState('');
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

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
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to transcribe audio.');
            }
        };
        audioChunksRef.current = [];
        console.log("Recording stopped");
    };

    return (
        <div className="App">
            <h1>Google Cloud STT Example</h1>
            <div className="record_btn">
                <button type="button" onClick={startRecord}>⏺️</button>
                <button type="button" onClick={endRecord}>🛑</button>
            </div>
            <p>{transcript}</p>
        </div>
    );
}

export default App;
