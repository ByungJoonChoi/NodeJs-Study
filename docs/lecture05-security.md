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

## 3. pbkdf2
### 1\) pbkdf2 란? <br>
salted hash에 hash함수를 여러번 iteration해서 hash를 얻어내는 방법을 키 스트레칭(key stretching)이라고 한다.<br>
키 스트레칭은 해싱반복횟수가 많아질수록 비밀번호 검증속도를 늦출 수 있어서 brute-force attack에 소요되는 시간을 늘릴수 있다.<br>
이러한 키 스트레칭을 응용하여 널리 사용되고 있는 알고리즘이 **pbkdf2**이다.<br>
pbkdf2는 key derivation function의 한 종류로써 NIST에서 승인되고, 미국정부에서도 사용되는 검증된 알고리즘이다. <br>
(key derivation function은 다이제스트를 생성할 때 솔팅과 키 스트레칭을 반복하며, 솔트와 패스워드 외에도 입력 값을 추가하여 공격자가 쉽게 다이제스트를 유추할 수 없도록 하고 보안의 강도를 선택할 수 있다.)<br><br>
**아무튼 결론은 pbkdf2라는 알고리즘은 비밀번호 보안을 위해 널리 사용되어지는 검증된 알고리즘이라는 거!!**

### 2\) pbkdf2-password 모듈 설치
```
$ npm install --save pbkdf2-password
```

### 3\) pbkdf2-password 모듈 설정 및 사용
```javascript
const bkfd2Password = require("pbkdf2-password");
const hasher = bkfd2Password();
```
위와 같이 hasher를 가져오고 아래와 같이 사용한다.<br>
```javascript
hasher({password:'1111'}, (err, pass, salt, hash) => {


});
```
함수를 실행할 때 첫번째 인자로 option 객체를, 두번째 인자로 콜백함수를 전달한다.<br>
option객체의 property로 password를 설정하면 그 password가 콜백함수의 인자 pass로 전달된다.<br>
(위 예제에서는 pass 가 '1111'로 저장됨)<br>
salt는 기본적으로 hasher가 랜덤하게 만들어서 저장해서 넘겨주며, 사용자가 지정한 salt를 사용하려면 아래와 같이 option에 추가하면 된다.
```javascript
hasher({password:'1111', salt:'1234567890'}, (err, pass, salt, hash) =>{

});
```
hash에는 pbkdf2 알고리즘이 적용된 hash값이 저장된다.<br>
우리는 이 hasher 함수를 이용하여 hash값을 생산/검증하면 된다.<br>
