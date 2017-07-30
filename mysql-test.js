const mysql      = require('mysql');
const conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '111111',
  database : 'o2'
});
conn.connect();

// var sql = 'INSERT INTO topic (title, description, author) VALUES("Express", "Web framework", "duru")';
// conn.query(sql, (err, rows, fields) => {
//   if(err){
//     console.log(err);
//     return;
//   }
//   console.log(rows.insertId);
// });

// [CREATE]
// var sql = 'INSERT INTO topic (title, description, author) VALUES(?, ?, ?)';
// var params = ['supervisor', 'watcher', 'cbj0618'];
// conn.query(sql, params, (err, rows, fields) => {
//   if(err){
//     console.log(err);
//     return;
//   }
//   console.log(rows.insertId);
// });

// [READ]
sql = 'SELECT * FROM topic';
conn.query(sql, function (err, rows, fields) {
  if (err) {
    console.log(err);
    return;
  }
  for(let i=0; i<rows.length; i++){
    console.log(rows[i].title);
  }
});

// [UPDATE]
// sql = 'UPDATE topic SET title=?, author=? WHERE id=?';
// var params = ['NPM', 'leezhe', 1];
// conn.query(sql, params, (err, rows, fields) => {
//   if(err){
//     console.log(err);
//     return;
//   }
//   console.log(rows);
// });

// [Delete]
// sql = 'DELETE from topic WHERE id=?';
// var params = [1];
// conn.query(sql, params, (err, rows, fields) => {
//   if(err){
//     console.log(err);
//     return;
//   }
//   console.log(rows);
// });

conn.end();
