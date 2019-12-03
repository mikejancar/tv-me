const fetch = require('node-fetch');
const core = require('@mikejancar/tv-me-core');
const keys = require('./keys.json');

exports.handler = async (event) => {

  let response = {};

  switch (event.httpMethod) {
    case 'GET':
      response = await searchForSeries();
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

  async function searchForSeries() {
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

    let searchResponse;

    if (event.pathParameters) {
      searchResponse = await fetch(`https://api.thetvdb.com/series/${event.pathParameters.id}`, options);
    } else if (event.queryStringParameters) {
      let searchParams = Object.keys(event.queryStringParameters).map(key => `${key}=${event.queryStringParameters[key]}`).join('&');
      searchResponse = await fetch(`https://api.thetvdb.com/search/series?${searchParams}`, options);
    } else {
      return {
        'statusCode': 400,
        'body': 'Request type unrecognized'
      };
    }

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
