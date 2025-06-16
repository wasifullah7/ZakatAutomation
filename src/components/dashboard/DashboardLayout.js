import React, { useState } from 'react';
import { Box, useTheme, useMediaQuery, AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Menu, MenuItem, Avatar, ListItemAvatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Payment as PaymentIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

const DashboardLayout = ({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const handleProfileClick = () => {
    handleProfileMenuClose();
    if (user?.role === 'donor') {
      navigate('/donor/profile');
    } else if (user?.role === 'acceptor') {
      navigate('/acceptor/profile');
    }
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Zakat System
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        <ListItem button onClick={() => navigate('/dashboard')}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        {user?.role === 'admin' && (
          <>
            <ListItem button onClick={() => navigate('/donors')}>
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="Donors" />
            </ListItem>
            <ListItem button onClick={() => navigate('/acceptors')}>
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="Acceptors" />
            </ListItem>
          </>
        )}
        {(user?.role === 'admin' || user?.role === 'donor') && (
          <ListItem button onClick={() => navigate('/donations')}>
            <ListItemIcon>
              <PaymentIcon />
            </ListItemIcon>
            <ListItemText primary="Donations" />
          </ListItem>
        )}
        <ListItem button onClick={() => navigate('/history')}>
          <ListItemIcon>
            <HistoryIcon />
          </ListItemIcon>
          <ListItemText primary="History" />
        </ListItem>
        <ListItem button onClick={() => navigate('/settings')}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <Typography 
              variant="h5" 
              component="div" 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '0.5px',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <img 
                src="/logo.png" 
                alt="Zakat Logo" 
                style={{ 
                  height: '32px', 
                  marginRight: '8px',
                  filter: 'brightness(0) invert(1)'
                }} 
              />
              Zakat Automation
            </Typography>
          </Box>
          <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton>
          <IconButton
            color="inherit"
            onClick={handleProfileMenuOpen}
            sx={{ ml: 1 }}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
              {user?.firstName?.[0]?.toUpperCase()}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleProfileClick}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText 
                primary="Profile" 
                secondary={user?.email}
              />
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: sidebarOpen ? 240 : 65,
          flexShrink: 0,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          [`& .MuiDrawer-paper`]: { 
            width: sidebarOpen ? 240 : 65,
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            overflowX: 'hidden'
          },
        }}
        open={sidebarOpen}
      >
        <Toolbar>
          {sidebarOpen ? (
            <Typography variant="h6" noWrap component="div">
              Zakat System
            </Typography>
          ) : (
            <Typography variant="h6" noWrap component="div" sx={{ textAlign: 'center' }}>
              ZS
            </Typography>
          )}
        </Toolbar>
        <Divider />
        <List>
          <ListItem button onClick={() => navigate('/dashboard')} sx={{ minHeight: 48, px: 2.5 }}>
            <ListItemIcon sx={{ minWidth: 0, mr: sidebarOpen ? 3 : 'auto', justifyContent: 'center' }}>
              <DashboardIcon />
            </ListItemIcon>
            {sidebarOpen && <ListItemText primary="Dashboard" />}
          </ListItem>
          {user?.role === 'admin' && (
            <>
              <ListItem button onClick={() => navigate('/donors')} sx={{ minHeight: 48, px: 2.5 }}>
                <ListItemIcon sx={{ minWidth: 0, mr: sidebarOpen ? 3 : 'auto', justifyContent: 'center' }}>
                  <PeopleIcon />
                </ListItemIcon>
                {sidebarOpen && <ListItemText primary="Donors" />}
              </ListItem>
              <ListItem button onClick={() => navigate('/acceptors')} sx={{ minHeight: 48, px: 2.5 }}>
                <ListItemIcon sx={{ minWidth: 0, mr: sidebarOpen ? 3 : 'auto', justifyContent: 'center' }}>
                  <PeopleIcon />
                </ListItemIcon>
                {sidebarOpen && <ListItemText primary="Acceptors" />}
              </ListItem>
            </>
          )}
          {(user?.role === 'admin' || user?.role === 'donor') && (
            <ListItem button onClick={() => navigate('/donations')} sx={{ minHeight: 48, px: 2.5 }}>
              <ListItemIcon sx={{ minWidth: 0, mr: sidebarOpen ? 3 : 'auto', justifyContent: 'center' }}>
                <PaymentIcon />
              </ListItemIcon>
              {sidebarOpen && <ListItemText primary="Donations" />}
            </ListItem>
          )}
          <ListItem button onClick={() => navigate('/history')} sx={{ minHeight: 48, px: 2.5 }}>
            <ListItemIcon sx={{ minWidth: 0, mr: sidebarOpen ? 3 : 'auto', justifyContent: 'center' }}>
              <HistoryIcon />
            </ListItemIcon>
            {sidebarOpen && <ListItemText primary="History" />}
          </ListItem>
          <ListItem button onClick={() => navigate('/settings')} sx={{ minHeight: 48, px: 2.5 }}>
            <ListItemIcon sx={{ minWidth: 0, mr: sidebarOpen ? 3 : 'auto', justifyContent: 'center' }}>
              <SettingsIcon />
            </ListItemIcon>
            {sidebarOpen && <ListItemText primary="Settings" />}
          </ListItem>
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout; 