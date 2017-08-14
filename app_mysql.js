const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.locals.pretty = true; // 페이지 소스 보기 할 때 이쁘게 보기!!
app.set('view engine', 'pug');
app.set('views', './views/mysql');
app.use(bodyParser.urlencoded({extended: false}));

const topic = require('./routes/mysql/topic')();
app.use('/topic', topic);

app.listen(3000, () => {
  console.log("Connected, 3000 port");
});
