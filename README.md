# Logger
[![Build Status][ci-badge]][ci-badge-link]
[![Dependency Status][david-badge]][david-badge-link]
[![devDependency Status][david-dev-badge]][david-dev-badge-link]

Winston logger to use with the [Logstash](https://www.elastic.co/products/logstash) and [Kibana](https://www.elastic.co/products/kibana).

## Usage

```bash
npm install @sinet/logger --save
```

### Example
```javascript
// Options are for winston transports, file and console
var options = {
	'file' : {
		// File transport is enabled on development and production environment
		'enabled'  : [ 'development', 'production' ],
		'filename' : 'logs/myLogFile.log',
	},

	'console' : {
		// Console transport is enabled only in development environment
		'enabled' : [ 'development' ],
		'level'   : 'debug'
	},

	'logstash' : {
		'enabled' : [ 'production' ],
		'port'    : 9563
	},

	// These are additional fields that get added to all logs
	'additional' : {
		'container' : 'user-service',

		// The items below are defaults added by the library automatically
		'hostname'   : os.hostname(),
		'dockerhost' : process.env.DOCKER_HOST || 'undefined'
	}
};

var logger = require( '@sinet/logger' )( options );

logger.error( 'error message', { 'method': 'v1.users.get', 'payload', payload } );
```

## FAQs

1. What happens when I add a `file` or `console` option without setting the `enabled` property?
```javascript
// Example
var options = {
	'file'    : {},
	'console' : {}
}
```

Answer:
If `file` and/or `console` is explicitly provided without setting the enabled property it will log in any environment.


## Contributing
All pull requests must follow [coding conventions and standards](https://github.com/sinet/coding-conventions).

[david-badge]: https://david-dm.org/sinet/logger.svg
[david-badge-link]: https://david-dm.org/sinet/logger
[david-dev-badge]: https://david-dm.org/sinet/logger/dev-status.svg
[david-dev-badge-link]: https://david-dm.org/sinet/logger
[david-dev-badge-link]: https://david-dm.org/sinet/logger#info=devDependencies
[ci-badge]: https://circleci.com/gh/sinet/logger.svg?style=shield
[ci-badge-link]: https://circleci.com/gh/sinet/logger
