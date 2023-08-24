const os = require('os')

function getIp() {
  const networkInterfaces = os.networkInterfaces()
  let IPv4 = ''
  for (const key in networkInterfaces) {
    if (key.includes('以太网') || key.includes('本地连接')) {
      IPv4 = networkInterfaces[key].find((item) => item.family === 'IPv4')?.address
    }
  }
  return {
    IPv4,
  }
}
module.exports = {
  getIp,
}
