const validations = require('../utils/validations');

module.exports = function(application) {
    application.get('/rooms', function(req, res) {
        application.app.controllers.rooms.findAll(application, req, res);
    });

    application.get('/rooms/:roomId', function(req, res) {
        application.app.controllers.rooms.findOne(application, req, res);
    });

    application.post('/rooms', validations.createRoom, function(req, res) {
        application.app.controllers.rooms.create(application, req, res);
    });

    application.put('/rooms/:roomId', validations.updateRoom, function(req, res) {
        application.app.controllers.rooms.update(application, req, res);
    });

    application.delete('/rooms/:roomId', function(req, res) {
        application.app.controllers.rooms.remove(application, req, res);
    });
};