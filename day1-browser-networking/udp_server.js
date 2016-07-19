var PORT = 33333;
var HOST = '127.0.0.1';

const dgram = require('dgram');
const server = dgram.createSocket('udp4');

server.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    server.close();
});

server.on('listening', () => {
    var address = server.address();
    console.log(`server listening ${address.address}:${address.port}`);
});

server.on('message', (msg, rinfo) => {
    var date = new Date();
    var timeStr = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    console.log(`server got message: ${msg} at ${timeStr} from ${rinfo.address}:${rinfo.port}`);

    server.send(msg, 0, msg.length, rinfo.port, rinfo.address);
});

server.bind(PORT, HOST);
