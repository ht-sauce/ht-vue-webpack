const path = require('path')

// 获取包文件的工作目录
function getCWD() {
  // 此方法返回一个字符串，该字符串指定node.js进程的当前工作目录。
  return process.cwd()
}
function resolvePath(pathRoute) {
  return path.resolve(getCWD(), pathRoute)
}
function joinPath(pathRoute) {
  return path.join(getCWD(), pathRoute)
}

function rootToStrNull(pathStr = '') {
  if (!pathStr || pathStr === '/') return ''
  return pathStr
}

module.exports = {
  getCWD,
  rootToStrNull,
  resolvePath,
  joinPath,
}
