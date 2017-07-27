# 파일 업로드
## 1.upload from WebClient to Server
파일 업로드를 위해서 html의 form, input(type="file")태그를 사용한다.<br>
이때 form태그에 enctype="multipart/form-data" 속성을 설정해 주어야 한다.

## 2.multer 설치
multer : 파일 업로드를 구현하기 위한 모듈<br>
```
$ npm install --save multer
```

## 3.multer 사용 기초<br>
```javascript
const multer = require('multer');
const upload = multer({ dest: 'uploads/' })
```
미들웨어 upload를 생성하고 파일을 저장할 path를 uploads/로 설정함<br>
라우터의 두번째 인자로 upload.single('userfile')를 넘겨주면, 세번째 인자인 익명함수가 실행되기 전에 upload.single('userfile')가 실행되어
req.file에 클라이언트로부터 받은 파일을 저장해준다.<br>
이때 'userfile'은 input(type='file') 태그의 name 속성값을 의미한다.<br>
```javascript
app.post('/upload', upload.single('userfile'), (req, res) => {
  res.send(req.file);
  });
```
위와 같이 코드를 실행하면 uploads/ 폴더에 파일을 저장한다.(이때 파일이름은 random)

## 4.multer 고급 설정<br>

```javascript
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
})
const upload = multer({ storage: storage });
```
위와같이 multer의 storage를 설정하면 로컬 저장 폴더, 파일에 대한 naming rule 을 동적으로 설정해줄 수 있다.






