'use strict';

require( 'should' );

describe( 'Require singleton', function () {
	let logger;

	before( function ( done ) {
		const options = {
			'file' : {
				'filename' : 'logs.log'
			}
		};

		const options2 = {
			'file' : {
				'filename' : 'test.log',
				'level'    : 'silly',
				'maxsize'  : 100,
				'tailable' : false
			},

			'console' : {
				'level' : 'debug'
			}
		};

		// Initially Configure
		require( '../' )( options );

		// Require again to get singleton new options won't be used
		logger = require( '../' )( options2 );
		done();
	} );

	it( 'should provide singleton with original config', function () {
		logger.transports.file.filename.should.be.of.type( 'string' ).and.equal( 'logs.log' );
		logger.transports.file.logstash.should.be.of.type( 'boolean' ).and.equal( true );
		logger.transports.file.maxsize.should.be.of.type( 'number' ).and.equal( 15000000 );
		logger.transports.file.tailable.should.be.of.type( 'boolean' ).and.equal( false );
	} );
} );
