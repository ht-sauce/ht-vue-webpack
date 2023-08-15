const path = require('path')

export function resolvePath(pathRoute) {
  return path.resolve(__dirname, pathRoute)
}
