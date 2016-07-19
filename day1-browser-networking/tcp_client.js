var net = require('net');

var HOST = '127.0.0.1';
var PORT = 6969;

var client = new net.Socket();

var message = "it`s my message";

client.connect(PORT, HOST, function() {
    console.log('connected to: ' + HOST + ':' + PORT);
    client.write(message);

    var date = new Date();
    var timeStr = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    console.log(`client send message: ${message} at ${timeStr}`);

});

// data is what the server sent to this socket
client.on('data', function(data) {
    var date = new Date();
    var timeStr = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    console.log(`client got message: ${data} at ${timeStr} from ${HOST}:${PORT}`);

    var isIdentical = data.toString('utf8') == message.toString('utf8');
    console.log('messаges identical:' + isIdentical.toString());
    
    // Close the client socket completely
    client.destroy();

});

// Add a 'close' event handler for the client socket
client.on('close', function() {
    console.log('Connection closed');
});
