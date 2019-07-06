var Utility = {};
var fs = require('fs');
var n$ = require('./JsNodeFix.js');
var clone = require('clone');
var njDB = require('./nodeStorage2.js');
njDB.init('Tuya-Api-Tasmota.rs');


Utility.MqTTServer = 'mqtt://xxx.xxx.x.xx:1883'; // mqtt server ip nd port 

Utility.tam_storage_key = 'tam_app_001';
Utility.getStorageKey = function(propertyname)
{
		return Utility.tam_storage_key+'.'+propertyname;
}
njDB.setItem = function(key, value)
{
	 	key = Utility.getStorageKey(key);
		njDB.setItemSync(key, value);
		return njDB.getItemSync(key);
}
njDB.getItem = function(key)
{
	 	key = Utility.getStorageKey(key);
		return njDB.getItemSync(key);
}
njDB.pushItem = function(key, item)
{
	 	var items = njDB.getItem(key);
		if(n$.isNullOrUndef(items))
		{
			items = [];
		}
		items.push(item);
		return {items: njDB.setItem(key, items), item : item};
}
njDB.swapItem = function(key, item)
{
		var items = njDB.getItemSync(key);
		var oldItem = n$.LinqIt(items, true).Where([{PropertyName:'nodeId', PropertyValue: item.nodeId}]).FirstOrDefault();
		for(k in item)
		{
			oldItem[k] = item [k];
		}
		return njDB.setItemSync(key, items);
}

Utility.SessionTimeOut = 1000 * 60;
Utility.deviceTypes = [
						   {name: 'Tuya Dimmer',      id: 'tuya_dimmer',     template:'shd_d1c_template.htm' ,isDimmer: true  ,powers:[1], 	  	  },// dimmerId :2, rangeFactor:100, minDimValue:10 },
						   {name: 'Tuya Fan Switch',  id: 'tuya_switch_fan', template:'shd_d2c_template.htm' ,isDimmer: true  ,powers:[1,3], 	    },// dimmerId :2, rangeFactor:255, minDimValue:10 },
						   {name: 'Tuya Swtich 1 CH', id: 'tuya_switch_ch1', template:'shd_s1c_template.htm' ,isDimmer: false ,powers:[1], 	  	  },// dimmerId :0, rangeFactor:-1 , minDimValue:-1 },
						   {name: 'Tuya Swtich 2 CH', id: 'tuya_switch_ch2', template:'shd_s2c_template.htm' ,isDimmer: false ,powers:[1,2], 	    },// dimmerId :0, rangeFactor:-1 , minDimValue:-1 },
						   {name: 'Tuya Swtich 3 CH', id: 'tuya_switch_ch3', template:'shd_s3c_template.htm' ,isDimmer: false ,powers:[1,2,3],    },// dimmerId :0, rangeFactor:-1 , minDimValue:-1 },
						   {name: 'Tuya Swtich 4 CH', id: 'tuya_switch_ch4', template:'shd_s4c_template.htm' ,isDimmer: false ,powers:[1,2,3,4],  },// dimmerId :0, rangeFactor:-1 , minDimValue:-1 }
                      ];
					  
Utility.devicesConfig = [];

