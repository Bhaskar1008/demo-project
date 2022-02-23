const AWS = require("aws-sdk");

AWS.config.update({
    region: 'us-east-1'
});

module.exports = {
    AWS: AWS,
    documentClient: new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' }),
}