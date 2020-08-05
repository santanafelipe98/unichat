module.exports = function(application, callback = undefined) {
    return function(req, res, next) {
        let AccessControl = application.app.util.AccessControl;

        if (!AccessControl.sessionExists(req)) {
            res.redirect('/auth');

            return;
        }

        if (callback) {
            callback(req, res, next);
        } else {
            next();
        }
    };
};