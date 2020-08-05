//Import modules

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

//Setup the server

app.set('view engine', 'ejs');
app.set('views', './app/views');

app.use(express.static('./app/public'))
app.use(bodyParser.urlencoded( { extended: true }));
app.use(bodyParser.json());

module.exports = app;
