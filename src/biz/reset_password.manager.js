const utils = require('../constant/utils');
const ResetPasswordRepo = require('../repository/reset_password.repository');
const ValidationError = require('../exception/validation.error');
const msg = require('../constant/msg');
const custom_validation_list = require('../exception/custom-exception-list');
const InternalError = require('../exception/internal.error');


class ResetPassword{
    constructor(){
        this.reset_password = new ResetPasswordRepo();
        this.utils = new utils();
    }

    async addNewResetReq(request) {
        try{
            const sanitize_data = {
                ID: this.utils.generateUUID(),
                CustomerID: request.CustomerID || "",
                OTP: request.otp || "",
                GeneratedAt: new Date().toISOString()
            };
    
            if(!(sanitize_data.ID || sanitize_data.CustomerID || sanitize_data.OTP || sanitize_data.GeneratedAt)) {
                throw new ValidationError(msg.VALIDATION_ERROR, `Provide all proper data {ID, CustomerID, OTP, GeneratedAt}`);
            }   

            if(!await this.reset_password.validateResetLimit(sanitize_data.CustomerID)) {
                // password reset already requested for two times
                throw new InternalError(msg.INTERNAL_ERROR, 'Reset Password already requested for Max limit times');
            }
            
            const addRes = await this.reset_password.newResetRequest(sanitize_data);
            const RespData = {
                code: 200,
                status: "Success",
                response: addRes
            }
            return RespData;
            if(addRes) return addRes;
            return null;

        } catch(err) {
            if(custom_validation_list.includes(err.name || "")) {
                return err;
            }
            return new InternalError(MSG.INTERNAL_ERROR, err);
        }
    }

    /**
     * 
     * @param {*} request.OTP | {4 digit numbers}
     * @param {*} request.CustomerID | string
     */
    async validateOTP(request) {
        
    }
    
}