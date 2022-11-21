/* eslint-disable no-return-assign */
import { log } from '@schneidernet/tools'
import _ from 'lodash'

const get = (obj: any) => (key: any) => obj[key]

const arrayComparator = (diffFn: any) => (co1: any, co2: any) => {
  const r = diffFn(co1, co2)
  const ifBoolean = _.isBoolean(r) ? r : true
  // Ergebnis hat props und damit Unterschiede || ist Boolean bei primitiven Werten
  return _.isObject(r) && Object.keys(r).length > 0 ? false : ifBoolean
}

const objectPropsCompareReducer =
  (o1: any, o2: any, diffFn: any) => (a: any, k: string) => {
    const v1 = get(o1)(k)
    const v2 = get(o2)(k)

    const diffResult = diffFn(v1, v2)

    if (_.isObject(diffResult)) {
      return Object.keys(diffResult).length > 0 ? { ...a, [k]: diffResult } : a
    }
    if (_.isBoolean(diffResult)) {
      return diffResult ? a : { ...a, [k]: v1 }
    }
    return undefined
  }

const objDiff = (o1: any, o2: any): any => {
  log.trace(
    `comparing ${JSON.stringify(o1)} (${typeof o1}) <> ${JSON.stringify(
      o2
    )} (${typeof o2}) Array:${_.isArray(o1)}`
  )

  if (_.isArray(o1)) {
    return [
      // added Values in o2
      ..._.differenceWith(o2, o1, arrayComparator(objDiff)),
      // delete Values in o2
      ..._.differenceWith(o1, o2, arrayComparator(objDiff)),
    ]
  }

  if (_.isObject(o1)) {
    return {
      // added Values in o2
      ...(o2
        ? Object.keys(o2).reduce(objectPropsCompareReducer(o2, o1, objDiff), {})
        : undefined),
      // delete Values in o2

      ...(o2
        ? Object.keys(o1).reduce(objectPropsCompareReducer(o1, o2, objDiff), {})
        : undefined),
    }
  }

  // plain Values
  return o1 === o2
}

function removeEmpty<T extends {}>(obj: T): T | T[] {
  if (Array.isArray(obj)) {
    return obj
      .map((v) => (v && typeof v === 'object' ? removeEmpty(v) : v))
      .filter((v) => v !== null) as T[]
  }
  return Object.entries(obj)
    .map(([k, v]) => [k, v && typeof v === 'object' ? removeEmpty(v) : v])
    .reduce(
      // eslint-disable-next-line no-param-reassign
      (a, [k, v]) => (v == null ? a : (((a as any)[k as any] = v), a)),
      {}
    ) as T
}

export { objDiff, removeEmpty }
