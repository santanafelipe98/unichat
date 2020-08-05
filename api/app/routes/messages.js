const validations = require('../utils/validations');

module.exports = function(application) {

    application.get('/messages', function(req, res) {
        application.app.controllers.messages.findAll(application, req, res);
    });

    application.get('/messages/:messageId', function(req, res) {
        application.app.controllers.messages.findOne(application, req, res);
    });

    application.post('/messages', validations.createMessage, function(req, res) {
        application.app.controllers.messages.create(application, req, res);
    });

    application.put('/messages/:messageId', function(req, res) {
        application.app.controllers.messages.update(application, req, res);
    });

    application.delete('/messages/:messageId', function(req, res) {
        application.app.controllers.messages.remove(application, req, res);
    });

};