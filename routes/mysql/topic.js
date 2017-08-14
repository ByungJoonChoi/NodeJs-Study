module.exports = function(){
  const route = require('express').Router();
  const conn = require('../../config/mysql/db')();

  route.get('/add', (req, res) =>{
    let sql = 'SELECT id, title FROM topic';
    conn.query(sql, (err, topics, fields) => {
      if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
        return;
      }
      res.render('topic/add', {topics:topics});
    });
  });

  route.post('/add', (req, res) => {
    let title = req.body.title;
    let description = req.body.description;
    let author = req.body.author;
    var sql = 'INSERT INTO topic (title, description, author) VALUES(?, ?, ?)';
    var params = [title, description, author];
    conn.query(sql, params, (err, result, fields) => {
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
        return;
      }
      res.redirect('/topic/' + result.insertId);
    });
  });

  route.get(['/', '/:id'], (req, res) => {
    let sql = 'SELECT id, title FROM topic';
    conn.query(sql, function (err, topics, fields) {
      let id = req.params.id;
      if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
        return;
      }
      if(id){
        let sql ='SELECT * FROM topic WHERE id=?';
        conn.query(sql, [id], (err, rows, fields) => {
          if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
          } else {
            res.render('topic/view', {topics: topics, topic:rows[0]});
          }
        });
      } else{
          res.render('topic/view', {topics: topics});
      }
    });
  });

  route.get('/:id/edit', (req, res) => {
    let id = req.params.id;
    if(!id){
      console.log("There is no id.");
      res.status(500).send('Internal Server Error');
      return;
    }
    let sql = 'SELECT id, title FROM topic';
    conn.query(sql, (err, topics, fields) => {
      if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
        return;
      }
      let sql ='SELECT * FROM topic WHERE id=?';
      conn.query(sql, [id], (err, rows, fields) => {
        if(err){
          console.log(err);
          res.status(500).send('Internal Server Error');
        } else {
          res.render('topic/edit', {topics: topics, topic:rows[0]});
        }
      });
    });
  });

  route.post('/:id/edit', (req, res) => {
    let id = req.params.id;
    let title = req.body.title;
    let description = req.body.description;
    let author = req.body.author;

    sql = 'UPDATE topic SET title=?, description=?, author=? WHERE id=?';
    var params = [title, description, author, id];
    conn.query(sql, params, (err, rows, fields) => {
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
        return;
      }
      res.redirect('/topic/' + id);
    });
  });

  route.get('/:id/delete', (req, res) => {
    let sql = 'SELECT id, title FROM topic';
    conn.query(sql, (err, topics, fields) => {
      let id = req.params.id;
      let sql = 'SELECT * FROM topic where id=?';
      conn.query(sql, [id], (err, topic) => {
        if(err){
          console.log(err);
          res.status(500).send('Internal Server Error');
        } else{
          if(topic.length === 0){
            console.log("There is no data where id = " + id);
            res.status(500).send('Internal Server Error');
          } else {
            res.render('topic/delete', {topics:topics, topic:topic[0]});
          }
        }
      });
    });
  });

  route.post('/:id/delete', (req, res) => {
    let id = req.params.id;
    let sql = "DELETE FROM topic where id=?"
    conn.query(sql, [id], (err, result) => {
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
      }
      res.redirect('/topic');
    });
  });

  return route;
}
