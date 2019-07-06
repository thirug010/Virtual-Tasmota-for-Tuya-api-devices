"use strict";
var LinqIt = function (arrayList, overridable) {
    var that = [];
    var _CloneArray = function (source) {
        return jQuery.extend(true, {}, source);
    }
    var isArray = function (obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }

    var _ToArray = function (Property) {
        var len = that.length;
        var newObjectArray = [];
        for (var cnt = 0 ; cnt < len ; cnt++) {
            var currentObj = that[cnt];
            var currentObject = currentObj[Property];
            if (typeof (currentObject) != 'undefined') {
                newObjectArray.push(currentObject);
            }
        }
        return newObjectArray;
    }
    var _Indexof = function (ObjectName, Value) {
        var len = that.length;
        var indexFound = -1;
        for (var cnt = 0 ; cnt < len ; cnt++) {
            var currentObj = that[cnt];
            if (Object != null && typeof (Object) != 'undefined') {
                if (currentObj[ObjectName] == Value) {
                    indexFound = cnt;
                    break;
                }
            }
            else {
                if (currentObj == Value) {
                    indexFound = cnt;
                    break;
                }
            }

        }
        return indexFound;
    }
    var _Contains2 = function (ObjectName, Value) {
        var index = _Indexof(ObjectName, Value);
        return index > -1 ? true : false;
    }
    var _Compare = function (a, b, d, c) {
        if (c == true) {
            a = a.toLowerCase();
            b = b.toLowerCase();
        }
        if (d == '==') {
            return a == b;
        }
        else if (d == '!=') {
            return a != b;
        }
    }
    var _Remove = function (ObjectName, Value) {
        var len = that.length;
        var indexFound = -1;
        var arrayList = [];



        for (var cnt = 0 ; cnt < len ; cnt++) {
            var currentObj = that[cnt];
            if (ObjectName != null && typeof (ObjectName) != 'undefined') {
                if (currentObj[ObjectName] == Value) {
                    indexFound = cnt;
                    continue;
                }
            }
            else {
                if (currentObj == Value) {
                    indexFound = cnt;
                    continue;;
                }
            }
            arrayList.push(currentObj);
        }
        return arrayList;
    }
    var _RemoveList = function (list, objectName, value, IgnoreCase) {
        var len = list.length;
        var indexFound = -1;
        var arrayList = [];



        for (var cnt = 0 ; cnt < len ; cnt++) {
            var currentObj = list[cnt];
            if (!IsNullOrUndefined(currentObj[objectName])) {
                if (objectName != null && typeof (objectName) != 'undefined') {
                    if (_Compare(currentObj[objectName], value, '==', IgnoreCase)) {
                        indexFound = cnt;
                        continue;
                    }
                }
                else {
                    if (_Compare(currentObj, value, '==', IgnoreCase)) {
                        indexFound = cnt;
                        continue;
                    }
                }
                arrayList.push(currentObj);
            }
        }
        return arrayList;
    }
    var _Remove2 = function (PropertyName, ValueList, IgnoreCase) {
        var _returnArray = that;
        for (var v = 0; v < ValueList.length; v++) {
            var value = ValueList[v];
            _returnArray = _RemoveList(_returnArray, PropertyName, value, IgnoreCase)
        }
        return _returnArray;
    }
    var _Unique = function (arryList) {
        var _arryList = arryList;
        if (_arryList == null && typeof (_arryList) == 'undefined') {
            _arryList = that;
        }
        var _result = [];

        for (var index = 0; index < _arryList.length; index++) {
            var item = _arryList[index];
            if (!_Contains(item, _result)) {
                _result.push(item);
            }
        }

        return _result;
    }
    var _replace = function (Lists, Options) {
        var that = Lists;
        var _returnArray = [];
        for (var index = 0; index < Lists.length; index++) {
            var objItem = Lists[index];
            for (var opIndex = 0; opIndex < Options.length; opIndex++) {
                var Option = Options[opIndex];

                if (Option.When != null && (Option.When) != 'undefined') {
                    if (objItem[Option.When.PropertyName] == Option.When.PropertyValue) {
                        objItem[Option.PropertyName] = Option.When.OverrideValue;
                    }
                    else {
                        objItem[Option.PropertyName] = objItem[Option.When.PropertyName]
                    }
                }
                else {
                    objItem[Option.PropertyName] = Option.PropertyValue;
                }
            }
            _returnArray.push(objItem);
        }
        return _returnArray;
    }
    var _DistArray = function (Property, ProcessIt) {
        var array;
        var result;
        if (!IsNullOrUndefined(ProcessIt)) {
            array = _ToArray(Property);
            for (var r = 0; r < array.length ; r++) {
                var currentItem = array[r];
                var processedItem = ProcessIt(currentItem);
                array[r] = processedItem;
            }
            result = _Unique(array);
        }
        else {
            array = _ToArray(Property);
            result = _Unique(array);
        }
        return result;
    }

    var _Clone = function (source) {
        var newobject = {};
        for (var prop in source) {
            newobject[prop] = source[prop];
        }
        return newobject;
    }
    var _StringToList = function (String, Delimiter, PropertyList) {
        var objItem = {};
        var objArrayList = [];
        var array = String.split(Delimiter);
        for (var index = 0; index < array.length; index++) {
            objItem = {};

            var strItem = array[index];
            if (strItem !== '') {
                if (typeof (PropertyList) != 'undefined') {
                    for (var j = 0; j < PropertyList.length ; j++) {
                        var objPropName = PropertyList[j];
                        objItem[objPropName] = array[index];
                        index = index + j
                    }
                }
                else {
                    objItem = array[index];
                }
                objArrayList.push(objItem);
            }
        }
        return objArrayList;
    }
    var _CloneNewObject = function (Source, Properties) {
        var newObject = {};
        //Properties = Properties.reverse();
        for (var propcnt = 0 ; propcnt < Properties.length; propcnt++) {
            var prop = Properties[propcnt];
            newObject[prop] = Source[prop];;
        }
        return newObject;
    }
    var _CloneNewObject2 = function (Source, Properties) {
        var newObject = {};
        //Properties = Properties.reverse();
        for (var propcnt = 0 ; propcnt < Properties.length; propcnt++) {
            var prop = Properties[propcnt];
            newObject[prop.AliasName] = Source[prop.OrginalName];;
        }
        return newObject;
    }
    var _Contains = function (item, theArray, ignoreCase) {
        if (typeof (theArray) == 'undefined') {
            theArray = _CloneArray(that);
        }
        if (!IsNullOrUndefined(ignoreCase) && ignoreCase == true) {
            for (var i = 0 ; i < theArray.length; i++) {
                theArray[i] = theArray[i].toLowerCase();
            }
            return ($.inArray(item.toLowerCase(), theArray) > -1);
        }
        return ($.inArray(item, theArray) > -1);
    }
    var _Contains3 = function (item, propertyList) {
        var theArray = that;
        for (var i = 0 ; i < theArray.length; i++) {
            var currentItem = theArray[i];
            var matchCount = 0;
            for (var j = 0 ; j < propertyList.length; j++) {
                var property = propertyList[j];
                if (currentItem[property] == item[property]) {
                    matchCount++;
                }
            }
            if (matchCount == j) {
                return true;
            }
        }
        return false;
    }
	
	var _Contains4 = function (theArray2, item, propertyList) 
	{
        for (var i = 0 ; i < theArray2.length; i++) {
            var currentItem = theArray2[i];
            var matchCount = 0;
            for (var j = 0 ; j < propertyList.length; j++) {
                var property = propertyList[j];
                if (!IsNullOrUndefined(currentItem[property]) && !IsNullOrUndefined(item[property]) && (currentItem[property] == item[property])) {
                    matchCount++;
                }
            }
            if (matchCount > 0 && matchCount == j) {
                return true;
            }
        }
        return false;
    }
    var _Append = function (List, Compare) {
        var objArrayList = that;
        if (objArrayList == null || objArrayList == undefined || typeof (objArrayList) == 'undefined') {
            objArrayList = [];
        }

        for (var index = 0; index < List.length; ++index) {
            var currentItem = List[index];

            if (Compare != null && typeof (Compare) != 'undefined') {
                var newItem = currentItem[Compare.PropertyName];
                var item = _where(that, Compare.PropertyName, newItem);

                if (item != null && item.length > 0) {
                    continue;
                }
                else {
                    objArrayList.push(List[index]);
                }

            }

            else if (!_Contains(currentItem, objArrayList)) {
                objArrayList.push(List[index]);
            }
        }
        var _self = new LinqIt(objArrayList, overridable);
        return _self;
    }
    var IsNullOrUndefined = function (object) {
        var returnValue = false;
        if (object == null || object == undefined || typeof (object) == 'undefined') {
            returnValue = true;
        }
        return returnValue;
    }
    var IsNullOrUndefinedOrEmptyList = function (object) {
        var returnValue = false;
        if (object == null || object == undefined || typeof (object) == 'undefined' || object.length <= 0) {
            returnValue = true;
        }
        return returnValue;
    }
    var source = arrayList;
    var _TranslateArray = function (Properties) {

        var ColumnList = [];
        var dataList = [];
        for (var propcnt = 0 ; propcnt < Properties.length; propcnt++) {
            var propName = Properties[propcnt];
            ColumnList.push({ OrginalName: propcnt, AliasName: propName });
        }

        for (var dataCnt = 0 ; dataCnt < that.length; dataCnt++) {
            var data = that[dataCnt];
            var newObject = _CloneNewObject2(data, ColumnList);
            dataList.push(newObject);
        }
        return dataList;
    }
    var _AddRowIndex = function (PropertyName, offset) {
        var objItem = {};
        var objArrayList = [];
        if (typeof (offset) == 'undefined') {
            offset = 0;
        }
        for (var index = 0; index < that.length; index++) {
            objItem = that[index];
            if (typeof (PropertyName) == 'undefined') {
                PropertyName = 'RowIndex';
            }
            objItem[PropertyName] = index + offset;
            objArrayList.push(objItem);
        }
        return objArrayList;
    }

    var _InsertAt = function (data, position) {
        var arrayList = that;
        var returnList = [];
        if (IsNullOrUndefined(position.PropertyName)) {
            var index = 0;
            for (var i = 0; i < arrayList.length ; i++) {
                var currentData = arrayList[i + index];
                if (i == position) {
                    returnList.push(data);
                    index = 1;
                    returnList.push(currentData);
                }
                else {
                    returnList.push(currentData);
                }
            }
        }
        else //if (!IsNullOrUndefined(position.PropertyName))
        {
            var index = 0;
            var referenceData = position.PropertyValue;
            var ProperyName = position.PropertyName;
            var insert = position.Before == true ? -1 : 1;

            for (var i = 0; i < arrayList.length ; i++) {
                var currentData = arrayList[i + index];

                if (currentData[ProperyName] == referenceData) {
                    returnList.push(data);
                    index = insert;
                    returnList.push(currentData);
                }
                else {
                    returnList.push(currentData);
                }
            }


        }
        return LinqIt(returnList);
    }

    var _ApplytoAll = function (ArrayList, ValueCollection) {
        var objItem = {};
        var objArrayList = [];
        if (ArrayList == null || ArrayList == undefined || typeof (ArrayList) == 'undefined') {
            ArrayList = [];
            return ArrayList;
        }
        var valueListCount = ValueCollection.length;
        for (var index = 0; index < ArrayList.length; index++) {
            var objItem = ArrayList[index];
            for (var valCount = 0 ; valCount < valueListCount; valCount++) {
                var val = ValueCollection[valCount];
                var PropertyName = val.PropertyName;
                var PropertyValue = val.PropertyValue;
                objItem[PropertyName] = PropertyValue;
            }
            objArrayList.push(objItem);
        }
        return objArrayList;
    }

    var _ApplytoAll2 = function (ArrayList, ValueCollection) {
        var objItem = {};
        var objArrayList = [];
        if (ArrayList == null || ArrayList == undefined || typeof (ArrayList) == 'undefined') {
            ArrayList = [];
            return ArrayList;
        }
        var valueListCount = ValueCollection.length;
        for (var index = 0; index < ArrayList.length; index++) {
            var objItem = ArrayList[index];
            for (var valCount = 0 ; valCount < valueListCount; valCount++) {
                var val = ValueCollection[valCount];
                var PropertyName = val.PropertyName;
                var PropertyValue = null;
                if (!IsNullOrUndefined(val.ProcessIt)) {
                    PropertyValue = val.ProcessIt(objItem);
                }
                else {
                    PropertyValue = val.PropertyValue;
                }
                objItem[PropertyName] = PropertyValue;
            }
            objArrayList.push(objItem);
        }
        return objArrayList;
    }
	var _ApplytoAll3 = function (ValueCollection) {
        var objItem = {};
        var objArrayList = [];        
        var valueListCount = ValueCollection.length;
        for (var index = 0; index < that.length; index++) {
            var objItem = that[index];
            for (var valCount = 0 ; valCount < valueListCount; valCount++) {
                var val = ValueCollection[valCount];
                var PropertyName = val.PropertyName;
                var PropertyValue = null;
                if (!IsNullOrUndefined(val.ProcessIt)) {
                    PropertyValue = val.ProcessIt(objItem);
                }
                else {
                    PropertyValue = _Clone(val.PropertyValue);
                }
                objItem[PropertyName] = PropertyValue;
            }

        }
        var _self = new LinqIt(that, overridable);
        return _self;
    }

    var thatList = _CloneArray(arrayList);

    if (overridable != undefined && typeof (overridable) != 'undefined' && overridable) {
        thatList = arrayList;
        that = thatList;
    }
    else {
        if (arrayList != undefined) {
            var thatListLength = arrayList.length;

            for (var lst = 0; lst < thatListLength ; lst++) {
                that.push(thatList[lst]);
            }
        }
        else {
            thatList = [];
            that = [];
        }
    }

    var _whereListofList = function (List, PropName, Values) {
        var returnList = [];
        var r = $.grep(Values, function (Value) {
            return $.grep(List, function (item) {
                if ($.inArray(Value, item[PropName]) > -1) { returnList.push(item) };
            });
        });
        return returnList;
    }

    var _whereList = function (List, PropName, Values) {
        var returnList = [];
        var r = $.grep(Values, function (Value) {

            return _where(List, PropName, Value);
        });
        return returnList;
    }

    var _where = function (List, PropName, Value) {

        if (typeof (PropName) === 'undefined' || PropName == null) {
            var returnList = $.grep(List, function (item) {
                return item == Value;
            });
            return returnList;
        }


        var returnList = $.grep(List, function (item) {
            return item[PropName] == Value;
        });
        return returnList;
    }

    var _whereLike = function (List, properName, propertyLike, ignoreCase) {
        var returnList = $.grep(List, function (item) {
            if (ignoreCase) {
                return item[properName].toLowerCase().indexOf(propertyLike.toLowerCase()) > -1;
            }
            else {
                return item[properName].indexOf(propertyLike) > -1;
            }
        });
        return returnList;
    }

    var _whereProcess = function (List, PropMethod, Value, IsExternalMethod) {
        var returnList = [];
        if (IsExternalMethod) {
            returnList = $.grep(List, function (item) {
                return PropMethod(item) == Value;
            });
        }
        else {
            returnList = $.grep(List, function (item) {
                return item[PropMethod]() == Value;
            });
        }
        return returnList;
    }

    var _whereOr = function (List, PropName, Values) {
        var returnList = $.grep(List, function (item) {
            return (_simplewhere(Values, item[PropName]));
        });
        return returnList;
    }

    var _whereIntheList = function (SourceList, PropName, ValueList) {
        var returnList = $.grep(SourceList, function (item) {
            return ($.inArray(item[PropName], ValueList) > -1)
        });
        return returnList;
    }
    var _whereNot = function (List, PropName, Value) {

        if (typeof (PropName) === 'undefined' || PropName == null) {
            var returnList = $.grep(List, function (item) {
                return item != Value;
            });
            return returnList;
        }

        var returnList = $.grep(List, function (item) {
            return item[PropName] != Value;
        });
        return returnList;
    }

    var _simplewhereNot = function (List, Value) {
        var returnList = $.grep(List, function (item) {
            return item != Value;
        });
        return returnList.length > 0;
    }
    var _simplewhere = function (List, Value) {
        var returnList = $.grep(List, function (item) {
            return item == Value;
        });
        return returnList.length > 0;
    }

    var _whereEach = function (List, PropertyName, PropertyValue) {
        var returnList = $.grep(List, function (item) {
            return item[PropertyName].indexOf(PropertyValue) > -1;
        });
        return returnList;
    }

    var _ToSort = function (Column) {
        if (typeof (Column) === 'undefined')
        { return that }
        else
        {
            return that.sort(function (a, b) {
                return (a[Column] < b[Column] ? -1 : a[Column] == b[Column] ? 0 : 1);
            });
        }
    }

    var _ToSort2 = function (sortList) {

        if (!isArray(sortList)) {
            return _toSortSingle(sortList)

        }
        else {
            return that.sort(_toSortMultiple(sortList));
        }
    }
    var _toSortSingle = function (column) {
        if (typeof (Column) === 'undefined')
        { return that }
        else
        {

            return that.sort(function (a, b) {
                return (a[Column] < b[Column] ? -1 : a[Column] == b[Column] ? 0 : 1);
            });
        }
    }
    var _dynamicSort = function (property, ascending) {
        return function (obj1, obj2) {
            ascending = isNull(ascending, 'true');

            var returnValue = 0;

            if (ascending.toLowerCase() == 'true') {
                returnValue = (obj1[property] > obj2[property]) ? 1 : (obj1[property] == obj2[property]) ? 0 : -1;
            }
            else {
                returnValue = (obj1[property] > obj2[property]) ? -1 : (obj1[property] == obj2[property]) ? 0 : 1;
            }

            return returnValue;
        }
    };
    var _toSortMultiple = function (sortList) {
        var sortInfo = {};
        return function (obj1, obj2) {
            for (var i = 0 ; i < sortList.length ; i++) {
                sortInfo = sortList[i];

                result = _dynamicSort(sortInfo.PropertyName, sortInfo.Ascending)(obj1, obj2);
            }
            return result;
        }
    };
    return {
        Append: _Append,
        StringToList: _StringToList,
        CloneArray: _CloneArray,
        Clone: _Clone,
        Contains: _Contains,
        Contains2: _Contains2,
        Contains3: _Contains3,
        ToList: function (Properties) {
            if (typeof (Properties) === 'undefined')
            { return that }
            else
            {
                var len = that.length;
                var newObjectArray = [];
                for (var cnt = 0 ; cnt < len ; cnt++) {
                    var currentObj = that[cnt];
                    var newObject = _CloneNewObject(currentObj, Properties);

                    newObjectArray.push(newObject);
                }
                return newObjectArray;
            }
        },
		ToUList: function (UniqueList) {
                var len = that.length;
                var newObjectArray = [];
                for (var cnt = 0 ; cnt < len ; cnt++) 
				{
                    var currentObj = that[cnt];
					if(!_Contains4(newObjectArray, currentObj, UniqueList))
					{
						newObjectArray.push(currentObj);
					}
                }
                return newObjectArray;
        },
        ToSort: _ToSort,
        SortBy: function (Column) {
            return new LinqIt(_ToSort2(Column), overridable);
        },
        ToArray: _ToArray,
        Where: function (PropName, Value, ignoreCase) {
            var returnList = [];
            if (ignoreCase) {
                if (typeof (PropName) == 'undefined' && PropName == undefined) {
                    returnList = $.grep(that, function (item) {
                        return item.toLowerCase() == Value.toLowerCase();
                    });
                    var _self = new LinqIt(returnList, overridable);
                    return _self;
                }

                var returnList = $.grep(that, function (item) {
                    return item[PropName] != null ? item[PropName].toLowerCase() == Value.toLowerCase() : true;
                });
                var _self = new LinqIt(returnList, overridable);
                return _self;
            }
            // single dimension array--> no property name 
            if (typeof (PropName) == 'undefined' && PropName == undefined) {
                returnList = $.grep(that, function (item) {
                    return item == Value;
                });
                var _self = new LinqIt(returnList, overridable);
                return _self;
            }

            returnList = $.grep(that, function (item) {
                return item[PropName] == Value;
            });
            var _self = new LinqIt(returnList, overridable);
            return _self;
        },
        Where2: function (Conditions) {
            var resultList = source;
            for (var i = 0 ; i < Conditions.length ; i++) {
                var currentWhere = Conditions[i];
                var propName = currentWhere.PropertyName;
                var propValue = currentWhere.PropertyValue;

                if (!IsNullOrUndefined(currentWhere.PropertyIsList) && !IsNullOrUndefined(currentWhere.ValueIsList)) {
                    resultList = _whereListofList(resultList, propName, propValue);
                }

                if (!IsNullOrUndefined(currentWhere.ValueIsList)) {
                    resultList = _whereList(resultList, propName, propValue);
                }

                if (typeof (currentWhere.PropertyMethod) != 'undefined' && currentWhere.PropertyMethod != undefined) {
                    resultList = _whereProcess(resultList, currentWhere.PropertyMethod, propValue, false);
                }
                else if (!IsNullOrUndefined(currentWhere.ProcessIt)) {
                    resultList = _whereProcess(resultList, currentWhere.ProcessIt, propValue, true);
                }
                else if (typeof (currentWhere.PropertyLike) != 'undefined' && currentWhere.PropertyLike != undefined) {
                    resultList = _whereLike(resultList, currentWhere.PropertyName, currentWhere.PropertyLike, true);
                }
                else if (!IsNullOrUndefined(currentWhere.InTheList)) {
                    resultList = _whereIntheList(resultList, propName, currentWhere.InTheList);
                }
                else if (typeof (currentWhere.OrValues) != 'undefined' && currentWhere.OrValues != undefined) {
                    resultList = _whereOr(resultList, propName, currentWhere.OrValues);
                }
                else if (typeof (currentWhere.PropertyIsList) != 'undefined' && currentWhere.PropertyIsList != undefined && currentWhere.PropertyIsList == true) {
                    resultList = _whereEach(resultList, propName, propValue);
                }
                else if (typeof (currentWhere.Not) != 'undefined') {
                    resultList = _whereNot(resultList, propName, propValue);
                }
                else {
                    resultList = _where(resultList, propName, propValue);
                }
            }

            var _self = new LinqIt(resultList, overridable);
            return _self;
        },
        Join: function (Jwith) {
            //
            //console.log(that);
            var returnList = [];
            var len = that.length;
            for (var cnt = 0; cnt < len ; cnt++) {
                var mainList = that[cnt];
                //console.log(mainList);  
                for (var i = 0; i < Jwith.length; i++) {
                    var jn = Jwith[i];
                    var joinMatch = '';
                    var LinqResult = {};

                    LinqResult = mainList;
                    var propertyName = jn.Property;
                    var propertyValue = mainList[propertyName];
                    var listData = jn.List;
                    var joinOverride = jn.JoinOverride;
                    //console.log(propertyName);
                    //console.log(propertyValue);
                    //console.log(listData);
                    var lnglistData = new LinqIt(listData, overridable);
                    joinMatch = lnglistData.Where(propertyName, propertyValue).ToList()[0];
                    //console.log(joinMatch);            
                    for (var prop in joinMatch) {
                        if (prop in LinqResult) {
                            if (_Contains(prop, joinOverride)) {
                                LinqResult[prop] = joinMatch[prop];
                            }
                            else {
                                continue;
                            }
                        }
                        LinqResult[prop] = joinMatch[prop];
                    }
                }
                //console.log(LinqResult); 
                returnList.push(LinqResult);
            }
            var _self = new LinqIt(returnList, overridable);
            return _self;
        },
        Join2: function (options) {
            //
            //console.log(that);
            var returnList = [];
            var len = that.length;
            var joinList = options.JoinList;
            var joinType = options.JoinType;
            var joinOn = options.JoinOn;
            var joinOverrideColumns = options.JoinOverrideColumns;
            var leftJoinColumns = options.LeftJoinColumns;
            for (var cnt = 0; cnt < len ; cnt++) {
                var mainList = that[cnt];
                var currentIem = that[cnt];
                //console.log(mainList);  

                // Prepare Where from onList;
                var jWhere = [];
                for (var jol = 0; jol < joinOn.length; jol++) {
                    var jcurrentPropertyName = joinOn[jol];
                    var currentItemPropertyValue = currentIem[jcurrentPropertyName]; // Current Item from MainList [ join Property Name]

                    var whr = { PropertyName: jcurrentPropertyName, PropertyValue: currentItemPropertyValue }
                    jWhere.push(whr);
                }

                var jMatchList = LinqIt(joinList).Where2(jWhere).FirstOrDefault();

                //Over the main
                if (joinType.toLowerCase() == "left") {
                    if (IsNullOrUndefined(jMatchList)) {
                        jMatchList = currentIem;
                    }
                }
                if (!IsNullOrUndefinedOrEmptyList(joinOverrideColumns)) {

                    for (var oc = 0 ; oc < joinOverrideColumns.length ; oc++) {
                        var overrideColumn = joinOverrideColumns[oc];
                        currentIem[overrideColumn] = jMatchList[overrideColumn];
                    }
                    returnList.push(currentIem);
                }
                else {
                    returnList.push(currentIem);
                }
                if (!IsNullOrUndefinedOrEmptyList(leftJoinColumns)) {

                    for (var jc = 0 ; jc < leftJoinColumns.length ; jc++) {
                        var leftJoinColumn = leftJoinColumns[jc];
                        if (!IsNullOrUndefinedOrEmptyList(jMatchList) && !IsNullOrUndefined(jMatchList[leftJoinColumn])) {
                            currentIem[leftJoinColumn] = jMatchList[leftJoinColumn];
                        }
                        else {
                            currentIem[leftJoinColumn] = null;
                        }
                    }
                }
            }

            var _self = new LinqIt(returnList, overridable);
            return _self;
        },
        JoinSP: function (table, options) {
            //
            //console.log(that);
            var returnList = [];
            var len = that.length;
            var joinList = table;
            var joinType = options.JoinType;
            var joinOn = options.JoinOn;
            var joinOverrideColumns = options.JoinOverrideColumns;
            var leftJoinColumns = options.LeftJoinColumns;
            for (var cnt = 0; cnt < len ; cnt++) {
                var mainList = that[cnt];
                var currentIem = that[cnt];
                //console.log(mainList);  

                // Prepare Where from onList;
                var jWhere = [];
                for (var jol = 0; jol < joinOn.length; jol++) {
                    var jcurrentPropertyName = joinOn[jol];
                    var currentItemPropertyValue = currentIem[jcurrentPropertyName]; // Current Item from MainList [ join Property Name]

                    var whr = { PropertyName: jcurrentPropertyName, PropertyValue: currentItemPropertyValue }
                    jWhere.push(whr);
                }

                var jMatchList = LinqIt(joinList).Where2(jWhere).FirstOrDefault();

                //Over the main
                if (joinType == "left") {
                    if (IsNullOrUndefined(jMatchList)) {
                        jMatchList = currentIem;
                    }
                }

                if (!IsNullOrUndefinedOrEmptyList(jMatchList)) {
                    // First Join Tables columns
                    if (!IsNullOrUndefinedOrEmptyList(leftJoinColumns)) {
                        for (var jc = 0 ; jc < leftJoinColumns.length ; jc++) {
                            var leftJoinColumn = leftJoinColumns[jc];
                            if (!IsNullOrUndefinedOrEmptyList(jMatchList) && !IsNullOrUndefined(jMatchList[leftJoinColumn])) {
                                currentIem[leftJoinColumn] = jMatchList[leftJoinColumn];
                            }
                            else {
                                currentIem[leftJoinColumn] = null;
                            }
                        }
                    }
                    returnList.push(currentIem);
                }
            }

            var _self = new LinqIt(returnList, overridable);
            return _self;
        },
        Select: function (Properties) {
            var returnList = [];
            var len = that.length;

            for (var cnt = 0; cnt < len ; cnt++) {
                var mainList = that[cnt];
                var ObjectReturn = {};
                //console.log(Properties.length); 
                for (var propcnt = 0 ; propcnt < Properties.length; propcnt++) {
                    var prop = Properties[propcnt];

                    if (typeof (prop.When) !== 'undefined') {
                        var when = prop.When;
                        if (mainList[when.FieldName] != when.FieldValue) {
                            continue;
                        }
                    }

                    if (typeof (prop.AliasName) != 'undefined') {
                        ObjectReturn[prop.AliasName] = mainList[prop.OrginalName];
                    }
                    else {
                        //console.log(prop);
                        ObjectReturn[prop] = mainList[prop];
                    }
                    //console.log(ObjectReturn);
                }
                returnList.push(ObjectReturn);
            }
            var _self = new LinqIt(returnList, overridable);
            return _self;
        },
        Select2: function (Properties) {
            var returnList = [];
            var len = that.length;

            for (var cnt = 0; cnt < len ; cnt++) {
                var mainList = that[cnt];
                var ObjectReturn = {};
                //console.log(Properties.length); 
                for (var propcnt = 0 ; propcnt < Properties.length; propcnt++) {
                    var prop = Properties[propcnt];

                    if (prop.ProcessIt != null && prop.ProcessIt != undefined) {
                        var objValue;
                        if (!IsNullOrUndefined(prop.OrginalName)) {
                            objValue = mainList[prop.OrginalName];
                        }
                        else {
                            objValue = mainList
                        }
                        var processedValue = prop.ProcessIt(objValue);
                        ObjectReturn[prop.AliasName] = processedValue;
                        continue;
                    }

                    if (prop.PropertyMethod != null && prop.PropertyMethod != undefined) {
                        var processedValue = mainList[prop.PropertyMethod]();
                        ObjectReturn[prop.AliasName] = processedValue;
                        continue;
                    }

                    if (typeof (prop.When) !== 'undefined') {
                        var when = prop.When;
                        if (mainList[when.FieldName] != when.FieldValue) {
                            continue;
                        }
                    }


                    if (typeof (prop.AliasName) != 'undefined') {
                        ObjectReturn[prop.AliasName] = mainList[prop.OrginalName];
                    }
                    else {
                        var objValue = mainList[prop];
                        if (typeof (objValue) != 'undefined') {
                            ObjectReturn[prop] = mainList[prop];
                        }
                        else {
                            ObjectReturn[prop] = null;
                        }
                    }
                    //console.log(ObjectReturn);
                }
                returnList.push(ObjectReturn);
            }
            var _self = new LinqIt(returnList, overridable);
            return _self;
        },
        SelectSP: function (Properties) {
            var returnList = [];
            var len = that.length;

            for (var cnt = 0; cnt < len ; cnt++) {
                var mainList = that[cnt];
                var ObjectReturn = {};
                //console.log(Properties.length);

                if (!isArray(Properties)) {
                    // Index array to Class with alais Name 
                    if (typeof (Properties.OrginalName) !== 'undefined' && Properties.OrginalName.toLowerCase() == '<indexed>') {
                        ObjectReturn[Properties.AliasName] = mainList;
                    }
                }
                else {
                    for (var propcnt = 0 ; propcnt < Properties.length; propcnt++) {
                        var prop = Properties[propcnt];

                        if (prop.ProcessIt != null && prop.ProcessIt != undefined) {
                            if (!isNullOrUndefined(prop.OrginalName)) {
                                var objValue = mainList[prop.OrginalName];
                                var processedValue = prop.ProcessIt(objValue);
                                ObjectReturn[prop.AliasName] = processedValue;
                            }
                            else {
                                var objValue = mainList;
                                var processedValue = prop.ProcessIt(objValue);
                                ObjectReturn[prop.AliasName] = processedValue;
                            }
                            continue;
                        }
                        if (typeof (prop.When) !== 'undefined') {
                            var when = prop.When;
                            if (mainList[when.FieldName] != when.FieldValue) {
                                continue;
                            }
                        }
                        if (typeof (prop.AliasName) != 'undefined') {
                            ObjectReturn[prop.AliasName] = mainList[prop.OrginalName];
                        }
                        else {
                            var objValue = mainList[prop];
                            if (typeof (objValue) != 'undefined') {
                                ObjectReturn[prop] = mainList[prop];
                            }
                            else {
                                ObjectReturn[prop] = null;
                            }
                        }
                    }
                }
                returnList.push(ObjectReturn);
            }
            var _self = new LinqIt(returnList, overridable);
            return _self;
        },
        SmartObject: _CloneNewObject,
        TranslateArray: _TranslateArray,
        AddRowIndex: _AddRowIndex,
        ApplytoAll: _ApplytoAll,
        ApplytoAll2: _ApplytoAll2,
		ApplytoAll3:_ApplytoAll3,
        FirstOrDefault: function () {
            var item = that[0];
            return item;
        },
        Unique: _Unique,
        DistArray: _DistArray,
        Replace: _replace,
        Indexof: _Indexof,
        Remove: _Remove,
        Remove2: _Remove2,
        ItemHasProperty: function (PropertyName) {
            var returnList = [];
            var len = that.length;
            for (var cnt = 0; cnt < len ; cnt++) {
                var objectCurrent = that[cnt];
                if (typeof (objectCurrent[PropertyName]) != 'undefined' && objectCurrent[PropertyName] != undefined) {
                    returnList.push(objectCurrent);
                }
            }
            return returnList;
        },
        InsertAt: _InsertAt,
        DoForEach : function(Properties)
        {
            var returnList = [];
            var len = that.length;

            for (var cnt = 0; cnt < len ; cnt++) 
            {
                var currentItem = that[cnt];
                for(var j =0 ; j < Properties.length; j++)
                    {
                        var prop = Properties[j];
                        if(typeof (prop['ProcessIt']) != 'undefined' && prop['ProcessIt'] != undefined)
                            {
                                var ProcessIt = prop['ProcessIt'];
                                if(typeof (prop['Args']) != 'undefined' && prop['Args'] != undefined)
                                {
                                    var Args = prop['Args']; 
                                    ProcessIt(currentItem,Args);
                                }
                                else
                                {
                                    ProcessIt(currentItem,[]);
                                }
                            }
                    }
            }
        }
    }
}

// used in LinqIt Js
