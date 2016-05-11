(function (global){
    "use strict";

    //NOTE: IMPORTANT! VALIDATIONS AND FILTERS FOR IE UNSUPPORTED METHODS
	var userAgent = navigator.userAgent;
	document.body.setAttribute('data-useragent', userAgent); 
	

	var browserCheck = {};

	browserCheck.isIE11 = function() {
		return userAgent.indexOf('Trident/7.0') > -1;
	};

	browserCheck.isIE10 = function() {
		return userAgent.indexOf('MSIE 10.0') > -1;
	};

	global.browserCheck = browserCheck;

})(window);
