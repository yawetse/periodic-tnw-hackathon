'use strict';


var mongoose = require('mongoose'),
	db = require('../config/db'),
	logger = require('../config/logger'),
	application_controller = require('./application'),
	appconfig = require('../config/environment'),
	Site = mongoose.model('Site');

exports.index = function(req, res){
	logger.verbose(__filename + ' - logged out');

	res.render('home/welcome', {
		title: 'Home page',
		page: {name:'home'},
		user: req.user
	});
};

exports.new = function(req, res){
	res.render('sites/new', {
		title: 'Home page',
		page: {name:'home'}
	});
};


exports.create = function(req, res, next) {
	var options;
		options.Model = Site;
		options.req = req; 
		options.res = res;
		options.next = next,
		options.logger = logger;
		options.newdoc = application_controller.remove_empty_object_values(req.body);
		options.newdoc.name = application_controller.make_user_name_nice(options.newdoc.title);
		options.modelname = "site";
		// options.errorredirect = errorredirect;
		// options.callback = callback;
		// options.onlyCallback = onlyCallback;

	application_controller.createModel(options);
};