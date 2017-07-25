const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
app.locals.pretty = true; // 페이지 소스 보기 할 때 이쁘게 보기!!
app.set('view engine', 'pug');
app.set('views', './views_file');
app.use(bodyParser.urlencoded({extended: false}));

app.get('/topic/new', (req,res) =>{
  res.render('new');
});

app.post('/topic', (req, res) => {
  let title = req.body.title;
  let description = req.body.description;
  fs.writeFile('data/'+title, description, 'utf8', (err)=>{
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    res.send('Success!');
  });
});

app.get('/topic', (req,res) => {
  fs.readdir('data', (err,files) => {
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    console.log(files);
    res.render('view', {topics: files});
  });
});

app.listen(3000, () => {
  console.log("Connected, 3000 port");
});
