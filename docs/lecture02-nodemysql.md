# node-mysql 기본
## 1. 모듈 설치 및 접속
1\) 모듈 설치
```
$ npm install --save node-mysql
```
2\) 접속
```javascript
const mysql      = require('mysql');
const conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '111111',
  database : 'o2'
});
conn.connect();
```

## CRUD
1\) C(create)
```javascript
var sql = 'INSERT INTO topic (title, description, author) VALUES("Express", "Web framework", "duru")';
conn.query(sql, (err, rows, fields) => {
  if(err){
    console.log(err);
    return;
  }
  console.log(rows.insertId);
});
```
보통은 위와같이 VALUES 부분을 하드코딩하지 않고 아래와 같이 params에 값을 넣어 넘겨준다.<br>
(이유? 동적 프로그래밍, sql-injection 공격 회피)

```javascript
var sql = 'INSERT INTO topic (title, description, author) VALUES(?, ?, ?)';
var params = ['supervisor', 'watcher', 'cbj0618'];
conn.query(sql, params, (err, rows, fields) => {
  if(err){
    console.log(err);
    return;
  }
  console.log(rows.insertId);
});
```
(tip: rows.insertId 를 통해 DB에 추가된 데이터의 id를 알 수 있다.)

2\) R(read)
```javascript
var sql = 'SELECT * FROM topic';
conn.query(sql, function (err, rows, fields) {
  if (err) {
    console.log(err);
    return;
  }
  for(let i=0; i<rows.length; i++){
    console.log(rows[i].title);
  }
});
```

3\) U(update)
```javascript
var sql = 'UPDATE topic SET title=?, author=? WHERE id=?';
var params = ['NPM', 'leezhe', 1];
conn.query(sql, params, (err, rows, fields) => {
  if(err){
    console.log(err);
    return;
  }
  console.log(rows);
});
```

4\) D(delete)
```javascript
var sql = 'DELETE from topic WHERE id=?';
var params = [1];
conn.query(sql, params, (err, rows, fields) => {
  if(err){
    console.log(err);
    return;
  }
  console.log(rows);
});
```

