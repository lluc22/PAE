/**
 * Created by sinnombre on 28/11/16.
 */

angular.module('myApp')
    .service('getRelateds', ['restService' , function (restService) {
        this.getRelateds = function (id) {
            return restService.get('/ticket/' + id + '/related', null);
        };
        return this;
    }]);

