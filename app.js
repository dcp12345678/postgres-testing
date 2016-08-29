'use strict';

require('dotenv').config();

const configObj = require('./config/config');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const express = require('express');
const massive = require('massive');
const app = express();

app.use(bodyParser.json());
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(express.static(path.join(__dirname, 'public')));

app.set('port', configObj.PORT || 3000);

const baseUrl = 'http://localhost:' + app.get('port');

const db = massive.connectSync({
  connectionString: configObj.DATABASE_CONN_DETAILS,
  scripts: path.join(__dirname, 'db')
});

http.createServer(app).listen(app.get('port'), () => {
  console.log('express server started on port : %d', app.get('port'));
  //straight up SQL 
  db.run("select * from person", [], function(err, people) {
    //all people
    console.log('number of records returned from person table = %d', people.length);
  });
});

app.get('/', (req, res) => {
  res.contentType('text/html');
  res.send('hey there');
});

app.get('/user', function(req, res) {
  res.status(200).json({ name: 'joey' });
})

app.get('/test', (req, res) => {
  res.contentType('text/html');
  res.send('test result');
});

module.exports = app;
