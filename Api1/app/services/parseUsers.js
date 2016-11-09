/**
 * Created by dani on 30/10/16.
 */
var fs        = require('fs');
var XmlStream = require('xml-stream');
/*
 * Pass the ReadStream object to xml-stream
 */
module.exports = {
    parse: function(callback) {
        var stream=fs.createReadStream('./app/services/DataSet/Users.xml');
        var xml = new XmlStream(stream);
        var jsonArray = [];
        xml.on('endElement: row', function(item) {
            var json = {saludo: "hola"};
            json = {
                id: item['$']['Id'],
                displayName: item['$']['DisplayName']
            }
            callback(json);
        });
    }
}
