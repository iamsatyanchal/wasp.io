var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var key = fs.readFileSync('keys/socketio-key.pem');
var cert = fs.readFileSync('keys/socketio-cert.pem');
var https_options = {
    key: key,
    cert: cert
};
// webRTC can't work over http so we need to set up a (insecure) https server
var https = require('https').createServer(https_options, app);
var io = require('socket.io')(https);
var ioinit = require('./socketio/index');
// add static folder
app.use(express.static(path.join(__dirname, './')));
// server index.html always
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
});

io.of('/wasp.io.audio').on('connection', function (socket) {
    socket.on('open-call-channel', function (userId) {
        socket.join(userId);
    });
    //
    socket.on('call', function (contact) {
        socket.to(contact.to.email).emit('call-request', contact.from);
    });
    //
    socket.on('accept-call', function (opts) {
        socket.to(opts.email).emit('call-accepted', opts.userId);
    });
    //
    socket.on('end-call', function (opts) {
        socket.to(opts.email).emit('call-ended', opts.userId);
    });
    //
    socket.on('send-audio-stream', function (opts) {
        socket.to(opts.email).emit('audio-message', opts.data);
    });
});
https.listen(3000, function (res) {
    console.log('https server listening on port 3000');
});
