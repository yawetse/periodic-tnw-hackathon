'use strict';

var mongoose = require('mongoose'),
	appconfig = require('./environment'),
    contentSourceSchema = require('../model/contentSource.js'),
    userSchema = require('../model/user.js'),
    db = appconfig.environment.database.db;

mongoose.model('contentSource',contentSourceSchema);
mongoose.model('User',userSchema);

module.exports = exports = db;