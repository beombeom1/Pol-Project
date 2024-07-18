import express from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import axios from 'axios';
import cors from 'cors';
import mysql from 'mysql';
import fs from 'fs';
import FormData from 'form-data';
import dotenv from 'dotenv';
import { SpeechClient } from '@google-cloud/speech';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffprobeInstaller from '@ffprobe-installer/ffprobe';

dotenv.config();

const app = express();
const upload = multer({ dest: 'uploads/' });
const port = 3002;

const ffmpegPath = ffmpegInstaller.path;
const ffprobePath = ffprobeInstaller.path;
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

const determineTier = (point) => {
  if (point >= 1000) return 'master';
  if (point >= 600) return 'diamond';
  if (point >= 400) return 'platinum';
  if (point >= 200) return 'gold';
  if (point >= 100) return 'silver';
  if (point >= 51) return 'bronze';
  return 'bronze';
};

// 서비스 계정 키 파일 경로 설정
const speechClient = new SpeechClient({
  keyFilename: process.env.SPEECH_KEY_FILENAME // JSON 키 파일의 실제 경로
});
const ttsClient = new TextToSpeechClient({
  keyFilename: process.env.TTS_KEY_FILENAME // JSON 키 파일의 실제 경로
});

// OpenAI API 키 설정
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// MySQL 연결 설정
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'poldb'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database!');
});

// 오디오 파일의 샘플 레이트를 가져오는 함수
const getSampleRate = (filePath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        const sampleRate = metadata.streams[0].sample_rate;
        resolve(parseInt(sampleRate, 10));
      }
    });
  });
};

// OpenAI API를 이용한 음성 인식
app.post('/transcribe', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const formData = new FormData();
    formData.append('file', fs.createReadStream(file.path));
    formData.append('model', 'whisper-1');

    const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
    });

    // 파일 삭제
    fs.unlinkSync(file.path);

    res.json(response.data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to transcribe audio' });
  }
});

// Google Speech-to-Text API를 이용한 음성 인식
app.post('/transcribe-google', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }
    const webmFilePath = `${file.path}.webm`;
    await new Promise((resolve, reject) => {
      ffmpeg(file.path)
        .output(webmFilePath)
        .on('end', resolve)
        .on('error', reject)
        .run();
    });

    const sampleRate = await getSampleRate(webmFilePath);

    const audio = {
      content: fs.readFileSync(webmFilePath).toString('base64'),
    };

    const request = {
      audio: audio,
      config: {
        encoding: 'WEBM_OPUS',
        sampleRateHertz: sampleRate,
        languageCode: 'ko-KR',
      },
    };

    const [response] = await speechClient.recognize(request);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');

    fs.unlinkSync(file.path);
    fs.unlinkSync(webmFilePath);

    res.json({ text: transcription });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to transcribe audio' });
    console.log('ffmpeg path:', ffmpegPath);
    console.log('ffprobe path:', ffprobePath);
  }
});

// GPT-3 API를 이용한 텍스트 응답
app.post('/api/openai', async (req, res) => {
  const { prompt } = req.body;
  console.log(prompt);

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

    console.log('API 응답 데이터:', JSON.stringify(response.data, null, 2));
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Google Text-to-Speech API를 이용한 음성 합성
app.post('/synthesize', async (req, res) => {
  const { text } = req.body;

  const request = {
    input: { text: text },
    voice: { languageCode: 'ko-KR', ssmlGender: 'NEUTRAL' },
    audioConfig: { audioEncoding: 'MP3' },
  };

  try {
    const [response] = await ttsClient.synthesizeSpeech(request);
    res.set('Content-Type', 'audio/mp3');
    res.send(response.audioContent);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to synthesize speech' });
  }
});

// 로그인 API
app.post('/login', (req, res) => {
  const { userid, password } = req.body;

  const query = 'SELECT * FROM users WHERE userid = ? AND password = ?';
  connection.query(query, [userid, password], (err, results) => {
    if (err) {
      res.status(500).send('Server error');
      return;
    }
    if (results.length > 0) {
      res.json({
        success: true,
        goal: results[0].goal,
        level: results[0].level
      });
    } else {
      res.status(401).send('Invalid credentials');
    }
  });
});

// 회원가입 API
app.post('/signup', (req, res) => {
  const { userid, password, name, school, gubun } = req.body;

  // gubun 값을 schoollevel에 저장
  let schoollevel;
  switch (gubun) {
    case 'elem_list':
      schoollevel = '초등학교';
      break;
    case 'middle_list':
      schoollevel = '중학교';
      break;
    case 'high_list':
      schoollevel = '고등학교';
      break;
    case 'univ_list':
      schoollevel = '대학교';
      break;
    default:
      schoollevel = '';
  }

  const query = 'INSERT INTO users (userid, password, name, school, point, schoollevel) VALUES (?, ?, ?, ?, 0, ?)';
  connection.query(query, [userid, password, name, school, schoollevel], (err, results) => {
    if (err) {
      res.status(500).send('Server error');
      return;
    }
    res.send('Signup successful');
  });
});

// 사용자 설정 API
app.post('/setup', (req, res) => {
  const { userid, goal, level } = req.body;

  console.log({ userid, goal, level });

  const query = 'UPDATE users SET goal = ?, level = ? WHERE userid = ?';
  connection.query(query, [goal, level, userid], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('서버 오류');
      return;
    }
    console.log('설정 성공:', results);
    res.send('설정이 성공적으로 완료되었습니다.');
  });
});

