/**
 * Created by Home on 19/11/2016.
 */
'use strict';

angular.module('myApp')
    .controller('topicsController', ['MY_CONSTANTS', '$scope', 'ngDialog', '$window', 'getTopics', function (MY_CONSTANTS, $scope,
                                                                                                ngDialog, $window, getTopics) {
            getTopics.getTopics();
            getTopics.lastMonthTopics();
            getTopics.getLegend();

            var i = 0;

            $scope.legend = getTopics.legend;
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
                    showAxis: true,
                    callback: function(chart) {
                        chart.discretebar.dispatch.on('elementClick', function(e){
                            console.log('elementClick in callback', e.data);
                            for (var x in $scope.legend) {
                                if ($scope.legend[x].id == e.data.label) {
                                    $scope.name = {name : $scope.legend[x].name,
                                                   id : $scope.legend[x].id };
                                }
                            }
                            var customCallback = function () {
                                ngDialog.open({
                                    templateUrl: 'word_cloud.html',
                                    controller : 'topicsController',
                                    scope: $scope,
                                    width : $window.innerWidth - 125,
                                    height : $window.innerHeight
                                });
                            };
                            getTopics.getTopicWords(e.data.label, customCallback);
                        });
                    }

                }
            };


            $scope.changeName = function () {
                //console.log(document.getElementById("newName").value);
                //console.log($scope.name.id);
                var data = {
                    name : document.getElementById("newName").value,
                    id : $scope.name.id
                };
                getTopics.changeName(data);
                $scope.closeThisDialog();
                $scope.legend = getTopics.legend;
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
                    labelType: "percent",
                    showLegend: false,
                    duration: 500,
                    labelThreshold: 0.01,
                    labelSunbeamLayout: true,
                    valueFormat: function(d) {
                        return d + " tickets ";
                    },
                    callback: function(chart) {
                        chart.pie.dispatch.on('elementClick', function(e){
                            console.log('elementClick in callback', e.data);
                            for (var x in $scope.legend) {
                                if ($scope.legend[x].id == e.data.key) {
                                    $scope.name = {name : $scope.legend[x].name,
                                        id : $scope.legend[x].id };
                                }
                            }
                            var customCallback = function () {
                                ngDialog.open({
                                    templateUrl: 'word_cloud.html',
                                    controller : 'topicsController',
                                    scope: $scope,
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



