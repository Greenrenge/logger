process.env.NODE_ENV = "production"
const tiny = require("../tiny")
const delay = require("util").promisify(setTimeout)

async function main() {
  const log = tiny("hi")
  log.info("hi")
}

main()
  .then(() => delay(2000))
  .then(() => console.log("hi"))
