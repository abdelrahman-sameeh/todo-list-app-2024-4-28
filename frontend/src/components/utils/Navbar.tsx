import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { Box, Button, Container, Typography } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
export const Navbar = () => {

  const navigate = useNavigate()
  const { authTokens, user }: any = useAuth()

  return (
    <Box sx={{ backgroundColor: '#f3f3f3', paddingY: '15px' }} >
      <Container sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} >
        <Typography variant='h4' sx={{ textTransform: 'capitalize' }} > {user?.name ? user?.name : 'Logo'} </Typography>

        <PopupState variant="popover" popupId="demo-popup-menu">
          {(popupState) => (
            <React.Fragment>
              <Button variant="contained" {...bindTrigger(popupState)}>
                Dashboard
              </Button>
              <Menu {...bindMenu(popupState)}>
                <MenuItem onClick={() => {
                  navigate('/')
                  popupState.close()
                }}>
                  Home
                </MenuItem>
                <MenuItem onClick={() => {
                  popupState.close()
                  navigate('/profile')
                }}>
                  Profile
                </MenuItem>
                {
                  authTokens?.access ?
                    <MenuItem onClick={() => {
                      localStorage.removeItem('authTokens')
                      popupState.close()
                      window.location.href = '/'
                    }}>
                      Logout
                    </MenuItem>
                    :
                    <MenuItem onClick={() => {
                      popupState.close()
                      navigate('/login')
                    }}>
                      Login
                    </MenuItem>
                }

              </Menu>
            </React.Fragment>
          )}
        </PopupState>

      </Container>
    </Box>
  )
}
