const express = require('express');
const bodyParser = require('body-parser');
const app = express();
// app.use(express.static('public'));
app.locals.pretty = true; // 페이지 소스 보기 할 때 이쁘게 보기!!
app.set('view engine', 'pug');
app.set('views', './views'); // 생략 가능
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));

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

app.get('/form', (req, res) => {
  res.render('form');
})

// form 태그를 "get" 방식으로 제출시, 쿼리스트링이 추가된 url을 만들어 요청함.
app.get('/form_receiver', (req, res) => {
  var title = req.query.title;
  var description = req.query.description;
  res.send(title + ", " + description);
});

// form 태그를 "post" 방식으로 제출시, post 라우터로 요청함.
app.post('/form_receiver', (req, res) => {
  var title = req.body.title;
  var description = req.body.description;
  res.send(title + ", " + description);
});

app.get('/topic/:num', (req, res) => {
  let id = req.params.num;
  var topics = [
    'Javascript is ...',
    'Nodejs is ...',
    'Express is ...'
  ];
  var output = `
  <a href="/topic/0">JavaScript</a><br>
  <a href="/topic/1">Nodejs</a><br>
  <a href="/topic/2">Express</a><br>
  ${topics[id]}
  `
  res.send(output);
});

app.get('/topic/:id/:mode', (req, res) => {
  res.send(req.params.id + ", " + req.params.mode);
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
