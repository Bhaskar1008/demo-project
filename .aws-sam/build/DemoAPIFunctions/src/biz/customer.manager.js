'use strict';
const { 
    v4: uuidv4,
  } = require('uuid');

//   const bcrypt = require('bcrypt');
const BaseManager = require('./base.manager');
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
    }

    async getCustomerList(req) {
        // return {test: "abcd unique", return_data: customer_repository()};
        
        try {
            const response = await this.CustomerRepository.CustomerList(req);
            const RespData = {
                status: 200,
                msg: "Success",
                data: response
            }
            return RespData;
        }catch(err) {
            if(custom_validation_list.includes(err.name ?? "")) {
                return err;
            }
            return new InternalError(MSG.INTERNAL_ERROR, err);
        }
    }

    generateUUID(){
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace( /[xy]/g , function(c) {
            var rnd = Math.random()*16 |0, v = c === 'x' ? rnd : (rnd&0x3|0x8) ;
            return v.toString(16);
        });
    }
    
    generatePassword(str) {
        // return str;
        try {
            if(str) {
                // error
                // const salt =  bcrypt.genSaltSync(10);
                // return bcrypt.hashSync(str, salt);    
                return str;
            }
            return undefined;
            // return new NotFound(MSG.NOT_FOUND, 'Not Found');

        } catch (err) {
            throw new InternalError(MSG.INTERNAL_ERROR, 'Password Hash Not Generated');
        }
    }

    async addNewCustomer(req, res) {
        try {
            
            // const hash_pass = this.generatePassword(req.body.password);
            // if(typeof hash_pass != "string") {
            //     return hash_pass;
            // }

            const sanitize_data = {
                ID: this.generateUUID(),
                UserName: req.body.username ?? undefined,
                EmailID: req.body.emailid ?? undefined,
                ContactNumber: req.body.contact_number ? parseInt(req.body.contact_number) : undefined,
                // password: req.body.password ? bcrypt.hash(req.body.password, saltRounds) : "",
                Password: this.generatePassword(req.body.password),
                LocationName: req.body.location_name ?? "",
                Isactive: true,
                // vehicle_id: req.body.vehicle_id ? JSON.parse(req.body.vehicle_id) : [],
                // loan_id: req.body.loan_id ? JSON.parse(req.body.loan_id) : [],
                // whishlist_id: req.body.whishlist_id ? JSON.parse(req.body.whishlist_id) : [],
                // purchased_accessories_id: req.body.purchased_accessories_id ? JSON.parse(purchased_accessories_id) : [],
                LoanAgreementtemplate: req.body.loan_agreement_template ?? "",
                CreatedAt: new Date().toLocaleString(),
                Type: req.body.type ?? ""
            };
            const validationResult = this.validate(SCHEMA.ADD_CUSTOMER, sanitize_data);
            
            if(validationResult.valid) {
                const response = await this.CustomerRepository.addCustomer(sanitize_data);
                const RespData = {
                    code: 200,
                    status: "Success",
                    data: sanitize_data,
                    response: response
                }
                return RespData;
            }
            
            throw new ValidationError(MSG.VALIDATION_ERROR, validationResult.errors);
        } catch(err) {
            if(custom_validation_list.includes(err.name ?? "")) {
                return err;
            }
            return new InternalError(MSG.INTERNAL_ERROR, err);
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

                // const password = passwordItem.Items?.at(0).Password;
                const password = passwordItem;
                const RespData = {
                    code: 200,
                    status: "Success",
                    data: password,
                    sanitize_data: sanitize_data
                }
                return RespData;
            }
            throw new ValidationError(MSG.VALIDATION_ERROR, validationResult.errors);
        } catch (err) {
            if(custom_validation_list.includes(err.name ?? "")) {
                return err;
            }
            return new InternalError(MSG.INTERNAL_ERROR, err);
        }
    }

    sanitizeArray(data) {
        return (typeof data === "object" ? data : (typeof data === "string" ? JSON.pdatarse(data) : undefined));
    }

    async updateCustomerDetail(req, res) {
        try {
            if(!req.body.id) {
                throw new ValidationError(MSG.VALIDATION_ERROR, "Id is required");
                // throw new Error('TEST','this is error');
            }
            const sanitize_data = {
                UserName: req.body.username ?? undefined,
                EmailID: req.body.emailid ?? undefined,
                ContactNumber: req.body.contact_number ? parseInt(req.body.contact_number) : undefined,
                // password: req.body.password ? bcrypt.hash(req.body.password, saltRounds) : "",
                Password: this.generatePassword(req.body.password),
                LocationName: req.body.location_name ?? undefined,
                Isactive: true,
                
                vehicle_id: this.sanitizeArray(req.body.vehicle_id),
                loan_id: this.sanitizeArray(req.body.loan_id),
                whishlist_id: this.sanitizeArray(req.body.whishlist_id),
                purchased_accessories_id: this.sanitizeArray(req.body.purchased_accessories_id),
                
                LoanAgreementtemplate: req.body.loan_agreement_template ?? undefined,
                // CreatedAt: new Date().toLocaleString(),
                Type: req.body.type ?? undefined
            }

            const validationResult = this.validate(SCHEMA.UPDATE_CUSTOMER, sanitize_data);
            if(validationResult.valid) {
                const updateRes = await this.CustomerRepository.updateCustomer(sanitize_data, req.body.id);
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
            if(custom_validation_list.includes(err.name ?? "")) {
                return err;
            }
            return new InternalError(MSG.INTERNAL_ERROR, err);
        }
    }
}
module.exports = Customer;