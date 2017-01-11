
angular.module('myApp')
    .service('configService',function(){
        var options = {};
        options.config = [];
        options.read = {};

        options.setConfig = function(conf) {
            //console.log(conf);
            angular.copy(conf,options.config);
        };

        options.setRead = function(r) {
            var result = {value: r};
            console.log(result);
            angular.copy(result,options.read);
        };
        return options
    });

