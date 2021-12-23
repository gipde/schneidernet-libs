import { Checkbox, FormControlLabel, Theme } from '@mui/material'
import { SxProps } from '@mui/system'
import React from 'react'
import { Controller } from 'react-hook-form'

interface ControlledCheckBoxProps {
  control: any
  name: string
  label: string
  sx?: SxProps<Theme>
}

const ControlledCheckBox = (props: ControlledCheckBoxProps) => {
  const { control, name, label, sx } = props
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControlLabel
          sx={{ ...sx }}
          control={
            <Checkbox
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
            />
          }
          label={label}
        />
      )}
    />
  )
}

ControlledCheckBox.defaultProps = { sx: {} }

export { ControlledCheckBox }
