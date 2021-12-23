import { collection, CollectionReference, DocumentData } from '@firebase/firestore'
import { SetterOrUpdater } from 'recoil'
import {
  addEntityToList,
  addOrUpdateEntityInList,
  clearList,
  fbCollectionAddEntity,
  fbCollectionClear,
  fbCollectionLoad,
  fbCollectionRemoveEntity,
  fbCollectionSeed,
  fbCollectionUpdateEntity,
  FEntity,
  FHistoryEntity,
  FirebaseCollectionI,
  FirebaseHistoryCollectionI,
  loadList,
  removeEntityFromList,
  seedList,
  SeedOptions,
  SyncListI,
  updateEntityInList,
} from '.'
import { firestore } from '../initFirebase'

function collectionRef(colName: string): CollectionReference<DocumentData> {
  return collection(
    firestore,
    process.env.NODE_ENV === 'production' ? colName : `test_${colName}`,
  )
}

const FirebaseCollection: <T extends FEntity>(
  collectionName: string,
) => FirebaseCollectionI<T> = <T extends FEntity>(colletionName: string) => {
  const colRef = collectionRef(colletionName)
  return {
    newEntity: () => {
      throw new Error('not implemented')
    },
    seed: (opts: SeedOptions<T>) => fbCollectionSeed(colRef, opts),
    addEntity: (e: T | T[]) => fbCollectionAddEntity(colRef, e),
    updateEntity: (o: T, e: T) => fbCollectionUpdateEntity(colRef, o, e),
    deleteEntity: (e: T) => fbCollectionRemoveEntity(colRef, e),
    clear: (l: T[]) => fbCollectionClear(colRef, l),
    load: () => fbCollectionLoad<T>(colRef),
    syncList: FirebaseCollectionSyncList<T>(colRef),
  }
}
/**
 *
 * @param colRef
 * @returns
 */
const FirebaseCollectionSyncList: <T extends FEntity>(
  colRef: CollectionReference<DocumentData>,
) => (setter: SetterOrUpdater<T[]>) => SyncListI<T> =
  <T extends FEntity>(colRef: CollectionReference<DocumentData>) =>
  (setter: SetterOrUpdater<T[]>) => ({
    seed: (opts: SeedOptions<T>) => seedList(setter, colRef, opts),
    addEntity: (e: T | T[]) => addEntityToList(setter, colRef, e),
    addOrUpdateEntity: (o: T, e: T) => addOrUpdateEntityInList(setter, colRef, o, e),
    updateEntity: (o: T, e: T) => updateEntityInList(setter, colRef, o, e),
    deleteEntity: (e: T) => removeEntityFromList(setter, colRef, e),
    clear: () => clearList(setter, colRef),
    load: () => loadList(setter, colRef),
  })

const FirebaseHistoryCollection: <T extends FHistoryEntity>(
  collectionName: string,
) => FirebaseHistoryCollectionI<T> = <T extends FHistoryEntity>(
  collectionName: string,
) => {
  const ref = collectionRef(collectionName)
  return {
    ...FirebaseCollection(collectionName),
    newEntity: () => {
      throw new Error('not implemented')
    },
    storeEntity: (e: T, history: string | boolean, user: string) =>
      fbCollectionAddEntity(ref, e, history, user),
    syncList: FirebaseHistoryCollectionSyncList<T>(ref),
  }
}

const FirebaseHistoryCollectionSyncList: <T extends FEntity>(
  ref: CollectionReference<DocumentData>,
) => (
  setter: SetterOrUpdater<T[]>,
  history?: string | boolean,
  user?: string,
) => SyncListI<T> =
  <T extends FEntity>(ref: CollectionReference<DocumentData>) =>
  (setter: SetterOrUpdater<T[]>, history?: string | boolean, user?: string) => ({
    seed: (opts: SeedOptions<T>) => seedList(setter, ref, opts, history, user),
    addEntity: (e: T | T[]) => addEntityToList(setter, ref, e, history, user),
    addOrUpdateEntity: (o: T, e: T) =>
      addOrUpdateEntityInList(setter, ref, o, e, history, user),
    updateEntity: (o: T, e: T) => updateEntityInList(setter, ref, o, e, history, user),
    deleteEntity: (e: T) => removeEntityFromList(setter, ref, e),
    clear: () => clearList(setter, ref),
    load: () => loadList(setter, ref),
  })

export { FirebaseHistoryCollection, FirebaseCollection }
