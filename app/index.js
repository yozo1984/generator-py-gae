'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var git = require('simple-git')();


var PyGaeGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies();
      }
    });
  },

  askFor: function () {
    var done = this.async();

    // have Yeoman greet the user
    this.log(this.yeoman);

    // replace it with a short and sweet description of your generator
    this.log(chalk.magenta('You\'re using the Python Google Appengine generator.'));

    var prompts = [{
      name: 'appId',
      message: 'What is your application id?',
      default: path.basename(process.cwd())
    }, {
      name: 'includeAngular',
      message: 'Do you wanna use Angular?',
      default: true
    }, {
      name: 'includeEndpoints',
      message: 'Do you wanna use Google Endpoints?',
      default: true
    }, {
      name: 'includeGit',
      message: 'Use git?',
      default: true
    }];

    this.prompt(prompts, function (props) {
      this.appId = props.appId;
      this.includeAngular = props.includeAngular;
      this.includeEndpoints = props.includeEndpoints;
      this.includeGit = props.includeGit;

      done();
    }.bind(this));
  },

  app: function () {
    this.mkdir('app');
    this.template('init.py', 'app/__init__.py');

    this.mkdir('app/templates');
    this.template('index.html', 'app/templates/index.html');

    this.template('_package.json', 'package.json');
    this.template('_bower.json', 'bower.json');
    this.template('_app.yaml', 'app.yaml');
  },

  projectfiles: function () {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
  },

  git: function() {
    if (this.includeGit) {
      this.copy('gitignore', '.gitignore');
      git.init(function(err) {
        if (err) {
          console.error(err);
        }
        console.log('Initialize Git repo');
        git.add('.').commit('Initial commit by yeoman py-gae', function(err) {
          console.info('Initial commit finished.');
        });
      });
    }
  }
});

module.exports = PyGaeGenerator;
