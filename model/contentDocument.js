'use strict';

var logger = require('../config/logger'),
  mongoose = require('mongoose'),
  queryHelper = require('./queryHelper'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var contentDocumentSchema = new Schema({
  id: ObjectId,
  title: String,
  name: String,
  content: String,
  media_content: String,
  media_content_type: String,
  document_original_uri: String,
  original_data: {
      type:Schema.Types.Mixed
  },
  original_id: String,
  original_date: {
    type: Date,
  },
  user_id: {
    type:  ObjectId,
    ref: 'User',
    index: {
      sparse: true
    }
  },
  content_source: {
    type:  ObjectId,
    ref: 'Content',
    index: {
      sparse: true
    }
  },
  content_source_format:{
    type: String,
    default:'rss'
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

contentDocumentSchema.post('init', function (doc) {
  logger.verbose(__filename + ' - '+doc._id+' has been initialized from the db');
});
contentDocumentSchema.post('validate', function (doc) {
  logger.verbose(__filename + ' - '+doc._id+' has been validated (but not saved yet)');
});
contentDocumentSchema.post('save', function (doc) {
  logger.verbose(__filename + ' - '+doc.type+' - '+doc._id+' has been saved');
});
contentDocumentSchema.post('remove', function (doc) {
  logger.verbose(__filename + ' - '+doc._id+' has been removed');
});

contentDocumentSchema.statics.removeContentDocument = function(options, callback) {
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

contentDocumentSchema.statics.addContentDocument = function(options, callback) {
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

exports = module.exports = contentDocumentSchema;