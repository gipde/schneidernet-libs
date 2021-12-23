import { camelize } from '.'

test('Camelize', () => {
  expect(camelize('WernerSchneider')).toBe('wernerSchneider')
})
