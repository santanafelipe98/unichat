const { Schema, model } = require('mongoose');

const MAX_USERS = 50;

const roomSchema = new Schema({
    author_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
    created_at: {
        type: Number,
        default: Date.now()
    },
    name: {
        type: String,
        required: true
    },
    max_users: {
        type: Number,
        default: MAX_USERS
    },
    participants: {
        type: Schema.Types.Array
    }
});

/* roomSchema.statics.findById = function(roomId, callback = undefined) {
    $this = this;

    if (callback) {
        $this.findOne({ _id: new ObjectID(roomId) }, callback);

        return;
    }

    return new Promise(function(resolve, reject) {
        $this.findOne({ _id: new ObjectID(roomId) }, function(err, room) {
            if (!err) {
                resolve(room);

                return;
            }

            reject(err);
        });
    });
}; */

let Room;

module.exports = function() {
    try {
        Room = model('Room');
    } catch(err) {
        Room = model('Room', roomSchema);
    }

    return Room;
};