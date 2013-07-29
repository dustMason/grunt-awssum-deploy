# grunt-awssum-deploy

> Upload your static assets to an S3 bucket

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-awssum-deploy --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-awssum-deploy');
```

## The "s3deploy" task

### Overview
In your project's Gruntfile, add a section named `s3deploy` to the data object passed into `grunt.initConfig()`.

### Options

#### options.key
Type: `String`

Your AWS access key, **mandatory**.

#### options.secret
Type: `String`

Your AWS secret, **mandatory**.

#### options.bucket
Type: `String`

The bucket to upload to, **mandatory**.

#### Note
The project is based on [awssum](http://awssum.io).

### Usage Examples

```js
grunt.initConfig({
  s3deploy: {
    options: {
      key: '<%= secret.awsKey %>',
      secret: '<%= secret.awsSecret %>',
      bucket: '<%= secret.awsBucket %>',
      access: 'public-read'
    },
    dist: {
      files: [{
        expand: true,
        cwd: 'dist/',
        src: '**/*.*',
        dest: './'
      }]
    }
  }
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style.

## Release History
* 2013-07-28   v0.1.0   First release
