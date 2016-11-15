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

    documentos.posts.push(data['body']);
    count++;

    if (documentos.posts.length % 1000 == 0) {
        console.log('doccument ' + count );
    }

};
var myCallback2 = function(data) {};
//parse.parse(myCallback, myCallback2);
//setTimeout(updateModel, 35000);
getTopics();
//deleteModel();

// update the model
function updateModel() {

    var docs = documentos;
    var n = docs.posts.length;
    console.log('SIZE_OF_DOCS ' + n);

    var SIZE_CHUNKS = 10000;
    var ITERS = (n / SIZE_CHUNKS) + 1;

    var chunk = 0;
    var shell = new PythonShell(PythonName, { mode: 'json', args:['create']});

    shell.send({op:'run', posts:docs.posts.slice(0, SIZE_CHUNKS)});

    var complete = false;

    shell.on('message', function (message) {
        console.log('MESSAGE = ');
        console.log(message);
        if (! complete) {
            var start = chunk * SIZE_CHUNKS;
            var end = start + SIZE_CHUNKS;
            if (end > docs.posts.length)
                end = docs.posts.length;
            if (chunk < ITERS) {
                shell.send({op:'run', posts:docs.posts.slice(start, end)});
            } else {
                shell.send({op:'finish'});
                complete = true;
            }
            chunk++;
        }
    });
}

function getTopics() {
    PythonShell.run(PythonName, { mode: 'json', args:['getTopics']} ,  function (err, results) {
        if (err) throw err;
        // results is an array consisting of messages collected during execution
        console.log(results);
    });
}

function deleteModel() {
    PythonShell.run(PythonName, {  args:['delete']} ,  function (err, results) {
        if (err) throw err;
        // results is an array consisting of messages collected during execution
        console.log(results);
    });
}
