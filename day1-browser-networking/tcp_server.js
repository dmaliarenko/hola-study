var net = require('net');

var HOST = '127.0.0.1';
var PORT = 6969;

var server = net.createServer().listen(PORT, HOST);

server.on('connection', handleConnection);

function handleConnection(conn) {
  var remoteAddress = conn.remoteAddress + ':' + conn.remotePort;
  console.log('new client connection from %s', remoteAddress);

  conn.on('data', onConnData);
  conn.once('close', onConnClose);
  conn.on('error', onConnError);


  function onConnData(msg) {
      var date = new Date();
      var timeStr = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

      console.log(`server got message: ${msg} at ${timeStr} from ${conn.remoteAddress}:${conn.remotePort}`);

      //return
      conn.write(msg);
  }

  function onConnClose() {
    console.log('connection from %s closed', remoteAddress);
  }

  function onConnError(err) {
    console.log('Connection %s error: %s', remoteAddress, err.message);
  }
}
