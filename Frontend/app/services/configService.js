
angular.module('myApp')
    .service('configService',function(){
        var options = {}
        options.config = []
        options.read = false

        options.setConfig = function(conf) {
            angular.copy(conf,options.config);
        };

        options.setRead = function(r) {
            angular.copy(r,options.read);
        }


        return options
    })

