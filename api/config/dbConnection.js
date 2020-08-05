const mongoose = require('mongoose');

const config = {
    host: 'localhost',
    port: 27017,
    name: 'uni_chat'
};

const dbUri = `mongodb://${ config.host }:${ config.port }/${ config.name }`;

const db = mongoose.connection;

mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = function() {
    return db;
};