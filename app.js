'use strict';

const fs = require('fs');
if (fs.existsSync('.env')) {
  console.log('loading .env file');
  require('dotenv').config();
}
const configObj = require('./config/config');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const express = require('express');
const massive = require('massive');
const app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');
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
  console.log('inside app.get for default path');
  //res.contentType('text/html');
  //res.send('hey there');

  console.log('calling db.getPeople...');
  db.getPeople(function(err, people) {
    console.log('returned from call to db.getPeople, function was ' + (err ? 'successful' : 'unsuccessful'));
    if (err) {
      res.send('Error getting people: ' + JSON.stringify(err));
    } else {
      console.log('fetch was successful, number person recs returned = ' + people.length);
      res.render('pages/index', { people: people });
    }
  });

});

app.get('/user', function(req, res) {
  res.status(200).json({ name: 'joey' });
})

app.get('/test', (req, res) => {
  res.contentType('text/html');
  res.send('test result');
});

module.exports = app;
