var elixir = require('laravel-elixir');
require('./tasks/angular.task.js');
require('./tasks/bower.task.js');
require('laravel-elixir-livereload');

//Set true or false if in productor or not
elixir.config.production = false;
elixir.views = {};
elixir.css = {};
elixir.js = {};
elixir.fonts = {};

elixir.css.outputFolder = './UserControl/MortgageCEO_Forms/ContentEditor/assets/css';
elixir.js.outputFolder = './UserControl/MortgageCEO_Forms/ContentEditor/assets/js';
elixir.views.outputFolder = './UserControl/MortgageCEO_Forms/ContentEditor/views';
elixir.fonts.outputFolder = './UserControl/MortgageCEO_Forms/ContentEditor/assets/fonts'

elixir(function(mix){
    mix
        .bower('vendor.js', elixir.js.outputFolder, 'vendor.css', elixir.css.outputFolder)
        .angular('angular/', elixir.js.outputFolder)

        //compile stylesheets
        .less('./angular/**/*.less', elixir.css.outputFolder)
        
        //Copy source files
        .copy('./angular/app/**/*.html', elixir.views.outputFolder + '/app/')
        .copy('./angular/directives/**/*.html', elixir.views.outputFolder + '/directives/')
        .copy('./angular/dialogs/**/*.html', elixir.views.outputFolder + '/dialogs/')
        .copy('./bower_components/tinymce-dist/themes/', 
              elixir.js.outputFolder + '/themes/')
        .copy('./bower_components/tinymce-dist/skins/', 
              elixir.js.outputFolder + '/skins/')

        .copy('./bower_components/tinymce-dist/plugins/advlist/', 
              elixir.js.outputFolder + '/plugins/advlist/')
        .copy('./bower_components/tinymce-dist/plugins/autolink/', 
              elixir.js.outputFolder + '/plugins/autolink/')
        .copy('./bower_components/tinymce-dist/plugins/link/', 
              elixir.js.outputFolder + '/plugins/link/')
        .copy('./bower_components/tinymce-dist/plugins/image/', 
              elixir.js.outputFolder + '/plugins/image/')
        .copy('./bower_components/tinymce-dist/plugins/lists/', 
              elixir.js.outputFolder + '/plugins/lists/')
        .copy('./bower_components/tinymce-dist/plugins/autoresize/', 
              elixir.js.outputFolder + '/plugins/autoresize/')
        .copy('./bower_components/tinymce-dist/plugins/contextmenu/', 
              elixir.js.outputFolder + '/plugins/contextmenu/')
        .copy('./bower_components/tinymce-dist/plugins/code/', 
              elixir.js.outputFolder + '/plugins/code/')
        
        .copy('./filamanager/plugins/**/', 
              elixir.js.outputFolder + '/plugins/')

        //copy material-icons webfont
        .copy('./bower_components/material-design-icons/iconfont/', 
              elixir.fonts.outputFolder);
});
