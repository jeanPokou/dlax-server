 var spawn = require('child_process').spawn;
var util = require('util');
var events = require('async-node-events');
var trailingNewline = require('trailing-newline');
var Q = require('q');

// get all drivers

var apiExe = spawn('./dataLayer/dataRequestModule.exe',
[]);

function  DriversApi() {
  events.call(this);
  var self = this;
  self.driversList = [] ;
  self.dataStreamed = '';
  // self.dbPath = 't:/tdsm_Wdistech/dbf/driver.dbf~Driver~';
  self.dbPath = 'c:/tdsm_W/dbf/driver.dbf~Driver~';

  // listener for spawn  data event
  apiExe.stdout.on('data',function(data) {

    self.dataStreamed += data.toString('utf-8');

    if (trailingNewline(data.toString('utf-8'))) {
      var header = self.dataStreamed.split('~')[0];
      var response = self.dataStreamed.split('~')[1];
      if (header === 'getDrivers') {
        self.emit('driversLoaded',response);
      }
      if (header === 'getMissingLogs') {
        console.log('emiting missingsLogs');
        self.emit('missingsLogLoaded',response);
      }

    }

  });

  self.on('missingsLogLoaded',function(data) {
      console.log('in missingsLogLoaded');
      var dl = document.querySelector('driver-profile');
      console.log(dl);
      var temp = JSON.parse(data.toString('utf-8'));
      dl.$.mlogs.set('data',temp);
      dl.missingLogsCount = -1 * temp.length;
      //   dl.$.logsmlogs=JSON.parse(data.toString('utf-8');
      //   ml.set('data',mlogs));
      //console.log(data);
      self.dataStreamed = '';
    });

}
util.inherits(DriversApi,events);

DriversApi.prototype.loadDrivers = function(path) {
  // return if path is empty
  this.dataStreamed = '';
  if (path === '') {
    return ;
  }

  if (util.isNullOrUndefined(path)) {
    path = this.dbPath + 'getDrivers\n';
  } else {
    path = path + 'getDrivers\n';
  }

  apiExe.stdin.write(path);
};

DriversApi.prototype.greet = function() {
  console.log('hello');
};

DriversApi.prototype.editDriver = function(id, data) {
  this.dataStreamed = '';
  var arr = [];
  arr.push(data);
  console.log(JSON.stringify(arr));
  if (util.isArray(arr)) {
    console.log('in edit');
    var args = this.dbPath + 'editDriver~' + id + '~' +
     JSON.stringify(arr) + '\n';
    apiExe.stdin.write(args);

  }
};
DriversApi.prototype.getMissingLogs = function(id) {
  this.dataStreamed = '';
  var  args = this.dbPath + 'getMissingLogs~' + id + '\n';
  apiExe.stdin.write(args);

};

module.exports = new  DriversApi() ;
