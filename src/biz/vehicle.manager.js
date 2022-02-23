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
                vehicleServiceType: req.body.vehicleServiceType ?? "",
                vehicleType: req.body.vehicleType ?? "",
                VehicleNumber: req.body.VehicleNumber ?? "" ,
                Make: req.body.Make ?? "",
                Model: req.body.Model ?? "",
                Varient: req.body.Varient ?? "",
                Year: req.body.Year ?? "",
                Color: req.body.Color ?? "",
                RegistrationPlace: req.body.RegistrationPlace ?? "",
                Currentlocation: req.body.Currentlocation ?? "",
                Fueltype: req.body.Fueltype ?? "",
                Transmissiontype: req.body.Transmissiontype ?? "",
                Gares: req.body.Gares ?? "",
                Price: req.body.Price ?? "",
                VehicleCategory: req.body.VehicleCategory ?? "",
                NoOfOwners: req.body.NoOfOwners ?? "",
                EngineCapcityCC: req.body.EngineCapcityCC ?? "",
                VehicleFullDetails: req.body.VehicleFullDetails ? JSON.parse(req.body.VehicleFullDetails) : [],
                VehicleImageID: req.body.VehicleImageID ? JSON.parse(req.body.VehicleImageID) : [],
                createdat: req.body.createdat ?? "",
                CreatedBy: req.body.CreatedBy ?? ""
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