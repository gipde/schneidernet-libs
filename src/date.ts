import { differenceInDays, format } from 'date-fns'
import { de } from 'date-fns/locale'

function dateValidator(date: Date | number | null): boolean {
  return !(date === null || Number.isNaN(new Date(date).getDate()))
}

function dateFormat(d: Date | number | null | undefined, formatStr: string): string {
  return d ? format(d ?? new Date(), formatStr, { locale: de }) : '-'
}

function formatDayTime(d?: Date | number | null): string {
  return dateFormat(d, 'Pp')
}

function formatDay(d?: Date | number | null): string {
  return dateFormat(d, 'P')
}

function ageInYears(d: Date | number | null): string {
  if (d) {
    const diffDays = differenceInDays(new Date(), d)
    return (diffDays / 365).toFixed(1)
  }
  return '0'
}

export { formatDay, formatDayTime, dateValidator, ageInYears }
