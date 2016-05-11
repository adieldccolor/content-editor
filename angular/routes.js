(function(){
    "use strict";

    if ( browserCheck.isIE10() ) {
      return false;
    }

    angular.module('app.routes').config( function($stateProvider, $urlRouterProvider, $locationProvider ) {

        $urlRouterProvider.otherwise('/');
        $locationProvider.html5Mode(true).hashPrefix('!');

        $stateProvider
        // .state('landing', {
        //     url: '/',
        //     controller: 'LandingController'
        // })
        .state('pageEdit', {
            url: '/?:pageId',
            controller: 'PageEditCtrl'
        });

    } );
})();
