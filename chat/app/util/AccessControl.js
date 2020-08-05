module.exports.createSession = function(req, user) {
    //Create user session

    req.session.uid = user._id;
    req.session.nickname = user.nickname;
    req.session.native_language = user.native_language;
};

module.exports.updateSession = function(req, user) {
    //Update user session

    req.session.nickname = user.nickname;
    req.session.native_language = user.native_language;
};

module.exports.sessionExists = function(req) {
    return (typeof req.session !== undefined && req.session.uid !== undefined);
}

module.exports.clearSession = function(req) {
    //Clear all session content

    req.session.destroy();
};