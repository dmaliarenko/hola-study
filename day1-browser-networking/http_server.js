var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');

var hostname = 'localhost';
var port = 3000;

var app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());


app.post('/messager', function(req, res, next){
//     res.end(req.body.message);
    var res_msg = req.body.message;
    console.log('res_msg: ' + res_msg);

    res.end(res_msg);
});

app.use(express.static(__dirname + '/public'));

app.listen(port, hostname, function(){
    console.log('Server running at http://${hostname}:${port}/');
});
