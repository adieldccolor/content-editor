/*Elixir Task for bower
* Upgraded from https://github.com/ansata-biz/laravel-elixir-bower
*/
var gulp = require('gulp');
var mainBowerFiles = require('main-bower-files');
var filter = require('gulp-filter');
var notify = require('gulp-notify');
var minify = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var concat_sm = require('gulp-concat-sourcemap');
var concat = require('gulp-concat');
var gulpIf = require('gulp-if');

var Elixir = require('laravel-elixir');

var Task = Elixir.Task;

Elixir.extend('bower', function(jsOutputFile, jsOutputFolder, cssOutputFile, cssOutputFolder) {

    var cssFile = cssOutputFile || 'vendor.css';
    var jsFile = jsOutputFile || 'vendor.js';

    if (!Elixir.config.production){
        concat = concat_sm;
    }

    var onError = function (err) {
        notify.onError({
            title: "Laravel Elixir",
            subtitle: "Bower Files Compilation Failed!",
            message: "Error: <%= error.message %>",
            icon: __dirname + '/../node_modules/laravel-elixir/icons/fail.png'
        })(err);
        this.emit('end');
    };

    new Task('bower-js', function() {
        var filterJS = filter([
          '**/angular/angular.js',
          '**/angular-animate/angular-animate.js',
          '**/angular-aria/angular-aria.js',
          '**/angular-messages/angular-messages.js',
          '**/angular-resource/angular-resource.js',
          '**/angular-route/angular-route.js',
          '**/angular-toArrayFilter/toArrayFilter.js',
          '**/angular-ui-router/release/angular-ui-router.js',
          '**/tinymce-dist/tinymce.js',
          '**/angular-ui-tinymce/src/tinymce.js'
          ]);

        return gulp.src("./bower_components/**/*.js")
            .on('error', onError)
            .pipe(filterJS)
            .pipe(concat(jsFile, {sourcesContent: true}))
            .pipe(gulpIf(Elixir.config.production, uglify()))
            .pipe(gulp.dest(jsOutputFolder || Elixir.config.js.outputFolder))
            .pipe(notify({
                title: 'Task: Bower Components',
                subtitle: 'Javascript Bower Files Imported!',
                icon: __dirname + '/../node_modules/laravel-elixir/icons/laravel.png',
                message: ' '
            }));
    }).watch('bower.json');


    new Task('bower-css', function(){
        return gulp.src(mainBowerFiles({
            "overrides":
              {
                "tinymce-mention": {
                  "main": "css/autocomplete.css"
                },
                "angular-material": {
                  "main": "angular-material.css"
                }
              }
            }))
            .on('error', onError)
            .pipe(filter('**/*.css'))
            .pipe(concat(cssFile))
            .pipe(gulpIf(config.production, minify()))
            .pipe(gulp.dest(cssOutputFolder || config.css.outputFolder))
            .pipe(notify({
                title: 'Task: Bower Components CSS',
                subtitle: 'CSS Bower Files Imported!',
                icon: __dirname + '/../node_modules/laravel-elixir/icons/laravel.png',
                message: ' '
            }));
    }).watch('bower.json');

});
