/**
 * Created by dani on 8/11/16.
 */
var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');
}).listen(8080, '45.55.176.54');
console.log('Server running at http://45.55.176.54:8080/');