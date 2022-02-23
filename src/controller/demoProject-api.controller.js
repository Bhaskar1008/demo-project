'use strict';

const base_controller = require('./base.controller')

const Customer = require('../biz/customer.manager');
const vehical = require('../biz/vehical.manager');
const loan = require('../biz/loan.manager');
const accessories = require('../biz/accessories.manager');


class demoProjectApi extends base_controller {

    constructor() {
        super();
        this.customer = new Customer();
        // this.vehical = new vehical();
        // this.loan = new loan();
        // this.accessories = new accessories();
    }

    async getCustomerList(req, res) {
        try{
            console.log('Getting all customer list');
            const getCustomerList = await this.customer.getCustomerList(req);
            this.ok(res, getCustomerList)
        } catch (err) {
            
            this.error(res, err);
        }
    }

    async addNewCustomer(req, res) {
        try {
            console.log("New Customer Data..");
            const addCustomerRes = await this.customer.addNewCustomer(req, res);
            this.ok(res, addCustomerRes);
        } catch (err) {
            this.error(res, err);
        }
    }

    async validateLogin(req, res) {
        try {
            console.log('Validating Login');
            const authenticated = await this.customer.authenticateUser(req, res);
            // authenticated = {test: "abcd"}
            this.ok(res, authenticated);
        } catch (err) {
            this.error(res, err);
        }
    }

    async updateCustomerDetail(req, res) {
        try {
            console.log('Updating Customer Details');
            const updateRes = await this.customer.updateCustomerDetail(req, res);
            // authenticated = {test: "abcd"}
            this.ok(res, authenticated);
        } catch (err) {
            this.error(res, err);
        }
    }

}
module.exports = demoProjectApi;