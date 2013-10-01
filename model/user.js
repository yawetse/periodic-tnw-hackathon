'use strict';

var logger = require('../config/logger'),
  mongoose = require('mongoose'),
  queryHelper = require('./queryHelper'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var userSchema = new Schema({
    id: ObjectId,
    email: {
        type: String,
        index: {
            unique: true,
            sparse: false,
        }
    },
    userid: {
        type: Number,
        index: {
            sparse: true,
        }
    },
    accessToken: String,
    password: String,
    description: {
        type: String,
        default: "No profile"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    preferences: {
        units: {
            type: String,
            default: "imperial"
        }
    },
    accountType: {
        type: String,
        default: "basic"
    },
    gender: {
        type: String,
        default: "male"
    },
    firstname: String,
    birthday: Date,
    lastname: String,
    username: {
        type: String,
        index: {
            unique: true,
            sparse: true,
        }
    },
    password: String,
    url: String,
    profileimage: [{
        type: ObjectId,
        ref: "Media"
    }],
    apikey: String,
    twitterAccessToken: String,
    twitterAccessTokenSecret: String,
    twitterUsername: String,
    twitterId: String,
    facebookAccessToken: String,
    facebookUsername: String,
    facebookId: String,
    foursquareAccessToken: String,
    foursquareId: String,
    foursquareName: String,
    random: Number
});

contentSourceSchema.post('init', function (doc) {
  logger.verbose(__filename + ' - '+doc._id+' has been initialized from the db');
});
contentSourceSchema.post('validate', function (doc) {
  logger.verbose(__filename + ' - '+doc._id+' has been validated (but not saved yet)');
});
contentSourceSchema.post('save', function (doc) {
  logger.verbose(__filename + ' - '+doc.type+' - '+doc._id+' has been saved');
});
contentSourceSchema.post('remove', function (doc) {
  logger.verbose(__filename + ' - '+doc._id+' has been removed');
});

contentSourceSchema.statics.removeContentSource = function(options, callback) {
  var userid=options.userid,
  model=options.model,
  dataid=options.dataid,
  configOptions= {};

  configOptions.model = mongoose.model('contentSource');
  configOptions.query = {userid:userid,model:model,dataid:dataid};
  configOptions.queryOptions = false;

  // console.log('configOptions',configOptions)

  queryHelper.removeOneDocument(configOptions,callback);
};

contentSourceSchema.statics.addContentSource = function(options, callback) {
  var ContentSource = this,
    newContentSourceItem = new ContentSource(options);

  newContentSourceItem.save(callback);

  if(!options.created_at){
    options.created_at= new Date();
  }
  ContentSource.update(
    options,
    {'$set':options},
    {upsert:true},
  callback);
};



exports = module.exports = userSchema;