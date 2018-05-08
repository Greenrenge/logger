var winston = require('winston')
var fs = require('fs')

// create log folder if not exists
if (!fs.existsSync('./log')) {
  fs.mkdirSync('./log')
}

var logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      name: 'console.info',
      level: 'info',
      silent: true, // disable ?
      timestamp: true,
      colorize: true
    }),
    new winston.transports.Console({
      name: 'console.error',
      level: 'error',
      silent: true,
      timestamp: true,
      colorize: true
    }),
    new winston.transports.Console({
      name: 'console.warn',
      level: 'warn',
      silent: true,
      timestamp: true,
      colorize: true
    }),
    new winston.transports.File({
      filename: './log/error.log',
      name: 'file.error',
      level: 'error',
      json: false,
      maxsize: 10485760,
      maxFiles: 5,
      timestamp: true,
      tailable: true
    }),
    new winston.transports.File({
      filename: './log/warn.log',
      name: 'file.warn',
      level: 'warn',
      json: false,
      maxsize: 10485760,
      maxFiles: 3,
      timestamp: true,
      tailable: true
    }),
    new winston.transports.File({
      filename: './log/info.log',
      name: 'file.info',
      level: 'info',
      json: false,
      maxsize: 10485760,
      maxFiles: 3,
      timestamp: true,
      tailable: true
    }),
    new winston.transports.File({
      filename: './log/debug.log',
      name: 'file.debug',
      level: 'debug',
      json: false,
      maxsize: 10485760,
      maxFiles: 3,
      timestamp: true,
      tailable: true
    })

    // new winston.transports.File({ filename:  './debug.log', name: 'file.debug', level: 'debug', json : false })
  ],
  exceptionHandlers: [
    new winston.transports.Console({
      json: false,
      timestamp: true,
      colorize: true
    }),
    new winston.transports.File({
      filename: './log/system_error.log',
      json: false,
      maxsize: 10485760,
      maxFiles: 3,
      timestamp: true,
      tailable: true
    })
  ]
})

module.exports = logger
