const assert = require('assert');
const keys = require('../keys.json');
const events = require('./example-events.json');
const series = require('../index');

describe('TV Me API - Series Resource - Unit Tests', function () {
  describe('handler', function () {
    it('should return a success status and a token when the call succeeds', async function () {
      const response = await series.handler(events.getQuery);
      console.log(response);
      assert.equal(response.statusCode, 200);
      assert.ok(response.body);
    });
  });
});
