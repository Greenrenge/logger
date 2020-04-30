const debug = require("debug")
const fs = require("fs-extra")

const { loggerPath, createWinston } = require("./create-winston")

function getLog(inputWinston) {
  const winston = inputWinston || createWinston()
  let createLogFolder = !!inputWinston

  let createLogForFile
  const skips = []
  const names = []
  /**
   * Enables a debug mode by namespaces. This can include modes
   * separated by a colon and wildcards.
   *
   * @param {String} namespaces
   */
  function init(namespace) {
    let namespaces = namespace
    const split = (typeof namespaces === "string" ? namespaces : "").split(
      /[\s,]+/,
    )
    const len = split.length

    for (let i = 0; i < len; i += 1) {
      // eslint-disable-next-line no-continue
      if (!split[i]) continue // ignore empty strings
      namespaces = split[i].replace(/\*/g, ".*?")
      if (namespaces[0] === "-") {
        skips.push(new RegExp(`^${namespaces.substr(1)}$`))
      } else {
        names.push(new RegExp(`^${namespaces}$`))
      }
    }
  }
  /**
   * Returns true if the given mode name is enabled, false otherwise.
   *
   * @param {String} name
   * @return {Boolean}
   */

  function isEnabled(name) {
    let i
    let len
    for (i = 0, len = skips.length; i < len; i += 1) {
      if (skips[i].test(name)) {
        return false
      }
    }
    for (i = 0, len = names.length; i < len; i += 1) {
      if (names[i].test(name)) {
        return true
      }
    }
    return false
  }

  if (process.env.DEBUG) {
    // if debug has been set, we will filter namespaces for debugging
    init(process.env.DEBUG)
  }
  if (process.env.NODE_ENV === "production") {
    // log is winston
    createLogForFile = name => {
      const template = `[${name}]`
      const log = (level, ...msgs) => {
        winston.log(level, `${template} : `, ...msgs)
      }
      const wrapCall = (call, ...msgs) => {
        if (createLogFolder) {
          fs.mkdirpSync(loggerPath)
          createLogFolder = false
        }
        call(`${template} : `, ...msgs)
      }
      // debug loging level will be appended based on configuration , use same env as debug use(DEBUG=*)
      let debugCall
      if (!isEnabled(name)) {
        debugCall = () => {}
      } else {
        debugCall = (...msgs) => wrapCall(winston.debug, ...msgs)
      }

      return {
        log,
        silly: (...msgs) => wrapCall(winston.silly, ...msgs),
        debug: debugCall, // depend on filter
        verbose: (...msgs) => wrapCall(winston.verbose, ...msgs),
        info: (...msgs) => wrapCall(winston.info, ...msgs),
        warn: (...msgs) => wrapCall(winston.warn, ...msgs),
        error: (...msgs) => wrapCall(winston.error, ...msgs),
      }
    }
  } else {
    // put all to debug, note that DEBUG filters all levels
    createLogForFile = name => {
      const logger = debug(name)
      logger.enabled = true
      let debugCall
      if (!isEnabled(name)) {
        debugCall = () => {}
      } else {
        debugCall = (...msgs) => logger("[DEBUG] : ", ...msgs)
      }
      return {
        log: (level, ...msgs) => {
          logger(`[${level.toUpperCase()}] : `, ...msgs)
        },
        silly: (...msgs) => logger("[SILLY] : ", ...msgs),
        debug: debugCall,
        verbose: (...msgs) => logger("[VERBOSE] : ", ...msgs),
        info: (...msgs) => logger("[INFO] : ", ...msgs),
        warn: (...msgs) => logger("[WARN] : ", ...msgs),
        error: (...msgs) => logger("[ERROR] : ", ...msgs),
      }
    }
  }
  createLogForFile.getLog = getLog
  return createLogForFile
}

module.exports = getLog()
