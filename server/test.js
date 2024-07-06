const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
const port = 3001; // 원하는 포트 번호 설정

const openai = new OpenAI({
  apiKey: 'sk-proj-SumQIBL2z9D7hxc69HvLT3BlbkFJAEvPiwmleBN6VkloYYpP',  // 실제 API 키로 대체하세요
});

app.use(cors());
app.use(express.json());

app.post('/api/openai', async (req, res) => {
  const { userMessage } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: `Create a multiple-choice question with 4 options on the following topic: ${userMessage}. The options should include one correct answer and three plausible but incorrect answers. Format it as: 
        Question: <your question here>
        a) <option 1>
        b) <option 2>
        c) <option 3>
        d) <option 4>` }
      ],
      model: "gpt-3.5-turbo",
    });

    res.json({ message: completion.choices[0].message.content });
  } catch (error) {
    if (error.code === 'insufficient_quota') {
      res.status(403).json({ error: "API 호출 한도를 초과했습니다. 플랜과 청구 정보를 확인하세요." });
    } else {
      res.status(500).json({ error: "OpenAI API 호출 중 오류가 발생했습니다." });
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
