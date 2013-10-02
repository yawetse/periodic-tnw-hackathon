'use strict';

var mongoose = require('mongoose'),
	parser = require('blindparser'),
	db = require('../config/db'),
	logger = require('../config/logger'),
	application_controller = require('./application'),
	appconfig = require('../config/environment'),
	Content = mongoose.model('Content'),
	ContentDocument = mongoose.model('ContentDocument'),
	contentDocumentsToAdd = [];


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
	console.log("hanning here")
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

exports.query = function(req, res, next){
	var querydata = req.body;
	console.log(req.body)
	ContentDocument.find({}).limit(30).exec(function(err, documents) {
		res.json({
			'result': 'success',
			'data': documents
		});
	})	
};

exports.loadContent = function(req, res, next) {
	var params = req.params;
	var options = {};
		options.Model = Content;
		options.req = req; 
		options.res = res;
		options.next = next,
		options.logger = logger;
		options.docid = params.contentid;
		options.modelname = "content";
		options.callback = function(err,doc){
			// console.log(this)
			console.log(doc)
			if(err){
				application_controller.loadModelCallbackHelperError('content',req,res,logger);
			}
			else if(doc){
		      req.loadedContent= doc;
		      next();
			}
			else{
				application_controller.loadModelCallbackHelperInvalid('content',req,res,logger);
			}
		}.bind(this);
	application_controller.loadModel(options);
};

exports.updateContentDocuments = function(req,res,next){
	req.contentDocumentsToAdd = [];
	switch(req.loadedContent.content_source_format){
		case "rss":
		default:
			var feedurl = req.loadedContent.resource_url;
			parser.parseURL(feedurl, 
				function(err, out){
				    // console.log("out.metadata",out.metadata);
					if(err){
					}
					else{
						for(var x in out.items){
							var docToSave = {
								content_source_format:out.type,
								title: out.items[x].title,
								content: out.items[x].desc,
								document_original_uri: out.items[x].link,
								original_data:  out.items[x],
								original_id: out.items[x].link,
								original_date: out.items[x].date,
								content_source: req.loadedContent._id
							};
						    // console.log("docToSave",docToSave);
						    // console.log(req.contentDocumentsToAdd)
							req.contentDocumentsToAdd.push(docToSave);
						};
					    console.log(req.contentDocumentsToAdd.length)
					    ContentDocument.create(req.contentDocumentsToAdd, function (err){
						  	if (err){
						  		var options = {};
								options.Model = Content;
								options.req = req; 
								options.res = res;
								options.err = err;
						  		application_controller.genericModelCallbackHelperError()
						  	}
						  	else{
						  		res.json({
									'result': 'success',
									'data': 'updated'
								});
						  	}
						});
					}	
				}
			);
			break;
		}
}