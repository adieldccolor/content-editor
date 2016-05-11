(function (){
    "use strict";

    angular.module('app.factories').factory('PageDetails', function ($rootScope){

      //Set default title
      var title = 'Untitled page';

      //Set default body
      var body = 'Start typing here. <br>  <br>  <br>';

      //Main PageDetails object
      var page_details = {
        title: title,
        body: body,
        id: '',
        deleted_at: null,
        seo: {
          title: '',
          description: '',
          keywords: []
        },
        loaded: false,
        edition: {
          title: title,
          body: body,
          id: '',
          seo: {
            title: '',
            description: '',
            keywords: []
          },
          syncSeo: 'off',
          preventSaving: false,
          listenChanges: false
        },
        props: {
          filter: 'Search pages',
          filterQuery: { title: '' }
        },
        fn: { }
      };

      /*
      * Allow the editor to be responsive-like
      *
      * @param {Boolean} delayed to let know if we want to delay the resize
      * @param {Boolean} fullScreen
      */
      page_details.fn.resizeArea = function(delayed,fullScreen){

        //Override delayed variable if not defined
        delayed = delayed||false;

        //Override fullscreen variable if not defined
        fullScreen = fullScreen || false;

        if( fullScreen ){
          var winWidth = angular.element(document.body)[0].offsetWidth;
          var winWidthReduced = winWidth - 320;
          angular.element(document.getElementById('page-workflow-area')).css('width', winWidthReduced + 'px');
        }else{
          var contWidth = angular.element(document.getElementById('container-keep-proportions'))[0].offsetWidth;
          var contWidthReduced = contWidth - 320;
          angular.element(document.getElementById('page-workflow-area')).css('width', contWidthReduced + 'px');
        }

      };

      /*
      * Set the editor height to a minimum
      *
      * @param {Boolean} fullScreen
      */
      page_details.fn.fitScreen = function(fullScreen){

        //Override fullscreen variable if not defined
        fullScreen = fullScreen || false;

        if( !angular.element(document.getElementById('angularjs-content-editor')).length ) return;

        var contentEditor = angular.element(document.getElementById('angularjs-content-editor'));
        var elementsToFit = angular.element(document.getElementsByClassName('_fit-height'));
        var _body = angular.element(document.body);
        var _window = angular.element(window);

        if( fullScreen ){
          contentEditor.css('height', _window[0].innerHeight + 'px');
          return true;
        }

        contentEditor.css('height', 'inherit');

        contentEditor.css('min-height', _window[0].innerHeight + 'px');

      };
    return page_details;
  });
})();
