'use strict';

// create the module and name it scotchApp
angular
    .module('myApp', ['ui.router', 'nvd3', 'ngMaterial'])
    .constant('MY_CONSTANTS', {
        "SERVER_IP" : "http://84.88.81.126:8080/api",
        "LOCALHOST_IP" : 'http://localhost:8080/api',
        "colores" : ['#62A0CA', '#AEC7E8' , '#FF7F0E', '#FFBB78', '#2CA02C', '#A5E398', '#D62728', '#FF9896', '#9467BD', '#C5B0D5']
    })
    .config(config);

function config($stateProvider, $urlRouterProvider) {
    //['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {

    // HAY QUE INSTALAR BOWER COMPONENTS UI-ROUTER
    $urlRouterProvider.otherwise('/home');

    $stateProvider
        .state('home' , {
            url : '/home',
            templateUrl : 'views/home.html'
        })
        .state('dashboard', {
            url : '/dashboard',
            templateUrl : 'views/topics.html',
            controller  : 'topicsController'
        })
        .state('openTickets', {
            url : '/openTickets?page',
            templateUrl : "views/openTickets.html",
            controller  : 'openTicketsController'
        })
        .state('closedTickets', {
            url : '/closedTickets?page',
            templateUrl : "views/closedTickets.html",
            controller  : 'closedTicketsController'
        })
        .state('topics', {
            url : '/topics',
            templateUrl : 'views/filter.html',
            controller  : 'filterController'
        })
        .state('ticket', {
            url : '/ticket/:id',
            templateUrl : "views/ticket.html",
            controller  : 'ticketController'
        });

};

