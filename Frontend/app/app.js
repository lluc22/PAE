'use strict';

// create the module and name it scotchApp
angular
    .module('myApp', ['ngRoute', 'nvd3'])
    .config(config);

function config($routeProvider) {
    //['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {

        $routeProvider
            .when('/', {
                templateUrl : 'views/topics.html',
                controller  : 'topicsController'
            })
            .when('/opentickets', {
                templateUrl : "views/home.html",
                controller  : 'openTicketsController'
            })
            .when('/filter', {
                templateUrl : 'views/filter.html',
                controller  : 'filterController'
            })
            .when('/ticket/:id' , {
                templateUrl : "views/ticket.html",
                controller  : 'ticketController'
            });

};

