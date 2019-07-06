JsNodeFix = {};
JsNodeFix._weekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
JsNodeFix._weekends = ['Sunday','Saturday'];
var cl = require('clone');
JsNodeFix.g_log = [];



if(!Date.prototype.getWeekDay)
{
    Date.prototype.getWeekDay = function()
    {
        return JsNodeFix._weekdays[this.getDay()];
    }
}
if(!Date.prototype.toDateInfo)
{
    Date.prototype.toDateInfo = function()
    {
        var info =            {
            weekDay: this.getWeekDay(),
            dayType: this.getWeekDayType(),
            date : this.getFullYear() + "-" + (this.getMonth()+1) + "-" + this.getDate()
            }
        return info;

    }
}
if(!Date.prototype.getWeekDayType)
    {
        Date.prototype.getWeekDayType = function()
        {
            var day= JsNodeFix._weekdays[this.getDay()];
            return JsNodeFix._weekends.contains(day) ? 'WeekEnd': 'WeekDay'
        }
    }

if(!Date.prototype.addHours)
    {
        Date.prototype.addHours = function(h) {
		   this.setTime(this.getTime() + (h*60*60*1000));
		   return this;
		}
    }


if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}
if (!String.prototype.replaceAll) {
    String.prototype.replaceAll = function(search, replacement) {
        var target = this;
        return target.replace(new RegExp(search, 'g'), replacement);
    };
}

if(!Array.prototype.unique2)
{
  Array.prototype.unique2 = function() {
  return this.filter(function (value, index, self) {
    return self.indexOf(value) === index;
  });
}
}

