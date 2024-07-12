import express from 'express';
import multer from 'multer';
import axios from 'axios';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { SpeechClient } from '@google-cloud/speech';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import fs from 'fs';
import cors from 'cors';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffprobeInstaller from '@ffprobe-installer/ffprobe';

const ffmpegPath = ffmpegInstaller.path;
const ffprobePath = ffprobeInstaller.path;
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);
dotenv.config();


const app = express();
app.use(bodyParser.json());
const upload = multer({ dest: 'uploads/' });
const PORT = 5000;

// 서비스 계정 키 파일 경로 설정
const speechClient = new SpeechClient({
    keyFilename: process.env.SPEECH_KEY_FILENAME // JSON 키 파일의 실제 경로
});
const ttsClient = new TextToSpeechClient({
    keyFilename: process.env.TTS_KEY_FILENAME // JSON 키 파일의 실제 경로
});

// CORS 설정
app.use(cors());
app.use(express.json()); // JSON 본문 구문 분석 미들웨어 추가

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

app.post('/transcribe', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: 'No file provided' });
        }
        const webmFilePath = `${file.path}.webm`;
        // wav 파일을 webm 형식으로 변환합니다.
        await new Promise((resolve, reject) => {
            ffmpeg(file.path)
                .output(webmFilePath)
                .on('end', resolve)
                .on('error', reject)
                .run();
        });

        // 오디오 파일의 샘플 레이트를 가져옵니다.
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

        // 원본 및 변환된 파일 삭제
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
// GPT API 로 TEXT 에 대한 응답 대화 생성해서 텍스트 반환
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

        // 응답 데이터를 파싱하기 전에 터미널에 출력 (깊은 복사를 위해 JSON.stringify 사용)
        console.log('API 응답 데이터:', JSON.stringify(response.data, null, 2));
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


