const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const app = express();
const fs = require('fs');
app.locals.pretty = true; // 페이지 소스 보기 할 때 이쁘게 보기!!
app.set('view engine', 'pug');
app.set('views', './views_file');
app.use(bodyParser.urlencoded({extended: false}));

app.get('/upload', (req, res) => {
  res.render('uploadform');
});

app.post('/upload', (req, res) => {
  res.send("upload post");
});
app.get('/topic/new', (req,res) =>{
  fs.readdir('data', (err,files) => {
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    res.render('new', {topics:files});
  });
});

app.post('/topic', (req, res) => {
  let title = req.body.title;
  let description = req.body.description;
  fs.writeFile('data/'+title, description, 'utf8', (err)=>{
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    res.redirect('/topic/' + title);
  });
});

app.get(['/topic', '/topic/:topic'], (req,res) => {
  fs.readdir('data', (err,files) => {
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    let topic = req.params.topic;
    if(topic){
      fs.readFile('data/' + topic, 'utf8' ,(err, data) => {
        if(err){
          console.log(err);
          res.status(500).send('Internal Server Error');
        }
        console.log(data);
        res.render('view', {topics: files, title: topic, description: data});
      });
    } else{
      res.render('view', {topics: files, title: "Welcome", description: "Hello, JavaScript for server"});
    }
  });
});

app.listen(3000, () => {
  console.log("Connected, 3000 port");
});
