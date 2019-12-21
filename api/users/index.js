const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const userTable = 'tvme-users';

exports.handler = async (event) => {
  let response = {};

  switch (event.httpMethod) {
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

  async function addNewUser() {
    if (!event.body) {
      return {
        'statusCode': 400,
        'body': 'Invalid request content'
      };
    }

    const newUser = JSON.parse(event.body);
    if (!newUser.emailAddress || !newUser.password) {
      return {
        'statusCode': 400,
        'body': 'Missing request content'
      };
    }

    const params = {
      TableName: userTable,
      KeyConditionExpression: 'emailAddress = :email',
      ExpressionAttributeValues: {
        ':email': `${newUser.emailAddress}`
      }
    };

    try {
      const userQuery = await dynamo.query(params).promise();
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
      'body': `User creation successful`
    };
  }
};
