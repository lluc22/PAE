
// create the module and name it scotchApp
var app = angular.module('myApp', ['ngRoute', 'nvd3']);

// configure our routes
app.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {

    $routeProvider
        .when('/opentickets', {
            templateUrl : "views/home.html",
            controller  : 'mainController'
        })
        .when('/filter', {
            templateUrl : 'views/filter.html',
            controller  : 'filterController'
        })
        .when('/', {
            templateUrl : 'views/topics.html',
            controller  : 'topicsController'
        })
        .when('/ticket/:id' , {
            templateUrl : "views/ticket.html",
            controller  : 'mainController'
        })
}]);


// create the controller and inject Angular's $scope
app.controller('mainController', function($scope, $http, $location) {
    // create a message to display in our view
    $scope.message = 'Lists of opened tickets';
    $scope.tickets = [];
    //84.88.81.126
    //localhost:8080/api/tickets
    /*
    $http.get('http://84.88.81.126:8080/api/tickets')
        .then(function successCallback(response) {
        //var values = response['data']['msg'][0];
        //alert(response);
       angular.forEach(response['data']['msg']['data'], function(value) {
           //alert(value['title']);
           //console.log(value);
           $scope.tickets.push(value);
       })
    }, function errorCallback(response) {

    });*/
    $scope.selectTicket = function (ticket) {
        var id = ticket['id'];
        //console.log(id);
        $http.get('http://84.88.81.126:8080/api/ticket/'+id)
            .then(function successCallback(response) {
                //var values = response['data']['msg'][0];
                //alert(response);
               console.log(response);
            }, function errorCallback(response) {

            });
        $location.path('ticket/'+id);
    };
    var callback = function(result) {
        var json = JSON.parse(result);
        //console.log(json['msg']['data']);
        angular.forEach(json['msg']['data'], function(value) {
            //alert(value['title']);
            //console.log(value);
            $scope.tickets.push(value);
            $scope.$apply();
        })

    }
    var xhl = makeCorsRequest(callback);
    //console.log('AQUI---> ' + xhl);




    //$scope.tickets = ["Ticket1", "Ticket2", "Ticket3", "Ticket4", "Ticket5", "Ticket6", "Ticket7", "Ticket8" ]
});

app.controller('filterController', function($scope) {
    $scope.message = 'Not implemented yet!';
});

app.controller('topicsController', function($scope) {
    $scope.options = {
        chart: {
            type: 'discreteBarChart',
            height: 450,
            margin : {
                top: 100,
                right: 20,
                bottom: 50,
                left: 350
            },
            x: function(d){return d.label;},
            y: function(d){return d.value;},
            showValues: true,
            valueFormat: function(d){
                return d3.format(',.4f')(d);
            },
            duration: 500,
            xAxis: {
                axisLabel: 'Topic'
            },
            yAxis: {
                axisLabel: 'Quantity',
                axisLabelDistance: -10
            }
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

});


app.controller('topicsController2', function($scope) {
    $scope.options2 = {
        chart: {
            type: 'pieChart',
            height: 500,
            margin: {
                top: 100,
                right: 20,
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
                    right: 35,
                    bottom: 5,
                    left: 0
                }
            },
            legendPosition: 'right',
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
});


function createCORSRequest(method, url, callback) {
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
    };
    xhr.setRequestHeader('limit', 15);
    xhr.setRequestHeader('skip', 0);
    xhr.onreadystatechange = function () {
        if (this.status == 200 && this.readyState == 4) {
            var result = this.responseText;
            //console.log('response: ' + result);
            callback(result);
            //return JSON.parse(result);
        }
    };
    xhr.send();


    /*
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
    */
}

// Make the actual CORS request.
function makeCorsRequest(callback) {
    // This is a sample server that supports CORS.
    var url = 'http://84.88.81.126:8080/api/tickets';

    var xhr = createCORSRequest('GET', url, callback);
    //console.log('makeCorsRequest---> ' + xhr);
    if (!xhr) {
       // alert('CORS not supported');
        return;
    }

    var text;
    // Response handlers.
    xhr.onload = function() {
        text = xhr.responseText;
        //alert('Response from CORS request to ' + url + ': ' + title);
    };

    xhr.onerror = function() {
        //alert('Woops, there was an error making the request.');
    };

    xhr.send();
}