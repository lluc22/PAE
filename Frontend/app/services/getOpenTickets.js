/**
 * Created by Home on 20/11/2016.
 */


angular.module('myApp')
    .service('getOpenTickets', getOpenTickets);

getOpenTickets.$inject = ['$http'];

function getOpenTickets(callback, limit, skip) {
    return {
        makeCorsRequest : makeCorsRequest
    };

    function makeCorsRequest(callback, limit, skip) {
        // This is a sample server that supports CORS.
        var url = 'http://84.88.81.126:8080/api/tickets';
        //var url = 'http://localhost:8080/api/tickets';

        var xhr = createCORSRequest('GET', url, callback, limit, skip);
        //console.log('makeCorsRequest---> ' + xhr);
    }

    function createCORSRequest(method, url, callback, limit, skip) {
        var xhr = new XMLHttpRequest();
        if ("withCredentials" in xhr) {
            // XHR for Chrome/Firefox/Opera/Safari.
            xhr.open(method, url, true);
        } else if (typeof XDomainRequest != "undefined") {
            // XDomainRequest for IE.
            xhr = new XDomainRequest();
            xhr.open(method, url);
        } else {
            // CORS not supported.
            xhr = null;
        };
        xhr.setRequestHeader('limit', limit);
        xhr.setRequestHeader('skip', skip);
        xhr.onreadystatechange = function () {
            if (this.status == 200 && this.readyState == 4) {
                var result = this.responseText;
                //console.log('response: ' + result);
                callback(result);
                //return JSON.parse(result);
            }
        };
        xhr.send();
    }
}