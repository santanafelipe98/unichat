const authenticate = require('../util/authenticate');

module.exports = function(application) {

    application.get('/', authenticate(application), function(req, res) {
        application.app.controllers.chat.index(application, req, res);
    });

    application.get('/chat/:roomId', authenticate(application), function(req, res) {
        application.app.controllers.chat.chat(application, req, res);
    });
};