import { updateProfile } from 'firebase/auth'
import { log } from '@schneidernet/tools'
import { auth } from './initFirebase'

// TODO: hier sollte das mit Recoil State irgendwie funktionieren
//       aber das funktioniert nur innerhalb einer Component
//       beim LogOut sollte gleichzeigit der User auf undefined gesetzt werden.

export function setFirebaseUser(displayName: string) {
  if (auth.currentUser) {
    updateProfile(auth.currentUser, { displayName })
  } else {
    log.error('Kein Benutzer angemeldet')
  }
}

export function logOut() {
  return auth.signOut()
}
