/**
 * Created by Home on 19/11/2016.
 */

angular.module('myApp')
    .controller('openTicketsController', ['$scope', '$location', '$stateParams', '$state', 'getTickets',
        function ($scope, $location, $stateParams, $state, getTickets) {
        //console.log("Initial -> " + $stateParams.page);
        var self = this;
        self.page = parseInt($stateParams.page);
        $scope.tickets = [];
        var clicks = 0;

        $scope.selectTicket = function (ticket) {
            var id = ticket['id'];
            //console.log(id);
            $location.path('ticket/'+id);

        };

        getTickets.makeCorsRequest(20, this.page - 1, "open").then(function (result) {
            angular.forEach(result, function(value) {
                $scope.tickets.push(value);
            })
        });

        $scope.moreTickets = function () {
            $state.go('.', {page : self.page + 1});
        };
    }]);

