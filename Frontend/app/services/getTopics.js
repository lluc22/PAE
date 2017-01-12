/**
 * Created by sinnombre on 21/12/16.
 */

angular.module('myApp')
    .service('getTopics', ['restService', 'MY_CONSTANTS' , function (restService, MY_CONSTANTS) {
        var topics = {};
        topics.topicsContent = [];
        topics.words = [];
        topics.barCharContent = [];
        topics.legend = [];
        topics.getTopics = function () {
            var params = {params: {

            } };
            return restService.get('/tickets/topics/count', params).then(function (data) {
                //console.log(data);
                var correctData = [];
                var max = 0;
                for(x in data) {
                    max += data[x].count;
                    //console.log(data[x])
                    correctData.push({key: data[x]._id , y: data[x].count ,color: MY_CONSTANTS.colores[data[x]._id]});
                    //if (x!= 9) correctData.push(",")
                }
                angular.copy(correctData, topics.topicsContent);
            });
        };
        topics.getTopicWords = function (id, customCallback) {
            var params = {params: {

            } };
            return restService.get('/tickets/topics/' + id, params).then(function (data) {
                console.log(data);
                var correctData = [];

                for(x in data[0].palabras) {
                    console.log(data[0].palabras[x]);
                    var palabra = data[0].palabras[x];
                    correctData.push({"key":  palabra.word , "value": Math.round(palabra.value*100)*2.5});
                    //if (x!= 9) correctData.push(",")
                }
                //console.log(topics.words[id]);
                angular.copy(correctData, topics.words);
                customCallback();

            });
        };
        topics.lastMonthTopics = function () {
            var params = {params: {

            } };
            return restService.get('/tickets/topics/count/lastmonth', params).then(function (data) {
                var correctData = [{ key: "Cumulative Return", values: []}];
                for(x in data) {
                    //console.log(data[x]);
                    correctData[0].values.push({label: data[x]._id , value: data[x].count ,color: MY_CONSTANTS.colores[data[x]._id]});
                    //if (x!= 9) correctData.push(",")
                }
                //console.log(correctData);
                angular.copy(correctData, topics.barCharContent);

            });

        };
        topics.getLegend = function (legendCallback) {
            var params = {params: {

            } };
            return restService.get('/tickets/topics/legend', params).then(function (data) {
                //console.log(data);
                var correctData = [];
                for(x in data) {
                    //console.log(data[x]);
                    correctData.push({id: data[x].number , name: data[x].name ,color: MY_CONSTANTS.colores[data[x].number]});
                    //if (x!= 9) correctData.push(",")
                }
                //console.log(correctData);
                angular.copy(correctData, topics.legend);
                legendCallback();
            });
        };
        return topics;
    }]);