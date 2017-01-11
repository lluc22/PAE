
angular.module('myApp')
    .service('configService',function(){
        var config = {}

        var setConfig = function(conf) {
            config = conf;
        };

        var getConfig = function(){
            return config;
        };

        return {
            setConfig: setConfig,
            getConfig: getConfig
        };
    })

