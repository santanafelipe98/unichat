module.exports = function(application) {

    application.get('/auth', function(req, res) {
        application.app.controllers.auth.auth(application, req, res);
    });

    application.post('/signin', function(req, res) {
        application.app.controllers.auth.signin(application, req, res);
    });

    application.post('/signup', function(req, res) {
        application.app.controllers.auth.signup(application, req, res);
    });

};