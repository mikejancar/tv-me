const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

module.exports = {
  queryForUser: async (username) => {
    const params = {
      TableName: 'tvme-users',
      IndexName: 'index-username',
      KeyConditionExpression: 'username = :username',
      ExpressionAttributeValues: {
        ':username': `${username}`
      }
    };

    try {
      return await dynamo.query(params).promise();
    } catch (error) {
      console.log(`Error querying users table: ${error}`);
      return {
        'statusCode': 500,
        'body': `Error querying users table`
      };
    }
  }
}