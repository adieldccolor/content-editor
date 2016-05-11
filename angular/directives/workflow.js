(function (){
    "use strict";

    angular.module('app.directives').directive('workflow', function ($sce,PageDetails, $rootScope){
      
      var directive = {};
      directive.link = function(){
        PageDetails.fn.resizeArea();
        PageDetails.fn.fitScreen();
        $rootScope.$$childHead.editor.ready = true;
      };
      directive.templateUrl = getView('workflow', $sce);

      return directive;

    });

})();
