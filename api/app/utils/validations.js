const { check } = require('express-validator');

const namePattern = /\w+/;
const datePattern = /([0-9]{2,4})(\-([0-9]{2})){2}/;

const User = require('../models/User')();

module.exports.signin = [
    check('nickname')
        .notEmpty()
        .trim()
        .matches(namePattern, "i"),
    check('password')
        .notEmpty()
];

module.exports.signup = [
    check('firstname').notEmpty(),
    check('lastname').notEmpty(),
    check('nickname')
        .notEmpty()
        .trim()
        .matches(namePattern, 'i')
        .custom(async function(value, { req }) {

            let result = await User.exists({ nickname: value });
            console.log(result);

            if (result) {
                return Promise.reject()
            }

            return Promise.resolve();
        }),
    check('password')
        .notEmpty()
        .isLength({ min: 8 }),
    check('password_confirmation').custom(function(value, { req }) {
        console.log('password: ' + value);
        console.log('password_confirmation: ' + req.body.password);

        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password.');
        }

        return true;
    }),
    check('date_of_birth')
        .notEmpty()
        .matches(datePattern, 'i'),
    check('native_language')
        .notEmpty(),
    check('agree_to_terms')
        .exists()
];

module.exports.createRoom = [
    check('author_id')
        .notEmpty(),
    check('name')
        .notEmpty()
        .matches(namePattern)
];

module.exports.updateRoom = [
    check('name')
        .notEmpty()
];

module.exports.createMessage = [
    check('author_id')
        .notEmpty(),
    check('author_nickname')
        .notEmpty(),
    check('room_id')
        .notEmpty(),
    check('source_language')
        .notEmpty(),
    check('status')
        .optional()
        .isIn([ -1, 0, 1 ]),
    check('content')
        .notEmpty()
];

module.exports.updateMessage = [

];