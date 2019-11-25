const fetch = require('node-fetch');

module.exports = {
  getToken: async (apikey, username, userkey) => {
    const credentials = {
      apikey, username, userkey
    };
    const options = {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    };

    const tvdbUrl = `https://api.thetvdb.com/login`;
    const response = await fetch(tvdbUrl, options);

    if (response.status === 200) {
      const body = await response.json();
      return {
        status: response.status,
        token: body.token
      };
    }
    return response;
  }
}