import { format } from 'date-fns'
import { de } from 'date-fns/locale'

function formatDay(d?: Date) {
  return format(d || new Date(), 'P', { locale: de })
}

function formatDayTime(d?: Date) {
  return format(d || new Date(), 'Pp', { locale: de })
}

export { formatDay, formatDayTime }
