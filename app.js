const express = require('express');
const app = express();
// app.use(express.static('public'));
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.send('Welcome!!!');
});

app.get('/login', (req, res) =>{
  res.send('<h1>Please, Login!!</h1>');
});

app.get('/image', (req, res) => {
  res.send('image <br><img src="/totoro.jpg" width=350 >');
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
