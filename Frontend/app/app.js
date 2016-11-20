'use strict';

// create the module and name it scotchApp
angular
    .module('myApp', ['ui.router', 'nvd3'])
    .config(config);

function config($stateProvider, $urlRouterProvider) {
    //['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider
        .state('home' , {
            url : '/home',
            templateUrl : 'views/home.html'
        })
        .state('topics', {
            url : '/dashboard',
            templateUrl : 'views/topics.html',
            controller  : 'topicsController'
        })
        .state('openTickets', {
            url : '/openTickets?page',
            templateUrl : "views/openTickets.html",
            controller  : 'openTicketsController'
        })
        .state('filter', {
            url : '/filter',
            templateUrl : 'views/filter.html',
            controller  : 'filterController'
        })
        .state('ticket', {
            url : '/ticket/:id',
            templateUrl : "views/ticket.html",
            controller  : 'ticketController'
        });

    /*
        $routeProvider
            .when('/', {
                templateUrl : 'views/topics.html',
                controller  : 'topicsController'
            })
            .when('/opentickets', {
                templateUrl : "views/openTickets.html",
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
    */
};

