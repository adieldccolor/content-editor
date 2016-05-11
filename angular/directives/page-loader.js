(function (){
    "use strict";

    angular.module('app.directives').directive('pageLoader', function ($sce){

      var directive = {};
      directive.restrict = 'E';
      directive.templateUrl = getView('page-loader', $sce);

      return directive;

    });

})();
