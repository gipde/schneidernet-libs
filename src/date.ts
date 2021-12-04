import { format } from 'date-fns'
import { de } from 'date-fns/locale'

function formatDay(d: Date) {
  return format(d, 'P', { locale: de })
}

function formatDayTime(d: Date) {
  return format(d, 'Pp', { locale: de })
}

export { formatDay, formatDayTime }
