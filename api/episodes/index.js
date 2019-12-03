const fetch = require('node-fetch');
const core = require('@mikejancar/tv-me-core');
const keys = require('./keys.json');

exports.handler = async (event) => {

  let response = {};

  switch (event.httpMethod) {
    case 'GET':
      if (event.path.endsWith('next')) {
        response = await getNextEpisode();
      } else {
        response = await searchForEpisodes();
      }
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

  async function searchForEpisodes() {
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

    if (event.queryStringParameters) {
      let searchParams = Object.keys(event.queryStringParameters).map(key => `${key}=${event.queryStringParameters[key]}`).join('&');
      searchResponse = await fetch(`https://api.thetvdb.com/series/${event.pathParameters.id}/episodes/query?${searchParams}`, options);
    } else {
      searchResponse = await fetch(`https://api.thetvdb.com/series/${event.pathParameters.id}/episodes`, options);
    }

    if (searchResponse.status !== 200) {
      return {
        'statusCode': 500,
        'body': 'Episode search failed'
      };
    }
    const rawJson = await searchResponse.json();
    return {
      'statusCode': 200,
      'body': `${JSON.stringify(rawJson.data)}`
    };
  }

  async function getNextEpisode() {
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

    const seriesResponse = await fetch(`https://api.thetvdb.com/series/${event.pathParameters.id}`, options);
    if (seriesResponse.status !== 200) {
      return {
        'statusCode': 500,
        'body': 'Failed to retrieve the series'
      };
    }

    const seriesConverted = await seriesResponse.json();
    const series = seriesConverted.data;

    if (series.status !== 'Continuing') {
      return {
        'statusCode': 200,
        'body': 'Cannot retrieve the next episode for an inactive series'
      };
    }

    const currentSeasonResponse = await fetch(`https://api.thetvdb.com/series/${event.pathParameters.id}/episodes/query?airedSeason=${series.season}`, options);
    if (currentSeasonResponse.status !== 200) {
      return {
        'statusCode': 500,
        'body': `Failed to retrieve the current season for ${series.seriesName}`
      };
    }

    const currentSeasonConverted = await currentSeasonResponse.json();
    const currentSeason = currentSeasonConverted.data;
    const currentDate = new Date().toISOString().slice(0, 10);

    const upcomingEpisodes = currentSeason.filter(season => season.firstAired >= currentDate);
    if (upcomingEpisodes.length === 0) {
      return {
        'statusCode': 200,
        'body': `No upcoming episodes found for ${series.seriesName}`
      };
    }

    return {
      'statusCode': 200,
      'body': `${JSON.stringify(upcomingEpisodes[0])}`
    };
  }
};
