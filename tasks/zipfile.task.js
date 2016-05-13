/*Elixir Task for bower
* Upgraded from https://github.com/ansata-biz/laravel-elixir-bower
*/
var gulp = require('gulp');
var notify = require('gulp-notify');
var gulpIf = require('gulp-if');
var zip = require('gulp-zip');

var Elixir = require('laravel-elixir');

var Task = Elixir.Task;

Elixir.extend('zipFile', function(outputFolder) {

    var onError = function (err) {
        notify.onError({
            title: "Laravel Elixir",
            subtitle: "Bower Files Compilation Failed!",
            message: "Error: <%= error.message %>",
            icon: __dirname + '/../node_modules/laravel-elixir/icons/fail.png'
        })(err);
        this.emit('end');
    };

    new Task('zipfile', function() {
        return gulp.src(['./UserControl/', 'index.html'])
            .on('error', onError)
            .pipe(gulpIf(Elixir.config.production, zip('content-editor.zip')))
            .pipe(gulp.dest(outputFolder))
            .pipe(gulpIf(Elixir.config.production, notify({
                title: 'Task: File Zipped',
                subtitle: 'Zip file is bundled!',
                icon: __dirname + '/../node_modules/laravel-elixir/icons/laravel.png',
                message: ' '
            })));
    });

});
