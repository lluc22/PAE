/**
 * Created by Home on 19/11/2016.
 */
'use strict';

angular.module('myApp')
    .controller('topicsController', ['MY_CONSTANTS', '$scope', function (MY_CONSTANTS, $scope) {
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
                    showAxis: true
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
        }]);

