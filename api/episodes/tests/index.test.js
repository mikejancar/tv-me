const assert = require('assert');
const keys = require('../keys.json');
const events = require('./example-events.json');
const series = require('../index');

describe('TV Me API - Episodes Resource - Unit Tests', function () {
  describe('handler', function () {
    it('should return a successful response when called with no querystring params', async function () {
      const response = await series.handler(events.getNoQuery);
      assert.equal(response.statusCode, 200);
      assert.ok(response.body);
    });

    it('should return a successful response when called with querystring params', async function () {
      const response = await series.handler(events.getQuery);
      assert.equal(response.statusCode, 200);
      assert.ok(response.body);
    });

    it('should return a successful response when looking for the next episode', async function () {
      const response = await series.handler(events.getNext);
      assert.equal(response.statusCode, 200);
      assert.ok(response.body);
    });
  });
});
