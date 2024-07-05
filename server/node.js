const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// MySQL 연결 설정
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'dmlqja1298',
  database: 'poldb'
});

// 데이터베이스 연결
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to database');
});

// Express 서버 설정
app.use(bodyParser.json());

// 회원가입 API
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  const sql = 'INSERT INTO Users (username, password) VALUES (?, ?)';
  db.query(sql, [username, password], (err, result) => {
    if (err) {
      console.error('Error registering user:', err);
      res.status(500).send('Server error');
      return;
    }
    console.log('User registered:', result);
    res.status(200).send('User registered');
  });
});

// 로그인 API
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const sql = 'SELECT * FROM Users WHERE username = ? AND password = ?';
  db.query(sql, [username, password], (err, results) => {
    if (err) {
      console.error('Error logging in:', err);
      res.status(500).send('Server error');
      return;
    }
    if (results.length > 0) {
      res.status(200).send('Login successful');
    } else {
      res.status(401).send('Invalid credentials');
    }
  });
});

// 서버 시작
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
