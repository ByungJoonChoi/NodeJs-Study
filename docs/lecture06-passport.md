# Passportjs 모듈
## 1. Passportjs란?
웹서비스는 사용자에게 다양한 인증방법들(id/pw, 페이스북, 카카오톡, 구글, 등)을 제공한다.<br>
패스포트는 우선 모든 인증방법에서 사용되는 공통된 부분을 만들어 놓았다.<br>
그리고 각 인증방법들에 대해 구체적으로 다른 부분을 Strategy로 따로 추가하여 적용하도록 하였다.<br>

## 2. passport, passport-local 사용하기
### 1\) 모듈 설치
```
$ npm install --save passport
$ npm install --save passport-local
```

### 2\) 기본 설정
```javascript
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
//...
app.use(session({
  secret: 'kdasjf093j9qf03jf',
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
}))
app.use(passport.initialize());
app.use(passport.session());  // 이 코드는 위에 app.use(session(){}) 다음에 실행되어야 함

```
여기서 주의할 점은 app.use(passport.session())은 **app.use(session({}))입력 이후에 입력**해야 한다!!

### 3\) 라우터 연결
```javascript
app.post(
  '/auth/login',
  passport.authenticate(
    'local',
    {
      successRedirect: '/welcome',
      failureRedirect: '/auth/login',
      failureFlash: false // 인증에 실패한 경우 일회성 메시지를 띄워주는 기능
    }
  )
);
```
로그인 인증 요청을 하고자 하는 라우터에 두번째 인자로 passport.authenticate() 미들웨어를 넘긴다.<br>
미들웨어는 첫번째 인자('local')를 통해 해당 Strategy(여기서는 LocalStrategy)에 처리를 위임한다.<br>

### 4\) post method로 인증 요청시 주의사항
```html
<form action="/auth/login" method="post">
    <div>
        <label>Username:</label>
        <input type="text" name="username"/>
    </div>
    <div>
        <label>Password:</label>
        <input type="password" name="password"/>
    </div>
    <div>
        <input type="submit" value="Log In"/>
    </div>
</form>
```
사용자 이름과 비밀번호의 name을 각각 "username", "password"로 설정해서 전달해야 한다.<br>

### 5\) LocalStrategy 상세 구현
```javascript
passport.use(new LocalStrategy(
  (username, password, done) => {
    // 여기부터 developer custom logic
    let uname = username;
    let pwd = password;
    for(let i=0 ; i<users.length; i++){
      let user = users[i];
      if(user.username === uname){
        return hasher({password:pwd, salt:user.salt}, (err, pass, salt, hash) => {
          if(user.password === hash){
            done(null, user);
          } else {
            done(null, false);
          }
        });
      }
    }
    done(null, false);
  }
));
```
**3\) 라우터 연걸** 에서 설정한 라우터로 요청이 들어오면 passport.authenticate 미들웨어가 실행되는데<br>
첫번째 인자가 'local'이기 때문에 위 콜백함수 로직이 수행된다.<br>
콜백함수의 username, password에는 4\)에서 정의했던 form에 의해 전송된 username, password값이 넘어온다.<br>
이 값들을 가지고 custom한 인증 로직을 실행한 뒤 done()함수에 인자를 전달하면 된다.<br><br>
인증에 성공한 경우 done(null, user)를 실행한다.<br>
이때 전달하는 user객체는 각 사용자를 식별할 수 있는 식별자를 속성으로 포함해야 한다.(Primary key와 같은 식별자)<br>
이 식별자는 나중에 세션정보를 저장할 때 세션에 "passport":{"user":[식별자]} 와 같은 형태로 저장된다.<br><br>
인증에 실패한 경우 done(null, false)를 실행한다.<br>

### 6\) 세션정보 등록 및 확인
```javascript
passport.serializeUser(function(user, done) {  
  done(null, user.username);
});

passport.deserializeUser(function(id, done) {
  for(let i=0 ; i<users.length; i++){
    let user = users[i]
    if(user.username == id){
      return done(null, user);
    }
  }
});
```
LocalStrategy에서 done(null, user)가 샐행되면 user를 첫번째 인자로 넘겨주면서 serializeUser의 익명함수가 실행된다.<br>
이 익명함수에서 done(null, {식별자})를 실행하면 식별자를 세션에 저장한다.(여기서는 식별자로 username을 사용)<br>

