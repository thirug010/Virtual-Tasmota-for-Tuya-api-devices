var njDB = require('./nodeStorage2.js');
njDB.init('Tuya-Api-Tasmota.rs');
Utility = {};

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
	  console.log('njDB.pushItem');
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
			console.log('####################################333344(' +k + '): ', oldItem[k]);
		}
		  console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^3454items : ', items);
		return njDB.setItemSync(key, items);
}

console.log(njDB.getItem('deviceConfig')[2]);