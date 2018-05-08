# Greenrenge Logger
Example 
```
const logger = require(grn-logger)('test:example')
logger.info('this is an info')
logger.error('this is an error)
logger.log('debug','this is an debug)
```

## Log under the hood depends on which NODE_ENV currently run on.
* production --> sent all to winston
* others --> debug

## Important note
* debug level is always on concepts of 'debug' module, use ```DEBUG=*,-*agenda* ```for example, see [debug documents](https://github.com/visionmedia/debug)
* other levels on winston will be always logged out while on debug will depend on 'debug' module concepts

