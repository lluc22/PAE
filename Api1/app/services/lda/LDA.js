/**
 * Created by julian on 7/11/16.
 */
var PythonShell = require('python-shell');

var PythonName = 'extractTopics.py';


var parse = require('./parse');

var myCallback2 = function(data) {};


var documentos = { posts: []};
var count = 0;

var myCallback = function(data) {

    if (count < 10000) {
        documentos.posts.push(data['body']);
        if (documentos.posts.length % 1000 == 0) {
            console.log('doccument ' + count );
        }
        count++;
    }
};
var myCallback2 = function(data) {};
parse.parse(myCallback, myCallback2);
setTimeout(updateModel, 5000);


// update the model
function updateModel(docs) {

    var docs = documentos;
    console.log('SIZEOFDOCS ' + docs.posts.length);

    var shell = new PythonShell(PythonName, { mode: 'json', args:['update']});
    shell.send(docs);

    shell.on('message', function (message) {
        // received a message sent from the Python script (a simple "print" statement)
        console.log(message);
    });

    shell.end(function (err) {
        if (err) throw err;
        console.log('finished Python');
    });

    console.log('end');

}

function deleteModel() {

    var arguments = ['getTopics'];

    PythonShell.run(PythonName, {args: arguments}, function (err, results) {
        if (err) throw err;
        // results is an array consisting of messages collected during execution
        console.log('results: %j', results);
    });

}
