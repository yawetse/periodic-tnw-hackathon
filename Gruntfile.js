/*
 * Periodic
 * https://github.com/condenast/Periodic
 *
 * Copyright (c) 2013 Condé Nast. All rights reserved.
 */

'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    jsbeautifier: {
      files: ["<%= jshint.all %>"],
      options: {
        "indent_size": 2,
        "indent_char": " ",
        "indent_level": 0,
        "indent_with_tabs": false,
        "preserve_newlines": true,
        "max_preserve_newlines": 10,
        "brace_style": "collapse",
        "keep_array_indentation": false,
        "keep_function_indentation": false,
        "space_before_conditional": true,
        "eval_code": false,
        "indent_case": false,
        "unescape_strings": false,
        "space_after_anon_function": true
      }
    },
    simplemocha: {
      options: {
        globals: ['should'],
        timeout: 3000,
        ignoreLeaks: false,
        ui: 'bdd',
        reporter: 'tap'
      },
      all: {
        src: 'test/**/*.js'
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'config/**/*.js',
        'app.js',
        'lib/**/*.js',
        'routes/**/*.js',
        'test/**/*.js'
      ]
    },
    less: {
      development: {
        options: {
          paths: ["./public/stylesheets/less"],
          yuicompress: true
        },
        files: {
          "./public/stylesheets/css/style.css": "./public/stylesheets/less/style.less"
        }
      }
    },
    watch: {
      scripts: {
        // files: '**/*.js',
        files: [
          'Gruntfile.js',
          'config/**/*.js',
          'app.js',
          'lib/**/*.js',
          'routes/**/*.js',
          'test/**/*.js'
        ],
        tasks: ['lint', 'test','less'],
        options: {
          interrupt: true
        }
      },
      // files: "./assets/stylesheets/less/*",
      // tasks: ["less"]
    }
  });

  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-jsbeautifier');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['jshint', 'simplemocha']);
  grunt.registerTask('lint', 'jshint');
  grunt.registerTask('test', 'simplemocha');
};
