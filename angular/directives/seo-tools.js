(function (){
    "use strict";

    angular.module('app.directives').directive('seoTools', function ($sce,PageDetails, $rootScope){
    	
      var directive = {};
      directive.templateUrl = getView('seo-tools', $sce);
      return directive;

    });

})();
