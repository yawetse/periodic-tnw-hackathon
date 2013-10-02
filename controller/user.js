'use strict';

var mongoose = require('mongoose'),
	db = require('../config/db'),
	logger = require('../config/logger'),
	application_controller = require('./application'),
	appconfig = require('../config/environment'),
	User = mongoose.model('User');



exports.new = function(req, res, next) {
	res.render('users/new', {
		page: {
			name: "register"
		},
		flash_messages : req.flash(),
		title : "Create an Account"
	});
};

exports.login = function(req, res, next) {
	res.render('users/login', {
		page: {
			name: "login"
		},
		flash_messages : req.flash(),
		title : "sign in Account"
	});
};

exports.create = function(req, res) {
	var bcrypt = require('bcrypt'),
		userdata = application_controller.remove_empty_object_values(req.body);
	logger.verbose(__filename + ' - create a new user');
	// logger.verbose(userdata);
	// console.log(userdata)
	if (
	userdata.password === undefined || !userdata.password || userdata.password === '' || userdata.password === ' ' || userdata.passwordconfirm == undefined || !userdata.passwordconfirm || userdata.passwordconfirm === '' || userdata.passwordconfirm === ' ') {
		delete userdata.password;
		delete userdata.passwordconfirm;
		req.flash('error', "missing password");
		logger.error("controller - user.js - missing password - trying to create");

		res.render('users/new', {
			title: "Create an account",
			user: userdata,
			page: {name:"register"},
			flash_messages : req.flash()

		});
	} else if (userdata.passwordconfirm != userdata.password) {
		delete userdata.password;
		delete userdata.passwordconfirm;
		req.flash('error', "confirmation password doesn't match");
		logger.error("controller - user.js - confirmation password doesn't match");

		res.render('users/new', {
			user: userdata,
			page: {name:"register"},
			flash_messages : req.flash()
		});
	}
	 else if (userdata.email === undefined || !userdata.email || userdata.username === undefined || !userdata.username) {
		req.flash('error', "missing required data");
		logger.error("controller - user.js - missing required data");

		this.flash_messages = req.flash();
		this.user = req.user;
		res.render('users/new', {
			user: userdata,
			page: {name:"register"}
		});
	}
	else{
		var searchUsernameRegEx = new RegExp(userdata.username, "gi"),
		searchEmailRegEx = new RegExp(userdata.email, "gi");	
		var query = {};

		if(userdata.username && userdata.email){
			query = {
				$or: [{
					username: searchUsernameRegEx
				}, {
					email: searchEmailRegEx
				}]
			};		
		}
		else if(userdata.username){
			query = { username: searchUsernameRegEx };	
		}
		else{
			query={ email: searchEmailRegEx };	
		}


		// console.log("query",query)
		User.findOne(query,
			function(err, user) {
				// console.log("err",err,"user",user)
				if (err) {
					logger.error(err);
					// console.log("this is the error")
					req.flash('error', err.toString())
					this.user = req.user;

					res.render('users/new', {
						userToShow: userdata,
						page: {
							name: "register"
						},
						title : "Join Repetere",
						flash_messages : req.flash(),
					})
				} else if (user) {
					logger.silly("controller - user.js - user already has an account");
					req.flash('error', "you already have an account");

					this.user = req.user;

					res.render('users/new', {
						showuser: userdata,
						page: {
							name: "register"
						},
						flash_messages : req.flash(),
						title : "Join Repetere"
					})
				} else {
					delete userdata.passwordconfirm;
					User.fastRegisterUser(userdata,function(err,returnedUser){
						if (err) {
							logger.error(err);
							// console.log(err)
							req.flash('error', err.toString())

							res.render('users/new', {
								user: userdata,
								page: {
									name: "register"
								},
								title : "Join Repetere",
								flash_messages : req.flash()


							})
						} else {
							req.logIn(returnedUser, function(err) {
								logger.verbose("controller - auth.js - got user")

								if (err) {
									logger.error(err)
									return res.redirect('/periodic/login');
								}

								logger.silly("controller - auth.js - "+req.session.return_url)
								if(req.session.return_url){
									return res.redirect(req.session.return_url);
								}
								else{
									return res.redirect('/');				
								}
							});
							/*
							User.sendAsyncWelcomeEmail(userdata,function(){});
							var Progress = mongoose.model('Progress');
							var logProgress = {
						        userid: returnedUser._id,
						        username: returnedUser.username,
						        title: returnedUser.username,
						        name: returnedUser.username,
						        type: "new user", //exercise, workout
						        model: "user", //exercise, workout
						        dataid: returnedUser,
						        data: {
			            			description: returnedUser.description
						        }     
						    }
						    if(returnedUser.profileimages){
						    	logProgress.data.media = returnedUser.profileimages;
						    }
						    Progress.addProgress(logProgress,function(err){
						    	if(err){
						    		logger.error(err)
						    	}
						    	else{
						    		logger.verbose("new account created")
						    	}
						    });
						    */
						}
					});
				}
			}
		);
	}
};

exports.ensureAuthenticated = function(req, res, next) {
	if (req.isAuthenticated()) {
		if (!req.user.username) {
			res.redirect('/periodic/user/finishregistration')
		} else {
			return next();
		}
	} else {
	    if (req.query.format == "json" || req.xhr) {
	    	res.send({
	        "result": "error",
	        "data": {
	          error: "authentication requires "
	        }
	      });
		}
		else{
			if (req.url) {
				logger.verbose("controller - user.js - " + req.url)
				req.session.return_url = req.url;
				res.redirect('/periodic/auth/login?return_url=' + req.url);
			} else {
				res.redirect('/periodic/auth/login');
			}

		}
	}
}
exports.apiAuthenticated = function(req, res, next) {
	// console.log(req.body)
	if (req.body.apikey && req.body.userid) {
		return next();
	} else {
		return next(new Error("invalid api request"));
	}
}