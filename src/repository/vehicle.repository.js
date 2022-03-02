const { AWS, documentClient } = require('../services/aws.service');
const TABLE = require('../constant/table');
const InternalError = require('../exception/internal.error');
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

            Items.forEach(async (item, index) => {
                // item.VehicleImage_ID;
                if (item.VehicleImage_ID) {
                    // console.log("Log 1",typeof this.VehicleImage)
                    let Imagedata = await this.VehicleImage(item.VehicleImage_ID)
                    // console.log(Imagedata,"imagedata")
                    Items[index]['IMAGES'] = ImageData;

                }
                // console.log(item.VehicleImage_ID, "log2")
             
            });
            return Items;
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



        const Items = scanResults;

        var index = 0;
        for(const obj of Items) {
        // await Items.forEach(async (obj, index) => {
            if(obj.VehicleImage_ID) {
                
                let images = await this.VehicleImage(obj.VehicleImage_ID);
                Items[index]['VehcicleImages'] = images;
            }
            index++;
        }

        // if (offset && limit) Items = scanResults.slice(offset, limit + offset);
        return { Items, LastEvaluatedKey: data.LastEvaluatedKey, Count };
    }
    async VehicleImage(ImageID_arr) {
        // will load vehicleImage data
        try{
            var image_res = [];
            for(const image_id of ImageID_arr) {

            // }
            // ImageID_arr.forEach(async (image_id, index) => {
                let params = {
                    TableName: TABLE.TABLE_VEHICLE_IMAGES,
                    FilterExpression: " ID = :id ",
                    ExpressionAttributeValues: {
                        ":id": image_id
                    }
                };

                // const params = {
                //     TableName: "ResetPassword",
                //     ProjectionExpression: ['OTP'],
                //     FilterExpression : " ID = :id ",
                //     ExpressionAttributeValues : {
                //         ":id": "78c2bcfd-5345-4bca-a5f8-c92f81a297be"
                //     }
                // }
                // const CreatedAt_VALUE = await documentClient.scan(getSortKey).promise();

                // let params = {
                //     TableName: "ResetPassword",
                //     FilterExpression: " ID = :id and GeneratedAt = :GeneratedAt ",
                //     ExpressionAttributeValues: {
                //         ":id": "78c2bcfd-5345-4bca-a5f8-c92f81a297be",
                //         ":GeneratedAt": "2022-03-02T08:09:06.473Z"
                //     }
                // };
                // console.log('Before Log');
                let scanResults = [];
                let data, Count = 0;
                do {
                    data = await documentClient.scan(params).promise();
                    scanResults.push(...data.Items);
                    Count += data.Count;
                    params.ExclusiveStartKey = data.LastEvaluatedKey;
                } while (data.LastEvaluatedKey);
                // let data = await documentClient.scan(params).promise();
                // console.log('AFter Log');
                // console.log(data);
                if(scanResults) {
                    image_res.push(scanResults);
                }
            } 
            return image_res;
        } catch(err) {
            console.log('Error Raied', err.message);
        }
        


        // const params = {
        //     TableName: TABLE.TABLE_VEHICLE_IMAGES
        // };
        // if (req.params.id) {
<<<<<<< HEAD
        //     params.FilterExpression = "VehicleImage_ID = :id";
=======
        //     params.FilterExpression = "ID = :id";
>>>>>>> 849bf4af147c59e21c0fe216cabdc9cc42e360c9
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