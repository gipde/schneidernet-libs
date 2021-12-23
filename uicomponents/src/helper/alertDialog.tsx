import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import * as React from 'react'

interface AlertDialogProps<T> {
  title: string | ((data: T) => string)
  text: string | ((data: T) => string)
  /**
   * kann ein beliebiger Datentyp oder eben boolean sein
   */
  open: T
  onClose: (_accept: boolean, data: T) => void
}
const AlertDialog: <T>(props: AlertDialogProps<T>) => React.ReactElement = (props) => {
  const { onClose, title, text, open: context } = props

  const fnOrValue = (arg: string | ((data: typeof context) => string)) =>
    typeof arg === 'function' ? arg(context) : arg

  return (
    <div>
      <Dialog
        open={!!context}
        onClose={() => onClose(false, context)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{fnOrValue(title)}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {fnOrValue(text)}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => onClose(false, context)}>
            Abbrechen
          </Button>
          <Button variant="outlined" onClick={() => onClose(true, context)}>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export { AlertDialog }
