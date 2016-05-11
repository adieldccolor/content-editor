(function (){
    "use strict";

    angular.module('app.filters').filter('strip_html_tags', [
          '$filter', function($filter) {
              return function(input, format) {
                if (input) {
                  var tags = /(<([^>]+)>)/ig;
                  input = input.replace(tags,'');
                  input = input.replace(/&nbsp;/g, ' ');
                  input = input.replace(/\n\r/g, ' ');
                  input = input.replace(/\r\n/g, ' ');
                  input = input.replace(/\r/g, ' ');
                  input = input.replace(/\n/g, ' ');
                }

                return input;
              };
          }
      ]);
})();
