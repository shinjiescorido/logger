'use strict';

const requireNew = require( 'require-new' );
const should     = require( 'should' );

describe( 'No transports defined', function () {
	let logger, error;

	before( function ( done ) {
		logger = requireNew( '../' )();
		logger.on( 'error', function ( err ) {
			error = err;
			done();
		} );
		logger.log( 'Test log' );
	} );

	it( 'should throw error', function () {
		error.message.should.be.of.type( 'string' ).and.equal( 'No transports defined. Cannot produce logs.' );
	} );
} );

describe( 'Winston error missing filename for log file', function () {
	let error;

	before( function ( done ) {
		try {
			requireNew( '../' )( {
				'file' : {}
			} );
		} catch ( e ) {
			error = e;
			done();
		}
	} );

	it( 'should throw error', function () {
		error.message.should.be.of.type( 'string' ).and.equal( 'Cannot log to file without filename or stream.' );
	} );
} );

describe( 'Config with file option', function () {
	let logger;

	before( function ( done ) {
		let options = {
			'file' : {
				'filename' : 'logs.log'
			}
		};

		logger = requireNew( '../' )( options );
		done();
	} );

	it( 'should have default file settings', function () {
		logger.transports.file.filename.should.be.of.type( 'string' ).and.equal( 'logs.log' );
		logger.transports.file.logstash.should.be.of.type( 'boolean' ).and.equal( true );
		logger.transports.file.maxsize.should.be.of.type( 'number' ).and.equal( 15000000 );
		logger.transports.file.tailable.should.be.of.type( 'boolean' ).and.equal( false );
	} );
} );

describe( 'Custom config', function () {
	let logger;

	before( function ( done ) {
		let options = {
			'file' : {
				'filename' : 'test.log',
				'level'    : 'silly',
				'maxsize'  : 100,
				'tailable' : true
			},

			'console' : {
				'level' : 'debug'
			}
		};

		logger = requireNew( '../' )( options );
		done();
	} );

	it( 'should merge with default console settings', function () {
		logger.transports.console.level.should.be.of.type( 'string' ).and.equal( 'debug' );
	} );

	it( 'should merge with default file settings', function () {
		logger.transports.file.filename.should.be.of.type( 'string' ).and.equal( 'test.log' );
		logger.transports.file.level.should.be.of.type( 'string' ).and.equal( 'silly' );
		logger.transports.file.logstash.should.be.of.type( 'boolean' ).and.equal( true );
		logger.transports.file.maxsize.should.be.of.type( 'number' ).and.equal( 100 );
		logger.transports.file.tailable.should.be.of.type( 'boolean' ).and.equal( true );
	} );
} );

describe( 'Config on development mode environment', function () {
	let logger;

	before( function ( done ) {
		let options = {
			'file' : {
				'enabled'  : [ 'production' ],
				'filename' : 'test.log',
				'level'    : 'silly',
				'maxsize'  : 100,
				'tailable' : true
			},

			'console' : {
				'enabled' : [ 'development' ],
				'level'   : 'debug'
			}
		};

		process.env.NODE_ENV = 'development';

		logger = requireNew( '../' )( options );
		done();
	} );

	it( 'should only have console as transport mode on development', function () {
		logger.transports.console.should.be.of.type( 'object' );
		logger.transports.console.log.should.be.of.type( 'function' );

		should.not.exist( logger.transports.file );
	} );
} );

describe( 'Config on production environment', function () {
	let logger;

	before( function ( done ) {
		let options = {
			'file' : {
				'enabled'  : [ 'production' ],
				'filename' : 'test.log',
				'level'    : 'silly',
				'maxsize'  : 100,
				'tailable' : true
			},

			'console' : {
				'enabled' : [ 'development' ],
				'level'   : 'debug'
			}
		};

		process.env.NODE_ENV = 'production';

		logger = requireNew( '../' )( options );
		done();
	} );

	it( 'should only have file as transport mode on production', function () {
		logger.transports.file.should.be.of.type( 'object' );
		logger.transports.file.log.should.be.of.type( 'function' );

		should.not.exist( logger.transports.console );
	} );
} );

describe( 'Config on undefined environment', function () {
	let logger, error;

	before( function ( done ) {
		let options = {
			'file' : {
				'enabled'  : [ 'production' ],
				'filename' : 'test.log',
				'level'    : 'silly',
				'maxsize'  : 100,
				'tailable' : true
			},

			'console' : {
				'enabled' : [ 'development' ],
				'level'   : 'debug'
			}
		};

		process.env.NODE_ENV = undefined;

		logger = requireNew( '../' )( options );
		logger.on( 'error', function ( err ) {
			error = err;
			done();
		} );
		logger.log( 'Test log' );
	} );

	it( 'should throw error', function () {
		error.message.should.be.of.type( 'string' ).and.equal( 'No transports defined. Cannot produce logs.' );
	} );
} );

