import { Paper, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { formatDayTime } from '@schneidernet/tools'
import { History } from '@schneidernet/firebaseappp'
import React from 'react'

interface HistoryObject {
  history?: History[]
}

interface VerlaufProps {
  data: HistoryObject
  before?: React.ReactNode
  after?: React.ReactNode
}
function Verlauf(props: VerlaufProps) {
  const { before, data, after } = props

  return (
    <Paper
      variant="outlined"
      sx={{
        mt: 2,
        mb: 2,
        p: 2,
        backgroundColor: 'whitesmoke',
        width: '100%',
      }}
    >
      {before}
      <Box sx={{ margin: 1 }}>
        <Typography variant="h6" gutterBottom component="div">
          Verlauf
        </Typography>
        {data.history
          ? data.history.map((v) => (
              <Box key={`key_${v.datum}`}>
                {formatDayTime(v.datum)},{v.user},{v.beschreibung}
              </Box>
            ))
          : null}
      </Box>
      {after}
    </Paper>
  )
}

Verlauf.defaultProps = {
  before: null,
  after: null,
}

export { Verlauf }