if(!Array.prototype.contains)
    {
        Array.prototype.contains  =function(str)
        {
            if(JsNodeFix.isNullOrUndef(str))
            {
                    return false;
            }
           return this.indexOf(str) > -1;
        }
    }


        Array.prototype.pushU  =function(item, property, value )
        {
			var isFound = false;
            for (var i =0; i < this.length; i++)
			{
				var ci = this[i];
				if(ci[property] == value)
				{
					isFound = true;
					break;
				}
			}
			if(!isFound)
			{
				this.push(item);
			}
			else
			{
				console.log('item push skipped ...' );
			}
        }




	JsNodeFix.LinqIt = function(list,override)
	{
		override = JsNodeFix.isNull(override, false);
		if(!override)
		{
			that = JsNodeFix.extendObject(list);
		}
		else
		{
			that = list;
		}
		_find = function(whr, yesAll)
		{

			var items = [];
			for( var i = 0; i < that.length; i++)
			{
				var item = that[i];
				var whrCount = whr.length;
				var matchCnt = 0;
				for( var j=0 ; j < whrCount ; j++)
				{
					var w = whr[j];
					if(!JsNodeFix.isNullOrUndef(w.ProcessIt) && w.PropertyName == '<index>')
					{
						var val = w.ProcessIt(item);
						if(item == val)
						{
							matchCnt++;
						}
					}
					else if(!JsNodeFix.isNullOrUndef(w.ProcessIt) )
					{
						var val = w.ProcessIt(item);
						if(item[w.PropertyName] == val)
						{
							matchCnt++;
						}
					}
					// Case Index Array
					else if(w.PropertyName == '<index>')
					{
						if(item == w.PropertyValue)
						{
							matchCnt++;
						}
					}
					// Case PropertyValue
					else if(item[w.PropertyName] == w.PropertyValue)
						{
							matchCnt++;
						}
					// Case PropertyValue Processit
				}

				//console.log(matchCnt);
				if(matchCnt == whrCount)
				{
					items.push({index : i , item : item});
				}

				if (!yesAll)
				{
					return items;
				}
			}

			return items;
		}
		_where = function(whr)
		{
							var items = [];
							for( var i = 0; i < that.length; i++)
							{
								var item = that[i];
								var whrCount = whr.length;
								var matchCnt = 0;
								for( var j=0 ; j < whrCount ; j++)
								{
									var w = whr[j];
									if(!JsNodeFix.isNullOrUndef(w.ProcessIt) && w.PropertyName == '<index>' && !JsNodeFix.isNullOrUndef(w.PropertyValues))
									{
										var val = w.ProcessIt(item);
										if(item == val)
										{
											matchCnt++;
										}
									}
									// case ProcessIt
									else if(!JsNodeFix.isNullOrUndef(w.ProcessIt) )
									{
										var val = w.ProcessIt(item);
										if(item[w.PropertyName] == val)
										{
											matchCnt++;
										}
									}
									// Case Index Array
									else if(w.PropertyName == '<index>')
									{
										if(item == w.PropertyValue)
										{
											matchCnt++;
										}
									}
									// Case PropertyValues
									else if(!JsNodeFix.isNullOrUndef(w.PropertyValues))
									{
										for(var yt = 0; yt < w.PropertyValues.length; yt++)
										{
											if(item[w.PropertyName] == w.PropertyValues[yt])
											{
												matchCnt++;
											}
										}

									}
									// Case PropertyValue
									else if(item[w.PropertyName] == w.PropertyValue)
										{
											matchCnt++;
										}
									// Case PropertyValue Processit


								}
								//console.log(matchCnt);
								if(matchCnt == whrCount)
								{
									items.push(item);
								}
							}

							var _self = new JsNodeFix.LinqIt(items,override, false);
							_self.parentLQL = that;
							return _self;
						}
		_toList = function() { return that}
		_toArray = function(propertyname, uni) {
			var retArray = [];
			for( var i = 0; i < that.length; i++)
			{
				var item = that[i];
				if(uni)
				{
					if(retArray.indexOf(item[propertyname]) < 0)
					{
						retArray.push(item[propertyname]);
					}
				}
				else
				{
					retArray.push(item[propertyname]);
				}
			}
			return retArray;
		}
		_firstOrDefault = function() { return that [0]}
		_contains = function(whr)
		{
			var item = JsNodeFix.Where(whr).JsNodeFix.FirstOrDefault();
			return !JsNodeFix.isNullOrUndef(item);
		}
		_add = function(item , keys , override)
		{
			override = JsNodeFix.isNull(override, false);
			//console.log('_add called ');
			var whr = [];
			if(JsNodeFix.isNullOrUndef(keys))
			{
				if(!list.indexOf(item) > -1)
				{
					list.push(item);
				}
			}
			else
			{
				//console.log('_add called keys ');
				for (var i =0; i < keys.length; i++)
				{
					var key = keys[i];
					whr.push({PropertyName : key, PropertyValue : item[key]});
				}
				var exItem = JsNodeFix.LinqIt(list , true).Where(whr).FirstOrDefault();
				if(JsNodeFix.isNullOrUndef(exItem))
				{
					list.push(item);
				}
				else if(override)
				{
					for(key in item)
					{
						exItem[key] = JsNodeFix.extendObject(item[key]);
					}
				}
			}
		};
		_forEach = function(callback , args)
		{
			 for(var i = 0 ; i < list.length; i++)
			 {
				 callback(i, list[i], args);
			 }
		}
		_select = function(sel, distinct)
		{
			var retList =[];
			var curItem ={};
			//console.log('that length :' + that.length);
			//console.log( ' ');
			var isDistinct = !JsNodeFix.isNullOrUndef(distinct);
			for(var i=0; i < that.length; i++)
			{
				curItem = that[i];
				var retItem ={};
				//console.log('curItem ('+i+'): ');
				//console.log2(curItem);
				for(var s=0; s < sel.length; s++)
				{
					var cs = sel[s];
					//console.log('CS : ');
					//console.log2(cs);

					// Property Method
					if(!JsNodeFix.isNullOrUndef(cs.PropertyMethod))
					{
						if(!JsNodeFix.isNullOrUndef(cs.AlaisName))
						{
							var fn = curItem[cs.PropertyMethod];
							retItem[cs.AlaisName]    = fn(cs.CallBackArgs);
						}
						else
						{
							var fn = curItem[cs.PropertyMethod];
							retItem[cs.PropertyName] = fn(cs.CallBackArgs);
						}
					}
					// Do Process it
					else if(!JsNodeFix.isNullOrUndef(cs.ProcessIt))
					{
						if(!JsNodeFix.isNullOrUndef(cs.AlaisName))
						{
							retItem[cs.AlaisName]    = cs.ProcessIt(curItem);
						}
						else
						{
							retItem[cs.PropertyName] = cs.ProcessIt(curItem);
						}
					}
					// CaseWhen
					else if(!JsNodeFix.isNullOrUndef(cs.CaseWhen))
					{
						if(!JsNodeFix.isNullOrUndef(cs.AlaisName))
						{
							retItem[cs.AlaisName]    = cs.CaseWhen.CaseFn(curItem) ? cs.CaseWhen.TrueFn (item) : cs.CaseWhen.FalseFn(item);
						}
						else
						{
							retItem[cs.PropertyName] = cs.CaseWhen.CaseFn(curItem) ? cs.CaseWhen.TrueFn (item) : cs.CaseWhen.FalseFn(item);
						}
					}
					// AlaisName
					else if(!JsNodeFix.isNullOrUndef(cs.AlaisName))
					{
						retItem[cs.AlaisName]    = curItem[cs.PropertyName];
					}
					// PropertyName
					if(!JsNodeFix.isNullOrUndef(cs.PropertyName))
					{
						retItem[cs.PropertyName] = curItem[cs.PropertyName];
					}

				}
				//console.log('retItem Start ----------->' + i);
				//console.log2(retItem);
				//console.log(' ');
				if(isDistinct)
				{
					var whr = distinct.onColumns;
					var whrCnt = whr.length;

					for(var dsi=0; dsi< retList.length ; dsi++)
					{
						var fndCnt = 0;
						var isFound = false;
						var dsCruItem = retList[dsi];

						for(dsj=0; dsj < whrCnt ; dsj++)
						{
							var wr = whr[dsj];
							if(dsCruItem[wr] == retItem[wr])
							{
								fndCnt++;
							}
						}
						//console.log('fndCnt : ' + fndCnt + ' == '+whrCnt);
						if(fndCnt == whrCnt)
						{
							isFound = true;
							break;
						}
					}
					if(!isFound)
					{
						retList.push(retItem);
					}
				}
				else
				{
					retList.push(retItem);
				}
			}
			var _self = new JsNodeFix.LinqIt(retList);
			return _self;
		}
		_join = function(list2 , joinInfo)
		{
			var retList = [];
			for (var i=0 ; i < that.length ; i++)
			{
				//console.log('j Starts');
				var curItem = that[i];
 				retItem = curItem;
				joinOn = joinInfo.OnColumns;
				jSelect = joinInfo.SelectColumns;
				jType = joinInfo.JoinType;
				jSelectAll = JsNodeFix.isNull(joinInfo.SelectAll);
				var jonCnt = joinOn.length;
				var jonMatchCnt = 0;
				var isJion = false;
				var matchedItem = null;
				for(var l2 =0 ; l2 < list2.length; l2++)
				{
					jCurrentItem = list2[l2];
					jonMatchCnt = 0;
					for(var j=0; j < jonCnt; j++)
					{
						var jOn = joinOn[j];
						if(curItem[jOn.LName] == jCurrentItem[jOn.RName])
						{
							/*console.log(jOn);
							console.log(curItem[jOn.LName]);
							console.log(jCurrentItem[jOn.RName]);*/
							jonMatchCnt++;
							//console.log('Matched Count :'+ jonMatchCnt + " == " + jonCnt);
						}
					}
					if(jonMatchCnt == jonCnt)
					{
						matchedItem = jCurrentItem;
						break;
					}
				}

				if(jType == 'Inner')
				{
					//console.log('Inner --> Select All :' + jSelectAll);
					if(!JsNodeFix.isNullOrUndef(matchedItem))
					{
						if(jSelectAll)
						{
							//console.log('Inner --> '+JsNodeFix.isNullOrUndef(matchedItem));
							for (key in matchedItem)
							{
								curItem[key] = matchedItem[key];
							}
						}
						else
						{
							for(var js=0; js< jSelect.length ; js++)
							{
								var cc = jSelect[js];
								curItem[cc] = jCurrentItem[cc];
							}
						}
						retList.push(curItem);
					}
				}
				else if (jType == 'Outer')
				{
					if(matchedItem == null)
					{
						if(jSelectAll)
						{
							// No Item can be added from null Object
						}
						else
						{
							for(var js=0; js< jSelect.length ; js++)
							{
								var cc = jSelect[js];
								if(JsNodeFix.isNullOrUndef(curItem[cc]))
								{
									curItem[cc] = null;
								}
							}
						}
					}
					else
					{
						if(jSelectAll)
						{
							for (key in matchedItem)
							{
								curItem[key] = matchedItem[key];
							}
						}
						else
						{
							for(var js=0; js< jSelect.length ; js++)
							{
								var cc = jSelect[js];
								curItem[cc] = matchedItem[cc];
							}
						}
					}
					retList.push(curItem);
				}
			}
			var _self = new JsNodeFix.LinqIt(retList, true);
			return _self;
		}
		_applyToAll = function(items)
		{
			retList =[];
			for(var i = 0; i < that.length; i++)
			{
				var curItem = that[i];
				for(var j=0; j < items.length; j++)
				{
					var item = items[j];
					curItem[item.PropertyName] = item.PropertyValue;
				}
				retList.push(curItem);
			}
			return retList;
		}
		_delete = function(whr)
		{
			for(var pl =0; pl < that.length; pl++)
			{
				curItem = that[pl];
				var delWhrCnt = whr.length;
				var delMatchCnt = 0;
				for(var dw = 0; dw < whr.length; dw++)
				{
					var wi = whr[dw];
					// List Match
					if(!JsNodeFix.isNullOrUndef(wi.ProcessIt))
					{
						if(ProcessIt(curItem) == wi.PropertyValue)
						{
							delMatchCnt++;
						}
					}
					else
					{
						if(curItem[wi.PropertyName] == wi.PropertyValue)
						{
							delMatchCnt++;
						}
					}
				}
				if(delMatchCnt == delWhrCnt)
				{
					that.splice(pl,1);
				}
			}
			return that;
		}

		var ret =
		{
			ToList 		    : _toList,
			FirstOrDefault  : _firstOrDefault,
			Where 		    : _where,
			Join 		    : _join,
			Select		    : _select,
			Delete			: _delete,
			AddItem 	    : _add,
			ForEach 	    : _forEach,
			ApplyToAll	    : _applyToAll,
			Contains		: _contains,
			ToArray			: _toArray
		}

		return ret;
	}
	JsNodeFix.extendObject = function (t1)
	{
		return cl(t1);
	}

    JsNodeFix.isNullOrUndef = function(obj)
    {

        if(obj == undefined || obj == null || typeof obj === 'undefined')
            {
                return true;
            }
        else
            {
                return false;
            }
    }

	JsNodeFix.isNull = function(obj, replacement)
    {
        return this.isNullOrUndef(obj) ? replacement : obj;
    }



 if(!String.prototype.toJsonObject)
    {
        String.prototype.toJsonObject = function()
            {
                    return JSON.parse(this);
            }
    }
     if(!String.prototype.toEncodeURL)
    {
        String.prototype.toEncodeURL = function()
            {
                    return encodeURI(this);
            }
    }
    if(!String.prototype.toDecodeURL)
        {
            String.prototype.toDecodeURL = function()
                {
                        return decodeURI(this);
                }
        }

	getCurrentTime = function()
	{
		return (new Date()).toStringTime();
	}

  JsNodeFix.getDateTime = function()
	{
		return (new Date()).toStringTime();
	}

	if(!Date.prototype.toStringTime)
	{
		Date.prototype.toStringTime = function()
		{
			var date = new Date();
			var year = date.getUTCFullYear();
			var month = date.getUTCMonth();
			var day = date.getUTCDate();
			var hours = date.getUTCHours() - 5;
			var min = date.getUTCMinutes();
			var sec = date.getUTCSeconds();
			var strMonth = months[month];
			var strDay = day< 10 ? '0'+day.toString() : day.toString();

			var ampm = hours >= 12 ? 'PM' : 'AM';
			hours = ((hours + 11) % 12 + 1);

			min = (min < 10 ? "0" : "") + min;
			sec = (sec < 10 ? "0" : "") + sec;

			var str = strMonth + "-" + strDay + "-" + year + " " + hours + ":" + min + ":" + sec + " " + ampm;
			return str;
		}
	}

	var months = ['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

	CurrentTimeString  = function()
	  {
	  var date = new Date();
	  var year = date.getUTCFullYear();
	  var month = date.getUTCMonth();
	  var day = date.getUTCDate();
	  var hours = date.getUTCHours();
	  var min = date.getUTCMinutes();
	  var sec = date.getUTCSeconds();

	  var ampm = hours >= 12 ? 'pm' : 'am';
	  hours = ((hours + 11) % 12 + 1);

	  min = (min < 10 ? "0" : "") + min;
	  sec = (sec < 10 ? "0" : "") + sec;


	  var str = month + "/" + day + "/" + year + " " + hours + ":" + min + ":" + sec + " " + ampm;


	  return str;
	  }

  if(!Date.prototype.toStringDate)
  {
	  Date.prototype.toStringDate  = function()
	  {
	  var date = this;
	  var year = date.getUTCFullYear();
	  var month = date.getUTCMonth();
	  var day = date.getUTCDate();
	  var hours = date.getUTCHours();
	  var min = date.getUTCMinutes();
	  var sec = date.getUTCSeconds();

	  var ampm = hours >= 12 ? 'pm' : 'am';
	  hours = ((hours + 11) % 12 + 1);

	  min = (min < 10 ? "0" : "") + min;
	  sec = (sec < 10 ? "0" : "") + sec;


	  var str = month + "/" + day + "/" + year + " " + hours + ":" + min + ":" + sec + " " + ampm;


	  return str;
	  }
  }

 if(!String.prototype.toTimeSpan)
    {
        String.prototype.toTimeSpan  =function(unit)
        {
            unit = isNull(unit,'SEC');
            var tmStr = this;
            var timeSpan = tmStr.split(':').reduce((acc,time) => (60 * acc) + +time);
            if(unit =='SEC')
            {
                return timeSpan;
            }
            if(unit =='MIN')
            {
                return timeSpan / 60;
            }
            if(unit =='HR')
            {
                return timeSpan / (60 *60);
            }

        }
    }
 if(!String.prototype.contains)
    {
        String.prototype.contains  =function(str)
        {
           return this.indexOf(str) > -1;
        }
    }

	if(!console.log2)
    {
        console.log2 = function(msg)
		{
			console.log(JSON.stringify(msg));
		}
    }
	if(!console.logList)
    {
        console.logList = function(lst)
		{
			JsNodeFix.forEach(lst , function (i ,v , a) {console.log(v);}, []);
		}
    }


_defaultvalues = {string : '', object : {}, number : 0}
JsNodeFix.nullSafeProperties = function(obj)
{
    var list = _getProps(obj);
    for(var i = 0; i < list.length; i++ )
        {
            propName = list[i].key;
            ofType = list[i].type;
            var oldValue = obj[propName];
            var newValue = _defaultvalues[ofType];
            obj[propName] = isNull(oldValue, newValue);
        }
}

var _getProps = function(obj)
{
    var keys = [];
    for(var key in obj){
        if( typeof obj[key] !== 'function') {

                keys.push({key:key , type :typeof obj[key]});
            }
    }
    return keys;
}

JsNodeFix.generateGUID = function () {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }

 JsNodeFix.forEach = function(list, callback , args) {
	 for(var e = 0 ; e < list.length; e++)
	 {
		 callback(e, list[e],args);
	 }
 }

 JsNodeFix.Guid = function() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c)
  {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
 }

  JsNodeFix.Clone = function (obj) {
    return cl(obj);

}

	JsNodeFix.getTimeOut = function(pt)
	 {
		if(JsNodeFix.isNullOrUndef(pt))
		{
			return 0;
		}

		var m = 1000;
		if(pt.factor == "s")
		{
				return m*pt.time;
		}
		if(pt.factor == "m")
		{
				return m*60*pt.time;
		}
		if(pt.factor == "h")
		{
				return m*60*60*pt.time;
		}
	 }
JsNodeFix.trackCL = function()
{
  JsNodeFix.ocl = console.log;
  console.log = function(d, data)
  {
      var message = JsNodeFix.getDateTime() + ' ' ;
      if(!JsNodeFix.isNullOrUndef(data))
      {
        message += d + ': '+JSON.stringify(data);
        JsNodeFix.g_log.push(message);
        JsNodeFix.ocl(d,data);
      }
      else
      {
        message += d;
        JsNodeFix.g_log.push(message);
        JsNodeFix.ocl(d);
      }

  };
}
JsNodeFix.flushCL = function()
{
  JsNodeFix.g_log = [];
  JsNodeFix.g_log.push('Console log flushed at ' + JsNodeFix.getDateTime());
}

module.exports = JsNodeFix;
