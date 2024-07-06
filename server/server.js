const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const port = 3002;

app.use(cors());
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: '172.20.10.8',
  user: 'root', // 자신의 MySQL 사용자명
  password: 'minsu1234', // 자신의 MySQL 비밀번호
  database: 'poldb' // 자신의 MySQL 데이터베이스 이름
  
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database!');
});

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

app.post('/signup', (req, res) => {
  const { userid, password, name } = req.body; // name 추가

  const query = 'INSERT INTO users (userid, password, name) VALUES (?, ?, ?)'; // name 추가
  connection.query(query, [userid, password, name], (err, results) => { // name 추가
    if (err) {
      res.status(500).send('Server error');
      return;
    }
    res.send('Signup successful');
  });
});

app.post('/setup', (req, res) => {
  const { userid, goal, level } = req.body;

  console.log({ userid, goal, level }); // 수신된 데이터를 로그로 확인합니다.

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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
