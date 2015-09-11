# Git Refs
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
		'filename' : 'logs/myLogFile.log',
	},

	'console' : {
		'level' : 'debug'
	},

	// These are additional fields that get added to all logs
	'additional' : {
		'container' : 'user-service',

		// The items below are defaults added by the library automatically
		'hostname'   : os.hostname(),
		'dockerhost' : process.env.DOCKERHOST || 'undefined'
	}
};

var logger = require( '@sinet/logger' )( options );

logger.error( 'error message', { 'method': 'v1.users.get', 'payload', payload } );
```

## Contributing
All pull requests must follow [coding conventions and standards](https://github.com/School-Improvement-Network/coding-conventions).

[david-badge]: https://david-dm.org/School-Improvement-Network/logger.svg
[david-badge-link]: https://david-dm.org/School-Improvement-Network/logger
[david-dev-badge]: https://david-dm.org/School-Improvement-Network/logger/dev-status.svg
[david-dev-badge-link]: https://david-dm.org/School-Improvement-Network/logger
[david-dev-badge-link]: https://david-dm.org/School-Improvement-Network/logger#info=devDependencies
[ci-badge]: https://circleci.com/gh/School-Improvement-Network/logger.svg?style=shield
[ci-badge-link]: https://circleci.com/gh/School-Improvement-Network/logger
