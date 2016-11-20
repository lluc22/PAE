/**
 * Created by Home on 19/11/2016.
 */


angular.module('myApp')
    .controller('openTicketsController', ['$scope', '$location', '$stateParams', '$state', 'getOpenTickets', function ($scope, $location, $stateParams, $state, getOpenTickets) {
        //console.log("Initial -> " + $stateParams.page);
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

        getOpenTickets.makeCorsRequest(callback, 20, this.page - 1);

        $scope.moreTickets = function () {
            $state.go('.', {page : self.page + 1});
        };
    }]);