// 출석체크 API
app.post('/attendance', (req, res) => {
  const { userid } = req.body;
  const attendance_date = new Date().toISOString().slice(0, 10);

  if (!userid) {
    console.error('로그인 필요: userid가 제공되지 않았습니다.');
    res.status(401).send('로그인이 필요합니다.');
    return;
  }
  const checkQuery = 'SELECT * FROM attendance WHERE userid = ? AND attendance_date = ?';
  connection.query(checkQuery, [userid, attendance_date], (checkErr, checkResults) => {
    if (checkErr) {
      console.error('DB 조회 중 에러 발생:', checkErr);
      res.status(500).send('서버 오류');
      return;
    }

    if (checkResults.length > 0) {
      res.status(400).send('오늘 이미 출석체크를 완료했습니다.');
    } else {
      const query = 'INSERT INTO attendance (userid, attendance_date, status) VALUES (?, ?, ?)';
      connection.query(query, [userid, attendance_date, 'Present'], (err, results) => {
        if (err) {
          console.error('DB 업데이트 중 에러 발생:', err);
          res.status(500).send('서버 오류');
          return;
        }

        console.log('출석체크 상태 업데이트 성공:', results);
        res.send('출석체크 상태 업데이트가 성공적으로 완료되었습니다.');
      });
    }
  });
});

// 출석 데이터 가져오기 API
app.get('/attendance/:userid', (req, res) => {
  const { userid } = req.params;

  
  const query = 'SELECT * FROM attendance WHERE userid = ?';
  connection.query(query, [userid], (err, results) => {
    if (err) {
      console.error('DB에서 출석 데이터를 가져오는 중 에러 발생:', err);
      res.status(500).send('서버 오류');
      return;
    }

    res.json(results);
  });
});

// 이벤트 데이터 가져오기 API
app.get('/events/:userid', (req, res) => {
  const { userid } = req.params;

  const query = 'SELECT * FROM events WHERE userid = ?';
  connection.query(query, [userid], (err, results) => {
    if (err) {
      console.error('DB에서 일정 데이터를 가져오는 중 에러 발생:', err);
      res.status(500).send('서버 오류');
      return;
    }

    res.json(results);
  });
});

// 이벤트 추가 API
app.post('/events', (req, res) => {
  const { userid, title, start_date, end_date } = req.body;

  const checkQuery = 'SELECT COUNT(*) as count FROM events WHERE userid = ? AND start_date = ?';
  connection.query(checkQuery, [userid, start_date], (checkErr, checkResults) => {
    if (checkErr) {
      console.error('DB 조회 중 에러 발생:', checkErr);
      res.status(500).send('서버 오류');
      return;
    }

    if (checkResults[0].count > 2) {
      res.status(400).send('하루에 두 개 이상의 일정을 추가할 수 없습니다.');
    } else {
      const query = 'INSERT INTO events (userid, title, start_date, end_date) VALUES (?, ?, ?, ?)';
      connection.query(query, [userid, title, start_date, end_date], (err, results) => {
        if (err) {
          console.error('DB에 일정 추가 중 에러 발생:', err);
          res.status(500).send('서버 오류');
          return;
        }

        res.send('일정이 성공적으로 추가되었습니다.');
      });
    }
  });
});

// 이벤트 삭제 API
app.delete('/events/:id', (req, res) => {
  const eventId = req.params.id;

  const query = 'DELETE FROM events WHERE id = ?';
  connection.query(query, [eventId], (err, results) => {
    if (err) {
      console.error('이벤트 삭제 중 에러 발생:', err);
      res.status(500).send('서버 오류');
      return;
    }
    res.send('이벤트가 성공적으로 삭제되었습니다.');
  });
});

// 이벤트 수정 API
app.put('/events/:id', (req, res) => {
  const eventId = req.params.id;
  const { title, start_date, end_date } = req.body;

  const query = 'UPDATE events SET title = ?, start_date = ?, end_date = ? WHERE id = ?';
  connection.query(query, [title, start_date, end_date, eventId], (err, results) => {
    if (err) {
      console.error('이벤트 수정 중 에러 발생:', err);
      res.status(500).send('서버 오류');
      return;
    }
    res.send('이벤트가 성공적으로 수정되었습니다.');
  });
});

