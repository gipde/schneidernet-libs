import {
  Breakpoint,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import { log } from '@schneidernet/tools'
import React, { useEffect } from 'react'
import { SubmitHandler } from 'react-hook-form'

export interface BaseId {
  // Optional, damit eine Referenz auf ein Objekt überegeben werden kann
  baseId?: string
}
export interface GenericModelDialogProps<T> {
  data: T
  onClose: (data?: T) => void
}

interface FullGenericModelDialogProps<T> extends GenericModelDialogProps<T> {
  title: string
  formId: string
  maxWidth?: Breakpoint
  handleSubmit: any
  reset: (data: T) => void
}

const GenericModelDialog = <T extends {}>(
  props: React.PropsWithChildren<FullGenericModelDialogProps<T>>,
) => {
  const onSubmit: SubmitHandler<T> = (submittedData) => {
    log.debug('Submit', JSON.stringify(submittedData))
    props.onClose(submittedData as T)
  }

  // Setze Feldwerte
  useEffect(() => {
    if (props.data) {
      log.debug('Setting Dialog to ', props.formId, props.data)
      props.reset(props.data)
    }
  }, [!!props.data])

  return (
    <form id={props.formId} onSubmit={props.handleSubmit(onSubmit)}>
      <Dialog
        maxWidth={props.maxWidth || 'sm'}
        fullWidth
        open={!!props.data}
        onClose={() => props.onClose()}
      >
        <DialogTitle>{props.title}</DialogTitle>
        <DialogContent>{props.children}</DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => props.onClose()}>
            Abbrechen
          </Button>
          <Button variant="outlined" type="submit" form={props.formId}>
            Speichern
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  )
}

export { GenericModelDialog }
