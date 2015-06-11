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
	appConfig.allJsFiles.push(appConfig.tempPath + '/templates.js'); //tempates at the end
	
	//load grunt Plugins
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-injector');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-bower-concat');
	grunt.loadNpmTasks('grunt-ng-annotate');
	grunt.loadNpmTasks('grunt-filerev');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-angular-templates');
	
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

		clean: [appConfig.dist, appConfig.tempPath ],
		
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

	    ngtemplates:  {
			angularApp: {
				cwd: appConfig.appPath,
				src: 'views/**.html',
			    dest: appConfig.tempPath + '/templates.js',
			}
		},

	  	uglify: {
			options: {
		      mangle: false
		    },
		    minified: {
		      files: {
		        '<%=appConfig.dist %>/scripts/output.min.js': [appConfig.tempPath + '/_bower.js', '<%= appConfig.tempPath %>/annotated.js',  '<%= ngtemplates.angularApp.dest  %>']
		      }
		    }
  		},

  		filerev: {
		    dist: {
		        src: [
		          '<%= appConfig.dist %>/scripts/{,*/}*.js'
		        ]
	     	}
    	},

    	injector: {
	    	options: {},
	    	originals: {
	      		options: {},
	      		files: {
	        		'<%=appConfig.appPath %>/index.html': appConfig.allJsFiles
	        	}
	      	},
	      	minified : {
	      		options: {},
	      		files: {
	        		'<%=appConfig.appPath %>/index.html': [appConfig.dist +'/scripts/*.js']
	        	}
	      	}
	    }
	});//end grunt intConfig

	grunt.registerTask('build', [
		'clean',
		'bower_concat',
		'ngAnnotate:angularApp',
		'ngtemplates',
		'uglify:minified',
		'filerev',
		'injector:minified',
	]);

	grunt.registerTask('devBuild', [
		'clean',
		'ngtemplates',
		'injector:originals',
	]);

	grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
	    if (target === 'dist') {
	      return grunt.task.run(['build', 'connect']);
	    }
		grunt.task.run(['devBuild', 'connect']);
  	});

};//end grunt