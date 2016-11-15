var PythonShell = require('python-shell');
var Parser = require('../parse.js')
var pyshell = new PythonShell('./app/services/doc2vec/doc2vec.py',{ mode: 'json', pythonPath:'/usr/local/bin/python3'});
var fs = require('fs');
// sends a message to the Python script via stdin
var chunkSize = 10000
var chunks = 24
var c = 0
var model_path = ""
var size = 239932
var busy = false
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

      break;

    default:

  }

});


module.exports = {
  train: function(givePathCallback){
    if(!busy){
      busy = true
      pyshell.send({command:"build_vocab"})
      pyshell.on('message', function(message){
        if(message['command'] == 'train'){
            if(message['finished']){
            model_path = message['model_path']
            givePathCallback(model_path)
            busy = false
            }
        }
      });
    }
  },
  load_model: function(path,okCallBack){
    if(!busy){
      busy = true
      pyshell.send({command:"load_model",path:path})
      pyshell.on('message',function(message){
          if(message['command'] == 'load_model'){
              if(!message['ok']) console.log(message['err'])
              busy = false
              console.log("model loaded")
              okCallBack()
            }
      });
    }
  },
  vectors: function(fillVectorCallback){
    if(!busy){
      busy = true
      pyshell.on('message',function(message){
        command = message['command']
        if(command == "get_vector"){
          fillVectorCallback({id:message['id'],vector:message['vector']})
          if(message['finish']) busy = false
        }
      });
      for(i = 0; i < size; i++) pyshell.send({command:"get_vector",id:i});
    }
  },

  topn_similar: function(id,topn,fillIdCallback){
    if(!busy){
      busy = true
      pyshell.on('message',function(message){
        command = message['command']
        if(command == "topn"){
          console.log("doc2vec.Resp" + message['ids']);
          fillIdCallback(message['ids'])
        }
      });
      pyshell.send({command:"topn",n:topn,id:id})
    }
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
