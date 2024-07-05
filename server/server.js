const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', // 자신의 MySQL 사용자명
  password: '', // 자신의 MySQL 비밀번호
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
      res.send('Login successful');
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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
