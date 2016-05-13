(function (){
    "use strict";

    angular.module('app.controllers').controller('PageEditCtrl',
    function($stateParams, $scope, $rootScope, $window, Pages, PagesList, PageDetails, DialogService, ToastService, $state ) {

      function showLanding() {
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

        $rootScope.$$childHead.PageDetails = PageDetails;
        $rootScope.$$childHead.editor.loading = false;

        if ( $stateParams.pageId !== undefined && $stateParams.pageId !== '' ) {
          $state.go('pageEdit', { page: _config.rootFile, pageId: '' });
        }

        document.title = 'New Page | EncompassCRM';

      }





      //NOTE: important, this lets us know if the page was edited and not saved, so I will show a confirm message for the user
      var wasPreventing = PageDetails.edition.preventSaving;

      $rootScope.$$childHead.editor.preview = false;
      $rootScope.$$childHead.editor.loading = true;

      function updatePage(p){
        PageDetails.edition.listenChanges = false;

        //If the seo is in string format (remember that in php is saved as stringify)
        if ( typeof p.seo == "string" ) {
          p.seo = JSON.parse(p.seo);
        }


        PageDetails.title = p.title;
        PageDetails.body = p.body;
        PageDetails.id = p.id;
        PageDetails.seo.title = p.seo.title;
        PageDetails.seo.description = p.seo.description;
        PageDetails.seo.keywords = p.seo.keywords||[];
        PageDetails.deleted_at = p.deleted_at;

        PageDetails.edition.title = p.title;
        PageDetails.edition.body = p.body;
        PageDetails.edition.id = p.id;
        PageDetails.edition.seo.title = p.seo.title;
        PageDetails.edition.seo.description = p.seo.description;
        PageDetails.edition.seo.keywords = p.seo.keywords||[];

        PageDetails.loaded = true;
        $rootScope.$$childHead.editor.loading = false;

        PageDetails.edition.listenChanges = false;
        PageDetails.edition.preventSaving = false;

        PageDetails.edition.syncSeo = "off";

        $rootScope.$$childHead.PageDetails = PageDetails;

        //store title, body in seo
        $rootScope.$$childHead.updateSEOFromEdit(p);

        $rootScope.$$childHead.editor.trashed = false;

        if ( p.deleted_at ) {
          $rootScope.$$childHead.editor.trashed = true;
        }

        document.title = 'Edit Page | EncompassCRM';
      }



      function findPage(_id){
        var p = { id: '', title: '', body: ' ', seo: { title: '', description: '', keywords: [] } };
        for (var i = 0; i < $rootScope.$$childHead.PagesList.length; i++) {
          if( $rootScope.$$childHead.PagesList[i].id == _id ){
            p = $rootScope.$$childHead.PagesList[i];
          }
        }

        return p;
      }

      function showNextContent(){
        PageDetails.edition.listenChanges = false;

        if( PageDetails.id != $stateParams.pageId ){

          // if I can share Data Between scopes
          var presult = findPage($stateParams.pageId);

          //pageQuery to execute on the current page querying
          var pageQuery = {
            id: $stateParams.pageId, //Required by php webservice,
            SiteID: _config.SiteID
          };

          if ( !_config.touched ) {
            pageQuery.sp = 'pages/single'; //required for local environment
          }

          if( presult.id === "" ){
            var s = Pages.get(pageQuery).$promise.then(function(response){
              if( response.error && response.errorNumber == 404 ){
                ToastService.show('The page you are looking for does not exists. Redirecting to new page...');
                showLanding();
                return false;
              }

              var p = response;
              updatePage(p);
            });
           }else{
            updatePage(presult);
          }
        }else{
          PageDetails.loaded = true;
          PageDetails.edition.listenChanges = true;
          $rootScope.$$childHead.editor.loading = false;
        }
      }

      function stayOnPage(){
        PageDetails.loaded = true;
        PageDetails.edition.preventSaving = wasPreventing;
        PageDetails.edition.listenChanges = true;
        $rootScope.$$childHead.editor.loading = false;

        if( PageDetails.id === "" ){
          showLanding();
        }else{
          $state.go('pageEdit', { page: _config.rootFile, pageId: PageDetails.id });
        }
      }

      if( PageDetails.edition.preventSaving 
         && PageDetails.edition.id != $stateParams.pageId
         && $stateParams.pageId != undefined && $stateParams.pageId !== '' ){
          DialogService.confirm("Warning", "If you continue your changes will get lost", 'Ok', 'Cancel', showNextContent, stayOnPage);
      }else{
        PageDetails.loaded = false;
        
        if ( $stateParams.pageId != undefined && $stateParams.pageId !== '' ) {
          showNextContent();
        } else {
          showLanding();
        }
      }

  });
})();
