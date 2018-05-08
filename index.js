const winstonConfig = require('./config/winston')
const debug = require('debug')

function getLog (winston = winstonConfig) {
  let log
  const skips = []
  const names = []
  /**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 */
  function init (namespaces) {
    const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/)
    const len = split.length

    for (var i = 0; i < len; i++) {
      if (!split[i]) continue // ignore empty strings
      namespaces = split[i].replace(/\*/g, '.*?')
      if (namespaces[0] === '-') {
        skips.push(new RegExp('^' + namespaces.substr(1) + '$'))
      } else {
        names.push(new RegExp('^' + namespaces + '$'))
      }
    }
  }
  /**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 */

  function isEnabled (name) {
    let i, len
    for (i = 0, len = skips.length; i < len; i++) {
      if (skips[i].test(name)) {
        return false
      }
    }
    for (i = 0, len = names.length; i < len; i++) {
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

  if (process.env.NODE_ENV === 'production') {
  // log is winston
    log = (name) => {
      const template = `[${name}]`
      const log = (level, ...msgs) => {
        winston.log(level, `${template} : `, ...msgs)
      }
      const wrapCall = (call, ...msgs) => {
        call(`${template} : `, ...msgs)
      }
      // debug loging level will be appended based on configuration , use same env as debug use(DEBUG=*)
      let debug
      if (!isEnabled(name)) {
        debug = (...msgs) => {}
      } else {
        debug = (...msgs) => wrapCall(winston.debug, ...msgs)
      }

      return {
        log,
        silly: (...msgs) => wrapCall(winston.silly, ...msgs),
        debug, // depend on filter
        verbose: (...msgs) => wrapCall(winston.verbose, ...msgs),
        info: (...msgs) => wrapCall(winston.info, ...msgs),
        warn: (...msgs) => wrapCall(winston.warn, ...msgs),
        error: (...msgs) => wrapCall(winston.error, ...msgs)
      }
    }
  } else {
    // put all to debug, note that DEBUG filters all levels
    log = (name) => {
      const log = debug(name)
      return {
        log: (level, ...msgs) => log(`[${level.toUpperCase()}] : `, ...msgs),
        silly: (...msgs) => log(`[SILLY] : `, ...msgs),
        debug: (...msgs) => log(`[DEBUG] : `, ...msgs),
        verbose: (...msgs) => log(`[VERBOSE] : `, ...msgs),
        info: (...msgs) => log(`[INFO] : `, ...msgs),
        warn: (...msgs) => log(`[WARN] : `, ...msgs),
        error: (...msgs) => log(`[ERROR] : `, ...msgs)
      }
    }
  }
  log.getLog = getLog
  return log
}
module.exports = getLog()
