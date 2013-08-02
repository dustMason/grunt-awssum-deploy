/*
 * grunt-awssum-deploy
 *
 * Copyright (c) 2013 Jordan Sitkin
 * Licensed under the MIT license.
 */

'use strict';

var awssum = require('awssum'),
  fs = require('fs'),
  path = require('path'),
  async = require('async'),
  amz = require('awssum-amazon'),
  mime = require('mime'),
  AmazonS3 = require('awssum-amazon-s3').S3;

module.exports = function(grunt) {

  grunt.registerMultiTask('s3deploy', 'deploy to S3 using awssum', function () {

    var options = this.options(),
      region,
      access,
      connections,
      deployDone = this.async();

    if (options.region) { region = amz[options.region]; } else { region = amz.US_EAST_1; }
    delete options.region;
    if (options.access) { access = options.access; } else { access = 'public-read'; }
    delete options.access;
    if (options.connections) { connections = options.connections; } else { connections = 3; }
    delete options.access;

    var defaults = {
      BucketName: options.bucket,
      Acl: 'public-read',
      Acl: 'public-read'
    };

    var s3 = new AmazonS3({
      accessKeyId : options.key,
      secretAccessKey : options.secret,
      region : region
    });

    var upload_file = function(options, callback) {
      s3.PutObject(options, function ( err, data ) {
        if (err) {
          grunt.log.error('AWS Error: Status Code ' + err.StatusCode);
          grunt.log.error('Error Code: ' + err.Body.Error.Code);
          grunt.log.error('Error Message: ' + err.Body.Error.Message);
          // return deployDone(false);
        }
        grunt.log.ok('Deployed to '+ options.BucketName + '/' + options.ObjectName + '; Status Code ' + data.StatusCode);
        callback();
      });
    }

    var queue = async.queue(upload_file, connections);

    queue.drain = function() {
      grunt.log.ok('Done deploying');
      deployDone();
    };

    this.files.forEach(function(f) {
      f.src.filter(function(filepath) {
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).forEach(function(filepath) {
        var src = grunt.file.read(filepath, { encoding: null });
        var options = {
          BucketName: defaults.BucketName,
          Acl: defaults.Acl,
          ContentType: mime.lookup(filepath),
          ObjectName: f.dest,
          ContentLength: src.length,
          Body: src
        };
        queue.push(options);
      });
    });

  });

}
