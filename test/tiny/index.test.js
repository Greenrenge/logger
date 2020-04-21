const stdMocks = require("std-mocks")
const sinon = require("sinon")

describe("Logger", () => {
  let now
  let clock
  beforeEach(() => {
    clock = sinon.useFakeTimers(new Date("2020-01-28T10:38:33.000Z"))
    now = new Date(clock.Date()).toISOString()
  })
  afterEach(() => {
    clock.restore()
  })
  context("#wrapper logger", () => {
    it("should be able to call logger.error() to log to stdout", () => {
      stdMocks.use()
      logger.error("hello error", "param2")
      stdMocks.restore()
      const output = stdMocks.flush()
      output.stdout[0].should.equal(`${now} [ERROR]: hello error, param2\n`)
    })
    it("should be able to call logger.warn() to log to stdout", () => {
      stdMocks.use()
      logger.warn("hello warn", "param2")
      stdMocks.restore()
      const output = stdMocks.flush()
      output.stdout[0].should.equal(`${now} [WARN]: hello warn, param2\n`)
    })
    it("should be able to call logger.info() to log to stdout", () => {
      stdMocks.use()
      logger.info("hello info", "param2")
      stdMocks.restore()
      const output = stdMocks.flush()
      output.stdout[0].should.equal(`${now} [INFO]: hello info, param2\n`)
    })
    it("should be able to call logger.verbose() to log to stdout", () => {
      stdMocks.use()
      logger.verbose("hello verbose", "param2")
      stdMocks.restore()
      const output = stdMocks.flush()
      output.stdout[0].should.equal(`${now} [VERBOSE]: hello verbose, param2\n`)
    })
    it("should be able to call logger.debug() to log to stdout", () => {
      stdMocks.use()
      logger.debug("hello debug", "param2")
      stdMocks.restore()
      const output = stdMocks.flush()
      output.stdout[0].should.equal(`${now} [DEBUG]: hello debug, param2\n`)
    })
    it("should be able to call logger.silly() to log to stdout", () => {
      stdMocks.use()
      logger.silly("hello silly", "param2")
      stdMocks.restore()
      const output = stdMocks.flush()
      output.stdout[0].should.equal(`${now} [SILLY]: hello silly, param2\n`)
    })
    it("should be able to call logger.log() to log to stdout", () => {
      stdMocks.use()
      logger.log("debug", "hello log.(debug)", "param2")
      stdMocks.restore()
      const output = stdMocks.flush()
      output.stdout[0].should.equal(
        `${now} [DEBUG]: hello log.(debug), param2\n`,
      )
    })
    it("should not log if level is incorrect when calls logger.log()", () => {
      stdMocks.use()
      logger.log("wrong", "hello log.(debug)", "param2")
      stdMocks.restore()
      const output = stdMocks.flush()
      should().equal(output.stdout[0], undefined)
    })
  })
  context("#log with default format", () => {
    it("should be able to log with timestamp", () => {
      stdMocks.use()
      logger.info("hello info")
      stdMocks.restore()
      const output = stdMocks.flush()
      output.stdout[0].should.equal(`${now} [INFO]: hello info\n`)
    })
    it("should be able to log with string interpolation", () => {
      stdMocks.use()
      logger.info("hello %s", "hola")
      stdMocks.restore()
      const output = stdMocks.flush()
      output.stdout[0].should.equal(`${now} [INFO]: hello hola\n`)
    })
    it("should be able to log with two string interpolations", () => {
      stdMocks.use()
      logger.info("hello %s %s", "hola", "people")
      stdMocks.restore()
      const output = stdMocks.flush()
      output.stdout[0].should.equal(`${now} [INFO]: hello hola people\n`)
    })
    it("should be able to log with object", () => {
      const obj = { _id: "21344325", name: "John Doe" }
      stdMocks.use()
      logger.info(obj)
      stdMocks.restore()
      const output = stdMocks.flush()
      const stringifiedObj = stringifyLog(obj)
      output.stdout[0].should.equal(`${now} [INFO]: ${stringifiedObj}\n`)
    })
    it("should be able to log string with object", () => {
      const obj = { _id: "21344325", name: "John Doe" }
      stdMocks.use()
      logger.error("user Object = %o", obj)
      stdMocks.restore()
      const output = stdMocks.flush()
      output.stdout[0].should.equal(
        `${now} [ERROR]: user Object = { _id: '21344325', name: 'John Doe' }\n`,
      )
    })
    it("should be able to log string with object without interpolation", () => {
      const obj = { _id: "21344325", name: "John Doe" }
      const stringifiedObj = stringifyLog(obj)
      stdMocks.use()
      logger.error("user Object", obj)
      stdMocks.restore()
      const output = stdMocks.flush()
      output.stdout[0].should.equal(
        `${now} [ERROR]: user Object, ${stringifiedObj}\n`,
      )
    })
    it("should be able to log string with two objects without interpolation", () => {
      const obj = { _id: "21344325", name: "John Doe" }
      const obj2 = { _id: "3433", name: "Bob Doe" }
      const stringifiedObj = stringifyLog(obj)
      const stringifiedObj2 = stringifyLog(obj2)
      stdMocks.use()
      logger.error("user Object", obj, obj2)
      stdMocks.restore()
      const output = stdMocks.flush()
      output.stdout[0].should.equal(
        `${now} [ERROR]: user Object, ${stringifiedObj}, ${stringifiedObj2}\n`,
      )
    })
    it("should be able to log string with object with interpolation and without interpolation", () => {
      const obj = { _id: "21344325", name: "John Doe" }
      const obj2 = { _id: "3433", name: "Bob Doe" }
      const stringifiedObj2 = stringifyLog(obj2)
      stdMocks.use()
      logger.error("user Object = %o", obj, obj2)
      stdMocks.restore()
      const output = stdMocks.flush()
      output.stdout[0].should.equal(
        `${now} [ERROR]: user Object = { _id: '21344325', name: 'John Doe' }, ${stringifiedObj2}\n`,
      )
    })
  })
  context("#log with json format", () => {
    const jsonLogger = Logger({ logLevel: "silly", logFormat: "json" })
    it("should be able to log with timestamp", () => {
      stdMocks.use()
      jsonLogger.info("hello info")
      stdMocks.restore()
      const output = stdMocks.flush()
      output.stdout[0].should.equal(
        '{"message":"hello info","level":"info","severity":"info"}\n',
      )
    })
    it("should be able to log with string interpolation", () => {
      stdMocks.use()
      jsonLogger.info("hello %s", "hola")
      stdMocks.restore()
      const output = stdMocks.flush()
      output.stdout[0].should.equal(
        '{"level":"info","message":"hello hola","severity":"info"}\n',
      )
    })
    it("should be able to log with two string interpolations", () => {
      stdMocks.use()
      jsonLogger.info("hello %s %s", "hola", "people")
      stdMocks.restore()
      const output = stdMocks.flush()
      output.stdout[0].should.equal(
        '{"level":"info","message":"hello hola people","severity":"info"}\n',
      )
    })
    it("should be able to log with object", () => {
      const obj = { _id: "21344325", name: "John Doe" }
      stdMocks.use()
      jsonLogger.info(obj)
      stdMocks.restore()
      const output = stdMocks.flush()
      output.stdout[0].should.equal(
        '{"message":{"_id":"21344325","name":"John Doe"},"level":"info","severity":"info"}\n',
      )
    })
    it("should be able to log string with object", () => {
      const obj = { _id: "21344325", name: "John Doe" }
      stdMocks.use()
      jsonLogger.error("user Object = %o", obj)
      stdMocks.restore()
      const output = stdMocks.flush()
      output.stdout[0].should.equal(
        '{"_id":"21344325","name":"John Doe","level":"error","message":"user Object = { _id: \'21344325\', name: \'John Doe\' }","severity":"ERROR"}\n',
      )
    })
    it("should be able to log string with object without interpolation", () => {
      const obj = { _id: "21344325", name: "John Doe" }
      stdMocks.use()
      jsonLogger.error("user Object", obj)
      stdMocks.restore()
      const output = stdMocks.flush()
      output.stdout[0].should.equal(
        '{"_id":"21344325","name":"John Doe","level":"error","message":"user Object","meta":{"_id":"21344325","name":"John Doe"},"severity":"ERROR"}\n',
      )
    })
    it("should be able to log string with two objects without interpolation", () => {
      const obj = { _id: "21344325", name: "John Doe" }
      const obj2 = { _id: "3433", name: "Bob Doe" }
      stdMocks.use()
      jsonLogger.error("user Object", obj, obj2)
      stdMocks.restore()
      const output = stdMocks.flush()
      output.stdout[0].should.equal(
        '{"_id":"21344325","name":"John Doe","level":"error","message":"user Object","meta":[{"_id":"21344325","name":"John Doe"},{"_id":"3433","name":"Bob Doe"}],"severity":"ERROR"}\n',
      )
    })
    it("should be able to log string with object with interpolation and without interpolation", () => {
      const obj = { _id: "21344325", name: "John Doe" }
      const obj2 = { _id: "3433", name: "Bob Doe" }
      stdMocks.use()
      jsonLogger.error("user Object = %o", obj, obj2)
      stdMocks.restore()
      const output = stdMocks.flush()
      output.stdout[0].should.equal(
        '{"_id":"21344325","name":"John Doe","level":"error","message":"user Object = { _id: \'21344325\', name: \'John Doe\' }","meta":{"_id":"3433","name":"Bob Doe"},"severity":"ERROR"}\n',
      )
    })
  })
})
