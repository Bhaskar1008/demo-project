'use strict'
const awsServerlessExpress = require('aws-serverless-express')
const bodyParser = require("body-parser");
const app = require("express")();
const helmet = require("helmet");
const cors = require('cors');
require("dotenv").config();
const multer = require('multer');
const path = require('path');
const storage = multer.memoryStorage();
const img_validate_ext = require('./constant/image_ext_list');

const base64_upload = multer({ 
    limits: { fileSize: 2 * 1024 * 1024 }, 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
          cb(null, true);
        } else {
          cb(null, false);
          return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
      }    
 });

//body parser 
// app.use(bodyParser.text());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(helmet());

// app.use(cors());

const {
    demoProjectApi,
    defaultHandler
} = require("./controller/index.js");


app.get('/customer/:id?', demoProjectApi.getCustomerList);
app.post('/updateCustomer', demoProjectApi.updateCustomerDetail );
app.post('/AddCustomer', demoProjectApi.addNewCustomer);
app.post('/validateLogin', demoProjectApi.validateLogin );
// app.post('/test_api', base64_upload.array('test_file', 10), function(req, res){
//   res.send({body: req.body, files: req.files});
//     // console.log('Test Request');
//     // if(req.file !== undefined) {
//     //     // file uploaded
//     //     console.log(req.file.buffer.toString('base64'));
    
//     // }
//     // res.send(req.body);
// });
app.post('/addVehicle', base64_upload.array('vehicle_images', 10), demoProjectApi.addNewVehicle);


const server = awsServerlessExpress.createServer(app);
exports.handle = (event, context) => awsServerlessExpress.proxy(server, event, context);