export const NothingSymbol = Symbol('nothing')
export type Nothing = typeof NothingSymbol
export type Maybe<T> = T | Nothing

export type DateOrTime = Date | number | null
