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
    sanitizeArray(data) {
        return (typeof data === "object" ? data : (typeof data === "string" ? Object.entries(JSON.parse(JSON.stringify(data))) : undefined));
        }
    
    async addNewVehicle(req,res) {
        try {
        // return  req.body;
            const sanitize_data = {
                ID:this.generateUUID(),  
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
                VehicleFullDetails:this.sanitizeArray(req.body.VehicleFullDetails),
                VehicleImage_ID:this.sanitizeArray(req.body.VehicleImage_ID),
                CreatedAt: req.body.CreatedAt ?? "",
                CreatedBy: req.body.CreatedBy ?? ""
            };
            // return sanitize_data
            const validationResult = this.validate(SCHEMA.ADD_Vehical, sanitize_data);
            if(validationResult.valid) {
                const response = await this.VehicleRepository.addVehicle(sanitize_data);
                // return {response:response}
                const RespData = {
                    code: 200,
                    status: "Success",
                    data: response
                }
                console.log("log1")
                return RespData;
            }
            console.log("testing")
            
            throw new ValidationError(MSG.VALIDATION_ERROR, validationResult.errors);
        }catch(err) {
            console.log("log2")
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