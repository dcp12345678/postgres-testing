'use strict';

const fs = require('fs');
if (fs.existsSync('.env')) {
  console.log('loading .env file');
  require('dotenv').config();
}
const helper = require('./common/helper');
const api = helper.api;
const chai = require('chai');
const assert = require('chai').assert;
const _ = require('lodash');
const configObj = require('../config/config');
const massive = require('massive');
const path = require('path');

console.log('dbPath = ' + path.join(__dirname, '../db'));

const db = massive.connectSync({
  connectionString: configObj.DATABASE_CONN_DETAILS,
  scripts: path.join(__dirname, '../db')
});

describe('postgres-tests', () => {

  function* _testCall() {
    let body = 'this is the body';
    const res = yield api
      .get(`/test`)
      .set({
        authorization: 'dummy token'
      })
      .send(body)
      .expect('Content-Type', /html/)
      .expect(200)
      .endAsync();
    return res.text;
  }

  beforeEach((done) => {
    if (_.isFunction(done)) {
      done();
    }
  });
  afterEach((done) => {
    done();
  });

  describe('1st test', () => {
    it('should get correct property values for user object', () => {
      var user = {
        name: 'Joey',
        age: 42
      };
      assert.equal(user.name, 'Joey');
      assert.equal(user.age, 42);
    });
  });

  describe('Supertest', () => {
    it('should get correct text returned', function*() {
      debugger;
      let x = yield _testCall();
      console.log('x = ' + x);
      assert.equal(x, 'test result');
    });

    it('should get correct json returned', function*() {
      const res = yield api
        .get('/user')
        .expect('Content-Type', /json/)
        .expect('Content-Length', '15')
        .expect(200)
        .endAsync();
      assert.equal(res.body.name, 'joey');
    });

    it('should load DB recs correctly', (done) => {
      db.loadTestData((err) => {
        if (err) {
          console.log('error loading data: ' + JSON.stringify(err));
        }
        done();
      });
    });

    it('should run SQL to get DB recs correctly', (done) => {
      db.run("select * from person p, dept d where p.dept_id = d.id", [], function(err, people) {
        //all people
        if (err) {
          console.log('error getting records: ' + JSON.stringify(err));
        } else {
          console.log('number of records returned from person table = %d', people.length);
        }
        done();
      });

    });

    it('should run script to get DB recs correctly', (done) => {
      db.getPeople((err, people) => {
        if (err) {
          console.log('error running script: ' + JSON.stringify(err));
        } else {
          console.log('number of person records in DB is = ' + people.length);
          console.log('data returned is = ' + JSON.stringify(people));
        }
        done();
      });
    });

  });
});
