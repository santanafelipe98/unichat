const express = require('express');
const bodyParser = require('body-parser');
const consign = require('consign');

const app = express();

//Setup ther server

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});

//Setup the consign

consign()
    .include('app/routes')
    .then('app/models')
    .then('app/controllers')
    .then('app/services')
    .then('config/dbConnection.js')
    .into(app);

module.exports = app;