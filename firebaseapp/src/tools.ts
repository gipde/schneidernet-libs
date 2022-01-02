import { updateProfile } from '@firebase/auth'
import { log } from '@schneidernet/tools'
import { useSetRecoilState } from 'recoil'

import { auth } from './initFirebase'
import { uiUserAtom } from './model/ui'

// TODO: hier sollte das mit Recoil State irgendwie funktionieren
//       aber das funktioniert nur innerhalb einer Component
//       beim LogOut sollte gleichzeigit der User auf undefined gesetzt werden.

export function setFirebaseUser(displayName: string) {
  const setUser = useSetRecoilState(uiUserAtom)
  if (auth.currentUser) {
    updateProfile(auth.currentUser, { displayName })
    setUser((oldUser) => {
      if (oldUser) {
        return { ...oldUser, displayName }
      }
      log.error('uiUser nicht gesetzt. Deshalb kann der DisplayName nicht gesetzt werden')
      return undefined
    })
  } else {
    log.error('Kein Benutzer angemeldet')
  }
}

export function logOut() {
  return auth.signOut()
}