Utility.devicesList = [];
Utility.init = function (cdnPort, webPort)
{
  Utility.cdnPort = cdnPort;
  Utility.webPort = webPort;
	Utility.initDevices();

    //console.log('Utility.devicesList: ', Utility.devicesList)
}
Utility.initDevices = function()
{
	Utility.devicesConfig = n$.isNull(clone(njDB.getItem('deviceConfig')),[]);

  var join = {OnColumns: [{RName:'id', LName:'deviceType'}], SelectAll: true ,  JoinType: 'Inner'}
  Utility.devicesList =n$.LinqIt(Utility.devicesConfig, true).Join(Utility.deviceTypes, join).ToList();
	Utility.devicesListLite = [];
  	for(var i=0; i < Utility.devicesList.length; i++)
  	{
  		var v = Utility.devicesList[i];
  		var nodeId = v.nodeId;
  		var isDimmer = n$.isNull(v.dimmerId,0) != 0;
  		v.isDimmer = isDimmer;
      v.titleShort = v.friendlyName.length >=16 ? v.friendlyName.substring(0,8)+'..': v.friendlyName;
      v.devIdShort = v.devId.slice(v.devId.length-7 ,-1);
  		v.data = {};
  		for(var p = 0; p < v.powers.length; p++)
  		{
  			var powerId = v.powers[p];
  			v.data['POWER'+powerId] = 'OFF';
  		}
			Utility.devicesListLite.push(JSON.parse(JSON.stringify(v))); // it is lite weight object
  		if(isDimmer)
  		{
  			v.data['Dimmer'] = 0;
  			v.setDimmerP = function(v)
		    {
		    	this.data['Dimmer'] = Math.round((v / 100) * this.rangeFactor);
		    	return this.data['Dimmer'];
		    };
				v.setDimmer = function(v)
		    {
		    	this.data['Dimmer'] = v;
		    	return this.data['Dimmer'];
		    };
  			v.getDimmer = function()
		    {
		    	return this.data['Dimmer'];
		    };
  			v.parseDimmer = function(v)
		    {
		    	return Math.round((v / this.rangeFactor) * 100);
		    };
  			v.getDimmerP = function()
		    {
		    	return this.parseDimmer(this.data.Dimmer);
		    };
  		}
      v.getData = function()
	    {
	      	var newData = {};
	      	for(var p = 0; p < this.powers.length; p++)
	      	{
	      		var powerId = this.powers[p];
	      		newData['POWER'+powerId] = this.data['POWER'+powerId];
	      	}
	        if(this.isDimmer)
	        {
	      	   newData['Dimmer'] = this.getDimmerP();
	        }
	      	return newData;
	    };
  	}
}

Utility.processPageRequest = function (req)
{
    var q = req.query;
    // nodeId
    if(!n$.isNullOrUndef(q.nodeId))
    {
        //console.log(q.nodeId);
        /*
        var pgTemp = n$.LinqIt(Utility.devicesList).Where([{PropertyName : 'nodeId', PropertyValue : q.nodeId}]).FirstOrDefault();
        var pgData = fs.readFileSync(__dirname+'/webpages-vt/'+pgTemp.template, 'utf8');
        pgData = pgData.replaceAll('{{nodeId}}', pgTemp.nodeId).replaceAll('{{name}}', pgTemp.name);
        */
        var pgTemp = n$.LinqIt(Utility.devicesList, true).Where([{PropertyName : 'nodeId', PropertyValue : q.nodeId}]).FirstOrDefault();
        var pgData = fs.readFileSync(__dirname+'/webpages-vt/shd_dev_template.htm', 'utf8');
        var hostName = req.protocol + '://' + req.get('host').split(':')[0];
        var updateData = Utility.getDeviceStatus(pgTemp);
        pgData = pgData.format(hostName, Utility.cdnPort, Utility.webPort, JSON.stringify(pgTemp), q.nodeId, updateData);
        return pgData;
    }
    // ip address
    if(!n$.isNullOrUndef(q.ip))
    {

    }
    // devid
    // localkey
    // name

    // default
    var hostName = req.protocol + '://' + req.get('host').split(':')[0];
    var pageData = fs.readFileSync(__dirname+'/webpages-vt/shd_000_template.htm', 'utf8');
    var devListJSON = JSON.stringify(Utility.devicesListLite);
    pageData = pageData.format(hostName, Utility.cdnPort, Utility.webPort, devListJSON)
    return pageData;
}

Utility.SelectColumns = [
												 {PropertyName:'topic'}
												,{PropertyName:'devId'}
												,{PropertyName:'key'}
												,{PropertyName:'friendlyName'}
												,{PropertyName:'nodeId'}
												,{PropertyName:'name'}
												,{PropertyName:'id'}
												,{PropertyName:'template'}
												,{PropertyName:'isDimmer'}
												,{PropertyName:'powers'}
												,{PropertyName:'dimmerId'}
												,{PropertyName:'rangeFactor'}
												,{PropertyName:'minDimValue'}
												,{PropertyName:'telePeriod'}
												,{PropertyName:'pulsePeriod'}
												,{PropertyName:'deviceType'}
												,{PropertyName:'titleShort'}
												,{PropertyName:'devIdShort'}
												,{PropertyName:'data'}
											];

