const express = require('express');
const session = require('express-session')
const app = express();
app.use(session({
  secret: 'kdasjf093j9qf03jf',
  resave: false,
  saveUninitialized: true
}))
// secret : session을 쿠키에 저장할 때 암호화할 때 사용하는 키?
// session()은 기본적으로 정보를 메모리에 저장

app.get('/count', (req, res) => {
  if(req.session.count){
    req.session.count++;
  } else {
    req.session.count = 1;
  }
  res.send("count : " + req.session.count);
});

app.listen(3003, () => {
  console.log("Connected 3003 port!!!");
});
