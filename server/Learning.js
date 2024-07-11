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
app.use(cors());

app.post('/api/openai', async (req, res) => {
    const { prompt } = req.body;

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo-0125",
            messages: [
                {
                    role: "system",
                    content: `You are an English teacher creating a single multiple-choice grammar question for Korean students. 
                    The difficulty level is intermediate. Each question should have 4 options labeled A, B, C, and D. 
                    Provide feedback for each option and the correct answer in JSON format as follows:
                    {
                        "question": "",
                        "options": {"A": "", "B": "", "C": "", "D": ""},
                        "answer": "",
                        "feedback": {"A": "", "B": "", "C": "", "D": ""},
                        "correct_answer": ""
                    }
                    Make sure to provide feedback in Korean. 모든 피드백은 반드시 한국어로 작성해야 합니다.`
                },
                {
                    role: "user",
                    content: "Generate a grammar question and provide feedback for each option. Make sure to provide feedback in Korean."
                }
            ]
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        // 응답 데이터를 파싱하기 전에 터미널에 출력 (깊은 복사를 위해 JSON.stringify 사용)
        console.log('API 응답 데이터:', JSON.stringify(response.data, null, 2));

        // 응답 데이터를 클라이언트에 JSON 형식으로 전달
        res.json(JSON.parse(response.data.choices[0].message.content));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
