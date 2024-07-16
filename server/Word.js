import express from 'express';
import axios from 'axios';
import mysql from 'mysql';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3003;

app.use(cors());
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'wjddn133',
  database: 'poldb'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database!');
});

app.get('/recommend-words/:userid', async (req, res) => {
  const { userid } = req.params;

  const query = 'SELECT schoollevel FROM users WHERE userid = ?';
  connection.query(query, [userid], async (err, results) => {
    if (err) {
      console.error('DB 조회 중 에러 발생:', err);
      res.status(500).send('서버 오류');
      return;
    }

    if (results.length === 0) {
      res.status(404).send('사용자를 찾을 수 없습니다.');
      return;
    }

    const { schoollevel } = results[0];
    let difficulty;

    switch (schoollevel) {
      case '초등학교':
        difficulty = 'easy';
        break;
      case '중학교':
        difficulty = 'intermediate';
        break;
      case '고등학교':
        difficulty = 'advanced';
        break;
      case '대학교':
        difficulty = 'expert';
        break;
      default:
        difficulty = 'intermediate';
    }

    const userPrompt = `
      You are a helpful assistant for Korean students learning English.
      Please recommend 8 English words for a ${difficulty} level student with the meanings in Korean.
      Ensure the words are suitable for Korean ${schoollevel} students learning English vocabulary.
      Provide the response in the following JSON format:
      {
        "단어1": "<word1>",
        "뜻1": "<meaning1>",
        "단어2": "<word2>",
        "뜻2": "<meaning2>",
        ...
        "단어8": "<word8>",
        "뜻8": "<meaning8>"
      }
    `;

    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-3.5-turbo-0125",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: userPrompt }
        ],
        max_tokens: 500,
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('OpenAI API 응답 데이터:', JSON.stringify(response.data, null, 2));

      const messageContent = response.data.choices[0].message.content;
      if (!messageContent) {
        throw new Error('Invalid response from OpenAI API');
      }

      const wordsData = JSON.parse(messageContent);

      res.json(wordsData);
    } catch (error) {
      console.error('OpenAI API 호출 중 에러 발생:', error.response ? error.response.data : error.message);
      res.status(500).json({ error: 'Failed to fetch recommended words' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
