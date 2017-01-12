/**
 * Created by Home on 19/11/2016.
 */

angular.module('myApp')
    .controller('ticketController', ['MY_CONSTANTS', '$scope', '$location', '$rootScope', 'getTicket', 'getUser', 'getRelateds', 'getBestUsers', 'configService',
        function (MY_CONSTANTS, $scope, $location, $rootScope, getTicket, getUser, getRelateds, getBestUsers, configService) {

        var string = window.location.href; // con esto cojo la url, solo me interesa quedarme el ultimo numero de esta
        var lastUrlPart = string.split('/');
        var answer_users =  [];
        var bestAnswerFromUser = [];
        var question_user;
        var id = lastUrlPart[lastUrlPart.length-1].split('?');
        id = id[0];
        $scope.relateds = [];
        $scope.bestUsers = [];

        var getAnswersUser = function () {
            //console.log("length-->" +a.length);
            if(answer_users.length == answersCount){
                for(var i =0; i<answer_users.length;++i)
                    document.getElementsByClassName('user')[i].innerHTML =
                        "<p align='right'> <i> response by: " + answer_users[i] +
                        "</i></p>";
            }
        };

        var getBesAnswerUser = function () {
            document.getElementsByClassName('bestAnswerUser')[0].innerHTML =
                "<p align='right'> <i> best response by: " + bestAnswerFromUser[0] +
                "</i></p>";
        };

        var getQuestionUser = function () {
            document.getElementById("question-user").innerHTML = "<p align='right' style='margin-right:2em;'> <i> Question made by: " + question_user +
                "</i></p>";
        };

        var answersCount;


        getTicket.getTicketContent(id).then(function (resp) {
            //console.log(resp);
            answersCount = resp.answers.length;
            var topics = resp.topics;
            for (x in topics) {
                var numTopic = topics[x].topicid;
                document.getElementById('questionTopics').innerHTML += "<span class='badge' style='background-color:" +
                    MY_CONSTANTS.colores[numTopic] + "'> &nbsp; </span>";
            }
            $scope.title = resp.title;
            document.getElementById('question').innerHTML = "<table><tbody><tr><td>" + resp.body + "</td></tr>" +
                "<tr><td id='question-user'></td></tr>";
            getUser.getUserInfo(resp.ownerUserId).then(function (resp) {
                question_user = resp.displayName;
                getQuestionUser();
            });
            if (resp.bestAnswer != null) {
                //console.log("best answer -> " + resp.bestAnswer);
                document.getElementById('answers-header').innerHTML = "<h4>" + (resp.answers.length+1) + " Answers </h4>";
                //IMAGEN
                 //"<img src='https://www.shareicon.net/data/128x128/2016/08/20/817720_check_395x512.png'>" +
                 //
                document.getElementById('bestAnswer').innerHTML =
                    "<table><tbody><tr>" +
                    "<td class='tickImage'> <img src='https://www.shareicon.net/data/128x128/2016/08/20/817720_check_395x512.png' " +
                    "style='width: inherit'></td>" +
                    "<td class='bestAnswer'></td></tr><tr><td></td><td class='bestAnswerUser'>" +
                    "</td></tr></tbody></table>";
                document.getElementsByClassName('bestAnswer')[0].innerHTML = resp.bestAnswer.body;
                getUser.getUserInfo(resp.bestAnswer.ownerId).then(function (resp2) {
                    //console.log(resp2);
                    //answer_users.push(resp2.displayName);
                    bestAnswerFromUser.push(resp2.displayName);
                    //getAnswersUser();
                    getBesAnswerUser();
                });
            }
            else document.getElementById('answers-header').innerHTML = "<h4>" + resp.answers.length + " Answers </h4>";
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


        getRelateds.getRelateds(id).then(function (resp) {
            //console.log(resp);
            for (var i = 0; i<10; ++i) {
                $scope.relateds.push(resp[i]);
            }
        });


        getBestUsers.getRelatedsUsers(id).then(function (resp) {
            //console.log(resp);
            for (var i = 0; i < 10; ++i) {
                $scope.bestUsers.push(resp[i]);
            }
        });

        $scope.selectTicket = function (ticket) {
            var id = ticket['id'];
            //console.log(id);
            $location.path('ticket/'+id);

        };

        $scope.$on("$locationChangeStart",function(){
            configService.setRead(true);
        });


        }]);