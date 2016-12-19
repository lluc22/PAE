/**
 * Created by Home on 19/11/2016.
 */
'use strict';

angular.module('myApp')
    .controller('topicsController', ['MY_CONSTANTS', '$scope', 'ngDialog', '$window', function (MY_CONSTANTS, $scope,
                                                                                                ngDialog, $window) {
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
                                templateUrl: 'views/word_cloud.html',
                                controller : 'topicsController',
                                width : $window.innerWidth - 125,
                                height : $window.innerHeight
                            });
                        });
                    }

                }
            };

            $scope.data = [{
                key: "Cumulative Return",
                values: [
                    { "label" : "Python" , "value" : 29, "color" : MY_CONSTANTS.colores[0] },
                    { "label" : "Smalltalk" , "value" : 0, "color" : MY_CONSTANTS.colores[1] },
                    { "label" : "C++" , "value" : 32, "color" : MY_CONSTANTS.colores[2] },
                    { "label" : "nvd3" , "value" : 58, "color" : MY_CONSTANTS.colores[3] },
                    { "label" : "AngularJs" , "value" : 85, "color" : MY_CONSTANTS.colores[4] },
                    { "label" : "Java" , "value" : 98, "color" : MY_CONSTANTS.colores[5] },
                    { "label" : "PHP" , "value" : 13, "color" : MY_CONSTANTS.colores[6] },
                    { "label" : "Ruby" , "value" : 5, "color" : MY_CONSTANTS.colores[7] },
                    { "label" : "Perl", "value" : 12, "color" : MY_CONSTANTS.colores[8]},
                    { "label" : "HTML", "value" : 42, "color" : MY_CONSTANTS.colores[9]}
                ]
            }];

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
                    }
                }
            };

            $scope.data2 = [
                { key : "Python" , y : 29, "color" : MY_CONSTANTS.colores[0]},
                { key : "Smalltalk" , y : 0, "color" : MY_CONSTANTS.colores[1] },
                { key : "C++" , y : 32, "color" : MY_CONSTANTS.colores[2] },
                { key : "nvd3" , y : 58, "color" : MY_CONSTANTS.colores[3] },
                { key : "AngularJs" , y : 85, "color" : MY_CONSTANTS.colores[4] },
                { key : "Java" , y : 98, "color" : MY_CONSTANTS.colores[5] },
                { key : "PHP" , y : 13, "color" : MY_CONSTANTS.colores[6] },
                { key : "Ruby" , y : 5, "color" : MY_CONSTANTS.colores[7] },
                { key : "Perl", y : 20, "color" : MY_CONSTANTS.colores[8]},
                { key : "HTML", y : 102, "color" : MY_CONSTANTS.colores[9]}
            ];

        $scope.tags = [
            {"key": "Cat", "value": 26},
            {"key": "fish", "value": 19},
            {"key": "things", "value": 18},
            {"key": "look", "value": 16},
            {"key": "two", "value": 15},
            {"key": "like", "value": 14},
            {"key": "hat", "value": 14},
            {"key": "Oh", "value": 13},
            {"key": "mother", "value": 12},
            {"key": "One", "value": 12},
            {"key": "Now", "value": 12},
            {"key": "Thing", "value": 12},
            {"key": "house", "value": 10},
            {"key": "fun", "value": 9},
            {"key": "know", "value": 9},
            {"key": "good", "value": 9},
            {"key": "saw", "value": 9},
            {"key": "bump", "value": 8},
            {"key": "hold", "value": 7},
            {"key": "fear", "value": 6},
            {"key": "game", "value": 6},
            {"key": "play", "value": 6},
            {"key": "Sally", "value": 6},
            {"key": "wet", "value": 6},
            {"key": "little", "value": 6},
            {"key": "box", "value": 6},
            {"key": "came", "value": 6},
            {"key": "away", "value": 6},
            {"key": "sit", "value": 5},
            {"key": "ran", "value": 5},
            {"key": "big", "value": 5},
            {"key": "something", "value": 5},
            {"key": "put", "value": 5},
            {"key": "fast", "value": 5},
            {"key": "go", "value": 5},
            {"key": "ball", "value": 5},
            {"key": "pot", "value": 5},
            {"key": "show", "value": 4},
            {"key": "cup", "value": 4},
            {"key": "get", "value": 4},
            {"key": "cake", "value": 4},
            {"key": "pick", "value": 4},
            {"key": "went", "value": 4},
            {"key": "toy", "value": 4},
            {"key": "ship", "value": 4},
            {"key": "net", "value": 4},
            {"key": "tell", "value": 4},
            {"key": "fan", "value": 4},
            {"key": "wish", "value": 4},
            {"key": "day", "value": 4},
            {"key": "new", "value": 4},
            {"key": "tricks", "value": 4},
            {"key": "way", "value": 4},
            {"key": "sat", "value": 4},
            {"key": "books", "value": 3},
            {"key": "hook", "value": 3},
            {"key": "mess", "value": 3},
            {"key": "kites", "value": 3},
            {"key": "rake", "value": 3},
            {"key": "red", "value": 3},
            {"key": "shame", "value": 3},
            {"key": "bit", "value": 3},
            {"key": "hands", "value": 3},
            {"key": "gown", "value": 3},
            {"key": "call", "value": 3},
            {"key": "cold", "value": 3},
            {"key": "fall", "value": 3},
            {"key": "milk", "value": 3},
            {"key": "shook", "value": 3},
            {"key": "tame", "value": 2},
            {"key": "deep", "value": 2},
            {"key": "Sank", "value": 2},
            {"key": "head", "value": 2},
            {"key": "back", "value": 2},
            {"key": "fell", "value": 2},
            {"key": "hop", "value": 2},
            {"key": "shut", "value": 2},
            {"key": "dish", "value": 2},
            {"key": "trick", "value": 2},
            {"key": "take", "value": 2},
            {"key": "tip", "value": 2},
            {"key": "top", "value": 2},
            {"key": "see", "value": 2},
            {"key": "let", "value": 2},
            {"key": "shake", "value": 2},
            {"key": "bad", "value": 2},
            {"key": "another", "value": 2},
            {"key": "come", "value": 2},
            {"key": "fly", "value": 2},
            {"key": "want", "value": 2},
            {"key": "hall", "value": 2},
            {"key": "wall", "value": 2},
            {"key": "Thump", "value": 2},
            {"key": "Make", "value": 2},
            {"key": "lot", "value": 2},
            {"key": "hear", "value": 2},
            {"key": "find", "value": 2},
            {"key": "lots", "value": 2},
            {"key": "bet", "value": 2},
            {"key": "dear", "value": 2},
            {"key": "looked", "value": 2},
            {"key": "gone", "value": 2},
            {"key": "sun", "value": 2},
            {"key": "asked", "value": 1},
            {"key": "shine", "value": 1},
            {"key": "mind", "value": 1},
            {"key": "bite", "value": 1},
            {"key": "step", "value": 1},
            {"key": "mat", "value": 1},
            {"key": "gave", "value": 1},
            {"key": "pat", "value": 1},
            {"key": "bent", "value": 1},
            {"key": "funny", "value": 1},
            {"key": "give", "value": 1},
            {"key": "games", "value": 1},
            {"key": "high", "value": 1},
            {"key": "hit", "value": 1},
            {"key": "run", "value": 1},
            {"key": "stand", "value": 1},
            {"key": "fox", "value": 1},
            {"key": "man", "value": 1},
            {"key": "string", "value": 1},
            {"key": "kit", "value": 1},
            {"key": "Mothers", "value": 1},
            {"key": "tail", "value": 1},
            {"key": "dots", "value": 1},
            {"key": "pink", "value": 1},
            {"key": "white", "value": 1},
            {"key": "kite", "value": 1},
            {"key": "bed", "value": 1},
            {"key": "bumps", "value": 1},
            {"key": "jumps", "value": 1},
            {"key": "kicks", "value": 1},
            {"key": "hops", "value": 1},
            {"key": "thumps", "value": 1},
            {"key": "kinds", "value": 1},
            {"key": "book", "value": 1},
            {"key": "home", "value": 1},
            {"key": "wood", "value": 1},
            {"key": "hand", "value": 1},
            {"key": "near", "value": 1},
            {"key": "Think", "value": 1},
            {"key": "rid", "value": 1},
            {"key": "made", "value": 1},
            {"key": "jump", "value": 1},
            {"key": "yet", "value": 1},
            {"key": "PLOP", "value": 1},
            {"key": "last", "value": 1},
            {"key": "stop", "value": 1},
            {"key": "pack", "value": 1},
            {"key": "nothing", "value": 1},
            {"key": "got", "value": 1},
            {"key": "sad", "value": 1},
            {"key": "kind", "value": 1},
            {"key": "fishHe", "value": 1},
            {"key": "sunny", "value": 1},
            {"key": "Yes", "value": 1},
            {"key": "bow", "value": 1},
            {"key": "tall", "value": 1},
            {"key": "always", "value": 1},
            {"key": "playthings", "value": 1},
            {"key": "picked", "value": 1},
            {"key": "strings", "value": 1},
            {"key": "Well", "value": 1},
            {"key": "lit", "value": 1}
        ];
        }]);



