'use strict';

module.exports = {
	genericModelCallbackHelperError: function(options){
		var req = options.req,
			res = options.res,
			err = options.err,
			// modelname = options.modelname,
			logger = options.logger,
			redirectUrl = options.redirectUrl,
			errorFlash = options.errorFlash;
		logger.error(err);
		if (req.query.format === 'json' || req.xhr) {
			res.send({
				'result': 'error',
				'data': {
					error: err
				}
			});
		}
		else {
			if(errorFlash){
			req.flash('error', errorFlash);
			}
			if(redirectUrl){
			res.redirect(redirectUrl);
			}
			else{
			res.redirect('/404');
			}
		}
	},
	createModel: function(options) {
		// var self = this,
		var	Model = options.Model,
			req = options.req,
			res = options.res,
			// next = options.next,
			logger = options.logger,
			newdoc = options.newdoc,
			modelname = options.modelname,
			errorredirect = options.errorredirect,
			callback = options.callback,
			onlyCallback = options.onlyCallback;

		logger.verbose(__filename + ': create a new ' + modelname + ' function');
		logger.silly(JSON.stringify(newdoc));

		var newDocument = new Model(newdoc);
		newDocument.save(function(err, savedDoc) {
			logger.silly('-: trying to create ' + modelname);
			if(onlyCallback){
				callback(err,savedDoc);
			}
			else{
				if (req.query.format === 'json' || req.xhr) {
					if (err) {
						logger.error(err);
						res.json({
							'result': 'error',
							'data': {
								error: err
							}
						});
					}
					else{// res.set('Content-Type', 'application/json');
						if(callback){
							callback(savedDoc);
						}
						res.json({
							'result': 'success',
							'data': savedDoc
						});
					}
				}
				else {
					if(err){
						logger.error(err);
						req.flash('error',err.toString());
						res.redirect(errorredirect);
					}
					else{
						if(callback){
							callback(savedDoc);
						}
					}
				}
			}
		});
	},
	remove_empty_object_values: function(obj) {
		// console.log("obj",obj)
		for (var property in obj) {
			if (typeof obj[property] == "object") {
		    	this.remove_empty_object_values(obj[property])
		  	} else {
		    	if (obj[property] == '' || obj[property] == ' ' || obj[property] == null || obj[property] == undefined || Object.keys(obj).length == 0) {
		      	// console.log("deleting obj property: "+property)

		      	delete obj[property];
		    	}
		  	}
		  	// console.log(typeof obj[property])
		}
		return obj;
	},
};