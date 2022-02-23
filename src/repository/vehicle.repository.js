const { AWS, documentClient } = require('../services/aws.service');
const TABLE = require('../constant/table');


class VehicleRepository{
    constructor(){}

    async addVehicle(rquest) {
        console.log(`New Vehicle Adding: ${JSON.stringify(rquest)}`);
        const params = {
            TableName: "Vehicle",
            Item: rquest
        };
        const data = await documentClient.put(params).promise();
        console.log('Inserted New Vehicle: ', data);
        if (data) return data;
        return null;
    }
}

module.exports = VehicleRepository;