import { ReactJSXElement } from '@emotion/react/types/jsx-namespace'
import { MoreVert } from '@mui/icons-material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import {
  Collapse,
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TablePropsSizeOverrides,
  TableRow,
  TableSortLabel,
  Theme,
} from '@mui/material'
import { SxProps } from '@mui/system'
import { OverridableStringUnion } from '@mui/types'
import _ from 'lodash'
import React, { ReactElement, useState } from 'react'

import { AlertDialog } from '../helper/alertDialog'

export interface ActionButton<T> {
  name: string
  disabled?: boolean
  onClick: (_data: T) => void
}

export interface ColumnDefinition<T> {
  name: string
  path?: string
  cellRenderer?: (v: T) => ReactElement | string
  sortComparator?: (order: Order) => (a: T, b: T) => number
  style?: SxProps<Theme>
}

interface DefaultActions<T> {
  delete?: (data: T) => void
  edit?: (data: T | undefined) => void
}

interface CrudTableData {
  id: string
}

interface CrudTableProps<T extends CrudTableData> {
  data: T[]
  collapse?: (data: T) => ReactJSXElement | undefined
  actionButtons?: (data: T) => ActionButton<T>[]
  columnDefinition: ColumnDefinition<T>[]
  size?: OverridableStringUnion<'small' | 'medium', TablePropsSizeOverrides>
  defaultSortColumn?: string | undefined
  defaultSortDirection?: Order
  defaultActions?: DefaultActions<T>
}

interface RowProps<T> {
  id: string
  data: T
  columnDefinition: ColumnDefinition<T>[]
  collapse?: (_data: T) => ReactJSXElement | undefined
  actionButtons: ActionButton<T>[]
  defaultDeleteAction?: (data: T) => void
  defaultEditAction?: (data: T | undefined) => void
}

export type Order = 'asc' | 'desc'

const Row: <T>(props: RowProps<T>) => React.ReactElement = (props) => {
  const {
    id,
    data,
    columnDefinition,
    collapse,
    actionButtons,
    defaultDeleteAction,
    defaultEditAction,
  } = props

  const [open, setOpen] = useState(false)
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null)

  const MenuOpen = Boolean(menuAnchorEl)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) =>
    setMenuAnchorEl(event.currentTarget)

  const handleCloseMenu = () => setMenuAnchorEl(null)

  const resolvedActionButtons = actionButtons.filter(
    (ab) => !ab.disabled || (ab.disabled && !ab.disabled),
  )
  if (defaultEditAction) {
    resolvedActionButtons.push({
      name: 'ändern',
      onClick: (v) => defaultEditAction(v),
    })
  }
  if (defaultDeleteAction) {
    resolvedActionButtons.push({
      name: 'löschen',
      onClick: defaultDeleteAction,
    })
  }

  return (
    <>
      <TableRow>
        {!collapse ? null : (
          <TableCell sx={{ p: { xs: 0, md: 1 } }}>
            <IconButton
              sx={{ p: { xs: 0, md: 2 } }}
              aria-label={`erweitern_${id}`}
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
        )}
        <>
          {columnDefinition.map((v, i) => {
            const value = v.path ? _.get(data, v.path) : 'unknown'
            const cellValue = v.cellRenderer ? v.cellRenderer(data) : value
            return (
              <TableCell key={`key_${v.name}`} sx={columnDefinition[i].style}>
                {cellValue}
              </TableCell>
            )
          })}
        </>
        {resolvedActionButtons.length ? (
          <TableCell>
            <IconButton onClick={handleClick}>
              <MoreVert />
            </IconButton>
          </TableCell>
        ) : null}
      </TableRow>

      {open ? (
        <TableRow>
          <TableCell
            style={{ paddingBottom: 0, paddingTop: 0, margin: 0 }}
            colSpan={columnDefinition.length + 2}
          >
            {!collapse ? null : (
              <Collapse in={open} timeout="auto" unmountOnExit>
                {collapse(data)}
              </Collapse>
            )}
          </TableCell>
        </TableRow>
      ) : null}

      {resolvedActionButtons.length ? (
        <Menu
          id="menu"
          anchorEl={menuAnchorEl}
          open={MenuOpen}
          onClose={handleCloseMenu}
          MenuListProps={{
            'aria-labelledby': 'button',
          }}
        >
          {resolvedActionButtons.map((ab) => (
            <MenuItem
              key={`key_${ab.name}`}
              onClick={() => {
                handleCloseMenu()
                ab.onClick(data)
              }}
            >
              {ab.name}
            </MenuItem>
          ))}
        </Menu>
      ) : null}
    </>
  )
}

const CrudTable = <T extends CrudTableData>(props: CrudTableProps<T>) => {
  const {
    columnDefinition,
    data,
    collapse,
    actionButtons,
    defaultSortColumn,
    defaultSortDirection,
    defaultActions,
  } = props

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [orderBy, setOrderBy] = React.useState<string | undefined>(defaultSortColumn)
  const [order, setOrder] = useState<Order>(defaultSortDirection ?? 'asc')
  const [deleteWarning, setDeleteWarning] = useState<T | undefined>()

  const handleDelete = (accept: boolean, m: T) => {
    if (defaultActions?.delete) {
      if (accept) {
        defaultActions.delete(m)
      }
      setDeleteWarning(undefined)
    }
  }

  const handleDeleteAction = (v: T) => setDeleteWarning(v)

  const handleChangePage = (event: unknown, newPage: number) => setPage(newPage)

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const createSortHandler = (colDef: ColumnDefinition<T>) => () => {
    const isAsc = orderBy === colDef.name && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(colDef.name)
  }

  const pathComparator = (path: string | undefined, orderArg: Order) => {
    return path
      ? (a: T, b: T) => {
          const aVal = _.get(a, path)
          const bVal = _.get(b, path)
          const retval = aVal === bVal ? 0 : aVal < bVal ? -1 : 1
          return orderArg === 'asc' ? retval : -retval
        }
      : undefined
  }

  const getComparator = (orderByArg: string | undefined, orderArg: Order) => {
    const column = columnDefinition.find((c) => c.name === orderByArg)
    if (column?.sortComparator) {
      return column?.sortComparator(orderArg)
    }
    return pathComparator(column?.path, orderArg)
  }

  return (
    <div>
      <TableContainer sx={{ width: '100%' }}>
        <Table aria-label="collapsible table" size="small">
          <TableHead>
            <TableRow>
              {!collapse ? null : <TableCell />}
              {columnDefinition.map((colDef) => (
                <TableCell key={colDef.name} sx={colDef.style}>
                  <TableSortLabel
                    active={orderBy === colDef.name}
                    direction={orderBy === colDef.name ? order : 'asc'}
                    onClick={createSortHandler(colDef)}
                  >
                    {colDef.name}
                  </TableSortLabel>
                </TableCell>
              ))}
              {!!actionButtons || defaultActions ? <TableCell /> : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .slice()
              .sort(getComparator(orderBy, order))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((element, i) => (
                <Row
                  id={i.toString()}
                  collapse={collapse}
                  columnDefinition={columnDefinition}
                  data={element}
                  key={element.id}
                  actionButtons={actionButtons ? actionButtons(element) : []}
                  defaultDeleteAction={
                    defaultActions?.delete ? handleDeleteAction : undefined
                  }
                  defaultEditAction={defaultActions?.edit}
                />
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
      {defaultActions?.delete && deleteWarning ? (
        <AlertDialog
          onClose={handleDelete}
          open={deleteWarning}
          text="Wollen Sie wirklich löschen?"
          title="Eintrag löschen"
        />
      ) : null}
    </div>
  )
}

export { CrudTable }
