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

const temp = require('../src/repository/reset_password.repository')

const base64_upload = multer({ 
    limits: { fileSize: 2 * 1024 * 1024 }, 
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

app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//body parser 
// app.use(bodyParser.text());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(helmet());

// app.use(cors());

const {
    amProjectApi,
    defaultHandler
} = require("./controller/index.js");

// get Customers/specific customer
app.get('/customer/:id?', amProjectApi.getCustomerList);

app.get('/verifyEMailMobile', amProjectApi.verifyEmailandMobileNumber);

// update Customer details
app.post('/updateCustomer', amProjectApi.updateCustomerDetail );

// add new customer
app.post('/AddCustomer', amProjectApi.addNewCustomer);

// validate user login
app.post('/validateLogin', amProjectApi.validateLogin );

app.post('/reset-password', amProjectApi.resetPassword );

app.post('/validate-otp', amProjectApi.validateOTP);

// add new vehicle {contains base64 images}
app.post('/addVehicle', base64_upload.array('vehicle_images', 10), amProjectApi.addNewVehicle);
// vehicle By CustomerID
app.get('/vehicle/customer/:id', amProjectApi.getVehicleList);

// vehicale Details along Imagedata
app.get('/vehicleDetails/:id', amProjectApi.getVehicleById);


app.get('/vehicleImageDetails', amProjectApi.getVehicleImageById);


// app.get('/temp/:id',async (req, res) => {
//   const resp = await new temp().validateResetLimit(req.params.id);
//   res.send(resp);
// });

app.listen(4000, function () {
    console.log('Server is running.. on Port https://localhost:4000/');
});


const server = awsServerlessExpress.createServer(app);
exports.handle = (event, context) => awsServerlessExpress.proxy(server, event, context);