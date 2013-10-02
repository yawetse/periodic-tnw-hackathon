'use strict';

/*
 * Module dependencies.
 */
var express = require('express'),
	appconfig = require('./config/environment.js'),
	logger = require('./config/logger'),
	http = require('http'),
	flash = require('connect-flash'),
	path = require('path'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy;

var app = express();

// all environments
app.set('port', appconfig.environment.server.port || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon(__dirname + '/public/favicon.ico', { maxAge: 2592000000 }));
app.use(express.logger('dev'));
app.use(express.compress());
if(appconfig.environment.name === 'development'){
	app.use(express.static(path.join(__dirname, 'public')));
}
else{
	app.use(express.static(path.join(__dirname, 'public'),{maxAge: 86400000}));
}
app.use(express.bodyParser({ keepExtensions: true, uploadDir: __dirname + '/public/uploads/files' }));



app.use(express.methodOverride());
app.use(express.cookieParser('asfdsfasds'));


var express_session_config,
	MongoStore = require('connect-mongo')(express),
	express_session_config = {
	secret:'hjoiuu87go9hui',
	maxAge: new Date(Date.now() + 3600000),
	store: new MongoStore(
		{url:appconfig.environment.database.url},
		function(err){
			if(!err){
				// logger.error(err || 'connect-mongodb setup ok possibly');
				logger.silly('connect-mongodb setup ok possibly');
			}
		})
	};
app.use(express.session(express_session_config));
app.use(flash());
app.use(express.csrf());

// Remember Me middleware
app.use(function(req, res, next) {
    // console.log(req.url)
    if (req.method === 'POST' && req.url === '/login') {
		if (req.body.rememberme) {
			req.session.cookie.maxAge = 2592000000; // 30*24*60*60*1000 Rememeber 'me' for 30 days
		} else {
			req.session.cookie.expires = false;
		}
    }
    next();
});
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
	// console.log(res)
	// console.log("in here")
    res.locals.token = req.session._csrf;
    res.locals.title = "";        
    res.locals.flash_messages = null;

    // res.locals.viewHelper = require('./views/helper/viewHelpers');
    res.locals.appenvironment = appconfig.environment.name;
    res.locals.appversion = appconfig.environment.version;
    // res.locals.filepathdata = {
    //   s3https: appconfig.environment.fileuploads.s3pathhttps,
    //   s3http: appconfig.environment.fileuploads.s3pathhttp,
    //   localpath: appconfig.environment.fileuploads.localpathdir
    // }
    var userdata = req.user;
    if(userdata){
      if(userdata.apikey){
        userdata.apikey = null
        delete userdata.apikey;
      }
      if(userdata.password){
        userdata.password = null
        delete userdata.password;
      }
      if(userdata.accessToken){
        userdata.accessToken = null
        delete userdata.accessToken;
      }
      
    }
    res.locals.user = userdata;
    // console.log("req.user",req.user);
    next();
});


app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));


// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

require('./config/routes')(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
