const AWS = require('aws-sdk');
const uuid = require('uuid/v5');
const sharedFunc = require('./opt/index');
const dynamo = new AWS.DynamoDB.DocumentClient();

const loginTable = 'tvme-logins';
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
    case 'PATCH':
      response = await updateUser();
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

  async function getUserRecord(userId) {
    const params = {
      TableName: userTable,
      Key: {
        id: userId
      }
    };

    try {
      return await dynamo.get(params).promise();
    } catch (error) {
      console.log(`Error getting user record: ${error}`);
      return {
        'statusCode': 500,
        'body': `Error getting user record`
      };
    }
  }

  async function deleteLoginRecord(username) {
    const params = {
      TableName: loginTable,
      Key: {
        username: `${username}`
      }
    };

    try {
      return await dynamo.delete(params).promise();
    } catch (error) {
      console.log(`Error deleting login record for ${username}: ${error}`);
    }
  }

  async function getUser() {
    if (event.pathParameters && event.pathParameters.id) {
      const userRecord = await getUserRecord(event.pathParameters.id);
      if (!userRecord.Item) {
        return {
          'statusCode': 404,
          'body': 'User not found'
        };
      }
      return {
        'statusCode': 200,
        'body': JSON.stringify(userRecord.Item)
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
    if (!newUser.username || !newUser.password) {
      return {
        'statusCode': 400,
        'body': 'Missing request content'
      };
    }

    const userQuery = await sharedFunc.queryForUser(newUser.username);
    if (userQuery.Count > 0) {
      return {
        'statusCode': 400,
        'body': 'Account already exists'
      };
    }

    const newUserId = uuid(newUser.username, `350bd3a8-2668-4938-b5e6-7b5c9cf26b26`);

    try {
      const loginParams = {
        TableName: loginTable,
        Item: {
          username: `${newUser.username}`,
          password: `${newUser.password}`
        }
      };
      await dynamo.put(loginParams).promise();
    } catch (error) {
      console.log(`Error creating login record for ${newUser.username}: ${error}`);
      return {
        'statusCode': 500,
        'body': `Error creating account`
      };
    }

    delete newUser.password;

    try {
      const userParams = {
        TableName: userTable,
        Item: {
          id: newUserId,
          ...newUser
        }
      };
      await dynamo.put(userParams).promise();
    } catch (error) {
      await deleteLoginRecord(newUser.username);
      console.log(`Error creating user record for ${newUser.username}: ${error}`);
      return {
        'statusCode': 500,
        'body': `Error creating account`
      };
    }

    return {
      'statusCode': 200,
      'body': JSON.stringify({
        id: newUserId
      })
    };
  }

  async function updateUser() {
    if (!event.body || !event.pathParameters || !event.pathParameters.id) {
      return {
        'statusCode': 400,
        'body': 'Invalid request'
      };
    }

    const userId = event.pathParameters.id;
    const userRecord = await getUserRecord(userId);
    if (!userRecord.Item) {
      console.log(`An account with id ${userId} does not exist`);
      return {
        'statusCode': 400,
        'body': 'Account does not exist'
      };
    }

    const existingUser = userRecord.Item;
    const userUpdates = JSON.parse(event.body);

    delete userUpdates.id;
    delete userUpdates.username;

    const updatedUser = {
      ...existingUser,
      ...userUpdates
    };

    try {
      const params = {
        TableName: userTable,
        Item: updatedUser
      };
      await dynamo.put(params).promise();
    } catch (error) {
      console.log(`Error updating account for ${userId}: ${error}`);
      return {
        'statusCode': 500,
        'body': `Error updating account`
      };
    }

    return {
      'statusCode': 200,
      'body': JSON.stringify({
        message: `User updated successfully`
      })
    };
  }
};