'use strict';

var mongoose = require('mongoose'),
	db = require('../config/db'),
	logger = require('../config/logger'),
	application_controller = require('./application'),
	appconfig = require('../config/environment'),
	User = mongoose.model('User'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	FacebookStrategy = require('passport-facebook').Strategy;

// var appconfig = require('../config/environment');


exports.login = function(req, res, next) {
	logger.info("controller - auth.js - "+req.body)
	passport.authenticate('local', function(err, user, info) {
		if (err) {
			logger.error(err)
			return next(err)
		}
		if (!user) {
			logger.info("controller - auth.js - no user")
			req.flash('error',"invalid credentials, did you forget your password?");
			return res.redirect('/login')
		}
		req.logIn(user, function(err) {
			logger.info("controller - auth.js - got user")

			if (err) {
				logger.error(err)
				return next(err);
			}

			logger.info("controller - auth.js - "+req.session.return_url)
			if(req.session.return_url){
				return res.redirect(req.session.return_url);
			}
			else{
				return res.redirect('/');				
			}
		});
	})(req, res, next);
};
exports.logout = function(req, res) {
	req.logout();
	res.redirect('/');
};
exports.requestCSRF = function(req, res){
	User.validApiKey(req.body.userid,req.body.apikey,function(err,user){
		if (err) {
			logger.error(err);
			res.send({
				"result": "error",
				"data": err
			});
		}
		else{
			res.send({
				"result": "success",
				data:{
					_csrf: req.session._csrf					
				}
			});		
		}
	})
}
exports.mobileLogin = function(req, res, next) {
	var userdata = req.query;
	console.log(userdata)
	logger.verbose("controller - auth.js - mobile login");
	passport.authenticate('local', function(err, user, info) {

		// console.log("in callback returnf rom auth")
		console.log(err)

		if (err) {
			logger.error(err);
			res.send({
				"result": "error",
				"data": err
			});
		}
		else if (!user) {
			logger.verbose("controller - auth.js - no user")
			if(application_controller.is_valid_email(userdata.username)){
					User.fastRegisterUser(userdata,function(err,returnedUser){
					if(err){
						console.log(err.toString())
						res.send({
							"result": "error-auth",
							"data": err.toString()
						});
					}
					else{
						res.send({
							"result": "success-register",
							"data": {
								user: returnedUser,
								_csrf: req.session._csrf
							}
						});
					}
				})
			}
			else{
				res.send({
					"result": "register-error",
					"data": "invalid email"
				});
			}
		}
		else{
			User.findOne({_id:user._id}).populate("profileimage").exec(function(err,loggedInUser){
				if (err) {
					logger.error(err);
					res.send({
						"result": "error",
						"data": err
					});
				}
				else{

					if(loggedInUser.password){
						loggedInUser.password = null;
						delete loggedInUser.password;
					}
					res.send({
						"result": "success",
						"data": {
							user: loggedInUser,
							_csrf: req.session._csrf
						}
					});
				}
			})

		}
		
	})(req, res, next);
};

exports.facebook = function(req, res, next) {
	logger.info("controller - auth.js - in facebook get token ")
	// if(req.url){
	//   	console.log(req.url)
	//   	req.session.return_url = req.url;
 //  	}
	passport.authenticate('facebook', { scope: [ 'email','publish_actions','offline_access','user_status' ,'user_likes','user_checkins','user_about_me','user_photo_video_tags','read_stream'] })(req, res, next);
}
exports.facebookCallback = function(req, res, next) {
	logger.info("controller - auth.js - in facebook callback")
	// console.log("forwaring url from session")
	// console.log(req.session.return_url)
	var loginUrl = (req.session.return_url) ? req.session.return_url : '/user/profile/edit';
	var loginFailureUrl = (req.session.return_url) ? req.session.return_url : '/login?return_url='+req.session.return_url;
	passport.authenticate('facebook', {
		successRedirect: loginUrl,
		failureRedirect: loginFailureUrl,
		failureFlash: 'Invalid username or password.'
	})(req, res, next);

}

// Passport session setup.
passport.serializeUser(function(user, done) {
	logger.verbose("controller - auth.js - serialize user")

	var createAccessToken = function() {
		var token = user.generateRandomToken();
		User.findOne({
			accessToken: token
		}, function(err, existingUser) {
			if (err) {
				return done(err);
			}
			if (existingUser) {
				createAccessToken(); // Run the function again - the token has to be unique!
			} else {
				user.set('accessToken', token);
				user.save(function(err) {
					if (err) return done(err);
					return done(null, user.get('accessToken'));
				})
			}
		});
	};

	if (user._id) {
		createAccessToken();
	}
});

passport.deserializeUser(function(token, done) {
	logger.verbose("controller - auth.js - deserialize user")
	User.findOne({
		accessToken: token
	})
	// .populate("profileimage")
	.exec(function(err, user) {
		// console.log(user)
		done(err, user);
	});
});


// Use the LocalStrategy within Passport.
passport.use(new LocalStrategy(function(username, password, done) {

	logger.silly("controller - auth.js - in passort local strategy ")
	// logger.silly("controller - auth.js - username: "+username)
	// logger.silly("controller - auth.js - password: "+password)

	User.findOne({
		$or: [{
			username:  { $regex : new RegExp(username, "i") }
		}, {
			email:  { $regex : new RegExp(username, "i") }
		}]
	}, function(err, user) {
		if (err) {
			return done(err);
		}
		if (!user) {
			return done(null, false, {
				message: 'Unknown user ' + username
			});
		}
		user.comparePassword(password, function(err, isMatch) {
			if (err) {
				return done(err);
			}

			if (isMatch) {
				return done(null, user);
			} 
			else {
				// logger.verbose(" in passport callback when no password")
				return done(null, false, {
					message: 'Invalid password'
				});
			}
		});
	});
}));

passport.use(new FacebookStrategy({
	clientID: appconfig.environment.oauth.facebook.appid,
	clientSecret: appconfig.environment.oauth.facebook.appsecret,
	callbackURL: appconfig.environment.oauth.facebook.callbackurl
},
	function(accessToken, refreshToken, profile, done) {
		// User.findOrCreate(..., function(err, user) {
		//   if (err) { return done(err); }
		//   done(null, user);

	 var newUser = new User;
		// });
		// console.log("accessToken:" +accessToken)
		// console.log("refreshToken:" +refreshToken)
		// console.log("profile:" +profile)
		logger.info("controller - auth.js - in callback for facebook strategy");
		newUser.findOrCreate({
			facebookId: profile.id,
			profile: profile,
			token: accessToken,
			done: done
		}, function(err, user) {
			return done(err, user);
		});
	})
);