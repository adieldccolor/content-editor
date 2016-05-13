(function (g){
    "use strict";

    function Config() {
      this.isSupported = true;
      this.SiteID = 'SITEID-123';
      this.WebService = 'webservice/pages/index.php';
      this.baseClientSiteUrl = '';
      this.viewsUrl = '';
      this.SiteAlias = 'responsive_template04';
      this.viewsExt = '.html';
      this.touched = false;
      this.rootFile = "index.html";
    }

    Config.prototype.setProp = function() {
      var propName, propValue;

      this.touched = true;

      if ( arguments.length == 2 ) {
        propName = arguments[0];
        propValue = arguments[1];

        if ( propName == "support" ) {
          this.isSupported = propValue;
        }

        if ( this.hasOwnProperty(propName) ) {

          if ( propName == "baseClientSiteUrl" ) {
            this.viewsUrl = this.baseClientSiteUrl + this.viewsUrl.replace(this.baseClientSiteUrl, propValue);
          }

          this[propName] = propValue;

          if ( propName == "viewsUrl" ) {
            this[propName] = this.baseClientSiteUrl + propValue;
          }

        }

        return true;
      }

      if( typeof console !== "undefined" ) {
        console.error('Expected 2 arguments, only ' + arguments.length + ' provided.');
      }

      return false;
    };

    Config.prototype.refresh = function() {

      //If user wants to override options
      if ( typeof _envConfig !== "undefined" ) {
        for ( var key in _envConfig ) {
          if ( _config.hasOwnProperty(key) && _envConfig.hasOwnProperty(key) ) {
            _config.setProp(key, _envConfig[key]);
          }
        }
      }

      //Set BaseTag
      // var baseSearch = window.location.search;
      // var baseUrl =  window.location.href.replace( baseSearch, '').replace(_config.rootFile, '') + _config.rootFile + baseSearch;
      var baseUrl = window.location.href.split('/');
      baseUrl[ baseUrl.length - 1 ] = '';
      baseUrl = baseUrl.join('/');
      angular.element('base').attr('href', baseUrl);
    };

    g._config = new Config();
    _config.refresh();

})(window);
