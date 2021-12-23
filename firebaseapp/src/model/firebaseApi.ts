import { atom, atomFamily, SetterOrUpdater } from 'recoil'

// TODO: ggf. irgendwie umdrehen .updateEntity().syncList()
//       history und username in syncList ist an sich falsch

interface History {
  datum: number
  user: string
  beschreibung: string
}

interface FEntity {
  id: string
}

class FEntityList<T extends FEntity> extends Array<T> {
  getById(id: string) {
    return this.find((e) => e.id === id)
  }
}

interface FHistoryEntity extends FEntity {
  history?: History[]
}

interface SeedOptions<T> {
  generator: (v: number) => T
  count?: number
}

// Wrapper API um sehr einfach die API zu benutzen...

interface FirebaseCollectionI<T extends FEntity> {
  newEntity: () => T
  addEntity: (e: T | T[]) => Promise<T | T[]>
  updateEntity: (o: T, e: T) => Promise<T | T[]>
  deleteEntity: (e: T) => void
  load: () => Promise<T[]>
  clear: (l: T[]) => Promise<string>
  seed: (options: SeedOptions<T>) => Promise<[string, T[]]>
  syncList: (s: SetterOrUpdater<T[]>) => SyncListI<T>
  test?: () => Promise<FEntityList<T>>
}

interface FirebaseHistoryCollectionI<T extends FEntity> {
  newEntity: () => T
  addEntity: (e: T | T[], history: string | boolean, user: string) => Promise<T | T[]>
  updateEntity: (o: T, e: T, history: string | boolean, user: string) => Promise<T | T[]>
  deleteEntity: (e: T) => void
  load: () => Promise<T[]>
  clear: (l: T[]) => Promise<string>
  seed: (options: SeedOptions<T>) => Promise<[string, T[]]>
  syncList: (
    s: SetterOrUpdater<T[]>,
    history: string | boolean,
    user: string,
  ) => SyncListI<T>
}

interface SyncListI<T extends FEntity> {
  addEntity: (e: T | T[]) => Promise<T | T[]>
  addOrUpdateEntity: (o: T, e: T) => Promise<T | T[]>
  updateEntity: (o: T, e: T) => Promise<T | T[]>
  deleteEntity: (e: T) => void
  load: () => Promise<T[]>
  clear: () => Promise<string>
  seed: (options: SeedOptions<T>) => Promise<string>
}

const entityAtom = (n: string) =>
  atomFamily<FEntity, string>({ key: n, default: { id: 'df' } })

const entityListAtom = <T extends FEntity>(n: string) =>
  atom<T[]>({ key: n, default: [] })

export {
  History,
  FEntity,
  FEntityList,
  FHistoryEntity,
  FirebaseCollectionI,
  FirebaseHistoryCollectionI,
  SyncListI,
  SeedOptions,
  entityListAtom,
}
