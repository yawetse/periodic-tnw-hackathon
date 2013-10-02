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
			logger.silly(__filename + ': trying to create ' + modelname);
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
  	loadModel: function(options) {
  		var	Model = options.Model,
			req = options.req,
			res = options.res,
			// next = options.next,
			logger = options.logger,
			modelname = options.modelname,
			docid = options.docid,
			callback = options.callback;

		logger.verbose(__filename + ': loading ' + modelname + ' function');

	    var self = this;
	    // logger.warn(docid)
	    if (docid.length == 24) {
	      Model.findOne({
	        $or: [{
	          name: docid
	        }, {
	          _id: docid
	        }]
	      }, callback.bind(this));
	    } else {
	      Model.findOne({
	        name: docid
	      }, callback.bind(this));
	    }
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
	make_user_name_nice: function(username) {
	    if (username) {
	      return username.replace(/[^a-z0-9]/gi, '-').toLowerCase();
	    } else {
	      return false;
	    }
	 },
	 sort_by: function(field, reverse, primer) {

	    reverse = (reverse) ? -1 : 1;

	    return function(a, b) {

	      a = a[field];
	      b = b[field];

	      if (typeof(primer) != 'undefined') {
	        a = primer(a);
	        b = primer(b);
	      }

	      if (a < b) return reverse * -1;
	      if (a > b) return reverse * 1;
	      return 0;

	    }
	},
	strip_tags: function(textinput) {
	    // cleantext = textinput.replace(/(<([^>]+)>)/ig,"");
	    // return cleantext;
	    if (textinput) {
	      return textinput.replace(/[^a-z0-9@._]/gi, '-').toLowerCase();
	    } else {
	      return false
	    }
	}
};