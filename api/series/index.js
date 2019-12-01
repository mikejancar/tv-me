const fetch = require('node-fetch');
const core = require('@mikejancar/tv-me-core');
const keys = require('./keys.json');

exports.handler = async (event) => {

  let response = {};

  switch (event.httpMethod) {
    case 'GET':
      response = await searchForSeries(event.queryStringParameters);
      break;
    default:
      response = {
        'statusCode': 400,
        'body': 'Bad Request'
      };
  }
  return {
    ...response,
    'isBase64Encoded': false,
    'headers': {
      'Access-Control-Allow-Origin': '*'
    }
  };

  async function getToken() {
    const tokenResponse = await core.getToken(keys.tvdb.apikey, keys.tvdb.username, keys.tvdb.userkey);
    return {
      'statusCode': tokenResponse.status,
      'body': tokenResponse.status === 200 ? tokenResponse.token : ''
    };
  }

  async function searchForSeries(params) {
    const tokenResponse = await getToken();
    if (tokenResponse.statusCode !== 200) {
      return {
        'statusCode': 500,
        'body': 'Token acquisition failed'
      };
    }

    const options = {
      method: 'GET',
      headers: { Authorization: `Bearer ${tokenResponse.body}` }
    };
    let searchParams = Object.keys(params).map(key => `${key}=${params[key]}`).join('&');

    const searchResponse = await fetch(`https://api.thetvdb.com/search/series?${searchParams}`, options);
    if (searchResponse.status !== 200) {
      return {
        'statusCode': 500,
        'body': 'Series search failed'
      };
    }
    const rawJson = await searchResponse.json();
    return {
      'statusCode': 200,
      'body': `${JSON.stringify(rawJson.data)}`
    };
  }
};
