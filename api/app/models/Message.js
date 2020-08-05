const { Schema, model, Types } = require('mongoose');
const User = require('./User')();

const messageSchema = new Schema({
    author_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    author_nickname: {
        type: String,
        required: true
    },
    room_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    created_at: {
        type: Number,
        default: Date.now()
    },
    source_language: {
        type: String,
        required: true
    },
    status: Number,
    content: {
        type: String,
        required: true
    }
});

messageSchema.statics.findById = function(messageId, callback = undefined) {
    let $this = this;

    if (callback) {
        $this.findOne({ _id: new Types.ObjectId(messageId) }, callback);

        return;
    }

    return new Promise(function(resolve, reject) {
        $this.findOne({ _id: new Types.ObjectId(messageId) }, function(err, message) {
            if (!err) {
                resolve(message);

                return;
            }

            reject(err);
        });
    });
};

messageSchema.statics.getLastMessagesFromRoom = function(room, limit=10, callback) {
    let $this = this;

    if (callback) {
        $this
            .find({ room_id: new Types.ObjectId(room._id) })
            .sort({ created_at: 1 })
            .limit(limit).exec(function(err, messages) {
                callback(err, messages);
            });
        
            return;
    }

    return new Promise(function(resolve, reject) {
        $this
            .find({ room_id: new Types.ObjectId(room._id) })
            .sort({ created_at: 1 })
            .limit(10).exec(function(err, messages) {

                if (!err) {
                    resolve(messages);

                    return;
                }

                reject(err);

            });
    });
};

let Message;

module.exports = function() {
    try {
        Message = model('Message');
    } catch(err) {
        Message = model('Message', messageSchema);
    }

    return Message;
};