import { DatePicker, DateTimePicker } from '@mui/lab'
import { TextFieldProps } from '@mui/material'
import { dateValidator } from '@schneidernet/tools'
import _ from 'lodash'
import React from 'react'
import {
  Controller,
  FieldErrors,
  UseFormClearErrors,
  UseFormSetError,
} from 'react-hook-form'

import { DateAsTime } from '../helper/types'
import { StyledTextField } from './textField'

interface ControlledDatePickerProps<T> {
  id: any
  label: string
  control: any
  errors: FieldErrors<T>
  setError: UseFormSetError<T>
  clearErrors: UseFormClearErrors<T>
  mask?: string
  type?: 'DateTimePicker' | 'DatePicker'
}

const ControlledDatePicker = <T,>(
  props: ControlledDatePickerProps<T> & TextFieldProps,
) => {
  const defaultProps: Partial<ControlledDatePickerProps<T> & TextFieldProps> = {
    size: 'medium',
    type: 'DatePicker',
  }

  const { id, label, control, setError, clearErrors, errors, size, sx, type } = {
    ...defaultProps,
    ...props,
  }

  const mask = type === 'DatePicker' ? '__.__.____' : '__.__.____ __:__'

  const pickerProps = (field: any) => ({
    desktopModeMediaQuery: '@media (min-width: 0px)',
    value: field.value,
    label,
    mask,
    onChange: (e: Date | null) => {
      if (!dateValidator(e)) {
        setError(id, {})
      } else {
        clearErrors(id)
      }
      field.onChange(e?.getTime())
    },
    renderInput: (params: any) => (
      <StyledTextField
        size={size}
        sx={sx}
        {...params}
        helperText={_.get(errors, id) && 'Datum falsch'}
        error={!!_.get(errors, id)}
      />
    ),
  })

  return (
    <Controller
      name={id}
      control={control}
      rules={{
        required: true,
        validate: ((d: DateAsTime) => dateValidator(d)) as any,
      }}
      render={({ field }) =>
        type === 'DateTimePicker' ? (
          <DateTimePicker {...pickerProps(field)} />
        ) : (
          <DatePicker {...pickerProps(field)} />
        )
      }
    />
  )
}

export { ControlledDatePicker }
