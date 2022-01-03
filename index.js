const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();

let db = new sqlite3.Database(':memory:');

db.serialize(function () {
  db.run('CREATE TABLE images(name TEXT, desc TEXT)');
  var stmt = db.prepare('INSERT INTO images values(?, ?)');
  stmt.run('Image 1', 'Impressive work!');
  stmt.run('Image 2', 'Wow!');
  stmt.finalize();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile('public/index.html');
});

app.get('/images', (req, res) => {
  db.all('SELECT name, desc FROM images', (err, rows) => {
    res.send(rows);
  });
})

app.listen(3000, () => console.log('server started'));
