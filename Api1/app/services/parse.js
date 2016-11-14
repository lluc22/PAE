/**
 * Created by dani on 30/10/16.
 */
var fs        = require('fs');
var XmlStream = require('xml-stream');
/*
 * Pass the ReadStream object to xml-stream
 */
module.exports = {
    parse: function(callback, callback2) {
        var stream=fs.createReadStream('./app/services/DataSet/Posts.xml');
        var xml = new XmlStream(stream);
        var jsonArray = [];
        xml.on('endElement: row', function(item) {
            var json = {saludo: "hola"};
            if(item['$']['PostTypeId'] == "1"){
                json = {
                    id: item['$']['Id'],
                    acceptedAnswerId: item['$']['AcceptedAnswerId'],
                    creationDate: item['$']['CreationDate'],
                    body: item['$']['Body'],
                    ownerUserId: item['$']['OwnerUserId'],
                    closedDate: item['$']['ClosedDate'],
                    title: item['$']['Title'],
                    tags: [
                        { name: item['$']['Tag'] }
                    ]
                }
                callback(json);
            }
            else if(item['$']['PostTypeId'] == "2"){
                json = {
                    id: item['$']['Id'],
                    ParentId: item['$']['ParentId'],
                    body: item['$']['Body'],
                    ownerUserId: item['$']['OwnerUserId']
                }
                callback2(json);
            }
        });
       /* xml.on('end',function(msg){
            callback('end')
        })*/
    }
}
