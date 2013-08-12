'use strict';

var logger = require('../config/logger'),
  mongoose = require('mongoose'),
  queryHelper = require('./queryHelper'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var contentSourceSchema = new Schema({
  id: ObjectId,
  title: String,
  name: String,
  resource_url: String, //exercise, workout
  content_source_format:{
    type: String,
    default:'following'
  },
  content_source_data: Schema.Types.Mixed,
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


exports = module.exports = contentSourceSchema;