(function (){
    "use strict";

    angular.module('app.directives').directive('contentEditor', function ($sce){
      
      var directive = {};
      directive.restrict = 'E';
      directive.templateUrl = getView('content-editor', $sce);

      return directive;

    });

})();
