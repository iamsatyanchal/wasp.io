var express = require('express');
var app = express();
var fs = require('fs');

var key = fs.readFileSync('keys/socketio-key.pem');
var cert = fs.readFileSync('keys/socketio-cert.pem');
var https_options = {
    key: key,
    cert: cert
};
// add static folder
app.use(express.static(__dirname + '/public'));

app.get('/', function ( req, res) {
    res.send('<h1> Welcome to the future! </h1>');
});
// webRTC can't work over http so we need to set up a (insecure) https server
var https = require('https').createServer(https_options, app);
//
https.listen(3000, function (res) {
    console.log('https server listening on port 3000');
});
