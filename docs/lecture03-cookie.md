# Cookie
## 1. cookie-parser 설치
Node.js에서 Cookie를 parsing하기 위해서는 cookie-parser 미들웨어를 설치해야 한다.
```
$ npm install --save cookie-parser
```

## 2. 모듈 설정 및 쿠키 읽기, 쓰기
```javascript
const express = require('express');
const cookieParser = require('cookie-parser')
const app = express();
app.use(cookieParser());

```
위와 같이 설정해두면 cookie-parser가 미들웨어역할을 하여 req.cookies에 쿠키들을 파싱하여 저장해둔다.(읽기)<br>
res.cookie({key}, {value})를 통하여 쿠키 값을 설정해줄 수 있다.(쓰기)

## 3. 보안 (쿠키 암호화)
```javascript
app.use(cookieParser("3289urfh9302jf0348gh0gh"));
```
위와 같이 cookieParser의 인자로 문자열을 넘겨주면, 문자열이 key가 된다.<br>
이 key는 cookie를 암/복호화 하는데 사용된다.
```javascript
let count = parseInt(req.signedCookies.count); // 암호화된 cookie를 복호화하여 변수 count에 저장
//...
res.cookie("count", count, {signed:true}); // cookie의 "count" 값을 암호화하여 저장
```
