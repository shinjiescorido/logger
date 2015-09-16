'use strict';

var _       = require( 'lodash' );
var winston = require( 'winston' );
var os      = require( 'os' );

// Logger placeholder
var logger;

function setConfigs ( options ) {
	if ( !options || !options.file || !options.file.filename ) {
		throw new Error( 'options.file.filename is required' );
	}

	var defaultOptions = {
		'file' : {
			'level'    : 'error',
			'logstash' : true,
			'maxsize'  : 15000000
		},

		'console' : {
			'level' : 'error'
		},

		'additional' : {
			'hostname'   : os.hostname(),
			'dockerhost' : process.env.DOCKER_HOST || 'undefined'
		}
	};

	options = _.defaultsDeep( options, defaultOptions );
}

function getLogger ( options ) {
	logger = new winston.Logger( {
		'transports' : [
			new ( winston.transports.Console )( options.console ),
			new ( winston.transports.File )( options.file )
		]
	} );

	logger.log = function () {
		var args = Array.prototype.slice.call( arguments );

		// If append the additional data
		var lastItem = args[ args.length - 1 ];
		if ( typeof lastItem === 'object' && !Array.isArray( lastItem ) ) {
			lastItem = _.defaultsDeep( lastItem, options.additional );
		} else {
			args.push( options.additional );
		}

		winston.Logger.prototype.log.apply( this, args );

	};

	return logger;
}

module.exports = function ( options ) {
	if ( !logger ) {
		setConfigs( options );

		logger = getLogger( options );
	}

	return logger;
};
