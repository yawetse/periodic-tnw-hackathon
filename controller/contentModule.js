'use strict';

var mongoose = require('mongoose'),
	db = require('../config/db'),
	logger = require('../config/logger'),
	application_controller = require('./application'),
	appconfig = require('../config/environment'),
	Module = mongoose.model('Module');

exports.new = function(req, res, next){
	res.render('modules/new', {
		title: 'Home page',
		page: {name:'module'}
	});
};

