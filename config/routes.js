'use strict';

var logger = require('./logger'),
	home = require('../controller/home'),
	content_source = require('../controller/contentSource');//appconfig = require('./environment');

logger.warn('*** make sure you seed your db first, set your host file and run: node scripts/seed.js ***');
logger.silly('*** in dev use sudo nodemon app.js ***');

exports = module.exports = function(app) {
	app.get('/', home.index);

	// **************** 
	//     content
	// ****************
	app.post('/content_source/new', content_source.new);
	// app.get('/content_source/new', user.ensureAuthenticated, media.new);



};