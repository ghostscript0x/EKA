import { format } from 'date-fns'

export function getTodayStr() {
  return format(new Date(), 'yyyy-MM-dd')
}
