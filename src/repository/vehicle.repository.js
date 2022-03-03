const { AWS, documentClient } = require('../services/aws.service');
const TABLE = require('../constant/table');
const InternalError = require('../exception/internal.error');
const custom_validation_list = require('../exception/custom-exception-list');
const msg = require('../constant/msg');


class VehicleRepository {
    constructor() { this.INTERNAL_ERROR }

    async addVehicle(request) {
        console.log(`New Vehicle Adding: ${JSON.stringify(request)}`);
        const params = {
            TableName: TABLE.TABLE_VEHICLE,
            Item: request
        };
        const data = await documentClient.put(params).promise();
        console.log('Inserted New Vehicle: ', data); //{}
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
            throw new InternalError(msg.INTERNAL_ERROR, err.message);
        }

    }
    async VehicleList(req) {
        try {
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
            // return Items

            var index = 0;
            for (const item of Items) {
                // Items.forEach(async (item, index) => {
                // item.VehicleImage_ID;
                if (item.VehicleImage_ID) {
                    // console.log("Log 1",typeof this.VehicleImage)
                    let ImageData = await this.VehicleImage(item.VehicleImage_ID)
                    // let CustomerData = await this.CustomerList(req)
                    // console.log(CustomerData,"CustomerData")
                    Items[index]['IMAGES'] = ImageData;

                }
                // console.log(item.VehicleImage_ID, "log2")
                index++;
            }
            let customerData = await this.CustomerList(req.params.id)
            console.log("customerDAta",req.params.id)
            return {"CustomerDetails":customerData, "VehicleDetails":Items};
            // if (Items.VehicleImage_ID.length) {
            //     console.log("Log 1")

            // }
            // // if (offset && limit) Items = scanResults.slice(offset, limit + offset);
            // return { Items, LastEvaluatedKey: data.LastEvaluatedKey,Imagedata, Count};
        }
        catch (err) {
            console.log('Error Raised Here', err.message);
            throw new InternalError(msg.INTERNAL_ERROR, err.message);
        }



        // const Items = scanResults;

        // var index = 0;
        // for(const obj of Items) {
        // // await Items.forEach(async (obj, index) => {
        //     if(obj.VehicleImage_ID) {

        //         let images = await this.VehicleImage(obj.VehicleImage_ID);
        //         Items[index]['VehcicleImages'] = images;
        //     }
        //     index++;
        // }

        // // if (offset && limit) Items = scanResults.slice(offset, limit + offset);
        // return { Items, LastEvaluatedKey: data.LastEvaluatedKey, Count };
    }
    async VehicleDetails(req) {
        console.log("In Repo")
        try {
            const params = {
                TableName: TABLE.TABLE_VEHICLE
            };
            if (req.params.id) {
                params.FilterExpression = "ID = :id";
                params.ExpressionAttributeValues = {
                    ":id": req.params.id
                }
            }
            let scanResults = []
            let data, Count = 0;
            do {
                data = await documentClient.scan(params).promise();
                scanResults.push(...data.Items);
                Count += data.Count;
                params.ExclusiveStartKey = data.LastEvaluatedKey;
            } while (data.LastEvaluatedKey);

            const Items = scanResults;
            // return Items

            var index = 0;
            for (const item of Items) {
                if (item.VehicleImage_ID) {
                    // console.log("Log 1",typeof this.VehicleImage)
                    let ImageData = await this.VehicleImage(item.VehicleImage_ID)
                    // let CustomerData = await this.CustomerList(req)
                    // console.log(CustomerData,"CustomerData")
                    Items[index]['IMAGES'] = ImageData;

                }
                index++;
            }
            return Items;

        }

        catch (err) {
            console.log('Error Raised Here', err.message);
            throw new InternalError(msg.INTERNAL_ERROR, err.message);
        }


    }

    async VehicleImage(ImageID_arr) {
        // will load vehicleImage data
        try {
            var image_res = [];
            for (const image_id of ImageID_arr) {

                // }
                // ImageID_arr.forEach(async (image_id, index) => {
                let params = {
                    TableName: TABLE.TABLE_VEHICLE_IMAGES,
                    FilterExpression: " ID = :id ",
                    ExpressionAttributeValues: {
                        ":id": image_id
                    }
                };
                let scanResults = [];
                let data, Count = 0;
                do {
                    data = await documentClient.scan(params).promise();
                    scanResults.push(...data.Items);
                    Count += data.Count;
                    params.ExclusiveStartKey = data.LastEvaluatedKey;
                } while (data.LastEvaluatedKey);
                if (scanResults) {
                    image_res.push(scanResults[0]);
                }
            }
            return image_res;
        } catch (err) {
            console.log('Error Raied', err.message);
        }

    }
    async CustomerList(id) {
        // console.log("In Fun")
        try {
            // this will load all customer data 
            const params = {
                TableName: TABLE.TABLE_CUSTOMER
            };
            if (id) {
                params.FilterExpression = " ID= :id ";
                params.ExpressionAttributeValues = {
                    ":id":id
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
            // if (offset && limit) Items = scanResults.slice(offset, limit + offset);
            return { Items};
        } catch (err) {
            if (custom_validation_list.includes(err.name || "")) {
                throw err;
            }
            throw new InternalError(msg.INTERNAL_ERROR, err.message);
        }
    }



}

module.exports = VehicleRepository;