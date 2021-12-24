import { AccountCircle, Sync } from '@mui/icons-material'
import MenuIcon from '@mui/icons-material/Menu'
import { Button, IconButton, MenuItem, Tooltip, useTheme } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/system'
import { log } from '@schneidernet/tools'
import React, { ReactElement, useState } from 'react'

const drawerWidth = 240

interface Page {
  name: string
  icon: ReactElement
  component: ReactElement
  adminOnly: boolean
}

const ResponsiveBox = styled('div')(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    left: '65px',
  },
  [theme.breakpoints.up('md')]: {
    left: '12px',
  },
}))

interface MainMenuProps {
  pages: any
  version: string
  logo: any
  sync: any
  logout: any
  user: string
}

const MainMenu = (props: MainMenuProps) => {
  const [activePage, setActivePage] = useState<Page | undefined>(
    props.pages.length ? props.pages[0] : undefined,
  )
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [drawerOpen, setDrawerOpen] = React.useState<boolean>(false)
  const isMenuOpen = Boolean(anchorEl)

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget)

  const handleSync = async () => {
    props.sync()
  }

  const handleMenuClose = () => setAnchorEl(null)

  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen)

  const logout = () => {
    props.logout().then(() => {
      handleMenuClose()
    })
  }

  const handleDrawer = (index: number) => {
    setActivePage(props.pages[index])
    setDrawerOpen(false)
  }

  const menuId = 'primary-search-account-menu'
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <Box
        sx={{
          p: 1,
          m: 1,
          borderWidth: 2,
          borderStyle: 'solid',
          borderColor: 'primary.secondary',
          borderRadius: 2,
          backgroundColor: 'secondary.main',
        }}
      >
        <Box sx={{ color: 'secondary.contrastText' }}>
          <Typography variant="body2">{props.user}</Typography>
        </Box>
      </Box>
      <MenuItem onClick={logout}>Logout</MenuItem>
    </Menu>
  )

  const drawer = (
    <div>
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {props.pages.map((page: any, index: number) => {
            return (
              <ListItem button key={page.name} onClick={() => handleDrawer(index)}>
                <ListItemIcon>{page.icon}</ListItemIcon>
                <ListItemText primary={page.name} />
              </ListItem>
            )
          })}
        </List>
      </Box>
    </div>
  )

  const t = useTheme()
  log.debug('Theme', JSON.stringify(t.palette.primary))
  console.log(t.palette.primary)

  return (
    <Box sx={{ display: 'flex' }}>
      <div style={{ border: '11 px solid black' }}>
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ width: '65px' }} />
            <ResponsiveBox
              sx={{
                position: 'absolute',
                top: '5px',
                filter: 'drop-shadow(0px 0px 5px #A0A0A0)',
              }}
            >
              <img width={55} src={props.logo} alt="Logo" />
            </ResponsiveBox>
            <Tooltip title={`Version: ${props.version}` ?? 'dev'}>
              <Typography variant="h4" noWrap component="div" sx={{ fontWeight: 500 }}>
                OGV Hemau e.V.
              </Typography>
            </Tooltip>
            <Box sx={{ flexGrow: 1 }} />
            <Tooltip title="Aktualisiere Daten">
              <IconButton size="large" edge="start" color="inherit" onClick={handleSync}>
                <Sync />
              </IconButton>
            </Tooltip>
            <Tooltip title="Benutzer">
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                onClick={handleProfileMenuOpen}
              >
                <AccountCircle />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
      </div>
      {renderMenu}
      <Drawer
        variant="temporary"
        open={drawerOpen}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          display: { xs: 'block', md: 'none' },
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          display: { xs: 'none', md: 'block' },
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        {drawer}
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 0, md: 3 } }}>
        {/* Als Platzhalter für die App-Bar */}
        <Toolbar />
        {activePage?.component}
      </Box>
    </Box>
  )
}

export { MainMenu, Page }
