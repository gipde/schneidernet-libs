const { log, formatDay } = require('@schneidernet/tools')

console.log('Test')

log.debug('debug')
log.warn('warn')

console.log(formatDay(new Date()))
