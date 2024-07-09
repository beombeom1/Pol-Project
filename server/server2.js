const express = require('express');
const multer = require('multer');
const { SpeechClient } = require('@google-cloud/speech');
const fs = require('fs');
const cors = require('cors');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

const app = express();
const upload = multer({ dest: 'uploads/' });
const PORT = 5000;

// 서비스 계정 키 파일 경로 설정
const speechClient = new SpeechClient({
    keyFilename: 'C:\\Users\\user\\Desktop\\apikey/stt-test-428805-44d33bb38495.json' // JSON 키 파일의 실제 경로
});

// CORS 설정
app.use(cors());

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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
