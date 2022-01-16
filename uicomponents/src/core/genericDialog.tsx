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

function GenericModelDialog<T extends {}>(
  props: React.PropsWithChildren<FullGenericModelDialogProps<T>>,
) {
  const { onClose, data, formId, reset, title, children, handleSubmit, maxWidth } = props

  const onSubmit: SubmitHandler<T> = (submittedData) => {
    log.debug('Submit', JSON.stringify(submittedData))
    onClose(submittedData as T)
  }

  // Setze Feldwerte
  useEffect(() => {
    if (data) {
      log.debug('Setting Dialog to ', formId, data)
      reset(data)
    }
  }, [!!data])

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)}>
      <Dialog maxWidth={maxWidth} fullWidth open={!!data} onClose={() => onClose()}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>{children}</DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => onClose()}>
            Abbrechen
          </Button>
          <Button variant="outlined" type="submit" form={formId}>
            Speichern
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  )
}

GenericModelDialog.defaultProps = {
  maxWidth: 'sm',
}

export { GenericModelDialog }
