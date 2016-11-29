/**
 * Created by Home on 19/11/2016.
 */

angular.module('myApp')
    .controller('ticketController', ['$scope', '$location', 'getTicket', 'getUser', 'getRelateds',
        function ($scope, $location, getTicket, getUser, getRelateds) {
        var string = window.location.href; // con esto cojo la url, solo me interesa quedarme el ultimo numero de esta
        var lastUrlPart = string.split('/');
        var answer_users =  [];
        var question_user;
        var id = lastUrlPart[lastUrlPart.length-1].split('?');
        id = id[0];
        $scope.relateds = [];

        var getAnswersUser = function () {
            //console.log("length-->" +a.length);
            if(answer_users.length == answersCount){

                for(var i =0; i<answer_users.length;++i)
                    document.getElementsByClassName('user')[i].innerHTML =
                        "<p align='right'> <i> response by: " + answer_users[i] +
                        "</i></p>";
            }
        };

        var getQuestionUser = function () {
            document.getElementById("question-user").innerHTML = "<p align='right' style='margin-right:2em;'> <i> Question made by: " + question_user +
                "</i></p>";
        };

        var answersCount;


        getTicket.getTicketContent(id).then(function (resp) {
            answersCount = resp.answers.length;
            $scope.title = resp.title;
            if (resp.bestAnswer != null) {
                console.log("best answer -> " + resp.bestAnswer);
            }
            document.getElementById('question').innerHTML = "<table><tbody><tr><td>" + resp.body + "</td></tr>" +
                "<tr><td id='question-user'></td></tr>";
            getUser.getUserInfo(resp.ownerUserId).then(function (resp) {
                question_user = resp.displayName;
                getQuestionUser();
            });
            document.getElementById('answers-header').innerHTML = "<h4>" + resp.answers.length + " Answers </h4>";
            if (resp.answers.length > 0) {
                for (var i = 0; i < resp.answers.length; ++i) {
                    document.getElementById('answers-content').innerHTML +=
                        "<table><tbody><tr><td class='answercell'></td></tr><tr><td class='user'>" +
                        "</td></tr></tbody></table>";
                    document.getElementsByClassName('answercell')[i].innerHTML = resp.answers[i].body;
                    //document.getElementsByClassName('user')[i].innerHTML = resp.answers[i].ownerId;
                    //namesId.push(resp.answers[i].owenerId);

                    getUser.getUserInfo(resp.answers[i].ownerId).then(function (resp2) {
                        answer_users.push(resp2.displayName);
                        getAnswersUser();
                    });
                }

            }
        });
        //getTicket.getTicketRelateds(id).then(function (resp) {
        //   console.log('This is the resp');
        //});
        console.log(id);
        getRelateds.getRelateds(id).then(function (resp) {
            console.log(resp);
            for (var i = 0; i<10; ++i) {
                $scope.relateds.push(resp[i]);
            };
        });

        $scope.selectTicket = function (ticket) {
            var id = ticket['id'];
            //console.log(id);
            $location.path('ticket/'+id);

        };


    }]);