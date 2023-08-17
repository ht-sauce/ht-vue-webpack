/*命令处理函数*/

function handlerArgv() {
  return process.argv
}
// 是否存在某个命令
function getCommand(command = '') {
  if (!command) return false
  const argv = handlerArgv()
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === command) {
      return true
    }
  }
  return false
}
// 返回某个命令的下一个参数
function getCommandSecondary(command = '') {
  const argv = handlerArgv()
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === command) {
      return argv[i + 1]
    }
  }
  return ''
}
// 返回mode，如果没有mode则返回development
function getMode() {
  const mode = getCommandSecondary('--mode')
  if (mode) return mode
  return 'development'
}
// 是否存在构建命令
function isBuild() {
  return getCommand('build')
}
// 是否是运行名称
function isServe() {
  return getCommand('serve')
}

module.exports = {
  getMode,
  isBuild,
  isServe,
}
