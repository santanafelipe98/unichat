const { request } = require('http');

module.exports.index = function(application, req, res) {
    let signout = req.query.signout;

    if (signout !== undefined) {
        let AccessControl = application.app.util.AccessControl;
        AccessControl.clearSession(req);

        res.redirect('/');
    }

    let user = {
        _id: req.session.uid,
        nickname: req.session.nickname
    };

    res.render('index', { user: user });
};

module.exports.chat = function(application, req, res) {
    let signout = req.query.signout;

    if (signout !== undefined) {
        let AccessControl = application.app.util.AccessControl;
        AccessControl.clearSession(req);

        res.redirect('/');
    }

    let roomId = req.params.roomId;

    const OPTIONS = {
        host: 'localhost',
        port: 8010,
        path: '/rooms/' + roomId,
        method: 'get',
        headers: {
            'Accept' : 'application/json',
            'Content-type': 'application/json'
        }
    };

    let user = {
        _id: req.session.uid,
        nickname: req.session.nickname,
        native_language: req.session.native_language
    };

    const r = request(OPTIONS, function(response) {
        let buffer = [];

        response.on('data', function(chunk) {
            buffer.push(chunk);
        });

        response.on('end', function() {
            let data = Buffer.concat(buffer).toString();

            let jsonData = JSON.parse(data);

            if (response.statusCode == 200) {
                let room = jsonData.payload;
            
                //Save room id

                req.session.roomId = room._id;

                res.render('chat', { user: user, room: room });
            } else {
                res.redirect('/?error=100');
            }
        });
    });

    r.end();
};