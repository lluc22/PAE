/**
 * Created by Home on 19/11/2016.
 */

angular.module('myApp')
    .controller('openTicketsController', ['MY_CONSTANTS', '$scope', '$location', '$stateParams', '$state', 'getTickets', 'getTopics', 'configService',
        function (MY_CONSTANTS, $scope, $location, $stateParams, $state, getTickets, getTopics, configService) {

            var legendCallback = function () {
                document.getElementById('topic').innerHTML = "<option> </option>";
                //console.log($scope.legend);
                for (x in $scope.legend) {
                    document.getElementById('topic').innerHTML += "<option>"+ $scope.legend[x].name +"</option>";
                }
            };

            getTopics.getLegend(legendCallback);
            $scope.legend = getTopics.legend;

            var self = this;
            console.log(configService.config);

            self.page = parseInt($stateParams.page);

            if(!configService.read.value) {
                //console.log($stateParams);
                self.open = $stateParams.open;
                self.closed = $stateParams.closed;
                self.iniDay = $stateParams.iniDay;
                self.endDay = $stateParams.endDay;
                self.topic = $stateParams.topic;
            }

            else{
                self.open = configService.config.open;
                self.closed = configService.config.closed;
                self.iniDay = configService.config.iniDay;
                self.endDay = configService.config.endDay;
                self.topic = configService.config.topic;
            }

            var startDay = self.iniDay;
            var lastDay = self.endDay;
            var selectedTopic = self.topic;
            var openSelected = self.open;
            var closeSelected = self.closed;

            $scope.tickets = [];

        $scope.selectTicket = function (ticket) {
            var id = ticket['id'];
            //console.log(id);
            $location.path('ticket/'+id);
            var config = {};
            config.open = openSelected;
            config.closed = closeSelected;
            config.iniDay = startDay;
            config.endDay = lastDay;
            config.topic = selectedTopic;
            configService.setRead(false);
            configService.setConfig(config);
        };

        $scope.tickets = getTickets.ticketContent;

        getTickets.getTickets(20, (this.page - 1) * 20, self.open, self.closed,  self.iniDay, self.endDay, self.topic);

        $scope.moreTickets = function () {
            /*
            console.log(openSelected);
            console.log(closeSelected);
            console.log(startDay);
            console.log(lastDay);
            console.log(selectedTopic);
            */

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
            if(selectedTopic == " ") selectedTopic = null;
            else {
                for (x in $scope.legend) {
                    if ($scope.legend[x].name == selectedTopic) {
                        selectedTopic = $scope.legend[x].id;
                    }
                }
            }
            getTickets.getTickets(20, self.page - 1, openSelected, closeSelected, startDay, lastDay, selectedTopic);

        }

    }]).run(function ($rootScope, MY_CONSTANTS) {
        $rootScope.MY_CONSTANTS = MY_CONSTANTS;
    });

