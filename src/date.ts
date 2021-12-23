import { differenceInDays, format } from 'date-fns'
import { de } from 'date-fns/locale'
import { DateOrTime } from './types'

function dateValidator(date: DateOrTime): boolean {
  return !(date === null || Number.isNaN(new Date(date).getDate()))
}

function dateFormat(d: DateOrTime | undefined, formatStr: string): string {
  return d ? format(d ?? new Date(), formatStr, { locale: de }) : '-'
}

function formatDayTime(d?: DateOrTime): string {
  return dateFormat(d, 'Pp')
}

function formatDay(d?: DateOrTime): string {
  return dateFormat(d, 'P')
}

/**
 *
 * @param from Date From
 * @param to Date To if Specified
 * @returns
 */
function ageInYears(from: DateOrTime, to?: DateOrTime): string {
  if (from) {
    const diffDays = differenceInDays(to || new Date(), from)
    return (diffDays / 365).toFixed(1)
  }
  return '0'
}

export { formatDay, formatDayTime, dateValidator, ageInYears }
