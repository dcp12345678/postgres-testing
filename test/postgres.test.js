'use strict';
const helper = require('./common/helper');
const api = helper.api;
const chai = require('chai');
const assert = require('chai').assert;
const _ = require('lodash');

describe('postgres-tests', () => {

  function* _testCall() {
    let body = 'this is the body';
    const res = yield api
      .post(`/`)
      .set({
        authorization: 'dummy token'
      })
      .send(body)
      .expect(200)
      .endAsync();
    return res.body;
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
    it('Supertest', () => {
      let x  = _testCall();
    });
  });
});
