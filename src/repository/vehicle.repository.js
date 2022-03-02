const { AWS, documentClient } = require('../services/aws.service');
const TABLE = require('../constant/table');
const InternalError = require('../exception/internal.error');
const msg = require('../constant/msg');


class VehicleRepository {
    constructor() { }

    async addVehicle(request) {
        console.log(`New Vehicle Adding: ${JSON.stringify(request)}`);
        const params = {
            TableName: TABLE.TABLE_VEHICLE,
            Item: request
        };
        const data = await documentClient.put(params).promise();
        console.log('Inserted New Vehicle: ', data);
        if (data) return data;
        return null;
    }

    // function to upload images of vehicle
    async vehicleImageUpload(request) {
        try {
            request.forEach(async (obj) => {
                let params = {
                    TableName: TABLE.TABLE_VEHICLE_IMAGES,
                    Item: obj
                };
                let data = await documentClient.put(params).promise();
            });
            return {};

        } catch (err) {
            throw new InternalError(msg.INTERNAL_ERROR, err.message);
        }

    }

    async updateVehicleDetails(data, id) {
        try {
            var filtered_data = {};
            var expression_list = [];
            var expression_name = {};
            var expression_value = {};
            Object.entries(data).map(([key, value], index) => {
                if (value) {
                    filtered_data[key] = value;
                    expression_list.push(`#KEY_${index} = :VALUE_${index}`);
                    expression_name[`#KEY_${index}`] = key;
                    expression_value[`:VALUE_${index}`] = value;
                }
            });

            const getSortKey = {
                TableName: TABLE.TABLE_VEHICLE,
                ProjectionExpression: ['CreatedAt'],
                FilterExpression: " ID = :id ",
                ExpressionAttributeValues: {
                    ":id": id
                }
            }
            const CreatedAt_VALUE = await documentClient.scan(getSortKey).promise();
            // console.log(typeof CreatedAt_VALUE.Items.at(0))
            const params = {
                TableName: TABLE.TABLE_VEHICLE,
                Key: {
                    "ID": id,
                    "CreatedAt": CreatedAt_VALUE.Items[0].CreatedAt || ""
                },
                UpdateExpression: `SET ${expression_list.join(', ')} `,
                ExpressionAttributeNames: expression_name,
                ExpressionAttributeValues: expression_value,
                ReturnValues: "UPDATED_NEW"
            };
            // return params;
            const updateRes = await documentClient.update(params).promise();

            if (updateRes) return updateRes;
            return null;
        } catch (err) {
            // console.log('Error Raised Here', err.message);
            throw new InternalError(MSG.INTERNAL_ERROR, err.message);
        }

    }
    async VehicleList(req) {
        // this will load all vehicle data 
        const params = {
            TableName: TABLE.TABLE_VEHICLE
        };
        if (req.params.id) {
            params.FilterExpression = " CreatedBy = :id ";
            params.ExpressionAttributeValues = {
                ":id": req.params.id
            }
        }
        let scanResults = [];
        let data, Count = 0;
        do {
            data = await documentClient.scan(params).promise();
            scanResults.push(...data.Items);
            Count += data.Count;
            params.ExclusiveStartKey = data.LastEvaluatedKey;
        } while (data.LastEvaluatedKey);

        const Items = scanResults;

        await Items.forEach(async (obj, index) => {
            if(obj.VehicleImage_ID) {
                
                let images = await this.VehicleImage(obj.VehicleImage_ID);
                Items[index]['ImageData'] = images;
            }
        });

        // if (offset && limit) Items = scanResults.slice(offset, limit + offset);
        return { Items, LastEvaluatedKey: data.LastEvaluatedKey, Count };
    }
    async VehicleImage(ImageID_arr) {
        // will load vehicleImage data
        try{
            var image_res = [];
            await ImageID_arr.forEach(async (image_id, index) => {
                let params = {
                    TableName: TABLE.TABLE_VEHICLE_IMAGES,
                    FilterExpression: " ID = :id and CreatedAt = :createdAT ",
                    ExpressionAttributeValues: {
                        ":id": image_id,
                        ":createdAT": "2/28/2022"
                    }
                };
                console.log('Before Log');
                let data = await documentClient.scan(params).promise();
                console.log('AFter Log');
                console.log(data);
                if(data) {
                    image_res.push(data);
                }
            }); 
            return image_res;
        } catch(err) {
            console.log('Error Raied', err.message);
        }
        


        // const params = {
        //     TableName: TABLE.TABLE_VEHICLE_IMAGES
        // };
        // if (req.params.id) {
        //     params.FilterExpression = "VehicleImage_ID = :id";
        //     params.ExpressionAttributeValues = {
        //         ":id": req.params.id
        //     }
        // }
        // // return params
        // let scanResults = [];
        // let data, Count = 0;
        // do {
        //     data = await documentClient.scan(params).promise();
        //     scanResults.push(...data.Items);
        //     Count += data.Count;
        //     params.ExclusiveStartKey = data.LastEvaluatedKey;
        // } while (data.LastEvaluatedKey);

        // const Items = scanResults;
        // // if (offset && limit) Items = scanResults.slice(offset, limit + offset);
        // return { Items, LastEvaluatedKey: data.LastEvaluatedKey, Count };
    }

}

module.exports = VehicleRepository;