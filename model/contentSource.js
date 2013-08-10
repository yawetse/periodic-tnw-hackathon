'use strict';

var logger = require('../config/logger'),
  // queryHelper = require('./queryHelper'),
  mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var progressSchema = new Schema({
  id: ObjectId,
  userid: {
      type:  ObjectId,
      index: {
        sparse: true,
      }
  },
  visibility:{
      allowed:{
        type:Schema.Types.Mixed,
        default:'following'
      }
  },
  username: String,
  title: String,
  name: String,
  model: String,
  type: String, //exercise, workout
  createdat: {
    type: Date,
    default: Date.now
  },
  dataid: {
    type:  ObjectId,
    index: {
        sparse: true,
    }
  },
  data: Schema.Types.Mixed
});

progressSchema.post('init', function (doc) {
  logger.verbose('model - progress.js - '+doc._id+' has been initialized from the db');
});
progressSchema.post('validate', function (doc) {
  logger.verbose('model - progress.js - '+doc._id+' has been validated (but not saved yet)');
});
progressSchema.post('save', function (doc) {
  logger.verbose('model - progress.js - '+doc.type+' - '+doc._id+' has been saved');
});
progressSchema.post('remove', function (doc) {
  logger.verbose('model - progress.js - '+doc._id+' has been removed');
});

progressSchema.statics.removeProgress = function(options, callback) {
  var userid=options.userid,
  model=options.model,
  dataid=options.dataid,
  configOptions= {};

  configOptions.model = mongoose.model('Progress');
  configOptions.query = {userid:userid,model:model,dataid:dataid};
  configOptions.queryOptions = false;

  // console.log('configOptions',configOptions)

  queryHelper.removeOneDocument(configOptions,callback);
};

// progressSchema.statics.addProgress = function(options, callback) {
//   // Progress = this;
//   // // newProgressItem = new Progress(options)
//   // // newProgressItem.save(callback);

//   // if(!options.createdat){
//   //   options.createdat= new Date();
//   // }
//   // Progress.update(
//   //   options,
//   //   {'$set':options},
//   //   {upsert:true},
//   // callback);
// };


exports = module.exports = progressSchema;