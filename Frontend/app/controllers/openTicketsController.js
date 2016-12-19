/**
 * Created by Home on 19/11/2016.
 */

angular.module('myApp')
    .controller('openTicketsController', ['MY_CONSTANTS', '$scope', '$location', '$stateParams', '$state', 'getTickets',
        function (MY_CONSTANTS, $scope, $location, $stateParams, $state, getTickets) {

            //$scope.dates4 = { startDate: moment().subtract(1, 'day'), endDate: moment().subtract(1, 'day') };
            //$scope.datePicker.date = {startDate: null, endDate: null};
        //console.log("Initial -> " + $stateParams.page);
            var self = this;
            self.page = parseInt($stateParams.page);

            $scope.tickets = [];
            var clicks = 0;

        $scope.selectTicket = function (ticket) {
            var id = ticket['id'];
            console.log(id);
            $location.path('ticket/'+id);

        };

        $scope.tickets = getTickets.ticketContent;

        getTickets.getTickets(20, this.page - 1, null, null,  null, null, null);
        /*
        getTickets.makeCorsRequest(20, this.page - 1, null, null, null, null).then(function (result) {
            angular.forEach(result, function(value) {
                //console.log(value);
                $scope.tickets.push(value);

            })
        });
        */

        $scope.moreTickets = function () {
            $state.go('.', {page : self.page + 1});
        };


        $scope.sendValues = function() {
            //console.log("HI");
            //console.log(document.forms("myForm").getElementByTagName("sel1"));
            //console.log($("#state").val());
            //console.log($("#topic").val());
            //console.log($("#usr").val());
            //console.log($("#iniDay").text());
            //console.log($("#endDay").text());
            var state = $("#state").val();
            var topic = $("#topic").val();
            var iniDay = ($("#iniDay").text());
            var endDay = ($("#endDay").text());
            var open = null;
            var closed = null;
            if (state == "Open") {
                open = true;
                closed = false;
            }
            else if (state == "Closed") {
                open = false;
                closed = false;
            }
            else state = null;
            if(topic == " ") topic = null;
            getTickets.getTickets(20, self.page - 1, open, closed, iniDay, endDay, topic);
        }

    }]).run(function ($rootScope, MY_CONSTANTS) {
        $rootScope.MY_CONSTANTS = MY_CONSTANTS;
    });

