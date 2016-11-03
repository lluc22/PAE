
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
app.controller('mainController', function($scope, $http) {
    // create a message to display in our view
    $scope.message = 'Lists of opened tickets';
    $scope.tickets = [];
    $http.get('http://localhost:8080/api/tickets').then(function successCallback(response) {
        //var values = response['data']['msg'][0];
        alert(response);
       angular.forEach(response['data']['msg']['data'], function(value) {
           //alert(value['title']);
           $scope.tickets.push(value['title'])
       })
    }, function errorCallback(response) {

    });
    //var xhl = makeCorsRequest();

    //$scope.tickets = ["Ticket1", "Ticket2", "Ticket3", "Ticket4", "Ticket5", "Ticket6", "Ticket7", "Ticket8" ]
});

app.controller('filterController', function($scope) {
    $scope.message = 'Not implemented yet!';
});

app.controller('topicController', function($scope) {
    $scope.message = 'Not implemented yet!';
});


function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
        // XHR for Chrome/Firefox/Opera/Safari.
        xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") {
        // XDomainRequest for IE.
        xhr = new XDomainRequest();
        xhr.open(method, url);
    } else {
        // CORS not supported.
        xhr = null;
    }
    return xhr;
}

// Helper method to parse the title tag from the response.
function getTitle(text) {
    return text.match('<title>(.*)?</title>')[1];
}

// Make the actual CORS request.
function makeCorsRequest() {
    // This is a sample server that supports CORS.
    var url = 'http://localhost:8080/api/tickets';

    var xhr = createCORSRequest('GET', url);
    if (!xhr) {
        alert('CORS not supported');
        return;
    }

    // Response handlers.
    xhr.onload = function() {
        var text = xhr.responseText;
        var title = getTitle(text);
        alert('Response from CORS request to ' + url + ': ' + title);
    };

    xhr.onerror = function() {
        alert('Woops, there was an error making the request.');
    };

    xhr.send();
}