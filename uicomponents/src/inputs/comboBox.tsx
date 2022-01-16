import { Clear } from '@mui/icons-material'
import { IconButton, InputAdornment, TextFieldProps } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import * as React from 'react'

import { StyledTextField } from './textField'

interface ComboBoxEntry {
  key: string
  value: string
}

interface ComboBoxProps {
  id: string
  label: string
  entries: ComboBoxEntry[]
  onClear?: () => void
}

function ComboBox(props: ComboBoxProps & TextFieldProps) {
  const { onClear, entries: values, ...restProps } = props

  return (
    <FormControl fullWidth>
      <StyledTextField
        select
        InputProps={
          onClear
            ? {
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton onClick={onClear}>
                      <Clear />
                    </IconButton>
                  </InputAdornment>
                ),
              }
            : undefined
        }
        {...restProps}
      >
        {values.map((v) => (
          <MenuItem key={`key=${v.key}`} value={v.key}>
            {v.value}
          </MenuItem>
        ))}
      </StyledTextField>
    </FormControl>
  )
}
ComboBox.defaultProps = {
  onClear: undefined,
}

export { ComboBox }
