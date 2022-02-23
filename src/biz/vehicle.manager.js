'use strict';
const { 
    v4: uuidv4,
  } = require('uuid');
  
const BaseManager = require('./base.manager');
const ValidationError = require('../exception/validation.error');
const NotFound = require('../exception/not-found.error');
const vehicle_repository = require('../repository/vehicle.repository');
const SCHEMA = require('../constant/schema');
const MSG = require("../constant/msg");
const req = require('express/lib/request');

class Vehicle extends BaseManager {
    constructor(){
        super();
        this.VehicleRepository = new vehicle_repository();
    }
    
    async addNewVehicle() {
        try {
            // const sanitize_data = req.body;
            const sanitize_data = {
                id: generateUUID(),  
                vehicle_service_type: req.body.vehicle_service_type ?? "",
                vehicle_type: req.body.vehicle_type ?? "",
                vehicle_number: req.body.vehicle_number ?? "" ,
                make: req.body.make ?? "",
                model: req.body.model ?? "",
                varient: req.body.varient ?? "",
                year: req.body.year ?? "",
                color: req.body.color ?? "",
                registration_place: req.body.registration_place ?? "",
                current_location: req.body.current_location ?? "",
                fuel_type: req.body.fuel_type ?? "",
                transmission_type: req.body.transmission_type ?? "",
                gares: req.body.gares ?? "",
                price: req.body.price ?? "",
                vehicle_category: req.body.vehicle_category ?? "",
                no_of_owners: req.body.no_of_owners ?? "",
                engine_capcity_cc: req.body.engine_capcity_cc ?? "",
                vehicle_full_details: req.body.vehicle_full_details ? JSON.parse(req.body.vehicle_full_details) : [],
                vehicle_image_id: req.body.vehicle_image_id ? JSON.parse(req.body.vehicle_image_id) : [],
                createdat: req.body.createdat ?? "",
                createdby: req.body.createdby ?? ""
            };
            const validationResult = this.validate(SCHEMA.ADD_Vehical, sanitize_data);
            if(validationResult.valid) {
                const response = await this.VehicleRepository.addVehicle(req.body);
                const RespData = {
                    status: 200,
                    msg: "Success",
                    data: response
                }
                return RespData;
            }
            
            throw new ValidationError(MSG.VALIDATION_ERROR, validationResult.errors);
        }catch(err) {
            // 
            throw err;
        }
    }
    generateUUID(){
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace( /[xy]/g , function(c) {
            var rnd = Math.random()*16 |0, v = c === 'x' ? rnd : (rnd&0x3|0x8) ;
            return v.toString(16);
        });
    }
}
module.exports = Vehicle;