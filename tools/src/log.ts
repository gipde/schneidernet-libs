import chalk from 'chalk'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import log from 'loglevel'

import { plattformIsBrowser } from './sys'

// Das File angeben
// Stacktrace
// get Logger / vs static
// Typeabhängiges bauen
// Object -> stringify
// Colors Browser + Node (https://developer.mozilla.org/en-US/docs/Web/API/console#Usage)

if (process.env.NODE_ENV !== 'production') {
  log.setDefaultLevel(log.levels.DEBUG)
  log.setLevel(log.levels.DEBUG)
} else {
  log.setDefaultLevel(log.levels.WARN)
  log.setLevel(log.levels.WARN)
}

let lastLogEntry = new Date().getTime()

const levelNames = Object.keys(log.levels)

const timestamp = () => format(new Date(), 'Ppp,SSS', { locale: de })

function getPattern(lvl: string) {
  const currentTime = new Date().getTime()
  const diff = `+ ${currentTime - lastLogEntry}`.padStart(10)
  lastLogEntry = currentTime

  return `${timestamp()} ${lvl} ${diff}`
}

function setLogLevel(level: log.LogLevelDesc) {
  log.setLevel(level)
}

function getLogLevel(): string {
  return levelNames[log.getLevel()]
}

function info(...msg: any) {
  log.info(getPattern('INFO '), msg.join())
}
function warn(...msg: any) {
  log.warn(chalk.yellow(getPattern('WARN '), msg))
}
function error(...msg: any) {
  log.error(chalk.redBright(getPattern('ERROR'), msg))
}

const err = error

function debug(...msg: any) {
  log.debug(chalk.cyan(getPattern('DEBUG'), msg))
}
function trace(...msg: any) {
  log.trace(chalk.blueBright(getPattern(''), msg))
}

info(`Initial LogLevel: ${levelNames[log.getLevel()]}`)
info(`we are in browser: ${plattformIsBrowser}`)

export { info, warn, debug, trace, error, err, setLogLevel, getLogLevel }
