import {
  getRedirectResult,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithEmailAndPassword,
  signInWithRedirect,
  UserCredential,
} from 'firebase/auth'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import {
  Avatar,
  Box,
  Button,
  CssBaseline,
  Grid,
  Link,
  TextField,
  Typography,
} from '@mui/material'
import { SxProps, TypographyProps } from '@mui/system'
import { log } from '@schneidernet/tools'
import React, { PropsWithChildren, useEffect, useState } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { auth } from './initFirebase'
import { uiIsAdminAtom, uiUserAtom } from './model/ui'

const appleLogo = (
  <svg
    width="80"
    height="30"
    viewBox="0 0 1000 1000"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M702 960c-54.2 52.6-114 44.4-171 19.6-60.6-25.3-116-26.9-180 0-79.7 34.4-122 24.4-170-19.6-271-279-231-704 77-720 74.7 4 127 41.3 171 44.4 65.4-13.3 128-51.4 198-46.4 84.1 6.8 147 40 189 99.7-173 104-132 332 26.9 396-31.8 83.5-72.6 166-141 227zM423 237C414.9 113 515.4 11 631 1c15.9 143-130 250-208 236z" />
  </svg>
)
const googleLogo = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="80"
    height="30"
    viewBox="0 0 300 90"
  >
    <path
      fill="#EA4335"
      d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"
    />
    <path
      fill="#FBBC05"
      d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"
    />
    <path
      fill="#4285F4"
      d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z"
    />
    <path fill="#34A853" d="M225 3v65h-9.5V3h9.5z" />
    <path
      fill="#EA4335"
      d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z"
    />
    <path
      fill="#4285F4"
      d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01z"
    />
  </svg>
)

function Copyright(props: TypographyProps) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      paddingTop="0.5em"
      {...props}
    >
      {'Copyright © '}
      <Link color="inherit" href="https://ogvhemau.web.app/">
        OGV Hemau
      </Link>
      {new Date().getFullYear()}
    </Typography>
  )
}

interface LoginProps {
  background: SxProps
  logo: string
  afterLogin?: () => void
}

function Login(props: PropsWithChildren<LoginProps>): any {
  const [errorMessage, setErrorMessage] = React.useState('')
  const [redirected, setRedirected] = useState(true)
  const [uiUser, setUiUser] = useRecoilState(uiUserAtom)
  const [uiInited, setUiInited] = useState(false)
  const setAdmin = useSetRecoilState(uiIsAdminAtom)

  const { afterLogin, children, background, logo } = props

  const setUser = () => {
    if (auth?.currentUser) {
      // we are already have a valid login
      log.debug('current Firebaseuser:', JSON.stringify(auth.currentUser))
      if (!uiUser) {
        const user = {
          displayName: auth.currentUser.displayName || '',
          email: auth.currentUser.email || '',
        }
        log.debug('setting UIUser to:', JSON.stringify(user))
        setUiUser(user)

        if (auth.currentUser.displayName === 'Werner Schneider') {
          setAdmin(true)
        }
      }

      if (afterLogin && !uiInited) {
        setUiInited(true)
        afterLogin()
      }
    }
  }

  const handleLogin = (
    message: string,
    loginFn: () => Promise<UserCredential | null>
  ) => {
    // we have to login
    loginFn()
      .then((credential) => {
        if (credential && auth.currentUser) {
          // TODO: irgendetwas stimmt hier nicht !!!
          setRedirected(true)
          setUser()
        } else {
          setRedirected(false)
        }
      })
      .catch((error) => {
        setErrorMessage(message)
        log.error(error.message)
      })
  }

  // Get the Redirection Result after page load
  // TODO: da dürfen wir keinen State verändern !!!
  useEffect(() => {
    handleLogin('Fehler nach Redirect OAuth', () => getRedirectResult(auth))
  }, [])

  // Set Existing User
  useEffect(() => {
    log.debug('[EFFECT] Set User...')
    setUser()
  })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)

    const email = data.get('email')
    const password = data.get('password')

    if (email && password) {
      handleLogin('Benutzername oder Passwort falsch', () =>
        signInWithEmailAndPassword(auth, email.toString(), password.toString())
      )
    }
  }

  const handleGoogle = () => {
    handleLogin('Fehler beim Login mit Google', () =>
      signInWithRedirect(auth, new GoogleAuthProvider())
    )
  }

  const handleApple = () => {
    handleLogin('Fehler beim Login mit Apple', () =>
      signInWithRedirect(auth, new OAuthProvider('apple.com'))
    )
  }

  if (children && (redirected || auth.currentUser)) {
    return children
  }

  return (
    <Box sx={background}>
      <CssBaseline />
      <Box
        sx={{
          border: 'solid 2px',
          padding: '1em',
          borderRadius: '10px',
          background: 'rgba(255,255,255, .92)',
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          OGV Hemau
        </Typography>
        <img width={55} src={logo} alt="Logo" />
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            sx={{ backgroundColor: 'whiteSmoke' }}
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Adresse"
            name="email"
            autoComplete="email"
          />
          <TextField
            sx={{ backgroundColor: 'whiteSmoke' }}
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Typography
            variant="h6"
            sx={{ textAlign: 'center', color: 'error.main' }}
          >
            {errorMessage}
          </Typography>
          <Button
            sx={{ mt: 2, mb: 2 }}
            type="submit"
            size="large"
            fullWidth
            variant="contained"
          >
            Anmelden
          </Button>
          <Grid container spacing={3}>
            <Grid item xs={6} width="50%">
              <Button
                sx={{ backgroundColor: 'whiteSmoke' }}
                fullWidth
                onClick={handleGoogle}
                variant="outlined"
                endIcon={googleLogo}
              >
                <Typography variant="body2">Login mit</Typography>
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                sx={{ backgroundColor: 'whiteSmoke' }}
                fullWidth
                onClick={handleApple}
                variant="outlined"
                endIcon={appleLogo}
              >
                <Typography variant="body2">Login mit</Typography>
              </Button>
            </Grid>
          </Grid>
        </Box>
        <Copyright />
      </Box>
    </Box>
  )
}

Login.defaultProps = {
  afterLogin: undefined,
}

export { Login }
