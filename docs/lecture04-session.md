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

## 3. 서버 Storage에 세션 저장
1\) session-file-store 설치<br>
서버 Storage에 세션을 저장하기 위해서 session-file-store 모듈을 설치한다.<br>
```
$ npm install session-file-store --save
```
2\) 서버 설정
```javascript
const session = require('express-session')
const FileStore = require('session-file-store')(session); // 모듈 의존성 설정
app.use(session({
  secret: 'kdasjf093j9qf03jf',
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
}))
```
두번째 줄 코드를 추가하여 session 모듈과 FileStore 모듈의 의존성을 설정해준다.<br>
그리고 session 옵션에 store: new FileStore()를 추가해준다.<br>
이렇게 설정하면 사용자 세션 정보를 메모리에 저장하지 않고 **"sessions"** 라는 폴더를 자동 생성하여 이 폴더에 저장한다.
