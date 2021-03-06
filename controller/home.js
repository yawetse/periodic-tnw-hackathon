'use strict';

var logger = require('../config/logger');

exports.index = function(req, res){
	console.log(req.user)
	logger.verbose(__filename + ' - logged out');

	res.render('home/welcome', {
		title: 'Home page',
		page: {name:'home'},
		user: req.user
	});
};

exports.error404 = function(req, res){
	console.log(req.params)
	req.flash('error', "Page not found");
	res.render('home/404', {
		title: 'Home page',
		page: {name:"home"},
		user: req.user,
		flash_messages : req.flash()
	});
};