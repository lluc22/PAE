
// create the module and name it scotchApp
var app = angular.module('myApp', ['ngRoute']);

// configure our routes
app.config(function($routeProvider) {
    $routeProvider

    // route for the home page
        .when('/', {
            templateUrl : 'views/home.html',
            controller  : 'mainController'
        })
        // route for the about page
        .when('/filter', {
            templateUrl : 'views/filter.html',
            controller  : 'filterController'

        })

        // route for the contact page
        .when('/topics', {
            templateUrl : 'views/topics.html',
            controller  : 'TopicsController'
        });
  // $routeProvider.otherwise({redirectTo: '/view1'});
});



// create the controller and inject Angular's $scope
app.controller('mainController', function($scope) {
    // create a message to display in our view
    $scope.message = 'Lists of opened tickets';

    $scope.tickets = ["Ticket1", "Ticket2", "Ticket3", "Ticket4", "Ticket5", "Ticket6", "Ticket7", "Ticket8" ]
});

app.controller('filterController', function($scope) {
    $scope.message = 'Not implemented yet!';
});

app.controller('topicController', function($scope) {
>>>>>>> 51fc98aa0895ae73df61bb952977878316d8f33e
    $scope.message = 'Not implemented yet!';
});