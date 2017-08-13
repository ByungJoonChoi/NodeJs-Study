module.exports = function(){
  const express = require('express');
  const session = require('express-session')
  const MySQLStore = require('express-mysql-session')(session);
  const bodyParser = require('body-parser')
  const app = express();
  app.set('view engine', 'pug');
  app.set('views', './views/mysql');
  app.use(bodyParser.urlencoded({extended: false}));
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
  return app;
}
