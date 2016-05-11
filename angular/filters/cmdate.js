(function (){
    "use strict";

    angular.module('app.filters').filter('cmdate', [
          '$filter', function($filter) {
              return function(input, format) {
                  return $filter('date')(new Date(input), format);
              };
          }
      ]);
})();
