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
const img_validate_ext = require('constant/image_ext_list.js');

const base64_upload = multer({ 
    limits: { fileSize: 2 * 1024 }, 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (img_validate_ext.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(null, false);
          return cb(new Error('Only .png, .jpg, .jpeg and .webp format allowed!'));
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
app.post('/test_api', base64_upload.single('test_file'), function(req, res){
    console.log('Test Request');
    if(req.file !== undefined) {
        // use req.file.buffer.toString('base64') to get base64 encoded image
        console.log(req.file.buffer.toString('base64'));
    
    }
    res.send(req.body);
});

const server = awsServerlessExpress.createServer(app);
exports.handle = (event, context) => awsServerlessExpress.proxy(server, event, context);