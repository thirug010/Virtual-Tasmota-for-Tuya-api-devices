var inquirer = require('inquirer');
var n$ = require('./JsNodeFix.js');
var util = require('./Utility.js');

const chalk = require("chalk");
const figlet = require("figlet");

  console.log(
    chalk.green(
      figlet.textSync("Virtual  Tasmota  CLI", {
        font: "big",
        horizontalLayout: "default",
        verticalLayout: "default"
      })
    )
  );
var questions = [
  {
    type: 'input',
    name: 'devId',
    message: 'Device Id:'
  },
  {
    type: 'input',
    name: 'localKey',
    message: 'Local Key:'
  },
  {
    type: 'input',
    name: 'localKey',
    message: 'Node ID:'
  },
  {
    type: 'input',
    name: 'localKey',
    message: 'Firendly Name:'
  },
  {
    type: 'list',
    name: 'deviceType',
    message: 'Device Type:',
    choices: [{name: 'Tuya Dimmer',value: 'tuya_dimmer'},{name: 'Tuya Fan Switch',value: 'tuya_switch_fan'},{name: 'Tuya Swtich 1 CH',value: 'tuya_switch_ch1'},{name: 'Tuya Swtich 2 CH', value: 'tuya_switch_ch2'},{name: 'Tuya Swtich 3 CH', value: 'tuya_switch_ch3'},{name: 'Tuya Swtich 4 CH', value: 'tuya_switch_ch4'}],
    filter: function(val)
	{
      return val.toLowerCase();
    }
  },
  {
    type: 'input',
    name: 'telePeriod.time',
    message: 'TelePeriod (Time):',
	default:'15',
    validate: function(value)
	{
      var valid = !isNaN(parseFloat(value));
      return valid || 'Please enter a number';
    },
    filter: Number
  },
  {
    type: 'list',
    name: 'telePeriod.factor',
    message: 'TelePeriod (factor):',
    choices: [{value: 's', name :'Sec'}, {value: 'm', name :'Min'}, {value: 'h', name :'Hour'}, {value: 'n', name :'None'}],
    filter: function(val)
	{
      return val.toLowerCase();
    }
  },
  {
	type: 'confirm',
    name: 'setOption',
    message: 'Home Assistant (SetOption19)',
    default:false
  },
  {
    type: 'list',
    name: 'topic',
    message: 'Mqtt Topic:',
    choices: [{value: 'nodeId', name :'Node ID (default)'}, {value: 'devId', name :'Device ID'}, {value: 'key', name :'Local Key'}, {value: 'friendlyName', name :'Friendly Name'}],
    filter: function(val)
	{
      return val.toLowerCase();
    }
  },
  {
	type: 'confirm',
    name: 'ready',
    message: 'Are you sure to added New Device ?',
    default:true
  }
];
console.log('test');
inquirer.prompt(questions).then(answers => {

  console.log("req :" , {query: {dev: JSON.stringify(answers)}});
  //var req = JSON.stringify({query: {dev : answers}});
  //console.log('Device Infromation: ' + req);
  //util.addNewTasmotaDev(req);
  console.log('Device Added Successfully !!!!');
});
/*
var dev = n$.LinqIt(util.deviceTypes).Where([{PropertyName:'devId', ProvertyValue:answers.devId}, {PropertyName:'localKey', ProvertyValue:answers.localKey}]).FirstOrDefault();

console.log(dev);

var questions2 = [
  {
    type: 'input',
    name: 'devId',
    message: 'do you wanDevice Id:'
  },
  {
    type: 'input',
    name: 'localKey',
    message: 'Local Key:'
  },
    {
    type: 'input',
    name: 'localKey',
    message: 'Node ID:'
  }
 ];

inquirer.prompt(questions2).then(answers => {
  console.log('\Device Infromation:');
  console.log(JSON.stringify(answers, null, '  '));
});
*/
