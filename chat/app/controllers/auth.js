const { request } = require('http'); 

module.exports.auth = function(application, req, res) {
    const AccessControl = application.app.util.AccessControl;

    if (AccessControl.sessionExists(req)) {
        res.redirect('/');

        return;
    }

    res.render('auth');
};

module.exports.signin = function(application, req, res) {
    const OPTIONS = {
        host: 'localhost',
        port: 8010,
        path: '/signin',
        method: 'post',
        headers: {
            'Accept' : 'application/json',
            'Content-type': 'application/json'
        }
    }

    let formData = req.body;
    let stringJson = JSON.stringify(formData);

    //Do the request stuff

    const r = request(OPTIONS, function(response) {
        let buffer = [];

        response.on('data', function(chunk) {
            buffer.push(chunk);
        });

        response.on('end', function() {
            let data = Buffer.concat(buffer).toString();
            let jsonData = JSON.parse(data);

            console.log(jsonData);

            if (response.statusCode == 200) {
                if (jsonData.data !== undefined) {
                    //Create user session

                    let user = jsonData.data;
                    let AccessControl = application.app.util.AccessControl;

                    AccessControl.createSession(req, user);

                    res.redirect('/');

                    return;
                }

                res.redirect('/auth');
            } else {
                res.redirect('/auth');
            }
        });
    });

    r.write(stringJson);
    r.end();
};

module.exports.signup = function(application, req, res) {
    //Do the request stuff

    const OPTIONS = {
        host: 'localhost',
        port: 8010,
        path: '/signup',
        method: 'post',
        headers: {
            'Accept' : 'application/json',
            'Content-type': 'application/json'
        }
    }

    let formData = req.body;
    let date = formData.date;
    date = (++date + 1 < 10) ? '0' + date: date;

    let month = formData.month;
    month = (++month < 10) ? '0' + month : month;

    let dateOfBirth = `${ formData.year }-${ month }-${ date }`;

    formData.date_of_birth = dateOfBirth;

    let stringJson = JSON.stringify(formData);

    const r = request(OPTIONS, function(response) {
        let buffer = [];

        response.on('data', function(chunk) {
            buffer.push(chunk);
        });

        response.on('end', function() {
            let data = Buffer.concat(buffer).toString();
            let jsonData = JSON.parse(data);

            console.log(jsonData);

            if (response.statusCode == 200) {
                if (jsonData.success) {
                    res.redirect('/auth?signup=true');

                    return;
                }

                res.redirect('/auth?signup=false');
            } else {
                res.redirect('/auth?signup=false');
            }

        });
    });

    r.write(stringJson);
    r.end();
};