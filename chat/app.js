const app = require('./config/server');
const consign = require('consign');

const session = require('express-session')({
    secret: 'dDtank@123',
    resave: true,
    saveUninitialized: true
});

const sharedSession = require('express-socket.io-session');

const server = require('http').createServer(app);
const io = require('socket.io')(server);



app.use(session);

io.of('/chat').use(sharedSession(session));
io.of('/chat').use(function(socket, next) {
    let handshakeData = socket.handshake;
    let userId = handshakeData.session.uid;

    if (!userId) {
        next(new Error('Not authorized'));
        
        return;
    }

    next();
});

app.set('io', io);

//Setup consign

consign()
    .include('app/routes')
    .then('app/models')
    .then('app/controllers')
    .then('app/services')
    .then('app/util')
    .into(app);


//Start the server

const config = {
    port: 8080,
    hostname: 'localhost'
}

const users = {},
    connections = {};

server.listen(config.port, config.hostname, function() {
    console.log('The server was started successfuly.');

    const chat = io
        .of('/chat')
        .on('connection', function(socket) {
            console.log('User has connected.');

            socket.on('subscribe user', function(data) {
                let user = data.user;
                let room = data.to;

                if (!(room in users)) {
                    users[room] = [];
                    users[room].push(user);
                } else {
                    users[room].push(user);
                }

                socket.join(room);
                connections[socket.id] = room;

                socket.room = room;

                io.of('/chat').to(room).emit('notify users', users[room]);
            });

            socket.on('send message', function(message) {
                let session = socket.handshake.session;
                message.author_id = session.uid;
                message.room_id = session.roomId;
                message.author_nickname = session.nickname;

                let id = socket.id;
                let room = connections[id];

                io.of('/chat').to(room).emit('new message', message);
            });

            socket.on('disconnect', function() {
                console.log("user disconnected");

                let id = socket.id;

                if (id in connections) {
                    delete connections[id];
                }

                let session = socket.handshake.session;
                let room = socket.room;
                let userId = session.uid;

                let userObj = users[room].find(function(user) {
                    return user._id == userId;
                });

                let pos = users[room].indexOf(userObj);
                
                if (pos !== -1) {
                    users[room].splice(pos, 1);
                }
            });
        });
});


