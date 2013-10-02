'use strict';

var mongoose = require('mongoose'),
	appconfig = require('./environment'),
    contentSchema = require('../model/content.js'),
    userSchema = require('../model/user.js'),
    siteSchema = require('../model/site.js'),
    db = appconfig.environment.database.db;

mongoose.model('Content',contentSchema);
mongoose.model('User',userSchema);
mongoose.model('Site',siteSchema);

module.exports = exports = db;