Utility.processGetRequest = function (req)
{
    var q = req.query;
    // nodeId
    if(!n$.isNullOrUndef(q.nodeId) && q.nodeId != 'all')
    {
        var pgTemp = n$.LinqIt(Utility.devicesList, true).Where([{PropertyName : 'nodeId', PropertyValue : q.nodeId}]).FirstOrDefault();
        return Utility.getDeviceStatus(pgTemp);
    }
    else
    {
			  var lst = n$.LinqIt(Utility.devicesList, true).Select(Utility.SelectColumns).ToList();
        return JSON.stringify (lst);
    }
}

Utility.getDeviceListLimitedCols = function()
{
	var l = n$.LinqIt(Utility.devicesList, true).Select(Utility.SelectColumns).ToList();
	return JSON.parse(JSON.stringify(l));
}

Utility.processSetRequest = function (req, device)
{
    var q = req.query;
    // nodeId
    if(!n$.isNullOrUndef(q.nodeId))
    {
        //console.log(q.nodeId);
        var pgTemp = n$.LinqIt(Utility.devicesList, true).Where([{PropertyName : 'nodeId', PropertyValue : q.nodeId}]).FirstOrDefault();
        switch(pgTemp.deviceType)
        {
            case 'tuya_switch_fan':
            {
                //console.log(pgTemp);
                var d,p1,p2;
                if(!n$.isNullOrUndef(q.d))
                {
                    pgTemp.setDimmerP(q.d);
                    pgTemp.data['POWER1'] = 'ON';
                }
                if(!n$.isNullOrUndef(q.o))
                {
                    pgTemp.data['POWER'+q.o] = Utility.toogleStatus(pgTemp.data['POWER'+q.o])
                }
                break;
            }
            case 'tuya_dimmer':
            {
                var d,p1;
                if(!n$.isNullOrUndef(q.d))
                {
                    pgTemp.setDimmerP(q.d);
                    pgTemp.data['POWER1'] = 'ON';
                }
                if(!n$.isNullOrUndef(q.o))
                {
                    pgTemp.data['POWER'+q.o] = Utility.toogleStatus(pgTemp.data['POWER'+q.o]);
                }
                break;
            }
            case 'tuya_switch_ch1':
            case 'tuya_switch_ch2':
            case 'tuya_switch_ch3':
            case 'tuya_switch_ch4':
            {
              if(!n$.isNullOrUndef(q.o))
              {
                  pgTemp.data['POWER'+q.o] = Utility.toogleStatus(pgTemp.data['POWER'+q.o])
              }
              break;
            }
        }
        Utility.updateDevStatus(pgTemp, device);
        return Utility.getDeviceStatus(pgTemp);
    }
}
Utility.updateDevStatus = function(pgTemp, device)
{
    switch(pgTemp.deviceType)
    {
      case "tuya_switch_fan":
      {
        var p1 = pgTemp.data.POWER1 =='ON'? true :false;
        var p3 = pgTemp.data.POWER3 =='ON'? true :false;
        var p2 = pgTemp.getDimmer();
				//gpTemp.data.lkDimmer = p2;
        //p2 = p1 ? p2 : 0;
				var setData = {};
				if(p1)
				{
						setData = {
	          						  multiple: true,
	          						      data: {'1' : p1, '2': p2 , '3' : p3}
	          					  }
				}
				else
				{
					setData = {
												multiple: true,
														data: {'1' : p1, '3' : p3}
											}
				}
        console.log('Utility.updateDevStatus --> setData: ',  setData);
        device.instance.set(setData);
        break;
      }
      case "tuya_dimmer":
      {
        var p1 = pgTemp.data.POWER1 =='ON'? true :false;
        var p2 = parseInt(pgTemp.data.Dimmer);
				//gpTemp.data.lkDimmer = p2;
        //p2 = p1 ? p2 : 0;
				var setData = {};
				if(p1)
				{
							setData = {
													multiple: true,
															data: {'1' : p1, '2': p2}
												}
				}
				else
				{
					setData = {
											multiple: true,
													data: {'1' : p1}
										}
				}

        console.log('Utility.updateDevStatus --> setData: ',  setData);
        device.instance.set(setData);
        break;
      }
      case "tuya_switch_ch1":
      {
        var p1 = pgTemp.data.POWER1 =='ON'? true :false;
        var setData = {
          						  multiple: true,
          						      data: {'1' : p1}
          					  }
        console.log('Utility.updateDevStatus --> setData: ',  setData);
        device.instance.set(setData);
        break;
      }
      case "tuya_switch_ch2":
      {
        var p1 = pgTemp.data.POWER1 =='ON'? true :false;
        var p2 = pgTemp.data.POWER2 =='ON'? true :false;
        var setData = {
          						  multiple: true,
          						      data: {'1' : p1, '2' : p2}
          					  }
        console.log('Utility.updateDevStatus --> setData: ',  setData);
        device.instance.set(setData);
        break;
      }
      case "tuya_switch_ch3":
      {
        var p1 = pgTemp.data.POWER1 =='ON'? true :false;
        var p2 = pgTemp.data.POWER2 =='ON'? true :false;
        var p3 = pgTemp.data.POWER3 =='ON'? true :false;
        var setData = {
          						  multiple: true,
          						      data: {'1' : p1, '2' : p2, '3' : p3}
          					  }
        console.log('Utility.updateDevStatus --> setData: ',  setData);
        device.instance.set(setData);
        break;
      }
      case "tuya_switch_ch4":
      {
        var p1 = pgTemp.data.POWER1 =='ON'? true :false;
        var p2 = pgTemp.data.POWER2 =='ON'? true :false;
        var p3 = pgTemp.data.POWER3 =='ON'? true :false;
        var p4 = pgTemp.data.POWER$ =='ON'? true :false;
        var setData = {
          						  multiple: true,
          						      data: {'1' : p1, '2' : p2, '3' : p3, '4': p4}
          					  }
        console.log('Utility.updateDevStatus --> setData: ',  setData);
        device.instance.set(setData);
        break;
      }

    }
    //return setData;
}
Utility.toogleStatus = function(status)
{
    if(status == 'ON')
    {
        return 'OFF';
    }
    else
    {
      return 'ON';
    }
}
Utility.getDeviceStatus = function (pgTemp)
{
  var data = "";
  switch(pgTemp.deviceType)
  {
      case 'tuya_switch_fan':
      {
          var d = pgTemp.getDimmerP();
          var p3 = pgTemp.data['POWER3'];
          var p1 = pgTemp.data['POWER1'];
          var p1Style = p1 == 'ON' ? 'bold':'normal';
          var p3Style = p3 == 'ON' ? 'bold':'normal';
          var gReq = "{t}</table>{t}<tr><td style='width:33{c}{{dev1Style}};font-size:46px'>{{dev1}}</div></td><td style='width:33{c}normal;font-size:46px'>   </div></td><td style='width:33{c}{{dev3Style}};font-size:46px'>{{dev3}}</div></td></tr></table>#;{{dimmer}}"
          gReq = gReq.replace('{{dev1}}', p1).replace('{{dev1Style}}',p1Style);
          gReq = gReq.replace('{{dev3}}', p3).replace('{{dev3Style}}',p3Style);
          gReq = gReq.replace('{{dimmer}}', d);
          data = gReq;
          break;
      }
      case 'tuya_dimmer':
      {
          var d = pgTemp.getDimmerP();
          var p1 = pgTemp.data['POWER1'];
          var p1Style = p1 == 'ON' ? 'bold':'normal';
          var gReq = "{t}</table>{t}<tr><td style='width:33{c}normal;font-size:46px'>    </div></td><td style='width:33{c}{{dev1Style}};font-size:46px'>{{dev1}}</div></td><td style='width:33{c}normal;font-size:46px'>   </div></td></tr></table>#;{{dimmer}}"
          gReq = gReq.replace('{{dev1}}', p1).replace('{{dev1Style}}',p1Style);
          gReq = gReq.replace('{{dimmer}}', d);
          data = gReq;
          break;
      }
      case 'tuya_switch_ch1':
      {
          var p1 = pgTemp.data['POWER1'];
          var p1Style = p1 == 'ON' ? 'bold':'normal';
          var gReq = "{t}</table>{t}<tr><td style='width:33{c}normal;font-size:46px'>    </div></td><td style='width:33{c}{{dev1Style}};font-size:46px'>{{dev1}}</div></td><td style='width:33{c}normal;font-size:46px'>   </div></td></tr></table>"
          gReq = gReq.replace('{{dev1}}', p1).replace('{{dev1Style}}',p1Style);
          data = gReq;
          break;
      }
      case 'tuya_switch_ch2':
      {
          var p1 = pgTemp.data['POWER1'];
          var p2 = pgTemp.data['POWER2'];
          var p1Style = p1 == 'ON' ? 'bold':'normal';
          var p2Style = p2 == 'ON' ? 'bold':'normal';
          var gReq = "{t}</table>{t}<tr><td style='width:50{c}{{dev1Style}};font-size:46px'>{{dev1}}</div></td><td style='width:50{c}{{dev2Style}};font-size:46px'>{{dev2}}</div></td></tr></table>"
          gReq = gReq.replace('{{dev1}}', p1).replace('{{dev1Style}}',p1Style);
          gReq = gReq.replace('{{dev2}}', p2).replace('{{dev2Style}}',p2Style);
          data = gReq;
          break;
      }
      case 'tuya_switch_ch3':
      {
          var p1 = pgTemp.data['POWER1'];
          var p2 = pgTemp.data['POWER2'];
          var p3 = pgTemp.data['POWER3'];
          var p1Style = p1 == 'ON' ? 'bold':'normal';
          var p2Style = p2 == 'ON' ? 'bold':'normal';
          var p3Style = p3 == 'ON' ? 'bold':'normal';
          var gReq = "{t}</table>{t}<tr><td style='width:33{c}{{dev1Style}};font-size:46px'>{{dev1}}</div></td><td style='width:33{c}{{dev2Style}};font-size:46px'>{{dev2}}</div></td><td style='width:33{c}{{dev3Style}};font-size:46px'>{{dev3}}</div></td></tr></table>"
          gReq = gReq.replace('{{dev1}}', p1).replace('{{dev1Style}}',p1Style);
          gReq = gReq.replace('{{dev2}}', p2).replace('{{dev2Style}}',p2Style);
          gReq = gReq.replace('{{dev3}}', p3).replace('{{dev3Style}}',p3Style);
          data = gReq;
          break;
      }
      case 'tuya_switch_ch4':
      {
          var p1 = pgTemp.data['POWER1'];
          var p2 = pgTemp.data['POWER2'];
          var p3 = pgTemp.data['POWER3'];
          var p4 = pgTemp.data['POWER4'];
          var p1Style = p1 == 'ON' ? 'bold':'normal';
          var p2Style = p2 == 'ON' ? 'bold':'normal';
          var p3Style = p3 == 'ON' ? 'bold':'normal';
          var p4Style = p4 == 'ON' ? 'bold':'normal';
          var gReq = "{t}</table>{t}<tr><td style='width:25{c}{{dev1Style}};font-size:36px'>{{dev1}}</div></td><td style='width:25{c}{{dev2Style}};font-size:36px'>{{dev2}}</div></td><td style='width:25{c}{{dev3Style}};font-size:36px'>{{dev3}}</div></td><td style='width:25{c}{{dev4Style}};font-size:36px'>{{dev4}}</div></td></tr></table>"
          gReq = gReq.replace('{{dev1}}', p1).replace('{{dev1Style}}',p1Style);
          gReq = gReq.replace('{{dev2}}', p2).replace('{{dev2Style}}',p2Style);
          gReq = gReq.replace('{{dev3}}', p3).replace('{{dev3Style}}',p3Style);
          gReq = gReq.replace('{{dev4}}', p4).replace('{{dev4Style}}',p4Style);
          data = gReq;
          break;
      }


  }
  return data;
}
Utility.getFontawsome = function (req)
{
  var hostName = req.protocol + '://' + req.get('host').split(':')[0] + ':'+Utility.cdnPort+'/font-awesome/';
  var pgData = fs.readFileSync(__dirname+'/cdn2/font-awesome/css/font-awesome.css', 'utf8');
  pgData = pgData.replaceAll('#:#', hostName);
  return pgData;
}
Utility.getTemplate= function (req)
{
  var item = JSON.parse(req.query.item);
  var hostName = req.protocol + '://' + req.get('host').split(':')[0];
  var pgData = fs.readFileSync(__dirname+'/cdn2/templates/'+item.deviceType+'.htm', 'utf8');
  var allScopeData = pgData.match(/\{{(.*?)\}}/g);
  for (var i =0; i < allScopeData.length; i++)
  {
      var sc = allScopeData[i];
      var scp = sc.replace("{{",'').replace("}}",'');
      pgData = pgData.replaceAll(sc,eval(scp));
  }
  pgData = pgData.format(hostName, Utility.cdnPort);
  return pgData;
}
Utility.getTasmotaConsole= function (req)
{
  var item = n$.LinqIt(Utility.devicesList, true).Where([{PropertyName : 'nodeId', PropertyValue : req.query.nodeId}]).FirstOrDefault();
	item = n$.isNull(item, {});
  var hostName = req.protocol + '://' + req.get('host').split(':')[0];
  var pgData = fs.readFileSync(__dirname+'/webpages-vt/shd_dev_console.htm', 'utf8');
  pgData = pgData.format(hostName, Utility.cdnPort,Utility.webPort, JSON.stringify(item), JSON.stringify(Utility.deviceTypes));
  return pgData;
}
Utility.getTasmotaConfig= function (req)
{
  var item = n$.LinqIt(Utility.devicesList, true).Where([{PropertyName : 'nodeId', PropertyValue : req.query.nodeId}]).FirstOrDefault();
	item = n$.isNull(item, {});
  var hostName = req.protocol + '://' + req.get('host').split(':')[0];
  var pgData = fs.readFileSync(__dirname+'/webpages-vt/shd_000_config.htm', 'utf8');
  pgData = pgData.format(hostName, Utility.cdnPort,Utility.webPort, JSON.stringify(item), JSON.stringify(Utility.deviceTypes));
  return pgData;
}
Utility.getNewTasmotaDev= function (req)
{
	var hostName = req.protocol + '://' + req.get('host').split(':')[0];
  var pgData = fs.readFileSync(__dirname+'/webpages-vt/shd_new_device.htm', 'utf8');
	Utility.deviceTypes = n$.LinqIt(Utility.deviceTypes).ApplyToAll([{PropertyName:'telePeriod', PropertyValue:{time:120, factor:'s'}}]);
  for(var i=0;i<Utility.deviceTypes.length;i++)
  {
			var d = Utility.deviceTypes[i];
			var pp = {};
			//console.log('d:', d);
			for(var k = 0; k < d.powers.length; k++)
			{
					pp[d.powers[k]] = {time:-1, factor:'n'};
			}
			//console.log(pp);
			Utility.deviceTypes = n$.LinqIt(Utility.deviceTypes).ApplyToAll([{PropertyName:'pulsePeriod', PropertyValue:pp}]);
	}
	pgData = pgData.format(hostName, Utility.cdnPort,Utility.webPort, JSON.stringify(Utility.deviceTypes));
  return pgData;
}
Utility.addNewTasmotaDev= function(req)
{
	 var item = JSON.parse(req.query.dev);
	 var eItem = n$.LinqIt(Utility.devicesListLite).Where([{PropertyName: 'devId', PropertyValue: item.devId},{PropertyName: 'key', PropertyValue: item.key}]).FirstOrDefault();
   delete item.$$hashKey;
	 if(n$.isNullOrUndef(eItem))
	 {
		 	var devData = njDB.pushItem('deviceConfig', item);
			Utility.initDevices();
			var result = { success : true, item : devData , message : 'device added success'}
			return result;
	 }
	 else
	 {
		  var result = { success : false, item : devData , message : 'device already exists'}
	 }
}
Utility.updateTasmotaDev=function(req)
{
	   var item = JSON.parse(req.query.dev);
     var eItem = n$.LinqIt(Utility.devicesListLite).Where([{PropertyName: 'nodeId', PropertyValue: item.nodeId}]).FirstOrDefault();
		 delete item.$$hashKey;
		 if(!n$.isNullOrUndef(eItem))
		 {
				var devData = njDB.swapItem(Utility.getStorageKey('deviceConfig'), item);
				Utility.initDevices();
				var result = { success : true, item : devData , message : 'device updated success'}
				return result;
		 }
		 else
		 {
				return Utility.addNewTasmotaDev(req);
		 }
}



module.exports = Utility;
