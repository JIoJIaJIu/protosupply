var config = require('config');
var bodyParser = require('body-parser');
var express = require('express');
var morgan = require('morgan');
var Router = require('./modules/router');

var app = express();
var router = new Router();

//TODO:
app.use(bodyParser());
app.use(router._router);
app.use(morgan('combined'));

app.listen(config.PORT);
console.log("Server startend on " + config.PORT);

