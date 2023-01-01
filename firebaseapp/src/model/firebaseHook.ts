import {
  addDoc,
  collection as fbCollection,
  CollectionReference,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  QueryConstraint,
  QuerySnapshot,
  where
} from '@firebase/firestore'
import { asArray, asListOrSingle, log, PartialBy } from '@schneidernet/tools'
import {
  atomFamily,
  RecoilState,
  RecoilValueReadOnly,
  selectorFamily,
  useRecoilCallback,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil'

import { uiUserAtom } from './ui'
import { firestore } from '../initFirebase'
import { objDiff, removeEmpty } from './utils'

export interface FBEntity {
  id: string
  history?: History[]
}

export interface History {
  datum: number
  user: string
  beschreibung: string
}

export type OptionalId<T extends FBEntity> = PartialBy<T, 'id'>

export interface FBEntityOptions {}

// lokaler state (bei Paginge z.b. nur der gepaedde zustand)
const listFamily = atomFamily<FBEntity[], string>({
  key: 'FBEntityListFamily',
  default: [],
}) as <T extends FBEntity>(collectionName: string) => RecoilState<T[]>

// Filtered Liste of Entities
const filterFamily = selectorFamily<
  (filterFn: (all: FBEntity[]) => FBEntity[]) => FBEntity[],
  string
>({
  key: 'FBEntityListFilterSelector',
  get:
    (collectionName) =>
    ({ get }) => {
      const list = get(listFamily(collectionName))
      return (filterFn: any) => filterFn(list)
    },
}) as <T extends FBEntity>(
  param: string
) => RecoilValueReadOnly<(filterFn: (all: T[]) => T[]) => T[]>

/**
 * get Collection Reference
 * @param colName Name of the Collection
 * @returns
 */
function getCollectionRef(colName: string) {
  return fbCollection(
    firestore,
    process.env.NODE_ENV === 'production' ? colName : `test_${colName}`
  )
}

/**
 * ergänzt die History
 * @param history
 * @param entity
 * @param user
 * @param diff
 * @returns
 */
function enrichWithHistory<T extends FBEntity>(
  history: string | boolean,
  entity: OptionalId<T>,
  user: string | undefined,
  diff?: string
): OptionalId<T> {
  if (!entity.id) {
    // Keine ID
    return {
      ...entity,
      history: [
        {
          datum: new Date().getTime(),
          beschreibung: history === true ? 'Neuanlage' : history,
          user,
        },
      ],
    }
  }
  const newEntry = {
    datum: new Date().getTime(),
    beschreibung: history === true ? `Änderung: ${diff}` : history,
    user,
  }
  const historyEntries =
    'history' in entity && entity.history instanceof Array
      ? [...entity.history, newEntry]
      : [newEntry]
  return {
    ...entity,
    history: historyEntries,
  }
}

/**
 * aktualisiert die Recoil Liste, in dem alte entfernt, und neue hinzugefügt werden
 * @param tmpList
 * @returns
 */
const listUpdater =
  <T extends FBEntity>(tmpList: T[]) =>
  (old: T[]) =>
    [...old.filter((o) => !tmpList.find((t) => t.id === o.id)), ...tmpList]

/**
 * Schreibende FirebaseCollection - UI wird nicht aktualisiert
 * @param colName Name der Collection
 * @param options
 * @returns
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
function useFirebaseCollectionWrite<T extends FBEntity>(colName: string) {
  const setList = useSetRecoilState(listFamily<T>(colName))

  const u = useRecoilValue(uiUserAtom)
  const user = u ? `${u.displayName} (${u.email})` : 'unbekannter Nutzer'

  const getListSnapshot = useRecoilCallback(
    ({ snapshot }) =>
      () =>
        snapshot.getPromise(listFamily<T>(colName))
  )

  const collection = getCollectionRef(colName)

  /**
   * fügt ein Element hinzu
   * @param element Entity
   * @param history
   * @returns
   */
  const addEntity = async (
    element: OptionalId<T> | OptionalId<T>[],
    history: string | boolean = true
  ) => {
    const list: OptionalId<T>[] = asArray(element)

    const enrichtedList: OptionalId<T>[] = list.map((e: OptionalId<T>) =>
      history ? enrichWithHistory<T>(history, e, user) : e
    )

    const fbDocs = await Promise.all(
      enrichtedList.map(async (m) => addDoc(collection, removeEmpty(m)))
    )
    const fixedIds = enrichtedList.map((e, i) => ({
      ...e,
      id: fbDocs[i].id,
    })) as T[]
    setList(listUpdater(fixedIds))
    log.debug(
      `Added Entitie(s) with id: ${fixedIds
        .map((m) => m.id)
        .join(',')} to list ${collection.id}`
    )
    return asListOrSingle<T>(element as T | T[], fixedIds)
  }

  /**
   * ändert ein Element
   * @param element
   * @param history
   * @returns
   */
  const updateEntity = async (
    element: T | T[],
    history: string | boolean = true
  ) => {
    const list = asArray(element)
    const oldList = await getListSnapshot()

    const result: T[] = await Promise.all(
      list.map(async (e) => {
        const oldElement = oldList.find((oe) => oe.id === e.id)
        if (!oldElement) {
          throw new Error(
            `das zu aktualisierende Element ${e.id} konnte nicht gefunden werden`
          )
        }
        const { history: oldHistory, ...oldWithoutHistory } = oldElement
        const { history: eHistory, ...eWithoutHistory } = e
        const diff = objDiff(oldWithoutHistory, eWithoutHistory)
        if (
          diff &&
          Object.keys(diff).length === 0 &&
          typeof history === 'boolean'
        ) {
          log.warn('Dokument ist gleich und wurde nicht geändert')
          return e
        }

        const enriched = history
          ? (enrichWithHistory(history, e, user, JSON.stringify(diff)) as T)
          : e

        const { id, ...rest } = enriched
        const docRef = doc(collection, id)
        if (docRef) {
          const cleaned = removeEmpty(rest)
          updateDoc(docRef, cleaned as any)
        } else {
          log.warn(
            `Dokument ${id} sollte aktualisiert werden, wurde aber nicht gefunden.`
          )
        }
        return enriched
      })
    )

    setList(listUpdater(result))
    return asListOrSingle(element, result)
  }

  /**
   * löscht ein Element
   * @param element
   */
  const deleteEntity = async (element: T) => {
    const docRef = doc(collection, element.id)
    if (docRef) {
      await deleteDoc(docRef)
    } else {
      log.warn('Document nicht gefunden: ', element.id)
    }
    setList((old) => [...old.filter((o) => o.id !== element.id)])
  }

  /**
   * lädt alle Elemente
   * @param updateList
   * @returns
   */
  const loadAll = async (updateList: boolean = true): Promise<T[]> => {
    log.debug(`fetching all docs from ${collection.id} ...`)
    const listSnapshot = await getDocs(collection)
    log.debug(`fetched ${listSnapshot.size} docs from ${collection.id}.`)
    const returnList: T[] = []
    listSnapshot.forEach((entitySnapshot) => {
      const loadedData = entitySnapshot.data() as T
      loadedData.id = entitySnapshot.id
      returnList.push(loadedData)
    })

    if (updateList) {
      setList(returnList)
    }
    return returnList
  }

  /**
   * löscht alle Elemente
   * @returns
   */
  const clearAll = async () => {
    log.info(`Loading List ${collection.id}...`)
    // lädt erst die Liste, und löscht dann alle elemente
    const tmplist = await loadAll(false)
    // alternativ einfach die bestehnde liste verwenden
    // const tmplist = await getListSnapshot()
    log.info(`clearing List: ${collection.id} with ${tmplist.length} Elements`)
    await Promise.all(tmplist.map((e) => deleteEntity(e)))
    setList([])
    return `${collection.id} gelöscht`
  }

  /**
   * Testbestand seeden
   * @param generator Generator Function
   * @param maxElements Number of Elements
   * @returns
   */
  const seed: (
    generator: (i: number) => OptionalId<T>,
    maxElements?: number
  ) => Promise<[string, T[]]> = async (
    generator: (i: number) => OptionalId<T>,
    num = 5
  ) => {
    const list = (await addEntity(
      [...Array(num)].map((m, i) => generator(i)),
      'Seed'
    )) as T[]

    const retval: [string, T[]] = [
      `Collection ${collection.id} seeded with ${num} elements`,
      list,
    ]
    return retval
  }

  return {
    clearAll,
    loadAll,
    seed,

    addEntity,
    addOrUpdateEntity: async (
      e: OptionalId<T> | OptionalId<T>[],
      history?: string | boolean
    ) => {
      const v = e instanceof Array ? e[0] : e
      return v.id ? updateEntity(e as T | T[], history) : addEntity(e, history)
    },
    updateEntity,
    deleteEntity,
    // setlect: undefined,
  }
}

