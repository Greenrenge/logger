const winston = require("winston")
const dailyRotateFile = require("winston-daily-rotate-file")
const fs = require("fs")
const defaultConfig = require("./config")

winston.transports.DailyRotateFile = dailyRotateFile

class Logger {
  constructor(config) {
    this.levels = ["error", "warn", "info", "verbose", "debug", "silly"]
    this.logLevel = "debug"
    this.config = config
    if (this.config.enableLogFile) {
      fs.existsSync(config.logDirectory) || fs.mkdirSync(config.logDirectory)
    }
    this.logger = {
      error: this.initialize("error"),
      warn: this.initialize("warn"),
      info: this.initialize("info"),
      verbose: this.initialize("verbose"),
      debug: this.initialize("debug"),
      silly: this.initialize("silly"),
    }
  }

  initialize(level) {
    const zippedArchive = false
    const enableJson = false
    const { maxFiles } = this.config
    const datePattern = this.config.datePattern || "YYYYMMDD"

    const exceptionHandlers = [
      new winston.transports.Console({
        json: false,
        timestamp: true,
        colorize: true,
      }),
    ]

    if (this.config.enableLogFile) {
      exceptionHandlers.push(
        new winston.transports.DailyRotateFile({
          name: "file",
          dirname: this.config.logDirectory,
          filename: "exceptions.%DATE%.log",
          json: enableJson,
          datePattern,
          zippedArchive,
          ...(maxFiles && { maxFiles }),
        }),
      )
    }

    const options = {
      transports: [
        new winston.transports.Console({
          name: "console",
          level,
          timestamp: true,
          colorize: true,
        }),
      ],
      exitOnError: false,
    }
    if (level === "error") {
      options.exceptionHandlers = exceptionHandlers // exception level error only
    }

    const logger = new winston.Logger(options)

    if (this.config.enableLogFile) {
      logger.add(winston.transports.DailyRotateFile, {
        level,
        name: "file",
        dirname: this.config.logDirectory,
        filename: `${level}.%DATE%.log`,
        json: enableJson,
        datePattern,
        zippedArchive,
        // maxFiles: maxFiles
      })
    }

    return logger
  }

  setLevel(level = "debug") {
    if (typeof level === "string" && this.levels.indexOf(level) !== -1) {
      this.logLevel = level
      this.setLevels()
    } else {
      console.error(`setLevel() called with invalid level: "${level}"`)
    }
  }

  getLevel() {
    return this.logLevel
  }

  setLevels() {
    Object.keys(this.logger).forEach(level => {
      Object.keys(this.logger[level].transports).forEach(transport => {
        this.logger[level].transports[transport].level = this.logLevel
      })
    })
  }

  enableAll() {
    this.setLevel("debug")
  }

  disableAll() {
    this.setLevel("error")
  }

  _checkLevel(log) {
    return this.levels.indexOf(log) > -1
  }

  log(...log) {
    let level = "info"
    if (this._checkLevel(log[0])) {
      level = log[0]
    } else {
      log.unshift("info")
    }
    let message = null
    switch (level) {
      case "error":
        message = this._parse(log)
        this.logger.error.log(...message)
        break
      case "warn":
        message = this._parse(log)
        this.logger.warn.log(...message)
        break
      case "info":
        message = this._parse(log)
        this.logger.info.log(...message)
        break
      case "verbose":
        message = this._parse(log)
        this.logger.verbose.log(...message)
        break
      case "debug":
        message = this._parse(log)
        this.logger.debug.log(...message)
        break
      default:
        break
    }
  }

  error(...log) {
    const message = this._parse(log)
    this.logger.error.log("error", ...message)
  }

  warn(...log) {
    const message = this._parse(log)
    this.logger.warn.log("warn", ...message)
  }

  info(...log) {
    const message = this._parse(log)
    this.logger.info.log("info", ...message)
  }

  verbose(...log) {
    const message = this._parse(log)
    this.logger.verbose.log("verbose", ...message)
  }

  debug(...log) {
    const message = this._parse(log)
    this.logger.debug.log("debug", ...message)
  }

  _parse(log) {
    return log.map(element => {
      if (typeof element === "object") {
        const obj = {}
        // iterate check object all key then convert to json.stringify
        Object.keys(element).forEach(k => {
          // parse body, query, params from req
          if (k === "req" && element[k] && typeof element[k] === "object") {
            obj.req = this._parseRequest(element.req)
          } else {
            // convert another object
            obj[k] = this._parseObject(element[k])
          }
        })
        return obj
      }
      // if string then return
      return element
    })
  }

  _parseObject(message) {
    return JSON.stringify(message)
  }

  _parseRequest({ body, query, params }) {
    const info = {
      body,
      query,
      params,
    }
    return { requestInfo: JSON.stringify(info) }
  }
}

module.exports = {
  getLogger: () => new Logger(defaultConfig),
  Logger,
}
