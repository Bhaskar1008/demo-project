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
    
    async addNewVehicle(req,res) {
        try {
            // return req.body
            // const sanitize_data = req.body;
            const sanitize_data = {
                id:"10",  
                VehicleServiceType: req.body.VehicleServiceType ?? "",
                VehicleType: req.body.VehicleType ?? "",
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
                VehicleImage_ID: req.body.VehicleImage_ID ? JSON.parse(req.body.VehicleImage_ID) : [],
                CreatedAt: req.body.CreatedAt ?? "",
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
}
module.exports = Vehicle;