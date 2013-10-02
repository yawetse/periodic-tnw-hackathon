'use strict';

var logger = require('../config/logger');


exports.new = function(req, res){
	res.render('admin/new', {
		title: 'Home page',
		page: {name:'home'}
	});
};


exports.index = function(req, res){
	logger.verbose(__filename + ' - logged out');

	res.render('admin/index', {
		title: 'Home page',
		page: {name:'admin-home'},
		user: req.user
	});
};