/**
 * Created by sinnombre on 30/11/16.
 */


angular.module('myApp')
    .service('getBestUsers', ['restService' , function (restService) {
        this.getRelatedsUsers = function (id) {
            var headers = {headers: {
                'limit' : 20,
                'skip' : 0
            } };
            return restService.get('/ticket/' + id + '/related/users', headers);
        };
        return this;
    }]);

