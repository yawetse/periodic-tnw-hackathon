'use strict';

var logger = require('../config/logger'),
  mongoose = require('mongoose'),
  queryHelper = require('./queryHelper'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var moduleSchema = new Schema({
  id: ObjectId,
  name: String,
  title: String,
  description: String,
  image: String,
  moduleQuery: {
    filter: String,
    options: String
  },
  css: String, //exercise, workout
  template_html: String,
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

moduleSchema.post('init', function (doc) {
  logger.verbose(__filename + ' - '+doc._id+' has been initialized from the db');
});
moduleSchema.post('validate', function (doc) {
  logger.verbose(__filename + ' - '+doc._id+' has been validated (but not saved yet)');
});
moduleSchema.post('save', function (doc) {
  logger.verbose(__filename + ' - '+doc.type+' - '+doc._id+' has been saved');
});
moduleSchema.post('remove', function (doc) {
  logger.verbose(__filename + ' - '+doc._id+' has been removed');
});

moduleSchema.statics.removeContent = function(options, callback) {
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

moduleSchema.statics.addContent = function(options, callback) {
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


exports = module.exports = moduleSchema;