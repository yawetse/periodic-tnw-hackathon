'use strict';

var mongoose = require('mongoose'),
	appconfig = require('./environment'),
    contentSourceSchema = require('../model/contentSource.js'),
    userSchema = require('../model/user.js'),
    siteSchema = require('../model/site.js'),
    db = appconfig.environment.database.db;

mongoose.model('contentSource',contentSourceSchema);
mongoose.model('User',userSchema);
mongoose.model('Site',siteSchema);

module.exports = exports = db;