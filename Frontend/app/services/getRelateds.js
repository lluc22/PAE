/**
 * Created by sinnombre on 28/11/16.
 */

angular.module('myApp')
    .service('getRelateds', ['restService' , function (restService) {
        this.getRelateds = function (id) {
            var headers = {headers: {
                'limit' : 20,
                'skip' : 0
            } };
            return restService.get('/ticket/' + id + '/related', headers);
        };
        return this;
    }]);

