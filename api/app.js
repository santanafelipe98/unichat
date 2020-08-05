const app = require('./config/server');

//Initialize the server

const config = {
    port: 8010,
    hostname: 'localhost'
};

app.listen(config.port, config.hostname, function() {
    console.log('The server was started succesfuly.');

    const connection = app.config.dbConnection;

    connection.once('open', function() {
        console.log('Connected to MongoDB.');
    });

    connection.on('error', function(err) {
        console.log(err);
    })
});