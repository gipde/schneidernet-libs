import { Button, Tab, Tabs, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

interface TabProps {
  name: string
  child: React.ReactElement
}

interface ActionButton {
  icon: React.ReactElement
  name: string
  onClick: () => void
}
interface GenericTabProps {
  tabs: TabProps[]
  actionButtons?: (_tabName: string) => ActionButton[]
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { md: 3, sm: 1 }, pt: { xs: 2 } }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  )
}
TabPanel.defaultProps = {
  children: null,
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

function GenericTab(props: GenericTabProps) {
  const [activeTabPanel, setActiveTabPanel] = React.useState(0)
  const { tabs, actionButtons } = props

  const changeTab = (event: React.SyntheticEvent, newValue: number) =>
    setActiveTabPanel(newValue)

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: '#e0e0e0' }}>
        <Tabs
          value={activeTabPanel}
          onChange={changeTab}
          aria-label="generic tabs"
          role="tabpanel"
        >
          {tabs.map((t, i) => (
            <Tab key={`tab_${t.name}`} label={t.name} {...a11yProps(i)} />
          ))}
          {actionButtons ? (
            <Box id="rest" sx={{ pt: 1, display: 'flex', width: '100%' }}>
              <Box sx={{ width: '100%' }} />
              <Box>
                {actionButtons(tabs[activeTabPanel].name).map((ab) => (
                  <Button
                    sx={{ mr: 1 }}
                    key={`ab_${ab.name}`}
                    endIcon={ab.icon}
                    onClick={ab.onClick}
                  >
                    {ab.name}
                  </Button>
                ))}
              </Box>
            </Box>
          ) : null}
        </Tabs>
      </Box>
      {/* Panels */}
      {tabs.map((t, i) => (
        <TabPanel key={`tab_panel${t.name}`} value={activeTabPanel} index={i}>
          {t.child}
        </TabPanel>
      ))}
    </Box>
  )
}

GenericTab.defaultProps = {
  actionButtons: undefined,
}

export { GenericTab }
