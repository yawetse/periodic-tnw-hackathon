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

userSchema.post('init', function (doc) {
  logger.verbose(__filename + ' - '+doc._id+' has been initialized from the db');
});
userSchema.post('validate', function (doc) {
  logger.verbose(__filename + ' - '+doc._id+' has been validated (but not saved yet)');
});
userSchema.post('save', function (doc) {
  logger.verbose(__filename + ' - '+doc.type+' - '+doc._id+' has been saved');
});
userSchema.post('remove', function (doc) {
  logger.verbose(__filename + ' - '+doc._id+' has been removed');
});

userSchema.statics.generateRandomTokenStatic = function () {
  var user = this,
      chars = "_!abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
      token = new Date().getTime() + '_';
  for ( var x = 0; x < 16; x++ ) {
    var i = Math.floor( Math.random() * 62 );
    token += chars.charAt( i );
  }
  return token;
};


userSchema.statics.fastRegisterUser = function(userdata,callback){
    logger.silly("model - user.js - trying to fast register user");
    var bcrypt = require('bcrypt');
    var application_controller = require('../controller/application');
    var userdata = userdata;
    // console.log(userdata);
    if(userdata._csrf){delete userdata._csrf;}
    if(userdata.submit){delete userdata.submit;}
    if (
    userdata.password === undefined || !userdata.password || userdata.password === '' || userdata.password === ' ') {
        delete userdata.password;
        delete userdata.passwordconfirm;
        if(callback){
            callback(new Error("missing password"),userdata);            
        }
    }
    else if(userdata.password.length <8){
        if(callback){
            callback(new Error("password is too short - min 8 characters"),userdata);            
        }
    }
    else {
        delete userdata.passwordconfirm;
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(userdata.password, salt, function(err, hash) {
                // Store hash in your password DB.
                userdata.password = hash;
                logger.silly("model - user.js - to save user")
                // logger.info(userdata)
                if(userdata.username && !userdata.email){
                    userdata.email = userdata.username;
                    delete userdata.username;
                }
                // logger.info(userdata)
                var User = mongoose.model('User');
                userdata.apikey = User.generateRandomTokenStatic();
                // console.log(userdata)

                var newUser = User(userdata);
                newUser.save(function(err, user) {
                    logger.silly("model - user.js - trying to create user")
                    // console.log("user",user)

                    if (err) {
                        logger.error(err);
                        if(callback){
                            callback(err,userdata);         
                        }
                    } else {
                        // User.sendAsyncWelcomeEmail(user);
                        // if(user.password){
                        //     user.password = null;
                        //     delete user.password;
                        // }
                        if(callback){
                            callback(false,user);
                        }
                    }
                });

            });
        });
    }
} 
userSchema.statics.removeContentSource = function(options, callback) {
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

userSchema.statics.addContentSource = function(options, callback) {
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

// Password verification
userSchema.methods.comparePassword = function(candidatePassword, cb) {
    var bcrypt = require('bcrypt');
    // logger.silly("model - user.js - hashed password: "+this.password);
    // console.log(this.password)

    if(this.password){
        // logger.silly("tyring bcrypt")
        bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
            if(err) return cb(err);
            cb(null, isMatch);
        });
    }
    else{
        logger.silly("user has no pw")
        return cb(null,false)
    }
};

// Remember Me implementation helper method
userSchema.methods.generateRandomToken = function () {
  var user = this,
      chars = "_!abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
      token = new Date().getTime() + '_';
  for ( var x = 0; x < 16; x++ ) {
    var i = Math.floor( Math.random() * 62 );
    token += chars.charAt( i );
  }
  return token;
};

exports = module.exports = userSchema;