const express = require('express');
const cookieParser = require('cookie-parser')
const app = express();
app.use(cookieParser());

app.get('/count', (req,res) => {
  console.log('Cookies: ', req.cookies);
  let count = parseInt(req.cookies.count);
  if(!count)
    count = 0;
  count += 1;
  res.cookie("count", count);
  res.send("Count : " + count);
});

app.listen(3003, () => {
  console.log("Connected 3003 port!!!");
});
