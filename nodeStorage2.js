var nodeStorage2 ={};
var Storage = require('node-storage');
var store = {};
nodeStorage2.init = function(pathTo)
{
	store = new Storage(pathTo);
}

nodeStorage2.getItemSync = function(key)
{
	return store.get(key);
}

nodeStorage2.AppendData = function(key,value)
{
	var val = this.getItemSync(key);
	if(val!= undefined && ! (val.indexOf(value) > -1))
	{
		val = val + '#;' +(value);
	}
	else if(val == undefined || val == '')
	{
		val = value;
	}
	this.setItemSync(key,val);
	console.log(val);
}


nodeStorage2.setItemSync = function(key, value)
{
	store.put(key , value);
}

nodeStorage2.removeItem = function(key)
{
	store.remove(key);
}

module.exports = nodeStorage2;
