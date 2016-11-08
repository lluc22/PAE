/**
 * Created by dani on 8/11/16.
 */
var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');
}).listen(8080, '84.88.81.126');
console.log('Server running at http://84.88.81.126:8080/');