const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Welcome!!!');
});

app.get('/login', (req, res) =>{
  res.send('<h1>Please, Login!!</h1>');
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
