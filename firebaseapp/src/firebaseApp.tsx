/* eslint no-restricted-syntax: ["error"] */

import { FirebaseOptions } from '@firebase/app'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { log } from '@schneidernet/tools'
import { de } from 'date-fns/locale'
import React, { PropsWithChildren, useEffect, useState } from 'react'
import { RecoilRoot, useRecoilSnapshot } from 'recoil'

import { LocalizationProvider } from '@mui/x-date-pickers'
import { initFirebaseApp } from './initFirebase'

interface FirebaseAppProps {
  config: FirebaseOptions
  onInit?: () => void
}

function DebugObserver() {
  const snapshot = useRecoilSnapshot()
  useEffect(() => {
    log.debug('The following atoms were modified:')
    for (const node of snapshot.getNodes_UNSTABLE({ isModified: true })) {
      // eslint-disable-next-line no-console
      console.log(node.key, snapshot.getLoadable(node))
    }
  }, [snapshot])

  return null
}

function FirebaseApp(props: PropsWithChildren<FirebaseAppProps>) {
  log.debug('Starting FirebaseApp...')

  const { config, onInit, children } = props

  const [fbInited, setFbInited] = useState(false)

  useEffect(() => {
    if (!fbInited) {
      initFirebaseApp(config)
      setFbInited(true)
    }
    if (fbInited) {
      log.info('FirebaseApp inited')
    }
    if (fbInited && onInit) {
      onInit()
    }
  }, [fbInited])

  return (
    <RecoilRoot>
      {log.getLogLevel() === 'DEBUG' ? <DebugObserver /> : null}
      <LocalizationProvider dateAdapter={AdapterDateFns} locale={de}>
        {fbInited ? children : null}
      </LocalizationProvider>
    </RecoilRoot>
  )
}

FirebaseApp.defaultProps = {
  onInit: undefined,
}

export { FirebaseApp }
