import chalk from 'chalk'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import log from 'loglevel'

log.setDefaultLevel(log.levels.TRACE)
log.setLevel(log.levels.TRACE)

// Den Level
// Datum Uhrzeit
// Das File angeben
// Browser und cmdline (Node)
// Zeit seit letztem Log
// get Logger / vs static

const timestamp = () => format(new Date(), 'Pp,SSS', { locale: de })

function getPattern(lvl: string) {
  return `${timestamp()} ${lvl}`
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

export { info, warn, debug, trace, error, err }
