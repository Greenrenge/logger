const stdMocks = require("std-mocks")
const sinon = require("sinon")
const mockedEnv = require("mocked-env")
const createLogger = require("../../tiny/index")

describe("Tiny Logger", () => {
  let now
  let clock
  beforeEach(() => {
    clock = sinon.useFakeTimers(new Date("2020-01-28T10:38:33.000Z"))
    now = new Date(clock.Date()).toISOString()
  })
  afterEach(() => {
    clock.restore()
  })
  context("not production", () => {
    it("should use debug to be a logger", () => {
      const { log, debug, info, error, silly, verbose, warn } = createLogger(
        "debug001",
      )
      stdMocks.use()
      log("info", "any will not go to std out")
      info("any will not go to std out")
      debug("any will not go to std out")
      error("any will not go to std out")
      silly("any will not go to std out")
      verbose("any will not go to std out")
      warn("any will not go to std out")
      stdMocks.restore()
      const output = stdMocks.flush()
      output.stdout.should.have.lengthOf(0)
      output.stderr.should.have.lengthOf(6)
      output.stderr.should.deep.equal([
        "  \u001b[38;5;196;1mdebug001 \u001b[0m[INFO] :  any will not go to std out \u001b[38;5;196m+0ms\u001b[0m\n",
        "  \u001b[38;5;196;1mdebug001 \u001b[0m[INFO] :  any will not go to std out \u001b[38;5;196m+0ms\u001b[0m\n",
        "  \u001b[38;5;196;1mdebug001 \u001b[0m[ERROR] :  any will not go to std out \u001b[38;5;196m+0ms\u001b[0m\n",
        "  \u001b[38;5;196;1mdebug001 \u001b[0m[SILLY] :  any will not go to std out \u001b[38;5;196m+0ms\u001b[0m\n",
        "  \u001b[38;5;196;1mdebug001 \u001b[0m[VERBOSE] :  any will not go to std out \u001b[38;5;196m+0ms\u001b[0m\n",
        "  \u001b[38;5;196;1mdebug001 \u001b[0m[WARN] :  any will not go to std out \u001b[38;5;196m+0ms\u001b[0m\n",
      ])
    })
  })
  context("production", () => {
    let restore
    before(() => {
      restore = mockedEnv({
        NODE_ENV: "production",
        debug: "fileA,*fileB*",
      })
    })

    after(() => {
      restore()
    })
    it("should use winston to be a logger", () => {
      const {
        log,
        debug,
        info,
        error,
        silly,
        verbose,
        warn,
      } = createLogger.getLog()("fileC")
      stdMocks.use()
      const txt = "logs line"
      log("info", txt)
      info(txt)
      debug(txt) // not out
      error(txt)
      silly(txt)
      verbose(txt)
      warn(txt)
      stdMocks.restore()
      const output = stdMocks.flush()
      output.stdout.should.have.lengthOf(4)
      output.stderr.should.have.lengthOf(0)
      output.stdout.should.deep.equal([
        "2020-01-28T10:38:33.000Z [INFO] [fileC] : \n",
        "2020-01-28T10:38:33.000Z [INFO] [fileC] : \n",
        "2020-01-28T10:38:33.000Z [ERROR] [fileC] : \n",
        "2020-01-28T10:38:33.000Z [WARN] [fileC] : \n",
      ])
    })
  })
})
