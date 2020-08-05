const { validationResult } = require('express-validator');
const { Types } = require('mongoose');

module.exports.create = function(application, req, res) {
    let validationErrors = validationResult(req);
    let areThereAnyErrors = (!validationErrors.isEmpty());

    let jsonResponse = null;

    if (!areThereAnyErrors) {
        let formData = req.body;
        formData.author_id = new Types.ObjectId(formData.author_id);

        let Room = application.app.models.Room;
        let room = new Room(formData);

        room.save(function(err, room) {
            if (!err) {
                jsonResponse = {
                    success: true,
                    payload: room
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

module.exports.findOne = function(application, req, res) {
    let roomId = req.params.roomId;

    let Room = application.app.models.Room;
    Room.findById(roomId, function(err, room) {
        let jsonResponse = null;

        if (!err) {
            jsonResponse = {
                success: true,
                payload: room
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
};

module.exports.findAll = function(application, req, res) {

};

module.exports.update = function(application, req, res) {
    let validationErrors = validationResult(req);
    let areThereAnyErrors = (!validationResult.isEmpty());

    let roomId = new Types.ObjectId(req.params.roomId);

    let jsonResponse = null;

    if (areThereAnyErrors) {
        let formData = req.body;

        let Room = application.app.models.Room;
        Room.updateOne({ _id: roomId }, formData, function(err, result) {
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
                    'Unable to connect to database'
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
        let roomId = new Types.ObjectId(req.params.roomId);
        let Room = application.app.models.Room;

        Room.deleteOne({ _id: roomId }, function(err, result) {
            if (!err) {
                jsonResponse = {
                    success: true,
                    payload: result
                };

                res.status(200).json(jsonResponse);

                return;
            }

            jsonResponse = {
                sucess: false,
                errors: [
                    'Unable to connect to database'
                ]
            };

            res.status(500).json(jsonResponse);
        });
    } catch (err) {
        jsonResponse = {
            success: false,
            errors: [
                err
            ]
        };

        res.status(400).json(jsonResponse);
    }
};