deserializeUser 콜백함수는 세션정보가 저장되어 있는 사용자가 웹페이지를 로드할 때마다 호출된다.<br>
이때 id로는 사용자 식별자(여기서는 username)를 전달해준다. 

### 7\) 기본 내부 프로세스
passport를 사용하면 기본적으로 어떤 라우터로든 요청이 들어올 때 내부적으로 다음과 같은 프로세스가 진행된다.<br>

1\. 세션에 사용자 식별자("passport":{"user":[식별자]})가 있는지를 확인한다.<br>
2-a\. [식별자]가 존재하지 않으면 (보통 "passport":{} 상태인 경우임) 라우터 두번째 인자인 익명함수(req,res)를 바로 실행<br>
2-b\. [식별자]가 존재하는 경우 deserializeUser 콜백이 실행되어 [식별자]로부터 user를 식별하여 req.user객체에 저장함.<br>
3\. 익명함수(req,res)를 실행함. 이때 req.user로 해당 user 정보에 접근할 수 있음.<br>

### 8\) 로그인, 로그아웃
로그인
```javascript
req.login(user, function(){ //serializeUser 콜백함수가 실행되며 done을 하게 되면 여기 익명함수가 콜백된다.
  console.log("login callback");
  req.session.save(()=>{
    res.redirect('/welcome');
  });
});
```
회원가입 로직에서, user를 DB에 추가한 뒤 **해당 user가 접속중**이라는 정보를 세션에 저장해야 한다.<br>
이를 위해서 req.login() 메소드를 사용한다. 이 메소드를 호출하면 serializeUser 콜백함수가 실행된다.(이때 세션 정보를 저장한다.)<br>
serializeUser 콜백함수에서 done을 만나면 다시 req.login()함수의 콜백으로 들어와서 다음 로직을 수행한다.<br><br>
로그아웃
```javascript
app.get('/auth/logout', (req, res) => {
  req.logout(); // 이 코드가 실행되면 세션에 사용자 식별정보를 삭제한다.
  req.session.save(()=>{
    res.redirect('/welcome');
  });
});
```
로그아웃 로직을 구현하려면 세션 정보에서 **현재 접속중인 사용자 식별 정보를 제거**해야 한다.<br>
req.logout() 메소드를 호출하면 세션에 저장된 사용자 식별정보를 삭제한다.(세션에 "passport":{}와 같이 user 속성이 사라진다.)<br>

### 9\) deserializeUser 관련 팁
```javascript
passport.deserializeUser(function(id, done) {
  console.log('deserializeUser', id);
  for(let i=0 ; i<users.length; i++){
    let user = users[i]
    if(user.username == id){
      return done(null, user); // 이 코드가 실행되면서 req.user 객체가 만들어진다.
    }
  }
});
```
deserializeUser가 하는 일을 리마인드 해보면,<br> <br>
세션에 저장된 사용자 식별자(id)로 사용자 DB를 검색하여, <br>
해당 사용자의 전체 정보를 가지고 있는 user객체를 생성한 뒤, <br>
req.user 객체에 저장한다. <br><br>
그런데 세션에 저장된 사용자 식별자에 해당하는 정보가 DB에서 지워진 상황이 있을 수도 있다.(예 : 관리자가 차단하는 경우)<br>
이런 경우에는 for문을 아무리 돌아도 해당 식별자가 존재하지 않기 때문에 done이 호출되지 않는다.<br>
(done이 호출되지 않으면 웹페이지를 요청한 라우터의 콜백함수로 넘어가지 않기 때문에 화면은 멈춰있는 상태가 된다.)<br>
이런 경우를 대응하기 위해 for문 밖에도 done(null, null)을 호출해야 한다.<br>
(그리고, 이 경우 done(null, null)이 호출되면 세션에 사용자 식별자도 지워진다.)
