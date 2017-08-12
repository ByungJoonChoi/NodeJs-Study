module.exports = function(passport){
  const route = require('express').Router();

  route.post(
    '/login',
    passport.authenticate(
      'local',
      {
        successRedirect: '/welcome',
        failureRedirect: '/login',
        failureFlash: false // 인증에 실패한 경우 일회성 메시지를 띄워주는 기능
      }
    )
  );

  route.get(
    '/facebook',
    passport.authenticate(
      'facebook',
      {
        scope: 'email'
      }
    )
  );

  route.get(
    '/facebook/callback',
    passport.authenticate(
      'facebook',
      {
        successRedirect: '/welcome',
        failureRedirect: '/auth/login'
      }
    )
  );

  route.post('/register', (req, res) => {
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

  route.get('/register', (req, res) => {
    res.render('auth/register');
  });

  route.get('/login', (req, res) => {
    res.render('auth/login');
  });

  route.get('/logout', (req, res) => {
    req.logout(); // 이 코드가 실행되면 세션에 사용자 식별정보를 삭제한다.(세션에 "passport":{}와 같이 user 속성이 사라진다.)
    req.session.save(()=>{
      res.redirect('/welcome');
    });
  });

  return route;
}
