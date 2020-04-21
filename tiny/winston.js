const winston = require("winston")
const path = require("path")

const cwd = process.cwd()
const loggerPath = path.join(cwd, "/log")

const winstonLogger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      name: "console.info",
      level: "info",
      silent: true,
      timestamp: true,
      colorize: true,
    }),
    new winston.transports.Console({
      name: "console.error",
      level: "error",
      silent: true,
      timestamp: true,
      colorize: true,
    }),
    new winston.transports.Console({
      name: "console.warn",
      level: "warn",
      silent: true,
      timestamp: true,
      colorize: true,
    }),
    new winston.transports.File({
      filename: path.join(loggerPath, "/error.log"),
      name: "file.error",
      level: "error",
      json: false,
      maxsize: 10485760,
      maxFiles: 5,
      timestamp: true,
      tailable: true,
    }),
    new winston.transports.File({
      filename: path.join(loggerPath, "/warn.log"),
      name: "file.warn",
      level: "warn",
      json: false,
      maxsize: 10485760,
      maxFiles: 3,
      timestamp: true,
      tailable: true,
    }),
    new winston.transports.File({
      filename: path.join(loggerPath, "/info.log"),
      name: "file.info",
      level: "info",
      json: false,
      maxsize: 10485760,
      maxFiles: 3,
      timestamp: true,
      tailable: true,
    }),
    new winston.transports.File({
      filename: path.join(loggerPath, "/debug.log"),
      name: "file.debug",
      level: "debug",
      json: false,
      maxsize: 10485760,
      maxFiles: 3,
      timestamp: true,
      tailable: true,
    }),
  ],
  exceptionHandlers: [
    new winston.transports.Console({
      json: false,
      timestamp: true,
      colorize: true,
    }),
    new winston.transports.File({
      filename: path.join(loggerPath, "/system_error.log"),
      json: false,
      maxsize: 10485760,
      maxFiles: 3,
      timestamp: true,
      tailable: true,
    }),
  ],
})

module.exports = {
  winstonLogger,
  loggerPath,
}
