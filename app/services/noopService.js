'use strict';

angular.module('angularApp').service('noopService', function(){
	return {
		getSomeText : function(){return'çool text';}
	};
});