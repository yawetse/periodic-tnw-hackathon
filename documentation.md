# Building Periodic

## Environment Setup

I used the grunt package template from my git hub to set up the application (this doesn't need to be done unless you're creating an applciation from scratch)

It essentially creates the shell of the node application, by setting up the test directory, and rudimentary package information

### installed global node modules
* express
* mocha
* grunt
* less
* nodemon // used for development only

### Writing good code: JSHint, Linting javascript
you code should pass linting before commiting, you can do this through your IDE (i'm using sublime text, installed through the package manager) check out (https://github.com/victorporof/Sublime-JSHint) I installed with the sublime text package manager, you can also set up grunt to lint on save (a grunt watcher but I didn't go through this).

### Writing better code: Mocha tests, Testing javascript
write tests before you write code, using mocha: http://visionmedia.github.io/mocha/

### Less

### package.json
added mongoose - mongo orm

### install express with options
    $ express --session --css less --ejs #installed express app with session support, less css support and ejs html templating 

## Application Configuration
It's a mvc-like web application
* config - application configuration settings and environment settings
 * environment - environment specific configuration settings 
 * db.js - mongoose/orm model set up information
 * logger.js - application logging configuration
 * routes.js - application router
 * environment.js - environment set up
* controller - application controllers
* model - application models
* public - static assets
* test - mocha/bdd tests
* views - application views
* .gitignore - git ignore files
* .jshintrc - jshint / linting configuration
* .npmignore - npm ignore files
* app.js - application
* package.json - npm configuration

### Application runtime
in development mode, it's easier to work with nodemon (to automatically restart server on changes)

Also, to update your host file, to allow for accessing the application on port 80 (not necessary but I like testing oauth connections without the port number)

# Troubleshooting

* make sure you create a log directory
* make sure you start with nodemon in development mode
