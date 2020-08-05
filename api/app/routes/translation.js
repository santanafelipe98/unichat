module.exports = function(application) {
    application.get('/translate', function(req, res) {
        application.app.controllers.translation.translate(application, req, res);
    });
};