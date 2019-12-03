const assert = require('assert');
const keys = require('../keys.json');
const events = require('./example-events.json');
const series = require('../index');

describe('TV Me API - Series Resource - Unit Tests', function () {
  describe('handler', function () {
    it('should return a successful response when called with a valid name querystring param', async function () {
      const response = await series.handler(events.getQuery);
      assert.equal(response.statusCode, 200);
      assert.ok(response.body);
    });

    it('should return a successful response when called with a valid series id path param', async function () {
      const response = await series.handler(events.getId);
      assert.equal(response.statusCode, 200);
      assert.ok(response.body);
    });
  });
});
