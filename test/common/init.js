/**
 * Prepare testing environment
 */
'use strict';

console.log('inside init!');

require('dotenv').config();
process.env.NODE_ENV = 'test';

require('should');
require('co-mocha');

// Modify supertest.
const P = require('bluebird');
P.config({
  longStackTraces: true
});
const Test = require('supertest/lib/test');
Test.prototype.endAsync = P.promisify(Test.prototype.end);

/**
 * Finish request and assert api error
 * @param {String} errorMessage the error message to assert
 * @returns {Object} the original response
 */
Test.prototype.assertError = function* (errorMessage) {
  const res = yield this.endAsync();
  res.body.message.should.startWith(errorMessage);
  return res;
};
