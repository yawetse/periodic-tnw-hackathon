'use strict';

var mongoose = require('mongoose'),
	appconfig = require('./environment'),
	Schema = mongoose.Schema,
    contentSourceSchema = require('../model/contentSource.js'),
    ObjectId = Schema.ObjectId,
    db = appconfig.environment.database.db;

mongoose.model('contentSource',contentSourceSchema);
