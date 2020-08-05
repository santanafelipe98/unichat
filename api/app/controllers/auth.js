const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

module.exports.signin = function(application, req, res) {
    let validationErrors = validationResult(req);
    let areThereAnyErrors = !(validationErrors.isEmpty());

    if (!areThereAnyErrors) {

        let data = req.body;
        let User = application.app.models.User;
        const promise = User.findByCredentials(data);

        let json = null;

        promise.then(function(user) {
            
            if (user) {
                json = {
                    success: true,
                    data: user
                };

                res.status(200).json(json);
            } else {
                json = {
                    success: false,
                    errors: [
                        'User doesn\'t exists.'
                    ]
                }

                res.status(404).json(json);
            }
        }).catch(function(err) {
            json = {
                success: false,
                errors: [
                    'User doesn\'t exists.'
                ]
            }

            res.status(404).json(json);
        });

        return;
    }

    json = {
      success: false,
      errors: validationErrors.errors
    };

    res.status(400).json(json);
};

module.exports.signup = function(application, req, res) {
    let validationErrors = validationResult(req);
    let areThereAnyErrors = !(validationErrors.isEmpty());

    let json = null;

    if (!areThereAnyErrors) {
        let data = req.body;
        let password = data.password;

        const saltRounds = 10;

        bcrypt.hash(password, saltRounds, function(err, hash) {
            let userInfo = {
                name: {
                    firstname: data.firstname,
                    lastname: data.lastname
                },
                nickname: data.nickname,
                password: hash,
                date_of_birth: `${ data.year }-${ data.month }-${ data.date }`,
                native_language: data.native_language
            };

            let User = application.app.models.User;
            let user = new User(userInfo);
            
            user.save(function(err, user) {
                if (err) {
                    json = {
                        success: false,
                        errors: [
                            'Unable to connect to database.'
                        ]
                    };

                    res.status(502).json(json);

                    return;
                }

                json = {
                    success: true,
                    data: user
                };

                res.status(200).json(json);
            });
        });

        return;
    }

    json = {
        success: false,
        ...validationErrors
    };

    res.status(400).json(json);
};