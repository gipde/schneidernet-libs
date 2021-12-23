import { Paper, Theme } from '@mui/material'
import { SxProps } from '@mui/system'
import React, { PropsWithChildren, ReactNode } from 'react'

interface OutlineBoxProps {
  sx?: SxProps<Theme>
}

const OutlineBox = (props: OutlineBoxProps & PropsWithChildren<ReactNode>) => {
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
