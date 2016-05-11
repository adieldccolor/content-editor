(function (){
    "use strict";

    angular.module('app.filters').filter('rawHtml', [
          '$sce', function($sce) {
              return function(val){
                return $sce.trustAsHtml(val);
              };
          }
      ]);
})();
