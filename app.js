const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routers/user");
const app = express();
const {Api_VERSION} = require('./config');

//load routing
const userRoutes = require("./routers/user");

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Configure header HTTP
//..........

//Route Basic
app.use(`/api/${API_VERSION}`, userRoutes);

module.exports = app;
