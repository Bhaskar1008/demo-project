'use strict';

const base_controller = require('./base.controller')

const Customer = require('../biz/customer.manager');
const vehical = require('../biz/vehicle.manager');
const reset_password = require('../biz/reset_password.manager');
const loan = require('../biz/loan.manager');
const accessories = require('../biz/accessories.manager');


class demoProjectApi extends base_controller {

    constructor() {
        super();
        this.customer = new Customer();
        this.vehical = new vehical();
        this.reset_password = new reset_password();
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

    async verifyEmailandMobileNumber(req, res) {
        try{
            console.log('verifying email and number');
            const getVerifiedData = await this.customer.verifyEmailandMobile(req);
            this.ok(res, getVerifiedData)
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
            const updateRes = await this.customer.updateCustomerDetail(req.body);
            // authenticated = {test: "abcd"}
            this.ok(res, updateRes);
        } catch (err) {
            this.error(res, err); 
        }
    }

    async resetPassword(req, res) {
        try {
            console.log("Password Reset Request..");
            const resetPassword = await this.reset_password.resetPassword(req, res);
            this.ok(res, resetPassword);
        } catch (err) {
            this.error(res, err);
        }
    }

    async validateOTP(req, res) {
        try {
            console.log("OTP Validating..");
            const otpValidate = await this.reset_password.validateOTP(req, res);
            this.ok(res, otpValidate);
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
    async getVehicleList(req, res) {
        try{
            console.log('Getting all vehicle list');
            const getVehicleList = await this.vehical.getVehicleList(req);
            this.ok(res, getVehicleList)
        } catch (err) {
            
            this.error(res, err);
        }
    }
    async getVehicleById(req, res) {
        console.log("In demo")
        try{
            console.log('Getting  vehicle detail');
            const getVehicleDetail = await this.vehical.getVehicleDetail(req);
            this.ok(res, getVehicleDetail)
        } catch (err) {
            
            this.error(res, err);
        }
    }

    async getVehicleImageById(req, res) {
        console.log("In demo")
        try{
            console.log('Getting  vehicle Immage detail');
            const getVehicleIMGDetail = await this.vehical.getVehicleImgDetail(req);
            this.ok(res, getVehicleIMGDetail)
        } catch (err) {
            
            this.error(res, err);
        }
    }

}
module.exports = demoProjectApi;