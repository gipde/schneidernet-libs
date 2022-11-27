import { AccountCircle, Sync } from '@mui/icons-material'
import MenuIcon from '@mui/icons-material/Menu'
import { IconButton, MenuItem, Tooltip } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/system'
import { User } from '@schneidernet/firebaseappp'
import { log } from '@schneidernet/tools'
import React, { ReactElement, useEffect, useState } from 'react'

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
  title: string
  pages: any
  version: string
  logo: any
  sync: any
  logout: any
  user: User | undefined
}

function MainMenu(props: MainMenuProps) {
  const { pages, sync, logout, user, logo, version, title } = props

  // store last used
  const [activePage, setActivePage] = useState<Page | undefined>(
    pages.length ? pages[0] : undefined,
  )
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [drawerOpen, setDrawerOpen] = React.useState<boolean>(false)
  const isMenuOpen = Boolean(anchorEl)

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget)

  const handleSync = async () => {
    await sync()
    log.debug('Data synced')
  }

  const handleMenuClose = () => setAnchorEl(null)

  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen)

  const logoutHandler = () => {
    logout().then(() => {
      handleMenuClose()
    })
  }

  const handleDrawer = (index: number) => {
    setActivePage(pages[index])
    setDrawerOpen(false)
  }

  // if pages will be modified
  useEffect(() => {
    setActivePage(pages[0])
  }, [pages])

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
          <Typography variant="body2">{user?.displayName}</Typography>
          <Typography variant="body2">{user?.email}</Typography>
        </Box>
      </Box>
      <MenuItem onClick={logoutHandler}>Logout</MenuItem>
    </Menu>
  )

  const drawer = (
    <div>
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {pages.map((page: any, index: number) => (
            <ListItem button key={page.name} onClick={() => handleDrawer(index)}>
              <ListItemIcon>{page.icon}</ListItemIcon>
              <ListItemText primary={page.name} />
            </ListItem>
          ))}
        </List>
      </Box>
    </div>
  )

  return (
    <Box sx={{ display: 'flex' }}>
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
            <img width={55} src={logo} alt="Logo" />
          </ResponsiveBox>
          <Tooltip title={`Version: ${version}` ?? 'dev'}>
            <Typography variant="h4" noWrap component="div" sx={{ fontWeight: 500 }}>
              {title}
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
      {renderMenu}
      <Drawer
        variant="temporary"
        open={drawerOpen}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
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
          '& .MuiDrawer-paper': {
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
