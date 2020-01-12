const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const loginTable = 'tvme-logins';

exports.handler = async (event) => {
  let response = {};

  switch (event.httpMethod) {
    case 'POST':
      response = await validateLogin();
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

  async function retrieveUserLogin(username) {
    const params = {
      TableName: loginTable,
      Key: {
        username: `${username}`
      }
    };

    try {
      return await dynamo.get(params).promise();
    } catch (error) {
      console.log(`Error retrieving user record: ${error}`);
      return {
        'statusCode': 500,
        'body': `Error retrieving user record`
      };
    }
  }

  async function validateLogin() {
    if (!event.body) {
      return {
        'statusCode': 400,
        'body': 'Invalid request'
      };
    }

    const credentials = JSON.parse(event.body);
    if (!credentials.username || !credentials.password) {
      return {
        'statusCode': 400,
        'body': 'Missing request content'
      };
    }

    try {
      const userQuery = await retrieveUserLogin(credentials.username);
      if (!userQuery.Item) {
        console.log(`Username not found: ${credentials.username}`);
        return {
          'statusCode': 500,
          'body': 'Invalid username or password'
        };
      }

      const storedPass = userQuery.Item.password;
      if (storedPass !== credentials.password) {
        console.log(`Invalid password given for user ${credentials.username}`);
        return {
          'statusCode': 500,
          'body': 'Invalid username or password'
        };
      }
      console.log(`${credentials.username} logged in at ${new Date()}`);
      return {
        'statusCode': 200,
        'body': JSON.stringify({ validated: true })
      };
    } catch (error) {
      console.log(`Error validating user: ${error}`);
      return {
        'statusCode': 500,
        'body': `Error validating user`
      };
    }
  }
};
