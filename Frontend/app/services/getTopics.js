/**
 * Created by sinnombre on 21/12/16.
 */

angular.module('myApp')
    .service('getTopics', ['restService', 'MY_CONSTANTS' , function (restService, MY_CONSTANTS) {
        var topics = {};
        topics.topicsContent = [];
        topics.words = [];
        topics.getTopics = function () {
            var params = {params: {

            } };
            return restService.get('/tickets/topics/count', params).then(function (data) {
                //console.log(data);
                var correctData = [];
                for(x in data) {
                    //console.log(data[x])
                    correctData.push({key: data[x]._id , y: data[x].count ,color: MY_CONSTANTS.colores[data[x]._id]});
                    //if (x!= 9) correctData.push(",")
                }
                //console.log(correctData);
                angular.copy(correctData, topics.topicsContent);
            });
        };
        topics.getTopicWords = function (id) {
            var params = {params: {

            } };
            return restService.get('/tickets/topics/' + id, params).then(function (data) {
                //console.log(data[0]);
                var correctData = [];

                for(x in data[0].palabras) {
                    //console.log(data[0].palabras[x]);
                    var palabra = data[0].palabras[x];
                    correctData.push({"key":  palabra.word , "value": Math.round(palabra.value*100)});
                    //if (x!= 9) correctData.push(",")
                }
                //console.log(correctData);
                angular.copy(correctData, topics.words);

            });
        };
        return topics;
    }]);