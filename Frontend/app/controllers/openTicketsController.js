/**
 * Created by Home on 19/11/2016.
 */


angular.module('myApp')
    .controller('openTicketsController', openTicketsController);

function openTicketsController($scope, $location) {
    // create a message to display in our view
    $scope.tickets = [];
    var clicks = 0;
    //84.88.81.126
    //localhost:8080/api/tickets

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
    }

// Make the actual CORS request.
    function makeCorsRequest(callback, limit, skip) {
        // This is a sample server that supports CORS.
        var url = 'http://84.88.81.126:8080/api/tickets';
        //var url = 'http://localhost:8080/api/tickets';

        var xhr = createCORSRequest('GET', url, callback, limit, skip);
        //console.log('makeCorsRequest---> ' + xhr);
    }
}