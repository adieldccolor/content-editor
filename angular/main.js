(function(g){
"use strict";

    if ( browserCheck.isIE10() ) {
      var cEditor = document.getElementsByTagName("content-editor")[0];
      cEditor.style.display = "none";
      document.body.className += " ie-unsupported ";
      return false;
    }

    var app = angular.module('app',
        [
        'app.controllers',
        'app.filters',
        'app.services',
        'app.directives',
        'app.factories',
        'app.routes',
        'app.config'
        ]);

    angular.module('app.routes', ['ui.router']);
    angular.module('app.controllers', ['ngMaterial', 'ui.router', 'ui.tinymce', 'angular-toArrayFilter']);
    angular.module('app.filters', []);
    angular.module('app.services', []);
    angular.module('app.factories', ['ngResource', 'ngRoute']);
    angular.module('app.directives', []);
    angular.module('app.config', ['ngMaterial']);

    g._contentEditor = app;

})(window);