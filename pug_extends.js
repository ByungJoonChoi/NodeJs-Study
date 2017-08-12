const express = require('express');
const app = express();
app.locals.pretty = true; // 페이지 소스 보기 할 때 이쁘게 보기!!
app.set('view engine', 'pug');
app.set('views', 'pug');
app.get('/view', (req, res) => {
  res.render('view')
});
app.get('/add', (req, res) => {
  res.render('add')
});
app.listen(3003, () => {
  console.log('Connect 3003 port')
})
