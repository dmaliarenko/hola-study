var PORT = 33334;
var HOST = '127.0.0.1';

var serverPort = 33333;
var serverHost = '127.0.0.1';

var dgram = require( "dgram" );
var client = dgram.createSocket( "udp4" );

// client listens on a port as well in order to receive ping
client.bind( PORT, HOST );

var message = "it`s my message";
var buffer = new Buffer( message );

client.send(buffer, 0, buffer.length, serverPort, serverHost, function () {
    var date = new Date();
    var timeStr = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    console.log(`client send message: ${message} at ${timeStr}`);
});

client.on('message', function (msg, remote) {
    var date = new Date();
    var timeStr = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    console.log(`client got message: ${msg} at ${timeStr} from ${remote.address}:${remote.port}`);

    var isIdentical = msg.toString('utf8') == message.toString('utf8');
    console.log('messаges identical:' + isIdentical.toString());
});
