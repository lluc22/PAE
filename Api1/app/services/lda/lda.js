/**
 * Created by julian on 17/11/16.
 */
var PythonShell = require('python-shell');
var PythonName = './app/services/lda/extractTopics.py';

var APICallback;

var shell = new PythonShell(PythonName, { mode: 'json'});

function onShellMessage (message) {
    //console.log('MESSAGE = ');
    //console.log(message);
    if (message['message'] == 'finish') {
        mState = ldaState.IDLE;
        shell.removeListener("message", onShellMessage);
    } else {
        APICallback(message);
    }
};

var ldaState = {
    CREATE: 1,
    DELETE: 2,
    GET_TOPICS: 3,
    TOPICS_OF: 4,
    IDLE: 5
};

var mState = ldaState.IDLE;

// Data Format
// { op:'finish' | 'run' ,
//      posts: ['body1', 'body2', ...]
module.exports = {
    createModel: function (data, callBack) {
        APICallback = callBack;
        switch (mState) {
            case ldaState.IDLE:
                mState = ldaState.CREATE;
                shell.send({command:"create"});
            case ldaState.CREATE:
                shell.send(data);
                break;
            default:
                APICallback({status:1 , message:"Busy"});
        }
    } ,

    deleteModel: function (callBack) {
        APICallback = callBack;
        switch (mState) {
            case ldaState.IDLE:
                mState = ldaState.DELETE;
                shell.on('message', onShellMessage);
                shell.send({command:"delete"});
                break;
            default:
                APICallback({status:1 , message:"Busy"});
        }
    } ,

    getTopicsModel: function (callBack) {
        APICallback = callBack;
        switch (mState) {
            case ldaState.IDLE:
                mState = ldaState.GET_TOPICS;
                shell.on('message', onShellMessage);
                shell.send({command:"getTopics"});
                break;
            default:
                APICallback({status:1 , message:"Busy"});
        }
    } ,

    topicsOfDocs: function (data, callBack) {
        APICallback = callBack;
        switch (mState) {
            case ldaState.IDLE:
                mState = ldaState.TOPICS_OF;
                shell.on('message', onShellMessage);
                shell.send({command:"topicsOf"});
            case ldaState.TOPICS_OF:
                shell.send(data);
                break;
            default:
                APICallback({status:1 , message:"Busy"});
        }
    }
}