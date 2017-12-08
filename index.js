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
// add static folder
app.use(express.static(path.join(__dirname, './')));
// server index.html always
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})
// webRTC can't work over http so we need to set up a (insecure) https server
var https = require('https').createServer(https_options, app);
//
https.listen(3000, function (res) {
    console.log('https server listening on port 3000');
});
