'use strict';

var mongoose = require('mongoose'),
	parser = require('blindparser'),
	db = require('../config/db'),
	logger = require('../config/logger'),
	application_controller = require('./application'),
	appconfig = require('../config/environment'),
	Content = mongoose.model('Content'),
	ContentDocument = mongoose.model('ContentDocument'),
	addContentDocument = function(options){

	};


exports.new = function(req, res){
	logger.verbose(__filename + ' - create a new content source');
	var content_source_data = req.body,
		user_data = req.user;

    delete content_source_data._csrf;

	res.render('content/new', {
		title: 'Home page',
		page: {name:'content'},
		user: req.user
	});
};

exports.show = function(req, res){

	res.render('content/show', {
		title: 'Home page',
		page: {name:'content'},
		content: req.loadedContent
	});
};


exports.create = function(req, res, next) {
	var options ={};
		options.Model = Content;
		options.req = req; 
		options.res = res;
		options.next = next,
		options.logger = logger;
		options.newdoc = application_controller.remove_empty_object_values(req.body);
		options.newdoc.name = application_controller.make_user_name_nice(options.newdoc.title);
		options.modelname = "content";
		options.callback = function(newcontent){
			// console.log(newsite);
			res.redirect('/periodic/content/'+newcontent.name);
		};		// options.errorredirect = errorredirect;
		// options.onlyCallback = onlyCallback;

	application_controller.createModel(options);
};

exports.loadContentDocument = function(req, res, next) {
	var params = req.params;
	var options = {};
		options.Model = ContentDocument;
		options.req = req; 
		options.res = res;
		options.next = next,
		options.logger = logger;
		options.docid = params.contentdocumentid;
		options.modelname = "content";
		options.callback = function(err,doc){
			// console.log(this)
			console.log(doc)
			if(err){
				application_controller.loadModelCallbackHelperError('content',req,res,logger);
			}
			else if(doc){
		      req.loadedContentDocument= doc;
		      next();
			}
			else{
				application_controller.loadModelCallbackHelperInvalid('content',req,res,logger);
			}
		}.bind(this);
	application_controller.loadModel(options);

};