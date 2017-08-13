const app = require('./config/mysql/express')();
const passport = require('./config/mysql/passport')(app);
// 위코드 내에 app.use(passport.initialize()) 가 있는데 이 코드는 아래 정의한 라우터보다 먼저 수행되어야 한다. (그렇게 하지 않으면 req.user가 정의되지 않음!!!)

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

const auth = require('./routes/mysql/auth')(passport);
app.use('/auth', auth);

app.listen(3003, () => {
  console.log("Connected 3003 port!!!");
});
