/**
 * Created by julian on 7/11/16.
 */
var PythonShell = require('python-shell');
var PythonName = 'extractTopics.py';
deleteModel();
// update the model
function updateModel() {
    var documentsTest = ["Human machine interface for lab abc computer applications",
        "A survey of user opinion of computer system response time",
        "The EPS user interface management system",
        "System and human system engineering testing of EPS",
        "Relation of user perceived response time to error measurement",
        "The generation of random binary unordered trees",
        "The intersection graph of paths in trees",
        "Graph minors IV Widths of trees and well quasi ordering",
        "Graph minors A survey"]

    var arguments = ['update'];
    arguments.push(documentsTest);

    PythonShell.run(PythonName, {args: arguments}, function (err, results) {
        if (err) throw err;
        // results is an array consisting of messages collected during execution
        console.log('results: %j', results);
    });

}

function deleteModel() {

    var arguments = ['getTopics'];

    PythonShell.run(PythonName, {args: arguments}, function (err, results) {
        if (err) throw err;
        // results is an array consisting of messages collected during execution
        console.log('results: %j', results);
    });

}










