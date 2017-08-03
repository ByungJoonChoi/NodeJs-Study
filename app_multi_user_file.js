const express = require('express');
const session = require('express-session')
const FileStore = require('session-file-store')(session);
const bodyParser = require('body-parser')
const sha256 = require('sha256');
const app = express();
app.use(session({
  secret: 'kdasjf093j9qf03jf',
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
}))
// secret : session을 쿠키에 저장할 때 암호화할 때 사용하는 키?
// session()은 기본적으로 정보를 메모리에 저장
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
    password:'9e50affe4d3889511e99311a3f432eb1b788c21e019b760f0fd7f6fd67839045',
    displayName:'BJ Choi',
    salt:"(*&^%$#@!~!@#$%^&*()_+)"
  }
];

function makeSalt(){
  let salt = "";
  let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*()_+-=";

  for (let i = 0; i < 30; i++)
    salt += letters.charAt(Math.floor(Math.random() * letters.length));

  return salt;
}

app.post('/auth/login', (req, res) => {
  let uname = req.body.username;
  let pwd = req.body.password;
  for(let i=0 ; i<users.length; i++){
    let user = users[i];
    if(user.username === uname && user.password === sha256(pwd+user.salt)){
      req.session.displayName = user.displayName;
      return req.session.save(()=>{
         res.redirect('/welcome');
      });
    }
  }
  delete req.session.displayName;
  req.session.save(()=>{
    res.send('Who are you? <a href="/auth/login">login</a>');
  });
});

app.get('/welcome', (req,res) => {
  if(req.session.displayName){
    res.send(`
      <h1>Hello, ${req.session.displayName}</h1>
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
  let salt = makeSalt();
  users.push({
    'username':req.body.username,
    'password':sha256(req.body.password + salt),
    'displayName':req.body.displayName,
    'salt':salt
  })
  req.session.displayName = req.body.displayName;
  req.session.save(()=>{
    res.redirect('/welcome');
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
  delete req.session.displayName;
  res.redirect('/welcome');
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
