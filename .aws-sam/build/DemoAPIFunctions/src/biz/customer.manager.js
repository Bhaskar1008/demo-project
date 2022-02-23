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
const req = require('express/lib/request');

class Customer extends BaseManager {
    constructor(){
        super();
        this.CustomerRepository = new customer_repository();
    }

    async getCustomerList() {
        // return {test: "abcd unique", return_data: customer_repository()};
        
        try {
            const response = await this.CustomerRepository.CustomerList();
            const RespData = {
                status: 200,
                msg: "Success",
                data: response
            }
            return RespData;
        }catch(err) {
            // 
            throw new InternalError(MSG.INTERNAL_ERROR, err);
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
                id: this.generateUUID(),
                username: req.body.username ?? undefined,
                emailid: req.body.emailid ?? undefined,
                contact_number: req.body.contact_number ? parseInt(req.body.contact_number) : undefined,
                // password: req.body.password ? bcrypt.hash(req.body.password, saltRounds) : "",
                password: this.generatePassword(req.body.password),
                location_name: req.body.location_name ?? "",
                is_active: req.body.is_active ? parseInt(req.body.is_active) : 0,
                // vehicle_id: req.body.vehicle_id ? JSON.parse(req.body.vehicle_id) : [],
                // loan_id: req.body.loan_id ? JSON.parse(req.body.loan_id) : [],
                // whishlist_id: req.body.whishlist_id ? JSON.parse(req.body.whishlist_id) : [],
                // purchased_accessories_id: req.body.purchased_accessories_id ? JSON.parse(purchased_accessories_id) : [],
                loan_agreement_template: req.body.loan_agreement_template ?? "",
                createdat: req.body.createdat ?? "",
                type: req.body.type ?? ""
            };
            const validationResult = this.validate(SCHEMA.ADD_CUSTOMER, sanitize_data);
            
            if(validationResult.valid) {
                // const response = await this.CustomerRepository.addCustomer(sanitize_data);
                const RespData = {
                    code: 200,
                    status: "Success",
                    data: sanitize_data
                }
                return RespData;
            }
            
            throw new ValidationError(MSG.VALIDATION_ERROR, validationResult.errors);
        } catch(err) {
            if(err.code == 500) {
                return new InternalError(MSG.INTERNAL_ERROR, err);
            }
            return err;
        }
    }
}
module.exports = Customer;