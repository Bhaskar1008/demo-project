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



    }
    async VehicleImage(req) {
        try{
              // will load vehicleImage data
        let queryParams = { RequestItems: {} };
        var custom_obj = [];
        req.forEach(function (item, index) {
            custom_obj.push({ ID: item });
        });
        queryParams.RequestItems[TABLE.TABLE_VEHICLE_IMAGES] = {
            Keys: custom_obj
        }
        console.log("In vehicleImage")
        const getSortKey = {
            TableName: TABLE.TABLE_VEHICLE,
            ProjectionExpression: ['CreatedAt'],
            FilterExpression: " ID = :id ",
            ExpressionAttributeValues: {
                ":id": id
            }
        }
        const CreatedAt_VALUE = await documentClient.scan(getSortKey).promise();

        // const result = await documentClient.batchGet(queryParams,function(err, data) {
            if (err) console.log(err);
            else console.log(data);
        //   })
        console.log("result")
        return {};

        }
        catch (err) {
            console.log('Error Raised Here', err.message);
            throw new InternalError(msg.INTERNAL_ERROR, err.message);
        }
     


        // const params = {
        //     TableName: TABLE.TABLE_VEHICLE_IMAGES
        // };
        // if (req.params.id) {
        //     params.FilterExpression = "ID = :id";
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