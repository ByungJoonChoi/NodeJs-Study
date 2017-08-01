# express-session 모듈
## 1. 설치
```
$ npm install —save express-session
```
## 2. 기본 설정 및 사용
```javascript
const express = require('express');
const app = express();
const session = require('express-session')
app.use(session({
  secret: 'kdasjf093j9qf03jf',
  resave: false,
  saveUninitialized: true
}))

app.get('/count', (req, res) => {
  if(req.session.count){
    req.session.count++;
  } else {
    req.session.count = 1;
  }
  res.send("count : " + req.session.count);
});
```
1\) 기본설정<br>
secret: 쿠키에서와 마찬가지로 암호화할 때 사용하는 키<br>
위 기본설정대로 session을 사용하면 session 정보는 메모리에 저장된다.<br>
따라서 서버를 껐다가 키면 session 정보가 전부 지워져 버린다.<br>
(실제 개발 할 때 보통은 session 정보를 Database에 저장한다.)<br><br>

2\) 사용<br>
session 모듈을 사용하면 req.session을 통해 세션정보에 접근할 수 있다. <br>
예를 들어 session에 count라는 정보를 저장하고 싶으면, req.session.count = 1 처럼 작성하면 된다.<br>