/**
 * Lesende FirebaseCollection - UI wird bei jeder Änderung aktualisiert
 * @param collectionName
 * @param options
 * @returns
 */
function useFirebaseCollectionRead<T extends FBEntity>(collectionName: string) {
  return useRecoilValue(listFamily<T>(collectionName))
}

/**
 * ermöglicht es mit Hilfe einer Filterfunktion einen Selektor auf die Liste zu bilden.
 * @param collectionName
 * @param filterFn
 * @returns
 */
function useFirebaseCollectionFilter<T extends FBEntity>(
  collectionName: string,
  filterFn: (list: T[]) => T[]
) {
  return useRecoilValue(filterFamily<T>(collectionName))(filterFn)
}

/**
 * FirebaseCollection - lesend und schreibende
 * @param collectionName
 * @param options
 * @returns
 */
function useFirebaseCollection<T extends FBEntity>(collectionName: string) {
  return {
    list: useFirebaseCollectionRead<T>(collectionName),
    ...useFirebaseCollectionWrite<T>(collectionName),
  }
}

/**
 * Firebase Query
 * @param collectionName
 * @returns
 */
function useFirebaseCollectionQuery<T extends FBEntity>(
  collectionName: string
) {
  const ref: CollectionReference = getCollectionRef(collectionName)
  return (constraints: QueryConstraint) =>
    getDocs(query(ref, constraints)) as Promise<QuerySnapshot<T>>
}

/**
 * Get Firebase Collection Reference
 * @param collectionName
 * @returns
 */
function useFirebaseCollectionRef(collectionName: string) {
  return getCollectionRef(collectionName)
}

export {
  useFirebaseCollectionRef,
  useFirebaseCollectionQuery,
  useFirebaseCollectionRead,
  useFirebaseCollectionWrite,
  useFirebaseCollection,
  useFirebaseCollectionFilter,
}
