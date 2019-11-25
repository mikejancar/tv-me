const assert = require('assert');
const keys = require('./keys.json');
const core = require('../index');

describe('TV Me Core Unit Tests', function () {
  describe('getToken', function () {
    it('should return an unsuccessful response when the call fails', async function () {
      const response = await core.getToken('blah', 'blah', 'blah');
      assert.equal(response.status, 401);
    });

    it('should return a success status and a token when the call succeeds', async function () {
      const response = await core.getToken(keys.tvdb.apikey, keys.tvdb.username, keys.tvdb.userkey);
      assert.equal(response.status, 200);
      assert.ok(response.token);
    });
  });
});
