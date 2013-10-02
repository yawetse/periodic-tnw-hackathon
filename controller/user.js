'use strict';

var mongoose = require('mongoose'),
	db = require('../config/db'),
	logger = require('../config/logger'),
	application_controller = require('./application'),
	appconfig = require('../config/environment'),
	User = mongoose.model('User');



exports.new = function(req, res, next) {
	res.render('users/new', {
		page: {
			name: "register"
		},
		flash_messages : req.flash(),
		title : "Create an Account"
	})
	// res.render('users/new',{title: title})
	// var options;
	// 	options.Model = ContentSource;
	// 	options.req = req; 
	// 	options.res = res;
	// 	options.next = next,
	// 	options.logger = logger;
	// 	options.newdoc = application_controller.remove_empty_object_values(req.body);
	// 	options.modelname = "contentSource";
	// 	// options.errorredirect = errorredirect;
	// 	// options.callback = callback;
	// 	// options.onlyCallback = onlyCallback;

	// application_controller.createModel(options);
};

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
