/**
 * Created by Home on 19/11/2016.
 */
'use strict';

angular.module('myApp')
    .controller('topicsController', ['MY_CONSTANTS', '$scope', 'ngDialog', '$window', 'getTopics', function (MY_CONSTANTS, $scope,
                                                                                                ngDialog, $window, getTopics) {
            getTopics.getTopics();
            getTopics.lastMonthTopics();

            var i = 0;

            var topicID = null;
            $scope .options = {
                chart: {
                    type: 'discreteBarChart',
                    height: 450,
                    margin : {
                        top: 100,
                        right: 0,
                        bottom: 50,
                        left: 0
                    },
                    x: function(d){return d.label;},
                    y: function(d){return d.value;},
                    showValues: true,
                    valueFormat: function(d){
                        return d3.format(',')(d); //'.4f' 4 decimales
                    },
                    duration: 500,
                    xAxis: {
                        axisLabel: 'Topic'
                    },
                    yAxis: {
                        axisLabel: 'Quantity',
                        axisLabelDistance: -10
                    },
                    showAxis: true,
                    callback: function(chart) {
                        chart.discretebar.dispatch.on('elementClick', function(e){
                            console.log('elementClick in callback', e.data);
                            topicID = e.data.label;
                            ngDialog.open({
                                templateUrl: 'word_cloud.html',
                                controller : 'topicsController',
                                width : $window.innerWidth - 125,
                                height : $window.innerHeight
                            });
                        });
                    }

                }
            };


            $scope.data = getTopics.barCharContent;



            $scope.options2 = {
                chart: {
                    type: 'pieChart',
                    height: 450,
                    margin: {
                        top: 100,
                        right: 0,
                        bottom: 50,
                        left: 0
                    },
                    x: function(d){return d.key;},
                    y: function(d){return d.y;},
                    showLabels: true,
                    duration: 500,
                    labelThreshold: 0.01,
                    labelSunbeamLayout: true,
                    legend: {
                        margin: {
                            top: 5,
                            right: 0,
                            bottom: 5,
                            left: 0
                        }
                    },
                    legendPosition: 'top',
                    valueFormat: function(d) {
                        return d + " words";
                    },
                    callback: function(chart) {
                        chart.pie.dispatch.on('elementClick', function(e){
                            console.log('elementClick in callback', e.data);
                            var customCallback = function () {
                                ngDialog.open({
                                    templateUrl: 'word_cloud.html',
                                    controller : 'topicsController',
                                    width : $window.innerWidth - 125,
                                    height : $window.innerHeight
                                });
                            };
                            getTopics.getTopicWords(e.data.key, customCallback);

                        });
                    }
                }
            };


            //console.log(getTopics.topicsContent);
            $scope.data2 = getTopics.topicsContent;

           //console.log(getTopics.words);
           $scope.tags = getTopics.words;

        }]);



