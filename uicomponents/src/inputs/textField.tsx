import { TextField, TextFieldProps } from '@mui/material'
import React, { forwardRef } from 'react'

const StyledTextField = forwardRef<HTMLDivElement, TextFieldProps>((props, ref) => (
  <TextField variant="outlined" size="small" fullWidth {...props} ref={ref} />
))
StyledTextField.displayName = 'StyledTextField'

export { StyledTextField }
