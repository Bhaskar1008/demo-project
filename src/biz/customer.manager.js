'use strict';

const utils = require('../constant/utils');
const bcrypt = require('bcryptjs');
const BaseManager = require('./base.manager');
const BadRequestError = require('../exception/bad-request.error');
const ValidationError = require('../exception/validation.error');
const InternalError = require('../exception/internal.error');
const NotFound = require('../exception/not-found.error');
const customer_repository = require('../repository/customer.repository.js');
const SCHEMA = require('../constant/schema');
const MSG = require("../constant/msg");
const custom_validation_list = require('../exception/custom-exception-list');
const req = require('express/lib/request');

class Customer extends BaseManager {
    constructor(){
        super();
        this.CustomerRepository = new customer_repository();
        this.utils = new utils();
    }

    async getCustomerList(req) {
        // return {test: "abcd unique", return_data: customer_repository()};
        try {
            const response = await this.CustomerRepository.CustomerList(req);
            if (response.Count > 0) {
                const RespData = {
                    code: 200,
                    status: "Success",
                    data: response.Items[0]
                }
                return RespData;
            } else {
                throw new NotFound("Not FOund.", "Please enter the valid customer id.")
            }
        }catch(err) {
            if(custom_validation_list.includes(err.name || "")) {
                throw err;
            }
            throw new InternalError(MSG.INTERNAL_ERROR, err);
        }
    }

    async verifyEmailandMobile(req) {
        // return {test: "abcd unique", return_data: customer_repository()};
        try {
            if (req.query.emailid ) {
                const response = await this.CustomerRepository.verifyEmail(req);
                if (response.Count > 0) {
                    throw new ValidationError(MSG.VALIDATION_ERROR,`Email-ID: ${req.query.emailid} is already registered.`)
                }
            } else if ( req.query.mobilenumber) {
                const response = await this.CustomerRepository.verifyMobile(req);
                if (response.Count > 0) {
                    throw new ValidationError(MSG.VALIDATION_ERROR,`Mobile-Number: ${req.query.mobilenumber} is already Linked.`)
                }
            } else {
                throw new NotFound('Not Found', 'Please enter the email id or Mobile Number to verify.')
            }

            
            const RespData = {
                code: 200,
                status: "Success"
            }
            return RespData;
        }catch(err) {
            if(custom_validation_list.includes(err.name || "")) {
                throw err;
            }
            throw new InternalError(MSG.INTERNAL_ERROR, err);
        }
    }
    // generatePassword(str) {
    //     // return str;
    //     try {
    //         if(str) {
    //             // error
    //             const salt =  bcrypt.genSaltSync(10);
    //             return bcrypt.hashSync(str, salt);    
    //             // return str;
    //         }
    //         return undefined;
    //         // return new NotFound(MSG.NOT_FOUND, 'Not Found');

    //     } catch (err) {
    //         throw new InternalError(MSG.INTERNAL_ERROR, 'Password Hash Not Generated');
    //     }
    // }

    async addNewCustomer(req, res) {
        try {
            
            const sanitize_data = {
                ID: this.utils.generateUUID(),
                UserName: req.body.username || undefined,
                FirstName: req.body.firstname || undefined,
                LastName: req.body.lastname || undefined,
                EmailID: req.body.emailid || undefined,
                ContactNumber: req.body.contact_number ? parseInt(req.body.contact_number) : undefined,
                // password: req.body.password ? bcrypt.hash(req.body.password, saltRounds) : "",
                Password: this.utils.generatePassword(req.body.password),
                LocationName: req.body.location_name || "",
                Pincode: req.body.pincode ? parseInt(req.body.pincode) : undefined,
                Isactive: true,
                
                VehicleID: this.sanitizeArray(req.body.vehicle_id),
                LoanID: this.sanitizeArray(req.body.loan_id),
                WhishlistID: this.sanitizeArray(req.body.whishlist_id),
                PurchasedAccessoriessID: this.sanitizeArray(req.body.purchased_accessories_id),

                LoanAgreementtemplate: req.body.loan_agreement_template || "",
                CreatedAt: new Date().toLocaleString(),
                Type: req.body.type || ""
            };
            const validationResult = this.validate(SCHEMA.ADD_CUSTOMER, sanitize_data);
            
            if(validationResult.valid) {
                const response = await this.CustomerRepository.addCustomer(sanitize_data);
                const RespData = {
                    code: 200,
                    status: "Success",
                    data: "Successfully Submitted...",
                }
                return RespData;
            }
            console.log('---failed---' + JSON.stringify(validationResult));
            throw new ValidationError(MSG.VALIDATION_ERROR, validationResult);
        } catch(err) {
            if(custom_validation_list.includes(err.name || "")) {
                throw err;
            }
            throw new InternalError(MSG.INTERNAL_ERROR, err);
        }
    }


