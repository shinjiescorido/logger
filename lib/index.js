'use strict';

const _       = require( 'lodash' );
const winston = require( 'winston' );
const os      = require( 'os' );

// Logstash plugin
require( 'winston-logstash' );

// Logger placeholder
let logger;

function setConfigs ( options ) {
	options = options || {};

	// By default, file and console logs are disabled.
	let defaultEnabledOptions = {
		'file' : {
			'enabled' : []
		},

		'console' : {
			'enabled' : []
		},

		'logstash' : {
			'enabled' : []
		}
	};

	const defaultOptions = {
		'file' : {
			'logstash' : true,
			'maxsize'  : 15000000
		},

		'logstash' : {
			'max_connect_retries'     : -1,
			'timeout_connect_retries' : 3000
		},

		'additional' : {
			'hostname' : os.hostname()
		}
	};

	// This should take care of the condition that whenever a user
	// explicitly adds an option for a log stream it will run in
	// any environment.
	_.defaults( options, defaultEnabledOptions );

	// Add additional options
	_.defaultsDeep( options, defaultOptions );

	return options;
}

function setTransports ( options ) {
	let nodenv = null;

	if ( process.env.NODE_ENV ) {
		nodenv = process.env.NODE_ENV.toLowerCase();
	}

	// Log output stream config -> Winston transport module name
	let modes = {
		'file'     : 'File',
		'console'  : 'Console',
		'logstash' : 'Logstash'
	};

	const transports = _.map( Object.keys( modes ), out => {
		const mode = modes[ out ];

		// By default, if an out stream config is present but
		// `enabled` option is not set it will run in any environment.
		if ( !options[ out ].enabled ) {
			/* eslint no-extra-parens:0 */
			return new ( winston.transports[ mode ] )( options[ out ] );
		}

		if ( options[ out ].enabled.indexOf( nodenv ) !== -1 ) {
			/* eslint no-extra-parens:0 */
			return new ( winston.transports[ mode ] )( options[ out ] );
		}
	} );

	return _.filter( transports, transport => transport !== undefined );
}

// Returns a modified Winston logger instance
function getLogger ( options ) {
	const transports = setTransports( options );

	logger = new winston.Logger( { transports } );

	logger.log = function () {
		if ( transports.length < 1 ) {
			logger.emit( 'error', new Error( 'No transports defined. Cannot produce logs.' ) );
		}

		let args = Array.prototype.slice.call( arguments );

		// If append the additional data
		let lastItem = args[ args.length - 1 ];

		if ( typeof lastItem === 'object' && !Array.isArray( lastItem ) ) {
			lastItem = _.defaultsDeep( lastItem, options.additional );
		} else {
			args.push( options.additional );
		}

		winston.Logger.prototype.log.apply( this, args );
	};

	// Log to console for transport level errors
	transports.forEach( transport =>
		transport.on( 'error', console.log ) );

	return logger;
}

module.exports = function ( options ) {
	return logger || getLogger( setConfigs( options ) );
};
