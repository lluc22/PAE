/**
 * Created by Home on 19/11/2016.
 */
'use strict';

angular.module('myApp')
    .controller('topicsController', topicsController);

function topicsController($scope) {
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
            { "label" : "Python" , "value" : 29 },
            { "label" : "Smalltalk" , "value" : 0 },
            { "label" : "C++" , "value" : 32 },
            { "label" : "nvd3" , "value" : 58 },
            { "label" : "AngularJs" , "value" : 85 },
            { "label" : "Java" , "value" : 98 },
            { "label" : "PHP" , "value" : 13 },
            { "label" : "Ruby" , "value" : 5 }
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
        { key : "Python" , y : 29 },
        { key : "Smalltalk" , y : 0 },
        { key : "C++" , y : 32 },
        { key : "nvd3" , y : 58 },
        { key : "AngularJs" , y : 85 },
        { key : "Java" , y : 98 },
        { key : "PHP" , y : 13 },
        { key : "Ruby" , y : 5 }
    ];
}
