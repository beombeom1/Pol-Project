const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const port = 3002;

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
  const { userid, password, name, school } = req.body;

  const query = 'INSERT INTO users (userid, password, name, school, point) VALUES (?, ?, ?, ?, 0)';
  connection.query(query, [userid, password, name, school], (err, results) => {
    if (err) {
      res.status(500).send('Server error');
      return;
    }
    res.send('Signup successful');
  });
});


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

app.post('/attendance', (req, res) => {
  const { userid } = req.body;
  const attendance_date = new Date().toISOString().slice(0, 10);

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


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
