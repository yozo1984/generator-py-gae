'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');


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
    }];

    this.prompt(prompts, function (props) {
      this.appId = props.appId;
      this.includeAngular = props.includeAngular;

      done();
    }.bind(this));
  },

  app: function () {
    this.mkdir('app');
    this.copy('init.py', 'app/__init__.py');

    this.mkdir('app/templates');
    this.template('index.html', 'app/templates/index.html');

    this.template('_package.json', 'package.json');
    this.template('_bower.json', 'bower.json');
    this.template('_app.yaml', 'app.yaml');
  },

  projectfiles: function () {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
  }
});

module.exports = PyGaeGenerator;
