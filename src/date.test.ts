import { startOfDay } from 'date-fns'
import { formatDay, formatDayTime, ageInYears } from './date'

test('simple Date Test', () => {
  const d = new Date('2021-12-4')
  expect(formatDay(d)).toBe('04.12.2021')
})

test('simple DateTime Test', () => {
  const d = new Date('2021-12-4 09:42')
  expect(formatDayTime(d)).toBe('04.12.2021 09:42')
})

test('age', () => {
  const from = new Date('2020-11-4')
  const to = new Date('2021-11-4')
  const age = ageInYears(from, to)
  expect(age).toBe('1.0')
})

test('age 2', () => {
  const today = startOfDay(new Date())
  const tenYearsBefore = new Date(
    today.getFullYear() - 10,
    today.getMonth(),
    today.getDate(),
  )
  const age = ageInYears(tenYearsBefore, today)
  expect(age).toBe('10.0')
})
