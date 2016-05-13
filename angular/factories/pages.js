(function (){
    "use strict";

    angular.module('app.factories').factory('Pages', function ($resource){

        //Allows me to add some extra params appending them to the defaults object
        var resourceMethod = function resourceMethod (_params) {

          //set By Default for all methods
          var defaults = {
            method:'POST',
            params: {
              SiteID: window.SiteID
             },
            isArray: false,

            //The headers is required to be form data, else the data will be sent via Request Payload
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},

            //Transform the form data from json to normal form data
            transformRequest: function(obj) {

              //Ensure that we get the json matching the model and not an instance of ngResource
              if ( typeof obj == "object" && typeof obj.toJSON == "function" ) {
                obj = obj.toJSON();
              }

              // NOTE: TO SEND POST DATA WIH MULTILEVEL JSON PER DARWIN REQUEST
             //obj.content = JSON.stringify({Content: obj });

              var str = [];
              for (var p in obj) {

                var key = encodeURIComponent(p);
                var value = encodeURIComponent(obj[p]);

                //Check if attibute value is object/json/array inside, so stringigy (common case is for page.seo it is an object)
               if ( typeof obj[p] == "object" ) {
                 for (var o in obj[p]) {
                    value = encodeURIComponent(JSON.stringify(obj[p]));
                 }
               }

               if ( key.toLowerCase() == "active" ) {
                if ( value == "True" ) {
                  value = 1;
                }

                if ( value == "False" ) {
                  value = 0;
                }
               }

               if ( key == "SiteID" && value === "" ) {
                value = _config.SiteID;
               }

                //push the new key, value to the form data from json object
                str.push(key + "=" + value);
              }
              return str.join("&");
            }
          };

          //TODO: the variable sp=pages/{{whatever}} is neccesary for my webservice (in php).
          //Please remove when you integrate the new webservice in asp
          if ( typeof _params == 'object' ) {
            for (var param in _params) {
              if (_params.hasOwnProperty(param)) {
                defaults.params[param] = _params[param];
              }
            }
          }

          //return the defaults;
          
          return defaults;
        };

        //Default parameters sent in every request
        var createParams = {
          SiteID: _config.SiteID
        };

        var updateParams = {
          SiteID: _config.SiteID
        };

        var destroyParams = {
          SiteID: _config.SiteID,
          Active: 0
        };

        var restoreParams = {
          SiteID: _config.SiteID,
          Active: 1
        };

        if ( !_config.touched ) {
          createParams.sp = 'pages/store';
          updateParams.sp = 'pages/update';
          destroyParams.sp = 'pages/destroy';
          restoreParams.sp = 'pages/restore';
        }


        return $resource(_config.WebService||'', { }, {

            //Method extend for Pages Factory instance of $resource to allow create an item
            'create': resourceMethod(createParams),

            //Method extend for Pages Factory instance of $resource to allow update an item
            'update': resourceMethod(updateParams),

            //Method extend for Pages Factory instance of $resource to allow delete an item
            'destroy': resourceMethod(destroyParams),

            //Method extend for Pages Factory instance of $resource to allow restore an item
            'restore': resourceMethod(restoreParams)


        });
      });
})();
