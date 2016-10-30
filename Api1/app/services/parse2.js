/**
 * Created by dani on 30/10/16.
 */
var fs        = require('fs');
var XmlStream = require('xml-stream');
/*
 * Pass the ReadStream object to xml-stream
 */
var stream=fs.createReadStream('Comments2.xml');
var xml = new XmlStream(stream);
var jsonArray = [];
xml.on('endElement: row', function(item) {
    console.log(item['$']['Text']);
    var jsonObject = {};
    jsonArray.data.push(jsonObject);
});