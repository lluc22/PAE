/**
 * Created by Home on 19/11/2016.
 */

angular.module('myApp')
    .service('getUser', ['restService' , function (restService) {
        this.getUserInfo = function (id) {
            return restService.get('/user/' + id);
        };
        return this;
    }]);