    async authenticateUser(req, res) {
        try {
            const sanitize_data = {
                email: req.body.email,
                password: req.body.password
            };
            const validationResult = this.validate(SCHEMA.VALIDATE_USER, sanitize_data);
            if(validationResult.valid) {
                const passwordItem = await this.CustomerRepository.validateUser(sanitize_data);

                const password = passwordItem.Items[0]?.Password || "";
                if (bcrypt.compareSync(sanitize_data.password, password)) {
                    const RespData = {
                        code: 200,
                        status: "Success",
                        // data: password,
                        msg: "Authenticate Successfully.",
                        customer_id: passwordItem.Items[0]["ID"]
                        // sanitize_data: sanitize_data
                    }
                    return RespData;
                } else {
                    throw new BadRequestError('Authentication Failed',"Please enter the correct EmailID and Password.")
                }
            }
            throw new ValidationError(MSG.VALIDATION_ERROR, validationResult.errors);
        } catch (err) {
            if(custom_validation_list.includes(err.name || "")) {
                throw err;
            }
            throw new InternalError(MSG.INTERNAL_ERROR, err.message);
        }
    }

    sanitizeArray(data) {
        return (typeof data === "object" ? data : (typeof data === "string" ? Object.entries(JSON.parse(JSON.stringify(data))) : undefined));
    }

    async updateCustomerDetail(request) {
        try {
            if(!request.id) {
                throw new ValidationError(MSG.VALIDATION_ERROR, "Id is required");
                // throw new Error('TEST','this is error');
            }
            const sanitize_data = {
                UserName: request.username || undefined,
                EmailID: request.emailid || undefined,
                ContactNumber: request.contact_number ? parseInt(request.contact_number) : undefined,
                // password: request.password ? bcrypt.hash(request.password, saltRounds) : "",
                Password: this.utils.generatePassword(request.password),
                LocationName: request.location_name || undefined,
                Isactive: true,
                
                VehicleID: this.sanitizeArray(request.vehicle_id),
                LoanID: this.sanitizeArray(request.loan_id),
                WhishlistID: this.sanitizeArray(request.whishlist_id),
                PurchasedAccessoriesID: this.sanitizeArray(request.purchased_accessories_id),
                
                LoanAgreementtemplate: request.loan_agreement_template || undefined,
                // CreatedAt: new Date().toLocaleString(),
                Type: request.type || undefined
            }

            const validationResult = this.validate(SCHEMA.UPDATE_CUSTOMER, sanitize_data);
            if(validationResult.valid) {
                const updateRes = await this.CustomerRepository.updateCustomer(sanitize_data, request.id);
                const RespData = {
                    code: 200,
                    status: "Success",
                    data: updateRes,
                    sanitize_data: sanitize_data
                }
                return RespData;
            }
            throw new ValidationError(MSG.VALIDATION_ERROR, validationResult.errors);
        } catch (err) {
            if(custom_validation_list.includes(err.name || "")) {
                throw err;
            }
            throw new InternalError(MSG.INTERNAL_ERROR, err);
        }
    }

    // async resetPassword(req, res) {
    //     try{
    //         if(!req.body.EmailID || !req.body.CustomerID){
    //             throw new ValidationError(MSG.VALIDATION_ERROR, "CustomerID Or EmailID is required")
    //         }
    //         let sanitize_data = {
    //             EmailId: req.body.EmailID,
    //             CustomerID: req.body.CustomerID
    //         };

    //         let otp = Math.floor(1000 + Math.random() * 9000);

    //         const response = await this.CustomerRepository.resetPassword({...sanitize_data,otp:otp});
    //         const RespData = {
    //             code: 200,
    //             status: "Success",
    //             data: sanitize_data,
    //             response: response
    //         }
    //         return RespData;


    //     }catch(err) {
    //         console.log('Error Occured In Customer Manager');
    //         if(custom_validation_list.includes(err.name || "")) {
    //             return err;
    //         }
    //         return new InternalError(MSG.INTERNAL_ERROR, err.message);
    //     }
        
    // }
}
module.exports = Customer;