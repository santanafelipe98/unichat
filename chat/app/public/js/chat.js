const 
    messages = [],
    errors = [];

function newMessage(message) {
    let currentUser = $('#input-author-id').val();

    let messagePosition;

    if (currentUser !== message.author_id) {
        messagePosition = 'message-left';
    } else {
        messagePosition = 'message-right';
    }

    let html = 
        '<div class="message ' + messagePosition +  '" id="msg_' + 
        message._id  + '">' +
            '<div class="message-author">' + message.author_nickname + '</div>' +
            '<span class="message-text">' + message.content + '</span>' +
            '<div class="message-status">' + Date.now() + '</div>' +
        '</div>';

    let messagesContainer = $('#messages');

    messagesContainer.append(html);

    let containerHeight = parseInt(messagesContainer.css('height'));
    messagesContainer.scrollTop(containerHeight);
}

function newUser(user) {
    let userList = $('#user-list');

    let html = 
        '<li class="user-list-item">' +
            '<div class="user" id=user_"' + user._id + '">' +
                '<span class="user-nickname">' + 
                    user.nickname +
                '</span>' +
                '<span class="user-status user-status-on"></span>' +
            '</div>' +
        '</li>';
    
    userList.append(html);
};

function getMessage() {
    let inputMessage = $('#input-message');
    let inputRoom = $('#input-room-id');
    let inputAuthor = $('#input-author-id');
    let inputAuthorNickname = $('#input-author-nickname');
    let inputSourceLang = $('#input-source-language');

    let message = {
        room_id: inputRoom.val(),
        author_id: inputAuthor.val(),
        author_nickname: inputAuthorNickname.val(),
        content: inputMessage.val(),
        source_language: inputSourceLang.val()
    };

    inputMessage.val('');
    inputMessage.focus();

    return message;
};

function subscribeUser(socket) {
    let inputRoom = $('#input-room-id');
    let inputAuthor = $('#input-author-id');
    let inputAuthorNickname = $('#input-author-nickname');
    let inputSourceLang = $('#input-source-language');

    let data = {
        user: {
            _id: inputAuthor.val(),
            nickname: inputAuthorNickname.val(),
            native_language: inputSourceLang.val()
        },
        to: inputRoom.val()
    };


    socket.emit('subscribe user', data);
};

function getMessageTranslation(message, callback) {
    let inputSourceLang = $('#input-source-language');
    let targetLang = inputSourceLang.val();

    if (message.source_language !== targetLang) {
        //Translate message

        let sourceText = encodeURI(message.content);

        let sourceLang = message.source_language; 
        let endpoint = `http://localhost:8010/translate?sl=${ sourceLang }&tl=${ targetLang }&st=${ sourceText }`;

        $.ajax({
            url: endpoint,
            method: 'GET',
            dataType: 'json'
        }).done(function(data) {
            let finalText = data.data.text;
            message.content = finalText;

            callback(null, message);
        }).fail(function(err) {
            callback(err, null);
        });

        return;
    }

    callback(null, message);
}

function makeTranslationRequests(messageList, onComplete) {
    let messageOnTop = messageList.shift();

    if (messageOnTop) {
        let inputSourceLang = $('#input-source-language');
        let targetLang = inputSourceLang.val();

        if (messageOnTop.source_language !== targetLang) {
            //Translate message

            let sourceText = encodeURI(messageOnTop.content);

            let sourceLang = messageOnTop.source_language; 
            let endpoint = `http://localhost:8010/translate?sl=${ sourceLang }&tl=${ targetLang }&st=${ sourceText }`;

            $.ajax({
                url: endpoint,
                method: 'GET',
                dataType: 'json'
            }).done(function(data) {
                let finalText = data.data.text;
                messageOnTop.content = finalText;

                messages.push(messageOnTop)
            }).fail(function(err) {
                errors.push(err);
            }).always(function() {
                makeTranslationRequests(messageList, onComplete);
            });
        } else {
            messages.push(messageOnTop);

            makeTranslationRequests(messageList, onComplete);
        }
    } else {

        console.log('terminou');

        messages.sort(function(message1, message2) {
            return message1.created_at > message2.created_at;
        });

        onComplete(errors, messages);
    }
}

function loadLastTenMessages() {
    let inputRoom = $('#input-room-id');
    let roomId = inputRoom.val();

    let endpoint = `http://localhost:8010/messages?last=10&room=${ roomId }`;

    $.ajax({
        url: endpoint,
        method: 'GET',
        dataType: 'json'
    }).done(function(data) {

        let messageList = data.payload;

        //Make some translations

        makeTranslationRequests(
            messageList, 
            function(errors, messages) {

                if (messages) {
                    messages.forEach(function(message, index) {
                        newMessage(message);
                    });
                }
            }
        );


    }).fail(function(err) {
        console.log(err);
    });
};

$(document).ready(function() {

    const chat = io('http://localhost:8080/chat');

    chat.on('connect', function() {
        console.log('Connected');

        //Send user data

        subscribeUser(chat);

        //Load last room messages

        loadLastTenMessages();

        chat.on('notify users', function(users) {
            $('#user-list').html('');
            $('#users-count').html(users.length);

            users.forEach(function(user, index) {
                newUser(user);
            });
        });

        chat.on('new message', function(message) {

            getMessageTranslation(message, function(err, data) {
                if (!err) {
                    newMessage(message);
                } else {
                    console.log(err);
                }
            });
        });
    });
    
    

    $('#btn_send_message').click(function() {
        let message = getMessage();

        //Send message to backend using ajax

        let endpoint = 'http://localhost:8010/messages';
        $.ajax({
            method: 'POST',
            url: endpoint,
            data: message,
            dataType: 'json'
        }).done(function(data) {
            let message = data.payload;
            chat.emit('send message', message);
        }).fail(function(err) {
            console.log(err);
        });
        
    });

    $('#input-message').on('keyup', function(e) {
        const ENTER_KEY = 13;

        if (e.keyCode === ENTER_KEY) {
            $('#btn_send_message').trigger('click');
        }
    });
});