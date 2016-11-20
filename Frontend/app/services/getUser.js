/**
 * Created by Home on 19/11/2016.
 */


angular.module('myApp')
    .service('getUser', getUser);

getUser.$inject = ['$http'];

function getUser($http) {
    this.getUserInfo = function (id) {
        //return $http.get('http://localhost:8080/api/user/'+id)
        return $http.get('http://84.88.81.126:8080/api/user/'+id)
            .then(function successCallback(response) {
                //var values = response['data']['msg'][0];
                //alert(response);
                //console.log(response['data']['msg']['data'][0]);
                //callbackTicketContent(response)
                //console.log(response);

                return response['data']['msg']['data'][0];



            }, function errorCallback(response) {

            });
    };
    return this;
}