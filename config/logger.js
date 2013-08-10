'use strict';

var winston = require('winston'),
	appconfig = require('./environment.js');
	
	winston.loggers.add('category1', appconfig.environment.logger.apploggerconfig);
	var logger = winston.loggers.get('category1');

if(appconfig.environment.name=="development" || appconfig.environment.name=="test"){
	// logger.enabled = true;
}
else{
	// logger.enabled = false;
	logger.info = function(){};
	logger.verbose = function(){};
	logger.silly = function(){};
}
// exports.loggerObj = logger;
module.exports = exports = logger;