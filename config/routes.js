'use strict';

var logger = require('./logger'),
	home = require('../controller/home'),
	admin = require('../controller/admin'),
	user = require('../controller/user'),
	auth = require('../controller/auth'),
	// module = require('../controller/module'),
	page = require('../controller/page'),
	site = require('../controller/site'),
	content = require('../controller/contentSource');//appconfig = require('./environment');

logger.warn('*** make sure you seed your db first, set your host file and run: node scripts/seed.js ***');
logger.silly('*** in dev use sudo nodemon app.js ***');

exports = module.exports = function(app) {
	app.get('/', home.index);

	// **************** 
	//     users
	// ****************
	app.get('/periodic/users/new|/periodic/register', user.new);
	// app.get('/user/finishregistration', user.updateregistration);

	app.post('/periodic/users/new', user.create);
	// app.post('/user/finishregistration', user.updateuserregistration);
	// app.post('/user/updatefastregistration', user.updateFastRegistration);
	// app.post('/user/updateFastRegistration', user.loadUser, user.updateuserregistration);

	// // **************** 
	//     authentication
	// // ****************
	app.get('/periodic/auth/login', user.login);
	app.post('/periodic/auth/login', auth.login);
	app.get('/periodic/auth/logout', auth.logout);

	// app.get('/auth/facebook', auth.facebook);
	// app.get('/auth/facebook/callback', auth.facebookCallback);
	// app.get('/auth/mobile/login', auth.mobileLogin);
	// app.get('/auth/mobile/requestcsrf', auth.requestCSRF);	


	// **************** 
	//    admin 
	// ****************
	app.get('/periodic/admin|/periodic', user.ensureAuthenticated, admin.index);
	// **************** 
	//     content
	// ****************
	app.post('/periodic/content/new', content.new);
	// app.get('/content_source/new', user.ensureAuthenticated, media.new);
	// **************** 
	//     site
	// ****************
	app.get('/periodic/sites/new', site.new);
	app.post('/periodic/sites/new', site.create);
	// **************** 
	//     page
	// ****************
	app.get('/periodic/page/new', page.new);
	// **************** 
	//     module
	// ****************
	// app.get('/periodic/module/new', module.new);

	app.get('/periodic/404|:anypage',home.error404);




};