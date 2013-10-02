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

exports.show = function(req, res){

	res.render('sites/show', {
		title: 'Home page',
		page: {name:'site'},
		site: req.loadedSite
	});
};


exports.create = function(req, res, next) {
	var options = {};
		options.Model = Site;
		options.req = req; 
		options.res = res;
		options.next = next,
		options.logger = logger;
		options.newdoc = application_controller.remove_empty_object_values(req.body);
		options.newdoc.name = application_controller.make_user_name_nice(options.newdoc.title);
		options.modelname = "site";
		// options.errorredirect = errorredirect;
		options.callback = function(newsite){
			// console.log(newsite);
			res.redirect('/periodic/sites/'+newsite.name);
		};
		// options.onlyCallback = onlyCallback;

	application_controller.createModel(options);
};

exports.loadSite = function(req, res, next) {
	console.log("in loading site")
	var params = req.params;
	var options = {};
		options.Model = Site;
		options.req = req; 
		options.res = res;
		options.next = next,
		options.logger = logger;
		options.docid = params.siteid;
		options.modelname = "site";
		options.callback = function(err,doc){
			// console.log(this)
			console.log(doc)
			if(err){
				application_controller.loadModelCallbackHelperError('media',req,res,logger);
			}
			else if(doc){
		      req.loadedSite = doc;
		      next();
			}
			else{
				application_controller.loadModelCallbackHelperInvalid('media',req,res,logger);
			}
		}.bind(this);
	application_controller.loadModel(options);

};