module.exports = function(app){
  const conn = require('./db')();
  const bkfd2Password = require("pbkdf2-password");
  const hasher = bkfd2Password();
  const passport = require('passport');
  const LocalStrategy = require('passport-local').Strategy;
  const FacebookStrategy = require('passport-facebook').Strategy;
  app.use(passport.initialize());
  app.use(passport.session());  // 이 코드는 위에 app.use(session(){}) 다음에 실행되어야 함


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
  return passport;
}
