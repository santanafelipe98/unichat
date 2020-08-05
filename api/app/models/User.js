const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    createdAt: {
        type: Number,
        default: Date.now()
    },
    name: {
        firstname: String,
        lastname: String
    },
    nickname: String,
    password: String,
    date_of_birth: String,
    native_language: String
});

userSchema.statics.findByCredentials = function(credentials, callback = undefined) {
    let $this = this;
    
    if (callback) {
        $this.findOne()
            .where('nickname')
            .equals(credentials.nickname)
            .exec(function(error, user) {

                if (!user) {
                    callback(error, null);
                } else {
                    const hashedPassword = user.password;
                    bcrypt.compare(credentials.password, hashedPassword, function(err, result) {
                        if (result) {
                            callback(null, user)

                            return;
                        }

                        callback(err, null);
                    });
                }
            });
    } else {
        return new Promise(function(resolve, reject) {
            $this.findOne()
                .where('nickname')
                .equals(credentials.nickname)
                .exec(function(error, user) {

                    if (!user) {
                        reject(error);
                    } else {
                        const hashedPassword = user.password;
                        bcrypt.compare(credentials.password, hashedPassword, function(err, result) {
                            if (result) {
                                resolve(user);

                                return;
                            }

                            resolve(null);
                        });
                    }
                });
        });
    }
};

userSchema.statics.exists = function(user, callback = undefined) {
    let $this = this;

    if (callback) {
        $this.countDocuments(
            { nickname: user.nickname }, 
            function(err, count) {
                let result = (count > 0);
                callback(err, result);
            }
        );
    } else {
        return new Promise(function(resolve, reject) {
            $this.countDocuments(
                { nickname: user.nickname },
                function(err, count) {

                    if (err) {
                        reject(err);
                    } else {
                        let result = (count > 0);
                        resolve(result);
                    }

                }
            );
        });
    }
};

let User;

module.exports = function() {
    try {
        User = model('User');
    } catch (err) {
        User = model('User', userSchema);
    }

    return User;
}