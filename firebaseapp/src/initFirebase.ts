/* eslint-disable import/no-mutable-exports */
import { Analytics, getAnalytics } from 'firebase/analytics'
import { FirebaseApp, FirebaseOptions, initializeApp } from 'firebase/app'
import { Auth, getAuth } from 'firebase/auth'
import { Firestore, getFirestore } from 'firebase/firestore'
import { FirebasePerformance, getPerformance } from 'firebase/performance'
import { log } from '@schneidernet/tools'

let app: FirebaseApp
let firestore: Firestore
let analytics: Analytics
let auth: Auth
let performance: FirebasePerformance

const initFirebaseApp = (cfg: FirebaseOptions, name: string) => {
  if (app === undefined) {
    log.debug('Init Firebase...')
    app = initializeApp(cfg, name)
    firestore = getFirestore(app)
    analytics = getAnalytics(app)
    auth = getAuth(app)
    performance = getPerformance(app)
  }
}

export { initFirebaseApp, app, firestore, analytics, auth, performance }
