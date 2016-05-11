(function (){
    "use strict";

    angular.module('app.directives').directive('pagePreview', function ($sce){
      
      var directive = {};
      directive.restrict = 'E';
      directive.templateUrl = getView('page-preview', $sce);

      return directive;

    });

})();
