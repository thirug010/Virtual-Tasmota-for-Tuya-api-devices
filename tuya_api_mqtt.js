var n$ = require('./JsNodeFix.js');
var mqtt = require('mqtt');
var util = require('./Utility.js');
var clone = require('clone');
var appPort = 8082;
var cdnPort = 2362;
n$.trackCL();

util.init(cdnPort, appPort);
//console.log('util.devicesList', util.devicesList);
var tad = util.devicesList;
var cTad = function()
{
	return clone(util.devicesList);
}
var aply = [
						{PropertyName: 'telePeriodComplete', 		PropertyValue : null},
					  {PropertyName: 'teleTimeoutcb', 				PropertyValue : null},
						{PropertyName: 'mqttSubscribeComplete', PropertyValue : null},
						{PropertyName: 'virtualDeviceComplete', PropertyValue : null}
					];
var localDevList = n$.LinqIt(util.devicesList).Select([{PropertyName : 'nodeId'}]).ApplyToAll(aply);
setTimeout(function ()
{
	for(var i=0; i < tad.length; i++)
	{
		var v = tad[i];
		var vl = n$.LinqIt(localDevList).Where([{PropertyName:'nodeId', PropertyValue: v.nodeId}]).FirstOrDefault()
		vl.telePeriodComplete = true;
		if(!n$.isNullOrUndef(vl.teleTimeoutcb))
		{
			clearTimeout(vl.teleTimeoutcb)
		}
		setTelePeriod(clone(v),vl);
		vl.telePeriodComplete = true;
	}
}, 15000);

var setTelePeriod = function(v,vl)
{
		var t = n$.getTimeOut(v.telePeriod);
		var teleCallback = function(args)
		{
			var d = n$.LinqIt(cTad(),true).Where([{PropertyName : 'nodeId', PropertyValue : args.nodeId}]).FirstOrDefault();
			var topic = mqtt_cmnds.tel.format(d.nodeId);
			var msg = JSON.stringify(d.getData());
			client.publish(topic, msg);
		}
		vl.teleTimeoutcb =  setInterval(teleCallback,t, {nodeId : v.nodeId});
}

var doMqttSubscribe = function(v)
{
  //var v = n$.LinqIt(tad,true).Where([{PropertyName : 'nodeId', PropertyValue : nodeId}]).FirstOrDefault();
	var nodeId = v.nodeId;
	for(var p = 0; p < v.powers.length; p++)
	{
		var powerId = v.powers[p];
		var subTopic = mqtt_cmnds.sub.power.format(nodeId.toLowerCase(), powerId);
		client.subscribe(subTopic);
		devTopics.push({topic: subTopic, nodeId : nodeId.toLowerCase(), deviceId : powerId, type: 'power'});
	}
	// Default Power cmnd support
	var powerId = "";
	var subTopic = mqtt_cmnds.sub.power.format(nodeId.toLowerCase(), powerId);
	client.subscribe(subTopic);
	devTopics.push({topic: subTopic, nodeId : nodeId.toLowerCase(), deviceId : powerId, type: 'power'});

	if(v.isDimmer)
	{
		var subTopic = mqtt_cmnds.sub.dimmer.format(nodeId.toLowerCase());
		client.subscribe(subTopic);
		devTopics.push({topic: subTopic, nodeId : nodeId.toLowerCase(), deviceId : v.dimmerId, type: 'dimmer'});
	}
}

