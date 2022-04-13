
class ChatEngine {
    //passing Id of chatBox to constructor
    constructor(chatBoxId, userEmail) {
        this.chatBox = $(`#${chatBoxId}`)
        this.userEmail = userEmail;

        //1) initiating a connection to socket server
        this.socket = io.connect('http://localhost:5000', { transports: ['websocket'] });

        //only if userEmail is there
        if (this.userEmail) {
            this.connectionHandler();
        }
    }

    //handles interaction between user and server
    connectionHandler() {
        let self = this;
        // .on('connect') --> detects a connection event
        this.socket.on('connect', function () {
            console.log('connection established using sockets...');

            //sending an event/req to join the room
            self.socket.emit('join_room', {
                user_email: self.userEmail,
                chatroom: 'codeial'
            });

            self.socket.on('user_joined', function (data) {
                console.log('a new user joined', data);
            })
        })

        //event on clicking send button
        $('#send-message').click(function () {
            let msg = $('#chat-message-input').val();
            if (msg != '') {
                self.socket.emit('send_message', {
                    message: msg,
                    user_email: self.userEmail,
                    chatroom: 'codeial'
                });
            }
        });

        self.socket.on('receive_message', function (data) {
            console.log('message received', data.message);

            let newMessage = $('<li>');

            let messageType = 'other-message';

            if (data.user_email == self.userEmail) {
                messageType = 'self-message';
            }

            newMessage.append($('<span>', {
                'html': data.message
            }));

            newMessage.append($('<sub>', {
                'html': data.user_email
            }));

            newMessage.addClass(messageType);

            $('#chat-messages-list').append(newMessage);
        })
    }
}