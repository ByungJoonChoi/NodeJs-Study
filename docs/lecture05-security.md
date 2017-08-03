# 비밀번호 보안
## 1. sha256 모듈 설치
```
$ npm install --save sha256
```

## 2. 사용방법
```javascript
const sha256 = require('sha256');
let pwd = '1111';
sha256(pwd);
```
위와 같이 sha256을 pwd에 적용하면 해쉬값을 얻을 수 있다.<br>
이렇게 비밀번호를 직접 저장하지 않으면 혹시나 서버에 저장된 비밀번호를 탈취당해도 비교적 안전하다.<br>
그런데 해쉬 알고리즘만으로는 보안성을 보장할 수 없어서 비밀번호에 랜덤한 값을 더한 것에 해쉬를 적용하는 salted hash를 주로 사용한다.<br>
```javascript
sha256(pwd + salt);
```
사용자마다 다른 salt를 사용하면 보안적으로 더 안전하다.
