import { ageInYears } from '.'
import { formatDay, formatDayTime } from './date'

test('simple Date Test', () => {
  const d = new Date('2021-12-4')
  expect(formatDay(d)).toBe('04.12.2021')
})

test('simple DateTime Test', () => {
  const d = new Date('2021-12-4 09:42')
  expect(formatDayTime(d)).toBe('04.12.2021 09:42')
})

test('age', () => {
  const d = new Date('2021-11-4')
  const from = new Date('2020-11-4')
  const age = ageInYears(d, from)
  expect(age).toBe('1.0')
})
