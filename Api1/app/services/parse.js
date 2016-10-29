xml2js = require('xml2js');
fs = require('fs');

var parser = new xml2js.Parser();
fs.readFile( './Comments.xml', function(err, data) {
    parser.parseString(data, function (err, result) {
        for (var i = 0, len = result["comments"]["row"].length; i < len; i++) {
            console.dir("Comment id: " + i);
            console.dir(result["comments"]["row"][i]);
        }
    });
});