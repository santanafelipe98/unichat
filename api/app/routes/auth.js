const validations = require('../utils/validations');

module.exports = function(application) {

    application.post('/signin', validations.signin, function(req, res) {
        application.app.controllers.auth.signin(application, req, res);
    });

    application.post('/signup', validations.signup, function(req, res) {
        application.app.controllers.auth.signup(application, req, res);
    });

};