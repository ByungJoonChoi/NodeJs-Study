const express = require('express');
const app = express();
// app.use(express.static('public'));
app.locals.pretty = true; // 페이지 소스 보기 할 때 이쁘게 보기!!
app.set('view engine', 'pug');
app.set('views', './views'); // 생략 가능
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.send('Welcome!!!');
});

app.get('/topic', (req, res) => {
  let id = req.query.id;
  var topics = [
    'Javascript is ...',
    'Nodejs is ...',
    'Express is ...'
  ];
  var output = `
  <a href="/topic?id=0">JavaScript</a><br>
  <a href="/topic?id=1">Nodejs</a><br>
  <a href="/topic?id=2">Express</a><br>
  ${topics[id]}
  `
  res.send(output);
});

app.get('/template', (req, res) => {
  res.render('temp', {time: new Date().toLocaleString(), _title: "pug"});
});

app.get('/login', (req, res) =>{
  res.send('<h1>Please, Login!!</h1>');
});

app.get('/image', (req, res) => {
  res.send('image <br><img src="/totoro.jpg" width=350 >');
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
