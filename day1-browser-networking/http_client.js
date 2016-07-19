var querystring = require('querystring');
var http = require('http');

var message = "it`s my message";

var data = JSON.stringify({
      message: message,
    });

var options = {
    host: 'localhost',
    port: 3000,
    path: '/messager',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
    }
};

var req = http.request(options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (data) {
        var date = new Date();
        var timeStr = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

        console.log(`client got message: ${data} at ${timeStr}`);

        var isIdentical = data.toString('utf8') == message.toString('utf8');
        console.log('messаges identical:' + isIdentical.toString());
    });
});

req.write(data);
req.end();
