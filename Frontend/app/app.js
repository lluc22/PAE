

// Declare app level module which depends on views, and components
var myApplication = angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.version'
]);


myApplication.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');
    $routeProvider
        .when('/', {
            templateUrl : 'views/home.html',
            controller  : 'mainController'
        })
        .when('/filter', {
            templateUrl : 'views/filter.html',
            controller  : 'FilterController'
        })

        // route for the contact page
        .when('/topics', {
            templateUrl : 'views/topics.html',
            controller  : 'TopicsController'
        });

  // $routeProvider.otherwise({redirectTo: '/view1'});
}]);

myApplication.controller('mainController', function($scope) {
    // create a message to display in our view
    $scope.message = 'Open tickets list';
});

myApplication.controller('FilterController', function($scope) {
    $scope.message = 'Not implemented yet!';
});

myApplication.controller('TopicsController', function($scope) {
    $scope.message = 'Not implemented yet!';
});