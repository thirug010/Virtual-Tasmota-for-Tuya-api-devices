var config = require('./config.js');
var n$ = require('./JsNodeFix.js');
var mqtt = require('mqtt');
var client  = mqtt.connect('<mqttServer>')
client.on('connect', function ()
{
	client.subscribe('#');
});



client.on('message', function (topic, message) 
{
	var msg    = message.toString();
	console.log(topic+' -- >'+msg);
});
