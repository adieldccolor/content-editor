(function (){
    "use strict";

    angular.module('app.directives').directive('pageMenu', function ($sce){
      
      var directive = {};
      directive.restrict = 'E';
      directive.templateUrl = getView('page-menu', $sce);

      return directive;

    });

})();
