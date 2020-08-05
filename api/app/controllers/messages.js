const { validationResult } = require('express-validator');
const { Types } = require('mongoose');


module.exports.create = function(application, req, res) {
    let validationErrors = validationResult(req);
    let areThereAnyErrors = (!validationErrors.isEmpty());

    let jsonResponse = null;

    if (!areThereAnyErrors) {
        let formData = req.body;
        let Message = application.app.models.Message;
        let message = new Message(formData);

        message.save(function(err, message) {

            if (!err) {
                jsonResponse = {
                    success: true,
                    payload: message
                };

                res.status(200).json(jsonResponse);

                return;
            }

            jsonResponse = {
                success: false,
                errors: [
                    'Unnable to connect to database.'
                ]
            };

            res.status(500).json(json);
        });

        return;
    }

    jsonResponse = {
        success: false,
        errors: validationErrors.errors
    };

    res.status(400).json(jsonResponse);
    
};

module.exports.findAll = function(application, req, res) {
    //Get all messages

    /* let sort = req.query.sort;
    let sortMode = req.query.sort_mode || 'desc';
    let limit = req.query.limit || 10;
    let page = req.query.page || 1; */

    let last = parseInt(req.query.last);
    let sort = req.query.sort;
    let roomId = req.query.room;

    let Message = application.app.models.Message;
    let promise;

    if (last) {
        if (roomId) {
            let room = {
                _id: roomId
            };
            promise = Message.getLastMessagesFromRoom(room, 10);
        }
    }

    let jsonResponse = null;

    promise.then(function(messageList) {
        jsonResponse = {
            success: true,
            payload: messageList
        };

        res.status(200).json(jsonResponse);
    }).catch(function(err) {
        jsonResponse = {
            success: false,
            errors: [
                'Unable to connecto to database.'
            ]
        };

        res.status(500).json(jsonResponse);
    });
};

module.exports.findOne = function(application, req, res) {
    let messageId =  req.params.messageId;

    let Message = application.app.models.Message;

    Message.findById(messageId, function(err, message) {
        let json = null;

        if (!err) {
            json = {
                success: true,
                payload: message
            };

            res.status(200).json(json);

            return;
        }

        json = {
            success: false,
            errors: [
                'Unable to connect to database'
            ]
        };

        res.status(500).json(json);
    });

};

module.exports.update = function(application, req, res) {
    let validationErrors = validationResult(req);
    let areThereAnyErrors = (!validationErrors.isEmpty());

    let messageId = new Types.ObjectId(req.params.messageId);

    let jsonResponse = null;

    if (!areThereAnyErrors) {
        let formData = req.body;

        let Message = application.app.models.Message;
        Message.updateOne({ _id: messageId }, { formData }, function(err, result) {
            if (!err) {
                jsonResponse = {
                    success: true,
                    payload: result
                };

                res.status(200).json(jsonResponse);

                return;
            }

            jsonResponse = {
                success: false,
                errors: [
                    'Unable to connect to database.'
                ]
            };

            res.status(500).json(jsonResponse);
        });

        return;
    }
    
    jsonResponse = {
        success: false,
        errors: validationErrors.errors
    };

    res.status(400).json(jsonResponse);
};

module.exports.remove = function(application, req, res) {
    let jsonResponse = null;

    try {
        let messageId = new Types.ObjectId(req.params.messageId);
        
        let Message = application.app.models.Message;
        Message.deleteOne({ _id: messageId }, function(err, result) {
            if (!err) {
                jsonResponse = {
                    success: true,
                    payload: result
                };

                res.status(200).json(jsonResponse);

                return;
            }

            jsonResponse = {
                success: false,
                errors: [
                    'Unable to connect to database.'
                ]
            };

            res.status(500).json(jsonResponse);
        });
    } catch(err) {
        jsonResponse = {
            success: false,
            errors: [
                err
            ]
        };

        res.status(500).json(jsonResponse);
    };
};