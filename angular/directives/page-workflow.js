(function (){
    "use strict";

    angular.module('app.directives').directive('pageWorkflow', function ($sce){

      var directive = {};
      directive.restrict = 'E';
      directive.templateUrl = getView('page-workflow', $sce);


      return directive;

    });

})();
