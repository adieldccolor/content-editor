(function (){
    "use strict";

    angular.module('app.controllers').controller('LandingController',
    function($scope, $rootScope, PageDetails ) {
      PageDetails.loaded = true;

      var title = 'Untitled page';
      var body = 'Start typing here. <br>  <br> <br>';
      var seo = {
        title: title,
        description: '',
        keywords: []
      };

      PageDetails.id = '';
      PageDetails.title = title;
      PageDetails.body = body;
      PageDetails.seo = seo;
      PageDetails.deleted_at = null;

      PageDetails.edition.id = '';
      PageDetails.edition.title = title;
      PageDetails.edition.body = body;
      PageDetails.edition.seo = seo;
      
      PageDetails.edition.syncSeo = "on";



      PageDetails.edition.listenChanges = false;
      PageDetails.edition.preventSaving = false;

      PageDetails.fn.resizeArea();

      $rootScope.$$childHead.editor.preview = false;
    });
})();
