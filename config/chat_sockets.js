//OBSERVER ,server of chat engine, which will recieve incoming connections from users 

//for recieving a request for connection
module.exports.chatSockets = function (socketServer) {
    //passing socketServer from which is chatServer in index.js
    let io = require('socket.io')(socketServer);

    // 2) recieves a connection from chat_engine.js's io.connect and emits back an acknowledgement 'You are connected to chat_engine's  connectionHandler
    io.sockets.on('connection', function (socket) {
        console.log('new connection recieved', socket.id);

        socket.on('disconnect', function(){
            console.log('socket disconnected!');
        });

        // req to join room recieved
        socket.on('join_room', function (data) {
            console.log('Joining req recieved', data);
            //join the chatroom
            socket.join(data.chatroom);
            //notify all other users in chatroom that user has entered the chatroom
            io.in(data.chatroom).emit('user_ joined ', data)
        })

        //upon recieving send_message event, we emit the data to all the users in the chatroom with recieve_message event
        socket.on('send_message', function(data){
            io.in(data.chatroom).emit('receive_message', data);
        });
    })


} 