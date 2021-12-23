import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material'
import _ from 'lodash'
import React from 'react'
import { Controller } from 'react-hook-form'

interface ComboBoxEntry {
  key: string
  value: string
}

interface ControlledComboBoxProps {
  id: string
  label: string
  entries: ComboBoxEntry[]
  control: any
  errors: any
  errorText: string
  clearErrors?: any
}

const ControlledComboBox = (props: ControlledComboBoxProps) => {
  const { control, id, label, errors, clearErrors, errorText, entries } = props

  const formErrors = _.get(errors, id)

  return (
    <Controller
      name={id}
      control={control}
      rules={{
        validate: (value) => {
          return !!value
        },
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

export { ControlledComboBox }
