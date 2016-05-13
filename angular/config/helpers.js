(function (g){
    "use strict";

    g.getView = function( viewName, $sce ){
      var url =  _config.viewsUrl + 'views/app/' + viewName + '/' + viewName + _config.viewsExt;
      return $sce.trustAsResourceUrl(url);
    };

})(window);
