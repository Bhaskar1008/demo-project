var AWS = require("aws-sdk");
const TABLE_LIST = require('./tables');
AWS.config.update({
    region : "us-east-1"
});

var dynamodb = new AWS.DynamoDB();

// var params = {
//     TableName : "User",
//     KeySchema : [ {
//         AttributeName : "id",
//         KeyType : "HASH"
//     }, //Partition key
//     {
//         AttributeName : "user_name",
//         KeyType : "RANGE"
//     } //Sort key
//     ],
//     AttributeDefinitions : [ 
//         {
//             AttributeName : "email_id",
//             AttributeType : "S"
//         }
//     ],
//     ProvisionedThroughput : {
//         ReadCapacityUnits : 10,
//         WriteCapacityUnits : 10
//     }
// };


TABLE_LIST.forEach(async (element, index, array) => {
    console.log(element.x); // 100, 200, 300
    console.log(index); // 0, 1, 2
    console.log(array); // same myArray object 3 times

    let params = {
        TableName : Object.keys(element)[0],
        KeySchema : [ 
            {
                AttributeName : "id",
                KeyType : "HASH"
            }
        ],
        ProvisionedThroughput : {
            ReadCapacityUnits : 10,
            WriteCapacityUnits : 10
        }
    };

    var attributes = [];
    for (const key in element[params.TableName]) {
        attributes.push({AttributeName: key, AttributeType: element[params.TableName][key]});
    }
    params[AttributeDefinitions] = attributes;

    await dynamodb.createTable(params, function(err, data) {
        if (err) {
            if (err.code === "ResourceInUseException"
                    && err.message === "Cannot create preexisting table") {
                console.log("message ====>" + err.message);
            } else {
                console.error("Unable to create table. Error JSON:", JSON
                        .stringify(err, null, 2));
            }
    
        } else {
            console.log("Created table. Table description JSON:", JSON.stringify(
                    data, null, 2));
        }
    });

});
