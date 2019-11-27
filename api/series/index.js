const fetch = require('node-fetch');
const core = require('@mikejancar/tv-me-core');
const keys = require('./keys.json');

exports.handler = async (event) => {

  switch (event.httpMethod) {
    case 'GET':
      return await searchForSeries(event.queryStringParameters);
    default:
      return {
        status: 400,
        body: 'Bad Request'
      };
  }

  async function getToken() {
    const tokenResponse = await core.getToken(keys.tvdb.apikey, keys.tvdb.username, keys.tvdb.userkey);
    return {
      status: tokenResponse.status,
      body: tokenResponse.status === 200 ? tokenResponse.token : ''
    };
  }

  async function searchForSeries(params) {
    const tokenResponse = await getToken();
    if (tokenResponse.status !== 200) {
      return tokenResponse;
    }

    const options = {
      method: 'GET',
      headers: { Authorization: `Bearer ${tokenResponse.token}` }
    };
    let searchParams = Object.keys(params).map(key => `${key}=${params[key]}`).join('&');

    const searchResponse = await fetch(`https://api.thetvdb.com/search/series?${searchParams}`, options);
    if (searchResponse.status !== 200) {
      return searchResponse;
    }
    const rawJson = await searchResponse.json();
    return {
      status: 200,
      body: rawJson.data
    };
  }
};
