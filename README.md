# Greenrenge Logger
Example 
```
const logger = require(@greenrenge/logger)('test:example')
logger.info('this is an info')
logger.error('this is an error)
logger.log('debug','this is an debug)
```

## In case of winston injection setting
```
var logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      name: 'console.info',
      level: 'info',
      timestamp: true,
      colorize: true
    })
  ]
})
const logger = require(@greenrenge/logger).getLog(logger)('this_is_my_winston_transport')
```

## Log under the hood depends on which NODE_ENV currently run on.
* production --> sent all to winston
* others --> debug

## Important note
* debug level is always on concepts of 'debug' module, use ```DEBUG=*,-*agenda* ```for example, see [debug documents](https://github.com/visionmedia/debug)
* other levels on winston will be always logged out while on debug will depend on 'debug' module concepts

