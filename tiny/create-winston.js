const { createLogger, transports, format } = require("winston")
const path = require("path")

const cwd = process.cwd()
const loggerPath = path.join(cwd, "/log")

const createWinston = (
  { level: logLevel = "debug", logFile = true } = {
    level: "debug",
    logFile: true,
  },
) =>
  createLogger({
    transports: [
      new transports.Console({
        handleExceptions: true,
        format: format.combine(
          format.timestamp(),
          format.printf(({ level, timestamp, message }) => {
            return `${timestamp} [${level.toUpperCase()}] ${message}`
          }),
        ),
      }),
      logFile &&
        new transports.File({
          filename: "log.log",
          level: logLevel,
          dirname: loggerPath,
          json: false,
          maxsize: 10485760,
          maxFiles: 3,
          timestamp: true,
          tailable: true,
        }),
    ].filter(a => !!a),
    exceptionHandlers: [
      logFile &&
        new transports.File({
          filename: "exceptions.log",
          dirname: loggerPath,
          json: false,
          maxsize: 10485760,
          maxFiles: 3,
          timestamp: true,
          tailable: true,
        }),
    ].filter(a => !!a),
  })

module.exports = {
  createWinston,
  loggerPath,
}
