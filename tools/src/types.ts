export const NothingSymbol = Symbol('nothing')
export type Nothing = typeof NothingSymbol
export type Maybe<T> = T | Nothing

export type DateOrTime = Date | number | null

export const asArray = <T>(element: T | T[]) =>
  element instanceof Array ? element : [element]
export const asListOrSingle = <T>(input: T | T[], list: T[]) =>
  input instanceof Array ? list : list[0]

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

/**
 * einzelne Props sind partial
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
