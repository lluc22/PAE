/**
 * Created by Home on 20/11/2016.
 */


angular.module('myApp')
    .service('restService', ['MY_CONSTANTS', '$http' , function (MY_CONSTANTS, $http) {
        this.get = function (url, headers) {
            return $http.get(MY_CONSTANTS.SERVER_IP + url, headers)
                .then(function successCallback(response) {
                    if (headers != null) {
                        return response['data']['msg']['data'];
                    }
                    else {
                        return response['data']['msg']['data'][0];
                    }

                }, function errorCallback(response) {

                });
        };
    }]);