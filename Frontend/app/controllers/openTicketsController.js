/**
 * Created by Home on 19/11/2016.
 */


angular.module('myApp')
    .controller('openTicketsController', openTicketsController);

function openTicketsController($scope, $location, $stateParams, $state) {
    console.log("Initial -> " + $stateParams.page);
    var self = this;
    self.page = parseInt($stateParams.page);
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

    makeCorsRequest(callback, 20, this.page - 1);

    $scope.moreTickets = function () {
        $state.go('.', {page : self.page + 1});
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