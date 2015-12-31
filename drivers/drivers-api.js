var express = require('express');
var router = express.Router();
var driversApi = require('./drivers.js');

function _getDrivers(req, res, next) {
  var path = driversApi.dbPath;
  driversApi.loadDrivers(path);
  driversApi.once('driversLoaded',function(data) {
    var driversList = data.toString('utf-8');
    req.data = driversList;
    next();
  });

}

router.get('/',_getDrivers, function(req, res) {
  res.send(req.data);
});
router.post('/:driverId',_getDrivers, function(req, res) {
  console.log(req.params.driverId);
  driversApi.editDriver(req.params.driverId,req.body);
  res.json({message: ' Driver Updated !'});
});
module.exports = router;
