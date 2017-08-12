const express = require('express');
const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser')
const bkfd2Password = require("pbkdf2-password");
const hasher = bkfd2Password();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const app = express();
app.use(session({
  secret: 'kdasjf093j9qf03jf',
  resave: false,
  saveUninitialized: true,
  store: new MySQLStore({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '111111',
      database: 'o2'
  })
}))
const mysql      = require('mysql');
const conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '111111',
  database : 'o2'
});
conn.connect();

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
  <a href="/auth/facebook">facebook</a>
  `;
  res.send(output);
});

let users = [
  {
    authId:'local:peter',
    username:'peter',
    password:'72RFGsoQCbT+7qBDtskR9CrcDfF4g4Pde2R9ughcqjlKSXufdhgWvgMIBYyh4XLG8SnOAun+s7wF7QmZ29CHrofMCxiIhOclxRlXztphg4pAJpizW7kh9CNZ/ASdjosSlO/POQF7pcTfSF/HaySPjJwdJGD3LTPbE5OFmC58KpE=',
    displayName:'Peter Choi',
    salt:"k5i+KUCCD8UZd8Xh1PjHB/2frrTemhfG90wlKj2KqbdFbT/Kcjcr/Z1mLJKk8n/RtHbPnOxjcJOkgJ9EpU9pqA=="
  }
];
passport.serializeUser(function(user, done) {
  console.log('serializeUser', user);
  return done(null, user.authId);
});

passport.deserializeUser(function(id, done) {
  console.log('deserializeUser', id);
  let sql = 'SELECT * FROM users WHERE authId=?';
  conn.query(sql, [id], (err, results) => {
    if(err){
      console.log(err);
      return done(null, false);
    }
    let user = results[0];
    if(user.authId == id){
      return done(null, user);
    }
  });
});

passport.use(new LocalStrategy(
  (username, password, done) => {
    // 여기부터 developer custom logic
    let sql ='SELECT * FROM users WHERE authId=?';
    conn.query(sql, ['local:' + username], (err, results) => { // fields는 사용안하니 생략했고, rows 보다는 results라는 이름이 적합해 보여서 사용함
      if(err){
        console.log(err);
        return done(null, false);
      }
      let user = results[0];
      hasher({'password':password, 'salt':user.salt}, (err, pass, salt, hash) => {
        if(user.password === hash){
          done(null, user);
        } else {
          done(null, false);
        }
      });
    });
  }
));
passport.use(new FacebookStrategy({
    clientID: '106437943385750',
    clientSecret: '91040649fff896c7fa1811bc32a9510f',
    callbackURL: "/auth/facebook/callback",
    profileFields:['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified', 'displayName']
  },
  function(accessToken, refreshToken, profile, done) {
    let authId = "facebook:" + profile.id;
    let sql = 'SELECT * FROM users WHERE authId=?'
    conn.query(sql, [authId], (err, results) => {
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
        return;
      }

      if(results.length > 0){
        console.log("login!!")
        return done(null, results[0]);
      } else {
        console.log("have to create user")
        let newUser = {
          authId:authId,
          email:profile.emails[0].value,
          displayName:profile.displayName
        }
        let sql = 'INSERT INTO users SET ?'
        conn.query(sql, newUser, (err, results) => {
          if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
            return;
          }
          return done(null, newUser);
        });
      }
    });
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
app.get(
  '/auth/facebook',
  passport.authenticate(
    'facebook',
    {
      scope: 'email'
    }
  )
);
app.get(
  '/auth/facebook/callback',
  passport.authenticate(
    'facebook',
    {
      successRedirect: '/welcome',
      failureRedirect: '/auth/login'
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
      'authId':'local:'+req.body.username,
      'username':req.body.username,
      'password':hash,
      'displayName':req.body.displayName,
      'salt':salt,
      'email':req.body.username
    };
    let sql = 'INSERT INTO users SET ?';
    conn.query(sql, user, (err, result) => {
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
        return;
      }
      req.login(user, function(){ //serializeUser 콜백함수가 실행되며 done을 하게 되면 여기 익명함수가 콜백된다.
        console.log("login callback");
        req.session.save(()=>{
          res.redirect('/welcome');
        });
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