var client  = mqtt.connect(util.MqTTServer)
var devTopics = [];
var ignoreTopic = [];
var createDevice = function() {};
var mqtt_cmnds = {sub:{power:'cmnd/{0}/power{1}', dimmer : 'cmnd/{0}/dimmer', tele: 'cmnd/{0}/teleperiod'}, pub: 'stat/{0}/result', tel : 'tele/{0}/state'};
client.on('connect', function ()
{
	for(var i=0; i < tad.length; i++)
	{
		  var v = tad[i];
			doMqttSubscribe(v);
			var vl = n$.LinqIt(localDevList).Where([{PropertyName:'nodeId', PropertyValue: v.nodeId}]).FirstOrDefault()
			vl.mqttSubscribeComplete = true;
	}
	/*n$.LinqIt(tad).ForEach(function (i,v,args)
	{
		  var nodeId = v.nodeId;
			for(var p = 0; p < v.powers.length; p++)
			{
				var powerId = v.powers[p];
				var subTopic = mqtt_cmnds.sub.power.format(nodeId.toLowerCase(), powerId);
				client.subscribe(subTopic);
				devTopics.push({topic: subTopic, nodeId : nodeId.toLowerCase(), deviceId : powerId, type: 'power'});
			}
			if(v.isDimmer)
			{
				var subTopic = mqtt_cmnds.sub.dimmer.format(nodeId.toLowerCase());
				client.subscribe(subTopic);
				devTopics.push({topic: subTopic, nodeId : nodeId.toLowerCase(), deviceId : v.dimmerId, type: 'dimmer'});
			}
			MqttSubscribe(v);
		}); */
});

client.on('message', function (topic, message)
{
	var msg    = message.toString();
	if(msg == "")
	{
		console.log('topic ('+topic+') with no message data ignored');
		return;
	}
	var devtopic = n$.LinqIt(devTopics).Where([{PropertyName: 'topic' ,  PropertyValue: topic.toLowerCase()}]).FirstOrDefault();
	var nodeId = devtopic.nodeId;
	//var dev    = n$.LinqIt(tad, true).Where([{PropertyName: 'nodeId' , PropertyValue: nodeId}]).FirstOrDefault();
	var device = n$.LinqIt(dil, true).Where([{PropertyName: 'nodeId' , PropertyValue: nodeId}]).FirstOrDefault();

	if(!device.instance.isReady)
	{
		console.log('topic ('+topic+') with message ('+msg+') ignored as device is offline ');
		return;
	}
	var req = {query : {}};
	req.query = {nodeId: nodeId}
  var cdeviceId = devtopic.deviceId == ''  ? '1' : devtopic.deviceId;
	console.log('Mqtt message device ID ' + cdeviceId);
	if(devtopic.type == 'dimmer')
	{
		var val = n$.isNull(parseInt(msg),1);
		req.query['d'] = val;
	}
	if(devtopic.type == 'power')
	{
		req.query['o'] = cdeviceId;
	}
	util.processSetRequest(req, device);
	/*
	var setData = {
					multiple: true,
					data: {}
				  }
	var value = msg;
	var cdeviceId = devtopic.deviceId == ''  ? '1' : devtopic.deviceId;
	if(devtopic.type == 'dimmer')
	{
		var val = n$.isNull(parseInt(msg),1);
		value = dev.setDimmer(val);
			var data = {};
			data[cdeviceId] = value;
			data['1'] = true; // set dimmer and power1 on;
			setData.data = data;
	}

	if(devtopic.type == 'power')
	{
		if( msg == 'ON' || msg == 1) value =  true;
		if( msg == 'OFF' || msg == 0) value =  false;
		if( msg == 'TOGGLE' || msg == 2)
		{
			var cpower = dev.data["POWER"+cdeviceId];
			value =  cpower == 'ON' ? false : true;
		}
			var data = {};
			data[cdeviceId] = value;
			if(dev.isDimmer &&  dev.data["POWER1"] != 'ON')
			{
					data[dev.dimmerId] = 0;
			}
			setData.data = data;
	}
	device.instance.set(setData);*/
});

