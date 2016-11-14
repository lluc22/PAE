var PythonShell = require('python-shell');
var Parser = require('../parse.js')
var pyshell = new PythonShell('doc2vec.py',{ mode: 'json'});
var fs = require('fs');
// sends a message to the Python script via stdin
var chunkSize = 10000
var chunks = 1
var c = 0
var model_path = ""

//pyshell.send({command:"build_vocab"})
pyshell.on('message', function (message) {
  console.log(message)
  command = message['command']
  switch (command) {
    case "build_vocab":
      var posts = []
      if(c < chunks){
        //We simulate DB reading from chunk files
        fs.readFile('posts/'+c+'.txt', 'utf8', function (err,data) {
          if (err) {
            return console.log(err)
          }
          console.log(c)
          posts = JSON.parse(data)
          c++
          console.log("sending")
          pyshell.send({command:"build_vocab",finished:false,posts:posts})
        });
      }
      else {
        pyshell.send({command:"build_vocab",finished:true,posts:[]})
      }
      break;

    case "train":
      var finished = message['finished']
      if(!finished){
        var posts = []
        var chunk = message['chunk']
        console.log(chunk)
        fs.readFile('posts/'+chunk+'.txt', 'utf8', function (err,data) {
          if (err) {
            return console.log(err)
          }
          posts = JSON.parse(data)
          c++
          pyshell.send({command:"train",posts:posts})
        });
      }
      else{
        model_path = message['model_path']
        console.log(model_path)
        pyshell.send({command:'finish'})
      }
      break;
    case "load_model":
      if(!message['ok']) console.log(message['err'])
    default:

  }

});


module.exports = {
  train: function(){
    pyshell.send({command:"build_vocab"})
  },
  load_model: function(path){
    pyshell.send({command:"load_model",path:path})
  },
  vectors: function(id){

    pyshell.on('message',function(message){
    command = message['command']
    if(command == "get-vector"){
      return message['vector']
    }
    });
    pyshell.send({command:"get-vector",id:id})
  }
}

/*
Commands used:
  build_vocab: {command: "build_vocab", finished: TRUE/FALSE, posts:[]}
    python-shell: {dommand: "build_vocab", text:"next", finished:"True/False"}
  train: {command: "train", finished: TRUE/FALSE, posts:[]}
    python-shell: {dommand: "train", chunk:chunk_number, finished:"True/False", model_path:path}
  InferVectors: {command: "infer", finished: TRUE/FALSE}
    python-shell: {command: "infer",vectors:[]}
  load_model:{command: "load_model", path:path/to/model}
    python-shell: {command: "load_model", ok:True/False, err:"error msg"}

  finish: {command: "finish", p}
*/
