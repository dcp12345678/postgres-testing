'use strict';
const request = require('supertest');
const server = require('../../app');
const api = request(server);

// Exports
module.exports = {
  api: api
};
