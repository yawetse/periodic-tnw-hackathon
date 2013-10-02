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

exports.show = function(req, res){

	res.render('modules/show', {
		title: 'Home page',
		page: {name:'site'},
		site: req.loadedModule
	});
};


exports.create = function(req, res, next) {
	var options = {};
		options.Model = Module;
		options.req = req; 
		options.res = res;
		options.next = next,
		options.logger = logger;
		options.newdoc = application_controller.remove_empty_object_values(req.body);
		options.newdoc.name = application_controller.make_user_name_nice(options.newdoc.title);
		options.modelname = "module";
		// options.errorredirect = errorredirect;
		options.callback = function(newmodule){
			// console.log(newsite);
			// res.json('/periodic/modules/'+newmodule.name);
		};
		// options.onlyCallback = onlyCallback;

	application_controller.createModel(options);
};

exports.loadModule = function(req, res, next) {
	console.log("in loading module")
	var params = req.params;
	var options = {};
		options.Model = Site;
		options.req = req; 
		options.res = res;
		options.next = next,
		options.logger = logger;
		options.docid = params.moduleid;
		options.modelname = "module";
		options.callback = function(err,doc){
			// console.log(this)
			console.log(doc)
			if(err){
				application_controller.loadModelCallbackHelperError('media',req,res,logger);
			}
			else if(doc){
		      req.loadedModule = doc;
		      next();
			}
			else{
				application_controller.loadModelCallbackHelperInvalid('media',req,res,logger);
			}
		}.bind(this);
	application_controller.loadModel(options);

};