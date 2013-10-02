'use strict';

var logger = require('../config/logger'),
  mongoose = require('mongoose'),
  queryHelper = require('./queryHelper'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var siteSchema = new Schema({
  id: ObjectId,
  title: String,
  name: String,
  description: String,
  profile_image: String,
  user_id: {
    type:  ObjectId,
    ref: 'User',
    index: {
      sparse: true
    }
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

siteSchema.post('init', function (doc) {
  logger.verbose(__filename + ' - '+doc._id+' has been initialized from the db');
});
siteSchema.post('validate', function (doc) {
  logger.verbose(__filename + ' - '+doc._id+' has been validated (but not saved yet)');
});
siteSchema.post('save', function (doc) {
  logger.verbose(__filename + ' - '+doc.type+' - '+doc._id+' has been saved');
});
siteSchema.post('remove', function (doc) {
  logger.verbose(__filename + ' - '+doc._id+' has been removed');
});

siteSchema.statics.removeContentDocument = function(options, callback) {
  var userid=options.userid,
  model=options.model,
  dataid=options.dataid,
  configOptions= {};

  configOptions.model = mongoose.model('contentDocument');
  configOptions.query = {userid:userid,model:model,dataid:dataid};
  configOptions.queryOptions = false;

  // console.log('configOptions',configOptions)

  queryHelper.removeOneDocument(configOptions,callback);
};

siteSchema.statics.addContentDocument = function(options, callback) {
  var ContentDocument = this,
    newContentDocumentItem = new ContentDocument(options);

  newContentDocumentItem.save(callback);

  if(!options.created_at){
    options.created_at= new Date();
  }
  ContentDocument.update(
    options,
    {'$set':options},
    {upsert:true},
  callback);
};

exports = module.exports = siteSchema;