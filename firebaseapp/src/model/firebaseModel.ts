import {
  addDoc,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentData,
  getDocs,
  updateDoc,
} from '@firebase/firestore'
import { log } from '@schneidernet/tools'
import { SetterOrUpdater } from 'recoil'

import { NEW_MODEL_ID_PREFIX } from '.'
import { objDiff, removeEmpty } from './utils'
import { FEntity, FHistoryEntity, SeedOptions, FEntityList } from './firebaseApi'

function newEntity<T extends FEntity>() {
  return { id: NEW_MODEL_ID_PREFIX }
}

function newEntityList<T extends FEntity>(): FEntityList<T> {
  return new FEntityList()
}

async function fbCollectionAddEntity<T extends FEntity | FHistoryEntity>(
  col: CollectionReference<DocumentData>,
  element: T[] | T,
  history: string | boolean = false,
  user?: string,
): Promise<T[] | T> {
  const list: T[] = toList(element)

  const enrichtedList = toList(history ? enrichWithHistory<T>(history, list, user) : list)

  const fbDocs = await Promise.all(
    enrichtedList.map(async (m) => {
      const { id, ...rest } = m
      return addDoc(col, removeEmpty(rest))
    }),
  )
  const fixedIds = enrichtedList.map((e, i) => ({ ...e, id: fbDocs[i].id }))
  return toListOrSingle(element, fixedIds)
}

async function fbCollectionUpdateEntity<T extends FEntity | FHistoryEntity>(
  col: CollectionReference<DocumentData>,
  oldElement: T[] | T,
  element: T[] | T,
  history: string | boolean = false,
  user?: string,
): Promise<T[] | T> {
  const oldList = toList(oldElement)
  const list = toList(element)

  return toListOrSingle(
    element,
    await Promise.all(
      list.map(async (m, i) => {
        if (history) {
          const diff = objDiff(oldList[i], m)
          if (diff && Object.keys(diff).length === 0 && typeof history === 'boolean') {
            log.warn('Dokument ist gleich und wurde nicht geändert')
            return m
          }
          if (typeof history === 'boolean') {
            history = `Änderung: ${JSON.stringify(diff)}`
          }
        }
        const enriched = history ? (enrichWithHistory(history, m, user) as T) : m
        const { id, ...rest } = enriched
        const docRef = doc(col, id)
        if (docRef) {
          const cleaned = removeEmpty(rest)
          updateDoc(docRef, cleaned as any)
        } else {
          log.warn(
            `Dokument ${id} sollte aktualisiert werden, wurde aber nicht gefunden.`,
          )
        }
        return enriched
      }),
    ),
  )
}

function enrichWithHistory<T extends FEntity | FHistoryEntity>(
  history: string | boolean,
  entity: T | T[],
  user: string | undefined,
): T | T[] {
  return toListOrSingle(
    entity,
    toList(entity).map((e) => {
      if (e.id.startsWith(NEW_MODEL_ID_PREFIX)) {
        return {
          ...e,
          history: [
            {
              datum: new Date().getTime(),
              beschreibung: history === true ? 'Neuanlage' : history,
              user,
            },
          ],
        }
      }
      const historyEntries =
        'history' in e && e.history
          ? [
              ...e.history,
              {
                datum: new Date().getTime(),
                beschreibung: history === true ? 'Änderung' : history,
                user,
              },
            ]
          : [
              {
                datum: new Date().getTime(),
                beschreibung: history === true ? 'Änderung' : history,
                user,
              },
            ]
      return {
        ...e,
        history: historyEntries,
      }
    }),
  )
}

/**
 * Remove Entity from Collection
 * @param col
 * @param element
 */
async function fbCollectionRemoveEntity<T extends FEntity>(
  col: CollectionReference<DocumentData>,
  element: T,
) {
  const docRef = doc(col, element.id)
  if (docRef) {
    await deleteDoc(docRef)
  } else {
    log.warn('')
  }
}

/**
 * load Collection
 * @param col Collection
 * @returns
 */
async function fbCollectionLoad<T extends FEntity>(
  col: CollectionReference<DocumentData>,
) {
  const listSnapshot = await getDocs(col)
  log.debug(`fetch ${listSnapshot.size} docs from ${col.id} ...`)
  const tempList: T[] = []
  listSnapshot.forEach((entitySnapshot) => {
    const loadedData = entitySnapshot.data() as T
    loadedData.id = entitySnapshot.id
    tempList.push(loadedData)
  })
  return tempList
}

/**
 * Clears the Collection
 * @param col
 * @param list
 * @returns
 */
