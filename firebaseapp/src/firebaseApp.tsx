/* eslint no-restricted-syntax: ["error"] */

import { LocalizationProvider } from '@mui/lab'
import DateAdapter from '@mui/lab/AdapterDateFns'
import { log } from '@schneidernet/tools'
import { de } from 'date-fns/locale'
import { FirebaseOptions } from '@firebase/app'
import React, { PropsWithChildren, useEffect, useState } from 'react'
import { RecoilRoot, useRecoilSnapshot } from 'recoil'

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
      <LocalizationProvider dateAdapter={DateAdapter} locale={de}>
        {fbInited ? children : null}
      </LocalizationProvider>
    </RecoilRoot>
  )
}

FirebaseApp.defaultProps = {
  onInit: undefined,
}

export { FirebaseApp }
