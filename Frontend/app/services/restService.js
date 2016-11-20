/**
 * Created by Home on 20/11/2016.
 */


angular.module('myApp')
    .service('restService', ['MY_CONSTANTS', '$http' , function (MY_CONSTANTS, $http) {
        this.get = function (url) {
            return $http.get(MY_CONSTANTS.SERVER_IP + url)
                .then(function successCallback(response) {
                    return response['data']['msg']['data'][0];

                }, function errorCallback(response) {

                });
        };

    }]);
