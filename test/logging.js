'use strict';

/* eslint no-underscore-dangle:0 */

var rewire     = require( 'rewire' );
var should     = require( 'should' );
var os         = require( 'os' );

require( 'should' );

describe( 'Additional fields', function () {
	var hostname = os.hostname();
	var logger;
	var result;

	before( function ( done ) {
		var rewireLogger = rewire( '../' );

		var winstonMock = function () {
			result = arguments;
			return;
		};

		rewireLogger.__set__( 'winston.Logger.prototype.log', winstonMock );

		var options = {
			'file' : {
				'filename' : 'test/logs.log'
			}
		};

		logger = rewireLogger( options );
		done();
	} );

	describe( 'Simple message', function () {
		before( function ( done ) {
			logger.error( 'test' );
			done();
		} );

		it( 'should have correct log level', function () {
			result.length.should.equal( 3 );
			result[ 0 ].should.equal( 'error' );
		} );

		it( 'should have correct message', function () {
			result[ 1 ].should.equal( 'test' );
		} );

		it( 'should have additional default properties', function () {
			should( result[ 2 ] ).have.property( 'hostname' ).be.type( 'string' ).equal( hostname );
			should( result[ 2 ] ).have.property( 'dockerhost' ).be.type( 'string' ).equal( 'undefined' );
		} );
	} );

	describe( 'Only object as message', function () {
		before( function ( done ) {
			var a = { 'a' : 'b' };
			logger.error( a );
			done();
		} );

		it( 'should have correct log level', function () {
			result.length.should.equal( 2 );
			result[ 0 ].should.equal( 'error' );
		} );

		it( 'should merge object with default properties', function () {
			should( result[ 1 ] ).have.property( 'hostname' ).be.type( 'string' ).equal( hostname );
			should( result[ 1 ] ).have.property( 'dockerhost' ).be.type( 'string' ).equal( 'undefined' );
			should( result[ 1 ] ).have.property( 'a' ).be.type( 'string' ).equal( 'b' );
		} );
	} );

	describe( 'String and object message', function () {
		before( function ( done ) {
			var a = { 'a' : 'b' };
			logger.error( 'test', a );
			done();
		} );

		it( 'should have correct log level', function () {
			result.length.should.equal( 3 );
			result[ 0 ].should.equal( 'error' );
		} );

		it( 'should have correct message', function () {
			result[ 1 ].should.equal( 'test' );
		} );

		it( 'should merge object with default properties', function () {
			should( result[ 2 ] ).have.property( 'hostname' ).be.type( 'string' ).equal( hostname );
			should( result[ 2 ] ).have.property( 'dockerhost' ).be.type( 'string' ).equal( 'undefined' );
			should( result[ 2 ] ).have.property( 'a' ).be.type( 'string' ).equal( 'b' );
		} );
	} );

} );
