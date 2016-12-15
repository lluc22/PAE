var PythonShell = require('python-shell');
var Parser = require('../parse.js');
var pyshell = new PythonShell('./app/services/doc2vec/doc2vec.py',{ mode: 'json', pythonPath:'/usr/bin/python3.5'});
var fs = require('fs');
// sends a message to the Python script via stdin
var chunkSize = 10000;
var chunks = 24;
var c = 0;
var model_path = "";
var size = 239932;
var busy = false;
var firstTopN = true;
//pyshell.send({command:"build_vocab"})

// pyshell.on('message', function (message) {
//   command = mes      if(firstTopN){sage['command']
//   switch (command) {
//     case "build_vocab":
//       var posts = []
//       if(c < chunks){
//         //We simulate DB reading from chunk files
//         fs.readFile('posts/'+c+'.txt', 'utf8', function (err,data) {
//           if (err) {
//             return console.log(err)
//           }
//           console.log(c)
//           posts = JSON.parse(data)
//           c++
//           console.log("sending")
//           pyshell.send({command:"build_vocab",finished:false,posts:posts})
//         });
//       }
//       else {
//         pyshell.send({command:"build_vocab",finished:true,posts:[]})
//       }
//       break;
//
//     case "train":
//       var finished = message['finished']
//       if(!finished){
//         var posts = []
//         var chunk = message['chunk']
//         console.log(chunk)
//         fs.readFile('posts/'+chunk+'.txt', 'utf8', function (err,data) {
//           if (err) {
//             return console.log(err)
//           }
//           posts = JSON.parse(data)
//           c++
//           pyshell.send({command:"train",posts:posts})
//         });
//       }
//
//       break;
//
//     default:
//
//   }
//
// });
pyshell.on('error',function(err){console.log(err)})


module.exports = {
  train: function(givePathCallback){
    if(!busy){
      busy = true;
      pyshell.send({command:"build_vocab"});
      pyshell.on('message', function(message){
        if(message['command'] == 'train'){
            if(message['finished']){
            model_path = message['model_path'];
            givePathCallback(model_path);
            busy = false
            }
        }
      });
    }
  },
  load_model: function(path,okCallBack){
    if(!busy){
      busy = true;
      pyshell.send({command:"load_model",path:path});
      pyshell.on('message',function(message){
          if(message['command'] == 'load_model'){
              if(!message['ok']) console.log(message['err']);
              busy = false;
              console.log("model loaded");
              okCallBack()
            }
      });
    }
  },
  vectors: function(topn,fillVectorCallback){
    /*if(!busy){
      busy = true;
      pyshell.on('message',function(message){
        command = message['command'];
        if(command == "get_vectors"){
          fillVectorCallback({id:message['id'],vector:message['vector'],topn:message['topn']});
          if(message['finish']){
             busy = false;
             console.log("I finnished");
           }
        }
      });
      pyshell.send({command:"get_vectors",topn:topn});
    }*/
  },

  topn_similar: function(id,topn,fillIdCallback){
    /*if(!busy){
      busy = true
      var pyCallBack = function(message){
        command = message['command']
        if(command == "topn"){
          busy = false
          fillIdCallback(message['ids'])
          pyshell.removeListener('message',pyCallBack)
        }
      }

      pyshell.on('message',pyCallBack);
      pyshell.send({command:"topn",n:topn,id:id})
        */
    http.get({
        hostname: 'localhost',
        port: 8000,
        path: '/vectors/' + id,
        agent: false  // create a new agent just for this one request
    }, function(res) {
        // Do stuff with response
        console.log(res);
    });
  }
};

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
