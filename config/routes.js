'use strict';

var logger = require('./logger'),
	home = require('../controller/home');//appconfig = require('./environment');

logger.warn('*** make sure you seed your db first, set your host file and run: node scripts/seed.js ***');
logger.silly('*** in dev use sudo nodemon app.js ***');

exports = module.exports = function(app) {
	app.get('/', home.index);
};