var TuyAPI = require('tuyapi');
var publishMqtt = function(mqtt)
{
	console.log('Publish Mqtt:', mqtt)
	var topic = "";
	if(mqtt.type == 'Result')
	{
			topic = 'stat/{0}/result'.format(mqtt.nodeId);
	}
	if(mqtt.type == 'Power')
	{
			topic = 'stat/{0}/power{1}'.format(mqtt.nodeId, mqtt.param);
	}
	if(mqtt.type == 'Dimmer')
	{
			topic = 'stat/{0}/result'.format(mqtt.nodeId);
	}
	client.publish(topic, mqtt.value);
}
var processData  = function(data, di)
{
	console.log('called processData: for '+di, data)
	var dip = n$.LinqIt(tad, true).Where([{PropertyName : 'nodeId', PropertyValue: di}]).FirstOrDefault();
	//dimmer
	if(!n$.isNullOrUndef(data.dps[dip.dimmerId]))
	{
		var mcuDimmer = dip.parseDimmer(data.dps[dip.dimmerId]);
		var webDimmer = dip.getDimmer();
		dip.setDimmer(data.dps[dip.dimmerId]);
		console.log(dip.nodeId + ' dip.setDimmer()' , dip.getDimmerP());
		console.log(dip.nodeId + ' mcuDimmer' , mcuDimmer);
		var mqtt = {};
		mqtt.type  = 'Dimmer';
		mqtt.value = mqtt.value = '{"'+'power1":"' + dip.data['POWER1'] + '","dimmer":' +mcuDimmer+'}';
		mqtt.nodeId = di;
		mqtt.param = "";
		publishMqtt(mqtt);
	}
	//power
	var power= 0;
	for(var p =0 ; p< dip.powers.length;p++)
	{
		pow = dip.powers[p];
		if(!n$.isNullOrUndef(data.dps[pow]))
		{
			var pushPower = data.dps[pow] ? 'ON' : 'OFF';
			//if(dip.data['POWER' + pow] != pushPower)
			//{
				dip.data['POWER' + pow] = pushPower;
				var mqtt = {};
				mqtt.type  = 'Result';
				mqtt.value = '{"'+'power' + pow + '" : "' + dip.data['POWER' + pow] +'"}';
				mqtt.nodeId = di;
				mqtt.param = "";
				publishMqtt(mqtt);
				if(pow == 1)
				{
				var mqtt = {};
				mqtt.type  = 'Power';
				mqtt.value = dip.data['POWER' + pow];
				mqtt.nodeId = di;
				mqtt.param = pow.toString();
				publishMqtt(mqtt);
			  }
			//}
		}
	}
}
var createDevice = function(devId, key, nodeId)
{
	var device = new TuyAPI({
	  id: devId,
	  key: key});

	device.nodeId = nodeId;
	device.isReady = false;
	// Find device on network
	device.find().then(() =>
	{
	  // Connect to device
	  device.connect();
	});

	// Add event listeners
	device.on('connected', () => {
	  console.log('Connected to ' +device.nodeId);
	  device.isReady = true;
		 //console.log('Connected to: ', device);
	});

	device.on('disconnected', () => {
	  //console.log('Disconnected from device.');
	  device.isReady = false;
	});

	device.on('error', error => {
	  ////console.log('Error!', error);
	  device.isReady = false;
	  setTimeout(function() {
		  device.find().then(() => {
		  // Connect to device
		  device.connect();
		});
	  }, 10000);
	});

	device.on('data', data => {
	  console.log('Data from device:', data);
	  // process Data Here
	  processData(data,device.nodeId);
	});
	return device;
}

var dil = [];
var createVirtualTasmotaDevice = function(devId,key,nodeId)
{
	var dev = createDevice(devId,key,nodeId);
	dil.push({nodeId : nodeId, instance : dev});
}

