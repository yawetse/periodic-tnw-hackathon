'use strict';

var logger = require('../config/logger'),
	application_controller = require('./application'),
	appconfig = require('../config/environment');


exports.create = function(req, res){
	logger.verbose(__filename + ' - create a new content source');
	var content_source_data = req.body,
		user_data = req.user;

    delete content_source_data._csrf;

	res.render('home/welcome', {
		title: 'Home page',
		page: {name:'home'},
		user: req.user
	});
};