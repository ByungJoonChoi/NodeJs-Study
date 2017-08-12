module.exports = function(app){
  var express = require('express');
  var route = express.Router();
  route.get('/r1', (req, res) => {
    res.send("Hello /p1/r1");
  })
  route.get('/r2', (req, res) => {
    res.send("Hello /p1/r2");
  })
  app.get('/p3', (req, res) => {
    res.send("p3!!")
  })
  return route;
}
