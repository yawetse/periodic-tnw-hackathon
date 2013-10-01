'use strict';

var mongoose = require('mongoose'),
	db = require('../config/db'),
	logger = require('../config/logger'),
	application_controller = require('./application'),
	appconfig = require('../config/environment'),
	ContentSource = mongoose.model('contentSource');


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

exports.new = function(req, res, next) {
	var options;
		options.Model = ContentSource;
		options.req = req; 
		options.res = res;
		options.next = next,
		options.logger = logger;
		options.newdoc = application_controller.remove_empty_object_values(req.body);
		options.modelname = "contentSource";
		// options.errorredirect = errorredirect;
		// options.callback = callback;
		// options.onlyCallback = onlyCallback;

	application_controller.createModel(options);
};