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

    if (count < 1000) {
        documentos.posts.push(data['body']);
        if (documentos.posts.length % 100 == 0) {
            console.log('doccument ' + count );
        }
        count++;
    }
};
var myCallback2 = function(data) {};
parse.parse(myCallback, myCallback2);
setTimeout(updateModel, 5000);


// update the model
function updateModel() {

    /*var docs = documentos;
    console.log('SIZEOFDOCS ' + docs.posts.length);
    var n = documentos.length;
    console.log('SIZE_OF_DOCS ' + n);

    var SIZE_CHUNKS = 100;
    var ITERS = (n / SIZE_CHUNKS) + 1;

    var chunk = 0;
    var shell = new PythonShell(PythonName, { mode: 'json', args:['update']});

    shell.send({command:'run', posts:docs.posts.slice(0, SIZE_CHUNKS)});

    shell.on('message', function (message) {
        console.log('MESSAGE = ');
        console.log(message);
        var start = chunk * SIZE_CHUNKS;
        var end = start + SIZE_CHUNKS;
        if (end > docs.posts.length)
            end = docs.posts.length;
        if (chunk < ITERS) {
            shell.send({command:'run', posts:docs.posts.slice(start, end)});
        }
        chunk++;

    });



    console.log('end');*/

}

function deleteModel() {

    var arguments = ['getTopics'];

    PythonShell.run(PythonName, {args: arguments}, function (err, results) {
        if (err) throw err;
        // results is an array consisting of messages collected during execution
        console.log('results: %j', results);
    });

}
