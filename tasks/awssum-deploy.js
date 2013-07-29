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
  amz = require('awssum-amazon'),
  AmazonS3 = require('awssum-amazon-s3').S3;

module.exports = function(grunt) {

  grunt.registerMultiTask('s3deploy', 'deploy to S3 using awssum', function () {

    var options = this.options(),
      region,
      access,
      deployDone = this.async(),
      count = this.files.length;

    if (options.region) { region = amz[options.region]; } else { region = amz.US_EAST_1; }
    delete options.region;
    if (options.access) { access = options.access; } else { access = 'public-read'; }
    delete options.access;

    grunt.log.writeln("File count: " + count);

    var defaults = {
      BucketName: options.bucket,
      Acl: 'public-read',
      // ContentType: 'text/javascript; charset=UTF-8'
    };

    var s3 = new AmazonS3({
      accessKeyId : options.key,
      secretAccessKey : options.secret,
      region : region
    });

    this.files.forEach(function(f) {

      grunt.log.writeln("The dest is: " + f.dest);

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
          // ContentType: defaults.ContentType,
          ObjectName: f.dest,
          ContentLength: src.length,
          Body: src
        };

        s3.PutObject(options, function ( err, data ) {
          if (err) {
            grunt.log.error('AWS Error: Status Code ' + err.StatusCode);
            grunt.log.error('Error Code: ' + err.Body.Error.Code);
            grunt.log.error('Error Message: ' + err.Body.Error.Message);
            return deployDone(false);
          }

          count--;
          grunt.log.ok('Deployed to '+ options.BucketName + '/' + options.ObjectName + '; Status Code ' + data.StatusCode);

          if (count === 0) {
            grunt.log.ok('Done deploying');
            deployDone();
          }
        });
      });

    });

  });

}
