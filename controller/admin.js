'use strict';

var logger = require('../config/logger');

exports.index = function(req, res){
	logger.verbose(__filename + ' - logged out');

	res.render('home/welcome', {
		title: 'Home page',
		page: {name:'home'},
		user: req.user
	});
};