for(var t = 0; t < tad.length; t++)
	{
		var d = tad[t];
		createVirtualTasmotaDevice(d.devId,d.key,d.nodeId);
		var vl = n$.LinqIt(localDevList).Where([{PropertyName:'nodeId', PropertyValue: d.nodeId}]).FirstOrDefault()
		vl.mqttSubscribeComplete = true;
	}


	var http = require('http');
	var httpnds = require('http');
	var express = require('express');
	var bodyParser = require('body-parser');
	var cPath = require('path');

	var fs =  require('fs');
	var userInfo = {};
	var session = require('express-session');

	var app = express();
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded(
			{     // to support URL-encoded bodies
				extended: true
			}));

	app.use(session(
		{
		  secret: 'keyboard cat',
		  resave: false,
		  saveUninitialized: true//,
		  //cookie: { maxAge: config.SessionTimeOut }
		}))

	app.use(function (req, res, next)
	{
	  if (!req.session.key) {
	    req.session.key = {};
	  }
	  if (!req.session.isValid)
	  {
	    req.session.isValid = false;
	  }
	  if (!req.session.data)
	  {
	    req.session.data = {};
	  }
	  next()
	})

	app.get('/', function (req, res)
	{
		var pageData = util.processPageRequest(req);
		res.send(pageData);
	});



	app.get('/gd', function (req, res)
	{
	  var gReq =  util.processGetRequest(req);
	  res.send(gReq);
	});



	app.get('/sd', function (req, res)
	{
		var device = n$.LinqIt(dil, true).Where([{PropertyName: 'nodeId' , PropertyValue: req.query.nodeId}]).FirstOrDefault();
	  var gReq = util.processSetRequest(req, device);

		res.send(gReq);
	});



  app.get('/font-awesome/css/font-awesome.min.css',function(req,res)
	{
		res.set('Content-Type', 'text/css');
		res.send(util.getFontawsome(req));
	});

	app.get('/gettemplate',function(req,res)
	{
		res.send(util.getTemplate(req));
	});

	app.get('/cn',function(req,res)
	{
		res.send(util.getTasmotaConfig(req));
	});

	app.get('/cl',function(req,res)
	{
		res.send(util.getTasmotaConsole(req));
	});

	app.get('/ax',function(req,res)
	{
		res.send(n$.g_log.join('\n'));
	});

	app.get('/ccl',function(req,res)
	{
		n$.g_log = [];
		res.send("Console is cleared !");
	});

	app.get('/nu',function(req,res)
	{
		res.send(util.getNewTasmotaDev(req));
	});

	app.get('/dcu',function(req,res)
	{
		res.send(util.updateTasmotaDev(req));
	});

	app.get('/and',function(req,res)
	{
		var result = util.addNewTasmotaDev(req);
		for(var i=0; i < util.devicesList.length; i++)
		{
			var v = util.devicesList[i];
			var i = n$.LinqIt(localDevList).Where([{PropertyName : 'nodeId', PropertyValue: v.nodeId}]).FirstOrDefault();
			if(n$.isNullOrUndef(i))
			{
				localDevList.push({
														nodeId : v.nodeId,
														telePeriodComplete:null,
														teleTimeoutcb:null,
														mqttSubscribeComplete:null,
														virtualDeviceComplete:null
													});
			}
		}

		for(var i=0; i < localDevList.length; i++)
		{
			var vl = localDevList[i];
			var v = n$.LinqIt(util.devicesList).Where([{PropertyName : 'nodeId', PropertyValue: v.nodeId}]).FirstOrDefault();
			if(!vl.telePeriodComplete)
			{
					setTelePeriod(v,vl);
			}
			if(!vl.mqttSubscribeComplete)
			{
					doMqttSubscribe(v);
			}
			if(!vl.virtualDeviceComplete)
			{
				  var vc = clone(v);
				  createVirtualTasmotaDevice(vc.devId, vc.key, vc.nodeId);
					v.virtualDeviceComplete = true;
			}
		}
		/*if(result.sucess)
		{
				var item = result.item;
			  var v = n$.LinqtIt().Where([{PropertyName: 'nodeId', PropertyValue: item.nodeId}]).FirstOrDefault();
				setTelePeriod()
		}*/
		res.send(result.message);
	});





	// ------------------------------ Mqtt Ends   -----------------------------------------

	// htpp Server
	var httpServer = http.createServer(app);
	httpServer.listen (appPort);
	console.log('Web Server Running on Port 8082');

	var express = require('express');
	var path = require('path');
	var app = express();

	// Define the port to run on
	app.set('port', cdnPort);
	app.use(express.static(path.join(__dirname, 'cdn2')));

	// Listen for requests
	var server = app.listen(app.get('port'), function() {
	  var port = server.address().port;
	  console.log('CDN Running on Port ' + port);
	});
