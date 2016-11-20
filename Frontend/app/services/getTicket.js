/**
 * Created by Home on 19/11/2016.
 */

angular.module('myApp')
    .service('getTicket', ['restService' , function (restService) {
        this.getTicketContent = function(id) {
            return restService.get('/ticket/' + id);
        }
        return this;
    }]);


    /*
    .service('getTicket', function ($http) {
        this.getTicketContent = function (id) {
            //return $http.get('http://localhost:8080/api/ticket/'+id)
            return $http.get('http://84.88.81.126:8080/api/ticket/'+id)
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
        this.getTicketRelateds = function (id) {
            //return $http.get('http://localhost:8080/api/ticket/'+id+'/related')
            return $http.get('http://84.88.81.126:8080/api/ticket/'+id+'/related')
                .then(function successCallback(response) {
                    console.log(response['data']['msg']['data'][0]);
                    return response['data']['msg']['data'][0];
                }, function errorCallback(response) {
                    console.log(response);
                });
        };
        return this;
    });

/*
getTicket.$inject = ['$http'];

function getTicket($http) {
    return {
        getTicketContent : getTicketContent
    };

    function getTicketContent(id) {
        return $http.get('http://84.88.81.126:8080/api/ticket/'+id)
            .then(function successCallback(response) {
                //var values = response['data']['msg'][0];
                //alert(response);
                //console.log(response['data']['msg']['data'][0]);
                //callbackTicketContent(response)
                //console.log(response['data']['msg']['data'][0]);
                return response['data']['msg']['data'][0];

            }, function errorCallback(response) {

            });
    }


     this.getTicketRelateds = function (id) {
        return $http.get('http://localhost:8080/api/ticket/'+id+'/related')
      //return $http.get('http://84.88.81.126:8080/api/ticket/'+id+'/related')
        .then(function successCallback(response) {
     console.log(response['data']['msg']['data'][0]);
     return response['data']['msg']['data'][0];
     }, function errorCallback(response) {
     console.log(response);
     });
     };
     return this;
     });

}
*/