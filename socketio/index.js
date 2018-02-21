var initializeSocketIO = function (socket, ioObj) {
    console.log('new socketio connection established');
    socket.on('open-call-channel', function (userId) {
        socket.join(userId);
    });
    //
    socket.on('call', function (contact) {
        socket.join(contact.to.email);
        ioObj.to(contact.to.email).emit('call-request', contact.from);
    });
}

module.exports = initializeSocketIO;