async function fbCollectionClear<T extends FEntity>(
  col: CollectionReference<DocumentData>,
  list: T[],
) {
  await Promise.all(list.map((e) => fbCollectionRemoveEntity(col, e)))
  const retval = `${col.id} gelöscht`
  log.debug(retval)
  return retval
}

/**
 * Seed Collection
 * @param col Collection
 * @param opts SeedOptions
 * @returns [ result, Entity[] ]
 */
async function fbCollectionSeed<T extends FEntity>(
  col: CollectionReference<DocumentData>,
  { generator, count = 5 }: SeedOptions<T>,
  history: string | boolean = false,
  user?: string,
): Promise<[string, T[]]> {
  const elements = [...Array(count).keys()].map((v) => generator(v))
  const newElements = (await fbCollectionAddEntity(col, elements, history, user)) as T[]
  const retMsg = `Collection ${col.id} seeded with ${elements.length} elements`
  log.debug(retMsg)
  return [retMsg, newElements]
}

async function addEntityToList<T extends FEntity>(
  setter: SetterOrUpdater<T[]>,
  col: CollectionReference<DocumentData>,
  element: T[] | T,
  history: string | boolean = false,
  user?: string,
): Promise<T[] | T> {
  const e = await fbCollectionAddEntity(col, element, history, user)
  const tmpList = toList<T>(e)

  setter(listUpdater<T>(tmpList))
  return e
}

async function addOrUpdateEntityInList<T extends FEntity>(
  setter: SetterOrUpdater<T[]>,
  col: CollectionReference<DocumentData>,
  old: T[] | T | undefined,
  element: T[] | T,
  history: string | boolean = false,
  user?: string,
): Promise<T[] | T> {
  const e =
    !old || toList(element)[0].id.startsWith(NEW_MODEL_ID_PREFIX)
      ? await fbCollectionAddEntity(col, element, history, user)
      : await fbCollectionUpdateEntity(col, old, element, history, user)
  const tmpList = toList(e)
  setter(listUpdater<T>(tmpList))
  return e
}
async function updateEntityInList<T extends FEntity>(
  setter: SetterOrUpdater<T[]>,
  col: CollectionReference<DocumentData>,
  old: T[] | T,
  element: T[] | T,
  history: string | boolean = false,
  user?: string,
): Promise<T[] | T> {
  const e = await fbCollectionUpdateEntity(col, old, element, history, user)
  const tmpList = toList(e)
  setter(listUpdater<T>(tmpList))

  return e
}

async function removeEntityFromList<T extends FEntity>(
  setter: SetterOrUpdater<T[]>,
  col: CollectionReference<DocumentData>,
  element: T,
) {
  await fbCollectionRemoveEntity(col, element)
  setter((old) => [...old.filter((o) => o.id !== element.id)])
}

async function loadList<T extends FEntity>(
  setter: SetterOrUpdater<T[]>,
  col: CollectionReference<DocumentData>,
) {
  const e = await fbCollectionLoad<T>(col)
  setter(e)
  return e
}

async function clearList<T extends FEntity>(
  setter: SetterOrUpdater<T[]>,
  col: CollectionReference<DocumentData>,
): Promise<string> {
  return new Promise((resolve) => {
    setter((old: T[]) => {
      fbCollectionClear(col, old).then(resolve)
      return []
    })
  })
}

async function seedList<T extends FEntity>(
  setter: SetterOrUpdater<T[]>,
  col: CollectionReference<DocumentData>,
  opts: SeedOptions<T>,
  history: string | boolean = false,
  user?: string,
): Promise<string> {
  const [msg, entities] = await fbCollectionSeed(col, opts, history, user)
  setter((old) => [...old, ...entities])
  return msg
}

/**
 * Updater Funktion, welche entweder ein Element tauscht, oder hinzufügt
 * @param tmpList
 * @returns
 */
const listUpdater =
  <T extends FEntity>(tmpList: T[]) =>
  (old: T[]) =>
    [...old.filter((o) => !tmpList.find((t) => t.id === o.id)), ...tmpList]

const toList = <T>(element: T | T[]) => (element instanceof Array ? element : [element])
const toListOrSingle = <T>(input: T | T[], list: T[]) =>
  input instanceof Array ? list : list[0]

function getOldFromList<T extends FEntity>(element: T, list: T[]): T | undefined {
  return list.find((e) => e.id === element.id)
}

export {
  newEntity,
  fbCollectionAddEntity,
  fbCollectionUpdateEntity,
  fbCollectionRemoveEntity,
  fbCollectionLoad,
  fbCollectionClear,
  fbCollectionSeed,
  addEntityToList,
  addOrUpdateEntityInList,
  updateEntityInList,
  removeEntityFromList,
  loadList,
  clearList,
  seedList,
  getOldFromList,
}
