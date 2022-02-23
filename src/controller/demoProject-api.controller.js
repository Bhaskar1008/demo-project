'use strict';

const base_controller = require('./base.controller')

const Customer = require('../biz/customer.manager');
const vehical = require('../biz/vehicle.manager');
const loan = require('../biz/loan.manager');
const accessories = require('../biz/accessories.manager');


class demoProjectApi extends base_controller {

    constructor() {
        super();
        this.customer = new Customer();
        this.vehical = new vehical();
        // this.loan = new loan();
        // this.accessories = new accessories();
    }

    async getCustomerList(req, res) {
        try{
            console.log('Getting all customer list');
            const getCustomerList = await this.customer.getCustomerList(req.body);
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
    
    async addNewVehicle(req, res) {
        try {
            console.log("New Vehicle Data..");
            const addVehicleRes = await this.vehical.addNewVehicle(req, res);
            this.ok(res, addVehicleRes);
        } catch (err) {
            this.error(res, err);
        }
    }

}
module.exports = demoProjectApi;