import React from 'react'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import logoBonna from "../assets/img/logobonna.png"
import { CardMedia, ListItemButton, ListItemText } from '@mui/material';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router';
import { RiLogoutCircleRLine } from "react-icons/ri";
import useAuthCall from '../hooks/useAuthCall';


const pages = [
  {
    title: "Ana Sayfa",
    url: "/"
  },
  {
    title: "Çekiliş",
    url: "raffle"
  },
  {
    title: "Başvurular",
    url: "userapplications"
  },
  {
    title: "Kazananlar",
    url: "userwinners"
  }
];

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const NavBar = () => {


  const { logout } = useAuthCall()
  const { currentUser } = useSelector((state) => state.auth)

  const navigate = useNavigate()

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };



  return (

    <AppBar position="static" sx={{ backgroundColor: '#1F2937' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between' }}>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 5 }} >
            <img
              src={logoBonna}
              alt="bonnaLogo"
              width='130px'
            />

          </Box>


          {/* PAGE MENU */}

          {
            currentUser ?
              (
                <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleOpenNavMenu}
                    color="inherit"
                  >
                    <MenuIcon />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorElNav}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                    open={Boolean(anchorElNav)}
                    onClose={handleCloseNavMenu}
                    sx={{
                      display: { xs: 'block', md: 'none' },
                    }}
                  >
                    {pages.map((page, index) => (
                      <MenuItem key={index} onClick={() => {
                        navigate(page.url)
                        handleCloseNavMenu()
                      }}>
                        <ListItemButton sx={{ textTransform: 'none' }}>
                          <ListItemText sx={{ textTransform: 'none' }}>{page.title}</ListItemText>
                        </ListItemButton>

                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
              ) :
              (
                ""
              )
          }


          {/* MOBILE PAGES MENU */}

          {
            currentUser ?
              (
                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                  {pages.map((page, index) => (
                    <Button
                      key={index}
                      onClick={() => {
                        navigate(page.url)
                        handleCloseNavMenu()
                      }}
                      sx={{ my: 2, color: 'white', display: 'block', textTransform: 'none' }}
                    >
                      {page.title}
                    </Button>
                  ))}
                </Box>
              ) :

              (
                ""
              )
          }

          {/* SETTINGS MENU */}

          {/* <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box> */}


          <Box sx={{ display: { xs: 'flex', md: 'flex' }, justifyContent: 'center', gap: 3, mr: 1 }}>
            
            {
              currentUser ? 
              (<Box sx={{ display: { xs: 'flex', md: 'flex' }, justifyContent: 'center', gap: 3, mr: 1 }}>
                <Typography>{currentUser || null}</Typography>
                <RiLogoutCircleRLine size={22} color='#B31312' cursor='pointer' onClick={() => logout()} />
              </Box>)
              :
              (<Button variant='contained' onClick={()=>navigate('/login')} sx={{textTransform:'none',letterSpacing:3}}>Giriş</Button>)
            }
          </Box>

        </Toolbar>

      </Container>



      <Box>
        <Outlet />
      </Box>


    </AppBar>

  )
}

export default NavBar