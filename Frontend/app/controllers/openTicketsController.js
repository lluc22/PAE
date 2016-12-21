/**
 * Created by Home on 19/11/2016.
 */

angular.module('myApp')
    .controller('openTicketsController', ['MY_CONSTANTS', '$scope', '$location', '$stateParams', '$state', 'getTickets',
        function (MY_CONSTANTS, $scope, $location, $stateParams, $state, getTickets) {
            console.log($stateParams);
            var self = this;
            self.page = parseInt($stateParams.page);
            self.open = $stateParams.open;
            self.closed = $stateParams.closed;
            self.iniDay = $stateParams.iniDay;
            self.endDay = $stateParams.endDay;
            self.topic = $stateParams.topic;

            var startDay = self.iniDay;
            var lastDay = self.endDay;
            var selectedTopic = self.topic;
            var openSelected = self.open;
            var closeSelected = self.closed;

            $scope.tickets = [];

        $scope.selectTicket = function (ticket) {
            var id = ticket['id'];
            console.log(id);
            $location.path('ticket/'+id);

        };

        $scope.tickets = getTickets.ticketContent;

        getTickets.getTickets(20, this.page - 1, self.open, self.closed,  self.iniDay, self.endDay, self.topic);

        $scope.moreTickets = function () {
            console.log(openSelected);
            console.log(closeSelected);
            console.log(startDay);
            console.log(lastDay);
            console.log(selectedTopic);


            $state.go('.', {page : self.page + 1,
                            open: openSelected ,
                            closed : closeSelected,
                            iniDay : startDay,
                            endDay : lastDay,
                            topic : selectedTopic
                            });


        };


        $scope.sendValues = function() {
            //console.log($("#state").val());
            //console.log($("#topic").val());
            //console.log($("#usr").val());
            //console.log($("#iniDay").text());
            //console.log($("#endDay").text());
            var state = $("#state").val();
            selectedTopic = $("#topic").val();
            startDay = ($("#iniDay").text());
            lastDay = ($("#endDay").text());
            if (state == "Open") {
                openSelected = true;
                closeSelected = false;
            }
            else if (state == "Closed") {
                openSelected = false;
                closeSelected = false;
            }
            else state = null;
            if(topic == " ") topic = null;
            getTickets.getTickets(20, self.page - 1, openSelected, closeSelected, startDay, lastDay, selectedTopic);

        }

    }]).run(function ($rootScope, MY_CONSTANTS) {
        $rootScope.MY_CONSTANTS = MY_CONSTANTS;
    });

