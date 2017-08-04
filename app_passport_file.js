const express = require('express');
const session = require('express-session')
const FileStore = require('session-file-store')(session);
const bodyParser = require('body-parser')
const bkfd2Password = require("pbkdf2-password");
const hasher = bkfd2Password();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const app = express();
app.use(session({
  secret: 'kdasjf093j9qf03jf',
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
}))
app.use(passport.initialize());
app.use(passport.session());  // 이 코드는 위에 app.use(session(){}) 다음에 실행되어야 함
app.use(bodyParser.urlencoded({extended: false}));
app.get('/auth/login', (req, res) => {
  var output = `
  <h1>Login</h1>
  <form action="/auth/login" method="post">
    <p>
      <input type="text" name="username" placeholder="username">
    </p>
    <p>
      <input type="password" name="password" placeholder="password">
    </p>
    <p>
      <input type="submit">
    </p>
  </form>
  `;
  res.send(output);
});

let users = [
  {
    username:'peter',
    password:'72RFGsoQCbT+7qBDtskR9CrcDfF4g4Pde2R9ughcqjlKSXufdhgWvgMIBYyh4XLG8SnOAun+s7wF7QmZ29CHrofMCxiIhOclxRlXztphg4pAJpizW7kh9CNZ/ASdjosSlO/POQF7pcTfSF/HaySPjJwdJGD3LTPbE5OFmC58KpE=',
    displayName:'BJ Choi',
    salt:"k5i+KUCCD8UZd8Xh1PjHB/2frrTemhfG90wlKj2KqbdFbT/Kcjcr/Z1mLJKk8n/RtHbPnOxjcJOkgJ9EpU9pqA=="
  }
];
passport.serializeUser(function(user, done) {
  console.log('serializeUser', user);
  done(null, user.username);
});

passport.deserializeUser(function(id, done) {
  console.log('deserializeUser', id);
  for(let i=0 ; i<users.length; i++){
    let user = users[i]
    if(user.username == id){
      return done(null, user); // 이 코드가 실행되면서 req.user 객체가 만들어진다.
    }
  }
  console.log("식별자에 해당하는 사용자가 없음");
  return done(null, null); // 세션에 식별자는 있는데 해당하는 사용자가 없는 경우 여기서 done을 해주지 않으면 계속 기다린다. done을 해줘야 라우터의 익명함수를 실행하는 것 같다. 그리고, 이때 세션에 있던 식별자를 지운다.
});

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

/* 내부 프로세스 :
1. 세션에서 "passport":{"user":[식별자]} 부분에 식별자 확인
2-a. [식별자]가 존재하지 않으면 (보통 "passport":{} 상태인 경우임) 라우터 두번째 인자인 익명함수(req,res)를 바로 실행
2-b. [식별자]가 존재하는 경우 deserializeUser 콜백이 실행되어 [식별자]로부터 user를 식별하여 req.user객체에 저장함.
3. 익명함수(req,res)를 실행함. 이때 req.user로 해당 user 정보에 접근할 수 있음.
*/
app.get('/welcome', (req,res) => {
  if(req.user && req.user.displayName){
    res.send(`
      <h1>Hello, ${req.user.displayName}</h1>
      <a href="/auth/logout">LogOut</a>
    `);
  } else {
    res.send(`
      <h1>Welcome</h1>
      <ul>
        <li><a href="/auth/login">Login</a></li>
        <li><a href="/auth/register">Register</a></li>
      </ul>
    `);
  }
})

app.post('/auth/register', (req, res) => {
  hasher({password:req.body.password}, (err, pass, salt, hash) => {
    let user = {
      'username':req.body.username,
      'password':hash,
      'displayName':req.body.displayName,
      'salt':salt
    };
    users.push(user);
    req.login(user, function(){ //serializeUser 콜백함수가 실행되며 done을 하게 되면 여기 익명함수가 콜백된다.
      console.log("login callback");
      req.session.save(()=>{
        res.redirect('/welcome');
      });
    });
  });
});

app.get('/auth/register', (req, res) => {
  var output = `
  <h1>Register</h1>
  <form action="/auth/register" method="post">
    <p>
      <input type="text" name="username" placeholder="username">
    </p>
    <p>
      <input type="password" name="password" placeholder="password">
    </p>
    <p>
      <input type="text" name="displayName" placeholder="displayName">
    </p>
    <p>
      <input type="submit">
    </p>
  </form>
  `;
  res.send(output);
});

app.get('/auth/logout', (req, res) => {
  req.logout(); // 이 코드가 실행되면 세션에 사용자 식별정보를 삭제한다.(세션에 "passport":{}와 같이 user 속성이 사라진다.)
  req.session.save(()=>{
    res.redirect('/welcome');
  });
});

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
