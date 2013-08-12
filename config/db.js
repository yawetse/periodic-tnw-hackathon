'use strict';

var mongoose = require('mongoose'),
	appconfig = require('./environment'),
    contentSourceSchema = require('../model/contentSource.js'),
    db = appconfig.environment.database.db;

mongoose.model('contentSource',contentSourceSchema);

module.exports = exports = db;