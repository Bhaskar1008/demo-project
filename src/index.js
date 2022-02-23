'use strict'
const awsServerlessExpress = require('aws-serverless-express')
const bodyParser = require("body-parser");
const app = require("express")();
const helmet = require("helmet");
const cors = require('cors');
require("dotenv").config();

//body parser 
app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const {
    demoProjectApi,
    defaultHandler
} = require("./controller/index.js");


app.get('/customer', demoProjectApi.getCustomerList);
app.post('/AddCustomer', demoProjectApi.addNewCustomer);
app.post('/addVehicle', demoProjectApi.addNewVehicle);


const server = awsServerlessExpress.createServer(app);
exports.handle = (event, context) => awsServerlessExpress.proxy(server, event, context);