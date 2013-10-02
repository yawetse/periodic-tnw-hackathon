'use strict';

var logger = require('../config/logger');

exports.new = function(req, res){
	res.render('modules/new', {
		title: 'Home page',
		page: {name:'home'}
	});
};

exports.error404 = function(req, res){
	console.log(req.params)
	req.flash('error', "Page not found");
	this.flash_messages = req.flash();
	res.render('home/welcome', {
		title: 'Home page',
		page: {name:"home"},
		user: req.user
	});
};