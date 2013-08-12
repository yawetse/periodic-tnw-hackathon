'use strict';

exports.removeOneDocument = function(options, callback){
    var Model = options.model,
        query = options.query;

    Model.findOneAndRemove(query,callback);
};

exports.getRandomDocument = function(options,callback){
  var Model = options.model,
    rand = Math.random();

    Model.findOne({ random : { $gte : rand } },function(err,returnDoc){
        if(err){
            callback(err);
        }
        else if(returnDoc){
            callback(null,returnDoc);
        }
        else{
            Model.findOne({ random : { $lte : rand } },function(err,returnLessDoc){

                if(err){
                    callback(err);
                }
                else if(returnLessDoc){
                    callback(null,returnLessDoc);
                }
                else{
                    callback(new Error('couldn\'t get randomDoc'));
                }
            });
        }
    });
};