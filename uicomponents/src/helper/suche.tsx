import { Clear, Search } from '@mui/icons-material'
import { IconButton, InputAdornment, Tooltip } from '@mui/material'
import React, { useState } from 'react'

import { StyledTextField } from '../inputs/textField'

interface SucheProps {
  title?: string
  defaultValue?: string[]
  handleSearch: (_search: string[]) => void
}

function Suche(props: SucheProps) {
  const { title, defaultValue, handleSearch } = props
  const [search, setSearch] = useState<string[]>(defaultValue ?? [])

  const handleSearchIntern = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value.split(' '))
    handleSearch(e.target.value.split(' '))
  }

  const clearSearch = () => {
    setSearch([])
    handleSearch([])
  }

  return (
    <Tooltip title={title as string}>
      <StyledTextField
        value={search.join(' ')}
        label="Suche"
        InputProps={{
          endAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
          startAdornment: search.length ? (
            <InputAdornment position="start">
              <IconButton onClick={clearSearch}>
                <Clear />
              </IconButton>
            </InputAdornment>
          ) : undefined,
        }}
        onChange={handleSearchIntern}
      />
    </Tooltip>
  )
}

Suche.defaultProps = {
  title: 'Suche',
  defaultValue: [],
}

export { Suche }
