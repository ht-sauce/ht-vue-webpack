const dotenv = require('dotenv')
const configHandler = require('../configHandler')
const { joinPath } = require('./handlerPath')
const path = require('path')

function getEnvPath(cliOptions, mode) {
  const extractConfig = configHandler(cliOptions)
  const envName = mode ? '.env.' + mode : '.env'
  return joinPath(path.join(extractConfig.env, envName))
}
function loaderEnv(cliOptions, mode = '') {
  dotenv.config({ path: getEnvPath(cliOptions, mode) })
}
module.exports = {
  getEnvPath,
  loaderEnv,
}
