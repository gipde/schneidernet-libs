import { Paper, Theme } from '@mui/material'
import { SxProps } from '@mui/system'
import React, { PropsWithChildren } from 'react'

interface OutlineBoxProps {
  sx?: SxProps<Theme>
}

function OutlineBox(props: PropsWithChildren<OutlineBoxProps>) {
  const { sx, children } = props
  return (
    <Paper
      variant="outlined"
      sx={{
        ...sx,
        maxHeight: 40,
        borderColor: '#c4c4c4',
        '&:hover': { borderColor: 'black' },
      }}
    >
      {children}
    </Paper>
  )
}

OutlineBox.defaultProps = {
  sx: {},
}

export { OutlineBox }
