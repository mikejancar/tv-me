const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const userTable = 'tvme-users';

exports.handler = async (event) => {
  let response = {};

  switch (event.httpMethod) {
    case 'GET':
      response = await getUser();
      break;
    case 'POST':
      response = await addNewUser();
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

  async function retrieveUserRecord(username) {
    const params = {
      TableName: userTable,
      KeyConditionExpression: 'emailAddress = :email',
      ExpressionAttributeValues: {
        ':email': `${username}`
      },
      ProjectionExpression: [
        'emailAddress'
      ]
    };

    try {
      return await dynamo.query(params).promise();
    } catch (error) {
      console.log(`Error querying users table: ${error}`);
      return {
        'statusCode': 500,
        'body': `Error querying users table: ${error}`
      };
    }
  }

  async function getUser() {
    if (event.pathParameters && event.pathParameters.username) {
      const userQuery = await retrieveUserRecord(event.pathParameters.username);
      if (userQuery.Count === 0) {
        return {
          'statusCode': 404,
          'body': 'Username not found'
        };
      }
      return {
        'statusCode': 200,
        'body': JSON.stringify(userQuery.Items[0])
      };
    } else {
      return {
        'statusCode': 400,
        'body': 'Invalid request'
      };
    }
  }

  async function addNewUser() {
    if (!event.body) {
      return {
        'statusCode': 400,
        'body': 'Invalid request'
      };
    }

    const newUser = JSON.parse(event.body);
    if (!newUser.emailAddress || !newUser.password) {
      return {
        'statusCode': 400,
        'body': 'Missing request content'
      };
    }

    try {
      const userQuery = await retrieveUserRecord(newUser.emailAddress);
      if (userQuery.Count > 0) {
        return {
          'statusCode': 400,
          'body': 'Account already exists'
        };
      }
    } catch (error) {
      console.log(`Error querying users table: ${error}`);
      return {
        'statusCode': 500,
        'body': `Error querying users table: ${error}`
      };
    }

    try {
      const params = {
        TableName: userTable,
        Item: newUser
      };
      await dynamo.put(params).promise();
    } catch (error) {
      console.log(`Error creating account: ${error}`);
      return {
        'statusCode': 500,
        'body': `Error creating account: ${error}`
      };
    }

    return {
      'statusCode': 200,
      'body': JSON.stringify({
        message: 'User creation successful'
      })
    };
  }
};