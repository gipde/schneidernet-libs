import { atom, atomFamily, selector } from 'recoil'

interface User {
  displayName: string
  email: string
  givenName?: string
  firstName?: string
}

const atomBooleans = atomFamily<boolean, boolean>({
  key: 'booleans',
  default: false,
})

const uiUserAtom = atom<User | undefined>({
  key: 'user',
  default: undefined,
})

const uiPrettyUserWithMail = selector<string>({
  key: 'prettyUserWithMail',
  get: ({ get }) => {
    const u = get(uiUserAtom)
    if (!u?.firstName || !u?.givenName) {
      return u?.displayName
        ? `${u?.displayName} (${u?.email})`
        : `Unbekannter Name (${u?.email})`
    }
    return `${u?.firstName} ${u?.givenName} (${u?.email})`
  },
})

const uiInitedAtom = atom<boolean>({
  key: 'inited',
  default: false,
})

const uiIsAdminAtom = atomBooleans(false)

export { User, uiInitedAtom, uiUserAtom, uiIsAdminAtom, uiPrettyUserWithMail }
