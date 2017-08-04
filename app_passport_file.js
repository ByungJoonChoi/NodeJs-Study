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
      return done(null, user);
    }
  }
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

// app.post('/auth/login', (req, res) => {
//   let uname = req.body.username;
//   let pwd = req.body.password;
//   for(let i=0 ; i<users.length; i++){
//     let user = users[i];
//     if(user.username === uname){
//       return hasher({password:pwd, salt:user.salt}, (err, pass, salt, hash) => {
//         if(user.password === hash){
//           req.session.displayName = user.displayName;
//           req.session.save(()=>{
//             res.redirect('/welcome');
//           });
//         } else {
//           delete req.session.displayName;
//           req.session.save(()=>{
//             res.send('Who are you? <a href="/auth/login">login</a>');
//           });
//         }
//       });
//     }
//   }
//   delete req.session.displayName;
//   req.session.save(()=>{
//     res.send('Who are you? <a href="/auth/login">login</a>');
//   });
// });

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
  hasher({password:req.body.password}, (err, pass, salt, hash) => {
    users.push({
      'username':req.body.username,
      'password':hash,
      'displayName':req.body.displayName,
      'salt':salt
    })
    req.session.displayName = req.body.displayName;
    req.session.save(()=>{
      res.redirect('/welcome');
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
