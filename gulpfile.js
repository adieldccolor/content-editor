var elixir = require('laravel-elixir');
require('./tasks/angular.task.js');
require('./tasks/bower.task.js');
require('laravel-elixir-livereload');

//Set true or false if in productor or not
elixir.config.production = false;

elixir(function(mix){
    mix
        .bower()
        .angular('angular/')
        .less('./angular/**/*.less', 'css')
        .copy('./angular/app/**/*.html', 'public/views/app/')
        .copy('./angular/directives/**/*.html', 'public/views/directives/')
        .copy('./angular/dialogs/**/*.html', 'public/views/dialogs/')
        .copy('./bower_components/tinymce-dist/themes/', 'js/themes/')
        .copy('./bower_components/tinymce-dist/skins/', 'js/skins/')

        .copy('./bower_components/tinymce-dist/plugins/advlist/', 'js/plugins/advlist/')
        .copy('./bower_components/tinymce-dist/plugins/autolink/', 'js/plugins/autolink/')
        .copy('./bower_components/tinymce-dist/plugins/link/', 'js/plugins/link/')
        .copy('./bower_components/tinymce-dist/plugins/image/', 'js/plugins/image/')
        .copy('./bower_components/tinymce-dist/plugins/lists/', 'js/plugins/lists/')
        .copy('./bower_components/tinymce-dist/plugins/autoresize/', 'js/plugins/autoresize/')
        .copy('./bower_components/tinymce-dist/plugins/contextmenu/', 'js/plugins/contextmenu/')
        .copy('./bower_components/tinymce-dist/plugins/code/', 'js/plugins/code/')
        
        .copy('./filamanager/plugins/**/', 'js/plugins/');
});
