const { STS } = require("./aws.service");

/**
 * STS Service Wrapper
 */
class STSService {

    /**
     * Get Caller Identity
     */
    async getAccountNo() {
        try {
            return new Promise(function (resolve, reject) {
                STS.getCallerIdentity({}, function (err, data) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data.Account);
                    }
                });
            });
        } catch (error) {
            throw error;
        }
    }
}

module.exports = STSService;