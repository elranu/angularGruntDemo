'use strict';

module.exports = function (grunt) {

	var appConfig = {
		appPath : 'app',
		dist : 'dist',
		tempPath: '.temp'
		//distJsName = 'built.js'
	};
	
	appConfig.jsFiles = [appConfig.appPath + '/**/*.js'];
	appConfig.bowerJsFiles = ['bower.json'];
	appConfig.allJsFiles = appConfig.bowerJsFiles.concat(appConfig.jsFiles);
	
	//load grunt Plugins
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-injector');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-bower-concat');
	grunt.loadNpmTasks('grunt-ng-annotate');
	
	grunt.loadNpmTasks('grunt-contrib-connect');


	grunt.initConfig({
		//set config
		appConfig : appConfig,

		connect: {
		    server: {
		      options: {
		        port: 9001,
		        hostname: 'localhost',
		        keepalive: true
		      }
		    }
		},
		
		injector: {
	    	options: {},
	    	originals: {
	      		files: {
	        		'<%=appConfig.appPath %>/index.html': appConfig.allJsFiles
	        	}
	      	},
	      	minified : {
	      		files: {
	        		'<%=appConfig.appPath %>/index.html': [appConfig.dist +'/output.min.js']
	        	}
	      	}
	    },

	    bower_concat: {
  			all: {
    			dest: appConfig.tempPath + '/_bower.js'
    		}
    	},
    	
    	ngAnnotate: {
	        options: {
	            singleQuotes: true
	        },
	        angularApp : {
	        	files : {
	        		'<%= appConfig.tempPath %>/annotated.js': appConfig.jsFiles  
	        	}
	        } 
	    },

	  	uglify: {
			options: {
		      mangle: false
		    },
		    minified: {
		      files: {
		        '<%=appConfig.dist %>/output.min.js': [appConfig.tempPath + '/_bower.js', '<%= appConfig.tempPath %>/annotated.js']
		      }
		    }
  		}


	});//end grunt intConfig

	grunt.registerTask('build', [
		'bower_concat',
		'ngAnnotate:angularApp',
		'uglify:minified',
		'injector:minified',
	]);

	grunt.registerTask('devBuild', [
		'injector:originals',
	]);

	grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
	    if (target === 'dist') {
	      return grunt.task.run(['build', 'connect']);
	    }
		grunt.task.run(['devBuild', 'connect']);
  	});

};//end grunt