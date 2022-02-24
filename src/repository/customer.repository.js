const { AWS, documentClient } = require('../services/aws.service');
const TABLE = require('../constant/table');
const InternalError = require('../exception/internal.error');
const MSG = require('../constant/msg');


class CustomerRepository{
    constructor(){}

    async CustomerList(req) {
        // this will load all customer data 
        const params = {
            TableName: TABLE.TABLE_CUSTOMER
        };
        if(req.params.id) {
            params.FilterExpression = " ID = :id ";
            params.ExpressionAttributeValues = {
                ":id": req.params.id
            }
        }

        let scanResults = [];
        let data, Count = 0;
        do {
            data = await documentClient.scan(params).promise();
            scanResults.push(...data.Items);
            Count += data.Count;
            params.ExclusiveStartKey = data.LastEvaluatedKey;
        } while (data.LastEvaluatedKey);
        
        const Items = scanResults;
        // if (offset && limit) Items = scanResults.slice(offset, limit + offset);
        return { Items, LastEvaluatedKey: data.LastEvaluatedKey, Count };
    }

    // async addCustomer() {

    //     return await {res: "In process"}
    // }
    async addCustomer(rquest) {
        console.log(`New Customer Adding: ${JSON.stringify(rquest)}`);
        const params = {
            TableName: TABLE.TABLE_CUSTOMER,
            Item: rquest
        };
        const data = await documentClient.put(params).promise();
        // console.log('Inserted New Customer: ', data);
        // console.log('Data res', data);
        if (data) return data;
        return null;
    }

    async validateUser({email, password}) {
        const params = {
            TableName: TABLE.TABLE_CUSTOMER,
            ProjectionExpression: ['Password'],
            FilterExpression: " EmailID = :emailID ",
            ExpressionAttributeValues: {
                ":emailID": email
            }
        };
        const data = await documentClient.scan(params).promise();

        if(data) return data;
        return null;
    }


    async updateCustomer(data, id) {
        try{
            var filtered_data = {};
            var expression_list = [];
            var expression_name = {};
            var expression_value = {};
            Object.entries(data).map(([key,value], index) => {
                if(value) {
                    filtered_data[key] = value;
                    expression_list.push(`#KEY_${index} = :VALUE_${index}`);
                    expression_name[`#KEY_${index}`] = key;
                    expression_value[`:VALUE_${index}`] = value;
                }
            });

            // const params = {
            //     TableName: TABLE.TABLE_CUSTOMER,
            //     FilterExpression = " ID = :id ",
            //     ExpressionAttributeValues = {
            //         ":id": req.params.id
            //     }
            // }

            const params = {
                TableName: TABLE.TABLE_CUSTOMER,
                Key: {
                    "ID": id,
                    "CreatedAt" : "2.04"
                },
                UpdateExpression: `SET ${expression_list.join(', ')} `,
                ExpressionAttributeNames: expression_name,
                ExpressionAttributeValues: expression_value,
                ReturnValues: "UPDATED_NEW"
            };
            // return params;
            const updateRes = await documentClient.update(params).promise();

            if(updateRes) return updateRes;
            return null;
        } catch(err) {
            console.log('Error Raised Here');
            throw new InternalError(MSG.INTERNAL_ERROR, err);
        }
        
    }
}

module.exports = CustomerRepository;