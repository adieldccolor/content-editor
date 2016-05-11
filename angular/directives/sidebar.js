(function (){
    "use strict";

    angular.module('app.directives').directive('sidebar', function ($sce){

      var directive = {};
      directive.templateUrl = getView('sidebar', $sce);

      return directive;

    });

})();
