var express = require('express');
var app = express();

app.use(express.static(__dirname));

app.get('*', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.listen(8080, function() {
    console.log('Listening on port 8080');
});