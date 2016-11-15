
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
            controller  : 'ticketController'
        })
}]);

app.service('getTicket', function ($http) {
    this.getTicketContent = function (id) {
        return $http.get('http://localhost:8080/api/ticket/'+id)
            .then(function successCallback(response) {
                //var values = response['data']['msg'][0];
                //alert(response);
                //console.log(response['data']['msg']['data'][0]);
                //callbackTicketContent(response)
                //console.log(response['data']['msg']['data'][0]);
                return response['data']['msg']['data'][0];


            }, function errorCallback(response) {

            });
    };
    return this;
});

app.service('getUser', function ($http) {
    this.getUserInfo = function (id, vec) {
        return $http.get('http://localhost:8080/api/user/'+id)
            .then(function successCallback(response) {
                //var values = response['data']['msg'][0];
                //alert(response);
                //console.log(response['data']['msg']['data'][0]);
                //callbackTicketContent(response)
                //console.log(response);

                return response['data']['msg']['data'][0];



            }, function errorCallback(response) {

            });
    };
    return this;

});


app.controller('ticketController', function ($scope, $http, getTicket, getUser) {
    //console.log(window.location.href);
    var string = window.location.href; // con esto cojo la url, solo me interesa quedarme el ultimo numero de esta
    var id = string.split('/');
    var a =  [];
    id = id[id.length - 1];
    //var namesId = [];
    var vec = function () {
        //console.log("length-->" +a.length);
        if(a.length == answers){

            for(var i =0; i<a.length;++i)
                document.getElementsByClassName('user')[i].innerHTML = a[i];
        }
    };
    var answers;
    getTicket.getTicketContent(id).then(function (resp) {
        answers = resp.answers.length;
        $scope.title = resp.title;
        //$scope.body = resp.body;
        document.getElementById('question').innerHTML = resp.body;
        document.getElementById('answers-header').innerHTML = "<h4>" + resp.answers.length + " Answers </h4>";
        if (resp.answers.length > 0) {
            for (var i = 0; i < resp.answers.length; ++i) {
                document.getElementById('answers-content').innerHTML +=
                    "<table><tbody><tr><td class='user'></td><td class='answercell'>" +
                    "</td></tr></tbody></table>";
                document.getElementsByClassName('answercell')[i].innerHTML = resp.answers[i].body;
                //document.getElementsByClassName('user')[i].innerHTML = resp.answers[i].ownerId;
                //namesId.push(resp.answers[i].owenerId);

                 getUser.getUserInfo(resp.answers[i].ownerId,vec).then(function (resp2) {
                     a.push(resp2.displayName);
                     vec();
                    console.log(resp2.displayName);
                 //console.log(names);


                 });




                /*
                 document.getElementById('answers-content').innerHTML +=
                 "<table><tbody><tr><td class='user'>" + resp.answers[i].ownerId +"</td><td class='answercell'>" + resp.answers[i].body +
                 "</td></tr></tbody></table>";

                 */

            }

        }
    });

    /*
    }*/

});

// create the controller and inject Angular's $scope
app.controller('mainController', function($scope, $http, $location) {
    // create a message to display in our view
    $scope.tickets = [];
    var clicks = 0;
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

    /*
    var callbackTicketContent = function (response) {
        var json = response['data']['msg']['data'];
        $scope.title = json[0].title;
        $scope.$apply();
        console.log($scope.title);
    };
    */

    $scope.selectTicket = function (ticket) {
        var id = ticket['id'];
        //console.log(id);
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

    };
    makeCorsRequest(callback, 20, 0);
    //console.log('AQUI---> ' + xhl);

    $scope.moreTickets = function () {
        ++clicks;
        //console.log(clicks);
        makeCorsRequest(callback2, 20, clicks*20);
    };

    var callback2 = function(result) {
        var json = JSON.parse(result);
        //console.log(json['msg']['data']);
        angular.forEach(json['msg']['data'], function(value) {
            $scope.tickets.push(value);
            //console.log(value.title);
            $scope.$apply();

        })

    };



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
});


app.controller('topicsController2', function($scope) {
    $scope.options2 = {
        chart: {
            type: 'pieChart',
            height: 500,
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


function createCORSRequest(method, url, callback, limit, skip) {
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
    xhr.setRequestHeader('limit', limit);
    xhr.setRequestHeader('skip', skip);
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
function makeCorsRequest(callback, limit, skip) {
    // This is a sample server that supports CORS.
    //var url = 'http://84.88.81.126:8080/api/tickets';

    var url = 'http://localhost:8080/api/tickets';
    var xhr = createCORSRequest('GET', url, callback, limit, skip);
    //console.log('makeCorsRequest---> ' + xhr);
    /*
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
    */
}