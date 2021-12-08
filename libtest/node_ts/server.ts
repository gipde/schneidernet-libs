import { log, formatDay, formatDayTime } from '@schneidernet/tools'

console.log('Test')

log.debug('debug')
log.warn('warn')

log.info(formatDayTime(new Date()))
console.log(formatDay(new Date()))
