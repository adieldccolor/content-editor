(function(){
    "use strict";

    angular.module("app.services").factory('DialogService', function( $mdDialog ){

        return {
            fromTemplate: function( template, $scope ) {

                var options = {
                    templateUrl: 'public/views/dialogs/' + template + '/' + template + '.html'
                };

                if ( $scope ){
                    options.scope = $scope.$new();
                }

                return $mdDialog.show(options);
            },

            hide: function(){
                return $mdDialog.hide();
            },

            alert: function(title, content){
                $mdDialog.show(
                    $mdDialog.alert()
                    .title(title)
                    .content(content)
                    .ok('Ok')
                    );
            },
            confirm: function(title, content, okText, cancelText, okCallback, cancelCallback, $scope, $event){
              var confirm = $mdDialog.confirm()
                  .title(title)
                  .textContent(content)
                  .targetEvent($event)
                  .ok(okText||"Ok")
                  .cancel(cancelText||"Cancel");
              $mdDialog.show(confirm).then(function() {
                if( typeof okCallback == "function" ) okCallback();
              }, function() {
                if( typeof cancelCallback == "function" ) cancelCallback();
              });
            }
        };
    });
})();
