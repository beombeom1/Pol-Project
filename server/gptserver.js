import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';

// .env 파일에서 환경 변수 로드
dotenv.config();

const app = express();
const port = 3001;

app.use(bodyParser.json());

// CORS 설정
app.use(cors());

app.post('/api/openai', async (req, res) => {
    const { prompt } = req.body;

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo-0125",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: prompt }
            ]
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        // 응답 데이터를 파싱하기 전에 터미널에 출력 (깊은 복사를 위해 JSON.stringify 사용)
        console.log('API 응답 데이터:', JSON.stringify(response.data, null, 2));
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});