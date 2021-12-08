'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const tools_1 = require('@schneidernet/tools')
console.log('Test')
tools_1.log.debug('debug')
tools_1.log.warn('warn')
tools_1.log.info((0, tools_1.formatDayTime)(new Date()))
console.log((0, tools_1.formatDay)(new Date()))
