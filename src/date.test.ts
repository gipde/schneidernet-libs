import { formatDay, formatDayTime } from './date'

test('simple Date Test', () => {
  const d = new Date('2021-12-4')
  expect(formatDay(d)).toBe('04.12.2021')
})

test('simple DateTime Test', () => {
  const d = new Date('2021-12-4 09:42')
  expect(formatDayTime(d)).toBe('04.12.2021 09:42')
})
