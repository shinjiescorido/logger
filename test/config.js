'use strict';

var requireNew = require( 'require-new' );

require( 'should' );

describe( 'Invalid config', function () {

	var error;

	before( function ( done ) {
		try {
			requireNew( '../' )();

		} catch ( e ) {
			error = e;
			done();
		}

	} );

	it( 'should throw error', function () {
		error.message.should.be.of.type( 'string' ).and.equal( 'options.file.filename is required' );
	} );

} );

describe( 'Standard config', function () {
	var logger;

	before( function ( done ) {
		var options = {
			'file' : {
				'filename' : 'logs.log'
			}
		};

		logger = requireNew( '../' )( options );
		done();

	} );

	it( 'should have default console settings', function () {
		logger.transports.console.level.should.be.of.type( 'string' ).and.equal( 'error' );
	} );

	it( 'should have default file settings', function () {
		logger.transports.file.filename.should.be.of.type( 'string' ).and.equal( 'logs.log' );
		logger.transports.file.level.should.be.of.type( 'string' ).and.equal( 'error' );
		logger.transports.file.logstash.should.be.of.type( 'boolean' ).and.equal( true );
		logger.transports.file.maxsize.should.be.of.type( 'number' ).and.equal( 15000000 );
		logger.transports.file.tailable.should.be.of.type( 'boolean' ).and.equal( false );
	} );

} );

describe( 'Custom config', function () {
	var logger;

	before( function ( done ) {
		var options = {
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