// 이벤트 검색 API
app.get('/events/search/:userid', (req, res) => {
  const { userid } = req.params;
  const { query } = req.query; // 검색어를 쿼리 파라미터로 받습니다.

  console.log(`Search request received: userid=${userid}, query=${query}`); // 로그 추가

  const searchQuery = `
    SELECT * FROM events 
    WHERE userid = ? AND (title LIKE ?)
  `;
  const searchParams = [userid, `%${query}%`];

  connection.query(searchQuery, searchParams, (err, results) => {
    if (err) {
      console.error('이벤트 검색 중 에러 발생:', err); // 에러 로그 추가
      res.status(500).send('서버 오류');
      return;
    }
    res.json(results);
  });
});

// 사용자 정보를 가져오는 엔드포인트 
app.get('/userinfo/:userid', (req, res) => {
  const { userid } = req.params;

  const userQuery = `
    SELECT 
      name, goal, level, school, point, tier,
      (SELECT COUNT(*) + 1 FROM users WHERE point > users.point) AS \`rank\`
    FROM users
    WHERE userid = ?
  `;

  connection.query(userQuery, [userid], (err, results) => {
    if (err) {
      console.error('DB에서 사용자 정보를 가져오는 중 에러 발생:', err);
      res.status(500).send('서버 오류');
      return;
    }

    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).send('사용자를 찾을 수 없습니다.');
    }
  });
});

app.post('/update-settings', (req, res) => {
  const { userid, difficulty, goal } = req.body;

  const query = 'UPDATE users SET level = ?, goal = ? WHERE userid = ?';
  connection.query(query, [difficulty, goal, userid], (err, results) => {
    if (err) {
      console.error('설정을 업데이트하는 중 오류 발생:', err);
      res.status(500).send('Server error');
      return;
    }
    res.send('Settings updated successfully');
  });
});

// 포인트 합계가 0이 아닌 학교의 포인트 합계를 가져오는 엔드포인트
app.get('/ranking', (req, res) => {
  const topRankQuery = `
    SELECT school, SUM(point) as total_point
    FROM users
    WHERE school IS NOT NULL AND school != ''
    GROUP BY school
    HAVING total_point > 0
    ORDER BY total_point DESC
    LIMIT 5;
  `;

  connection.query(topRankQuery, (err, topRankResults) => {
    if (err) {
      console.error('순위 조회 중 오류 발생:', err);
      res.status(500).send('서버 오류');
      return;
    }
    res.json(topRankResults);
  });
});

app.get('/user_ranking', (req, res) => {
  const userRankQuery = `
    SELECT userid, name, school, point, tier
    FROM users
    WHERE point > 0
    ORDER BY point DESC
    LIMIT 10;
  `;

  connection.query(userRankQuery, (err, userRankResults) => {
    if (err) {
      console.error('개인별 순위 조회 중 오류 발생:', err);
      res.status(500).send('서버 오류');
      return;
    }
    res.json(userRankResults);
  });
});

const calculatePoints = (isCorrect, level) => {
  const points = { '하': 1, '중': 2, '상': 3 };
  if (isCorrect) {
    return points[level];
  } else {
    return level === '상' ? -2 : -1;
  }
};

app.post('/update-point', (req, res) => {
  const { userid, isCorrect, level } = req.body;
  console.log(`Received data - userid: ${userid}, isCorrect: ${isCorrect}, level: ${level}`);

  const getUserQuery = 'SELECT point, tier FROM users WHERE userid = ?';

  connection.query(getUserQuery, [userid], (err, results) => {
    if (err) {
      console.error('사용자 조회 중 오류 발생:', err);
      res.status(500).send('서버 오류');
      return;
    }

    if (results.length === 0) {
      res.status(404).send('사용자를 찾을 수 없습니다.');
      return;
    }
    const currentTier = results[0].tier;
    const currentPoint = results[0].point;
    const increment = calculatePoints(isCorrect, level);
    console.log(`Calculated points - increment: ${increment}, currentPoint: ${currentPoint}`);

    let newPoint = currentPoint + increment;

    // 포인트가 0 미만이면 0으로 설정
    if (newPoint < 0) {
      newPoint = 0;
    }

    const newTier = determineTier(newPoint);
    console.log(`Updating user ${userid} with point ${newPoint} and tier ${newTier}`);

    const updateQuery = 'UPDATE users SET point = ?, tier = ? WHERE userid = ?';
    connection.query(updateQuery, [newPoint, newTier, userid], (err, results) => {
      if (err) {
        console.error('포인트 업데이트 중 오류 발생:', err);
        res.status(500).send('서버 오류');
        return;
      }
      res.json({ newTier, currentTier }); // 현재 티어와 새로운 티어를 반환
    });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
