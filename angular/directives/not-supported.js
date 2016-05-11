(function (){
    "use strict";

    angular.module('app.directives').directive('notSupported', function ($sce){
      
      var directive = {};
      directive.restrict = 'E';
      directive.templateUrl = getView('not-supported', $sce);

      return directive;

    });

})();
