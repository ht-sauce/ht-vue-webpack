const path = require('path')

function resolvePath(pathRoute) {
  // console.log(__dirname, '__dirname')
  return path.resolve(__dirname, pathRoute)
}

module.exports = {
  resolvePath,
}
