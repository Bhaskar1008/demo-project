const TABLE = require("../constant/table");
const custom_validation_list = require('../exception/custom-exception-list');
const ValidationError = require('../exception/validation.error')
const InternalError = require('../exception/internal.error')
const utils = require('../constant/utils');
const msg = require("../constant/msg");
const {documentClient} = require('../services/aws.service')

class ResetPassword {
    constructor() {
        this.utils = new utils();
    }

    async newResetRequest(request) {
        console.log(`New Reset Request Adding`);
        const params = {
            TableName: TABLE.TABLE_RESET_PASSWORD,
            Item: request,
            ReturnValues: 'ALL_OLD'
        };
        const data = await documentClient.put(params).promise();
        if(data) return request;
        return null;
    }

    /**
     * Function to check that, is user already requested reset for 2 times in the period of 2 hrs!
     * {logic} if yes then user will block for 24 hrs
     * 
     * @param {string} CustomerID 
     * @returns TRUE|FALSE
     */
    async validateResetLimit(CustomerID){
        
        try{
            const MAX_RESET_LIMIT = 2;
            const MIN_HOUR = 24;

            var {expression_list, expression_name, expression_value} = await this.utils.santize_expression_obj({
                CustomerID: CustomerID
            });
            
            let current_time = new Date().toISOString();
            let modify_time = new Date(current_time);
            modify_time.setHours(modify_time.getHours() - MIN_HOUR);
            let minus_one_hr = modify_time.toISOString();

            expression_list.push(' #GeneratedAt BETWEEN :START and :END ');
            let params = {
                TableName: TABLE.TABLE_RESET_PASSWORD,
                ProjectionExpression: ['ID', 'GeneratedAt'],
                FilterExpression: ` ${expression_list.join(' and ')}  `,
                ExpressionAttributeNames:{...expression_name, '#GeneratedAt': 'GeneratedAt'},
                ExpressionAttributeValues: {...expression_value, ':START': minus_one_hr, ':END': current_time}
            };
            // return params
            let data = await documentClient.scan(params).promise();
            if(data) {
                // return true if
                //      1. Difference between GeneratedAt and currenttime is greater than 24 hrs AND
                //      2. Items Cout is less than MAX_RESET_LIMIT
                // else 
                //      false
                if((data?.Count || MAX_RESET_LIMIT) < MAX_RESET_LIMIT) {
                    return false;
                }
                let current_time = new Date(new Date().toISOString());
                let MinLastResetReq = current_time.setHours(current_time.getHours() - 24);
                
                return (data?.Items[0]?.GeneratedAt < MinLastResetReq);
                // data.Items[0]?.GeneratedAt 
                // return ((data?.Count || MAX_RESET_LIMIT) < MAX_RESET_LIMIT);
            }
            return null;
        } catch(err) {
            
            if(custom_validation_list.includes(err.name || "")) {
                return err;
            }
            return new InternalError(msg.INTERNAL_ERROR, err.message);
        }
    }
    
}
module.exports = ResetPassword;