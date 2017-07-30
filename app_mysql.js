const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
})
const upload = multer({ storage: storage });
const app = express();
const fs = require('fs');
const mysql      = require('mysql');
const conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '111111',
  database : 'o2'
});
conn.connect();

app.locals.pretty = true; // 페이지 소스 보기 할 때 이쁘게 보기!!
app.set('view engine', 'pug');
app.set('views', './views_mysql');
app.use(bodyParser.urlencoded({extended: false}));

app.get('/upload', (req, res) => {
  res.render('uploadform');
});

app.post('/upload', upload.single('userfile'), (req, res) => {
  res.send(req.file.filename);
});

app.get('/topic/add', (req,res) =>{
  let sql = 'SELECT id, title FROM topic';
  conn.query(sql, (err, topics, fields) => {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.render('add', {topics:topics});
  });
});

app.post('/topic/add', (req, res) => {
  let title = req.body.title;
  let description = req.body.description;
  let author = req.body.author;
  var sql = 'INSERT INTO topic (title, description, author) VALUES(?, ?, ?)';
  var params = [title, description, author];
  conn.query(sql, params, (err, result, fields) => {
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.redirect('/topic/' + result.insertId);
  });
});

app.get(['/topic', '/topic/:id'], (req,res) => {
  let sql = 'SELECT id, title FROM topic';
  conn.query(sql, function (err, topics, fields) {
    let id = req.params.id;
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
      return;
    }
    if(id){
      let sql ='SELECT * FROM topic WHERE id=?';
      conn.query(sql, [id], (err, rows, fields) => {
        if(err){
          console.log(err);
          res.status(500).send('Internal Server Error');
        } else {
          res.render('view', {topics: topics, topic:rows[0]});
        }
      });
    } else{
        res.render('view', {topics: topics});
    }
  });
});

app.get('/topic/:id/edit', (req, res) => {
  let id = req.params.id;
  if(!id){
    console.log("There is no id.");
    res.status(500).send('Internal Server Error');
    return;
  }
  let sql = 'SELECT id, title FROM topic';
  conn.query(sql, (err, topics, fields) => {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
      return;
    }
    let sql ='SELECT * FROM topic WHERE id=?';
    conn.query(sql, [id], (err, rows, fields) => {
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
      } else {
        res.render('edit', {topics: topics, topic:rows[0]});
      }
    });
  });
});

app.post('/topic/:id/edit', (req, res) => {
  let id = req.params.id;
  let title = req.body.title;
  let description = req.body.description;
  let author = req.body.author;

  sql = 'UPDATE topic SET title=?, description=?, author=? WHERE id=?';
  var params = [title, description, author, id];
  conn.query(sql, params, (err, rows, fields) => {
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.redirect('/topic/' + id);
  });
});

app.get('/topic/:id/delete', (req, res) => {
  let sql = 'SELECT id, title FROM topic';
  conn.query(sql, (err, topics, fields) => {
    let id = req.params.id;
    let sql = 'SELECT * FROM topic where id=?';
    conn.query(sql, [id], (err, topic) => {
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
      } else{
        if(topic.length === 0){
          console.log("There is no data where id = " + id);
          res.status(500).send('Internal Server Error');
        } else {
          res.render('delete', {topics:topics, topic:topic[0]});
        }
      }
    });
  });
});

app.post('/topic/:id/delete', (req, res) => {
  let id = req.params.id;
  let sql = "DELETE FROM topic where id=?"
  conn.query(sql, [id], (err, result) => {
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    res.redirect('/topic');
  });
});

app.listen(3000, () => {
  console.log("Connected, 3000 port");
});
