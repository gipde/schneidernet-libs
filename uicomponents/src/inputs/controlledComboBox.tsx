import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material'
import _ from 'lodash'
import React from 'react'
import { Controller } from 'react-hook-form'

export interface ComboBoxEntry {
  key: string
  value: string
}

export interface ControlledComboBoxProps {
  id: string
  label: string
  entries: ComboBoxEntry[]
  control: any
  errors: any
  errorText: string
  clearErrors?: any
  onChange?: (value: SelectChangeEvent<string>) => void
}

function ControlledComboBox(props: ControlledComboBoxProps) {
  const { control, id, label, errors, clearErrors, errorText, entries, onChange } = props

  const formErrors = _.get(errors, id)

  return (
    <Controller
      name={id}
      control={control}
      rules={{
        validate: (value) => !!value,
      }}
      render={({ field }) => (
        <FormControl fullWidth size="small" error={!!formErrors}>
          <InputLabel id={`select-label${id}`}>{label}</InputLabel>
          <Select
            labelId={`select-label${id}`}
            id={id}
            label={label}
            variant="outlined"
            value={field.value}
            fullWidth
            onChange={(value) => {
              if (clearErrors) {
                clearErrors()
              }
              field.onChange(value)
              if (onChange) {
                onChange(value)
              }
            }}
            size="small"
          >
            {entries.map((e) => (
              <MenuItem key={`key_${e.key}`} value={e.key}>
                {e.value}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>{formErrors && errorText}</FormHelperText>
        </FormControl>
      )}
    />
  )
}

ControlledComboBox.defaultProps = {
  clearErrors: undefined,
}

export { ControlledComboBox }
