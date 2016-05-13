(function(){
    "use strict";

    if ( browserCheck.isIE10() ) {
      return false;
    }

    angular.module('app.routes').config( function($stateProvider, $urlRouterProvider, $locationProvider ) {

        $urlRouterProvider.otherwise(_config.rootFile + '?norel');
        $locationProvider.html5Mode(true);

        var pageEditUrl = '/' + _config.rootFile + '?:pageId';

        $stateProvider
        .state('pageEdit', {
            url: pageEditUrl,
            controller: 'PageEditCtrl'
        });

    } );
})();
