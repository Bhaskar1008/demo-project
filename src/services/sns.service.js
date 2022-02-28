

const { SNS } = require("./aws.service");
const STSService = require("./sts.service");

let ACCOUNT_NO = undefined;

/**
 * SNS Service
 */
class SNSService {

    constructor() {
        this.stsService = new STSService();
    }

    /**
     * Publish message to SNS
     * @param {string} topic 
     * @param {string} message 
     */
    async publish(topic, message) {
        if (!ACCOUNT_NO) {
            ACCOUNT_NO = await this.stsService.getAccountNo();
        }
        return new Promise((resolve, reject) => {
            const params = {
                Message: message,
                TopicArn: `arn:aws:sns:${process.env.REGION}:${ACCOUNT_NO}:${topic}`
            };

            SNS.publish(params, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }


    /**
     * Creates subscription to SNS Topic
     * @param {string} protocol 
     * @param {string} topic 
     * @param {string} endpoint 
     */
    async subscribe(protocol, topic, endpoint) {
        try {
            if (!ACCOUNT_NO) {
                ACCOUNT_NO = await this.stsService.getAccountNo();
            }
            return new Promise(function (resolve, reject) {
                const params = {
                    Protocol: protocol, /* required */
                    TopicArn: `arn:aws:sns:${process.env.REGION}:${ACCOUNT_NO}:${topic}`, /* required */
                    Endpoint: endpoint
                };

                SNS.subscribe(params, (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        // console.log(`Subscription ARN is '${data.SubscriptionArn}'`);
                        resolve(data.SubscriptionArn);
                    }
                });
            });
        } catch (error) {
            throw error;
        }
    }
}

module.exports = SNSService;