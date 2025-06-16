import React, { useState, useContext } from 'react';
import {
  Box,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Menu,
  MenuItem,
  Avatar,
  ListItemAvatar,
  CssBaseline,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
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
  Calculate as CalculateIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
} from '@mui/icons-material';
import { ColorModeContext } from '../../App';

const drawerWidth = 240;

const DashboardLayout = ({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [anchorEl, setAnchorEl] = useState(null);
  const colorMode = useContext(ColorModeContext);

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

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
      roles: ['admin', 'donor', 'acceptor'],
    },
    {
      text: 'Zakat Calculator',
      icon: <CalculateIcon />,
      path: '/zakat-calculator',
      roles: ['admin', 'donor', 'acceptor'],
    },
    {
      text: 'Donor Applications',
      icon: <PeopleIcon />,
      path: '/admin/donor-applications',
      roles: ['admin'],
    },
    {
      text: 'Acceptor Applications',
      icon: <PeopleIcon />,
      path: '/admin/acceptor-applications',
      roles: ['admin'],
    },
    {
      text: 'Application History',
      icon: <HistoryIcon />,
      path: '/admin/application-history',
      roles: ['admin'],
    },
    {
      text: 'Approved Acceptors',
      icon: <PeopleIcon />,
      path: '/admin/approved-acceptors',
      roles: ['admin'],
    },
    {
      text: 'My Donations',
      icon: <PaymentIcon />,
      path: '/donations',
      roles: ['donor'],
    },
    {
      text: 'My Requests',
      icon: <PaymentIcon />,
      path: '/requests',
      roles: ['acceptor'],
    },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[3],
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              color: theme.palette.primary.main,
            }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '1.5px',
                textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                py: 1,
              }}
            >
              <Box component="span" sx={{ display: { xs: 'none', sm: 'block' } }}>Zakat Automation</Box>
            </Typography>
          </Box>
          <IconButton color="inherit" sx={{ color: theme.palette.text.secondary }}>
            <NotificationsIcon />
          </IconButton>
          <IconButton
            sx={{
              ml: 1,
              color: theme.palette.mode === 'dark' ? theme.palette.warning.main : theme.palette.text.secondary,
              '&:hover': {
                color: theme.palette.mode === 'dark' ? theme.palette.warning.light : theme.palette.primary.main,
              },
            }}
            onClick={colorMode.toggleColorMode}
            color="inherit"
          >
            {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          <IconButton
            color="inherit"
            onClick={handleProfileMenuOpen}
            sx={{ ml: 1, color: theme.palette.text.secondary }}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main }}>
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
                <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
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
          width: sidebarOpen ? drawerWidth : theme.spacing(7) + 1,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: sidebarOpen ? drawerWidth : theme.spacing(7) + 1,
            boxSizing: 'border-box',
            overflowX: 'hidden',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        }}
        open={sidebarOpen}
      >
        <Toolbar />
        <Divider />
        <List>
          {menuItems.map((item, index) => {
            if (item.roles.includes(user?.role)) {
              return (
                <ListItem
                  button
                  key={index}
                  onClick={() => navigate(item.path)}
                  sx={{
                    minHeight: 48,
                    justifyContent: sidebarOpen ? 'initial' : 'center',
                    px: 2.5,
                    backgroundColor: location.pathname === item.path ? theme.palette.action.selected : 'inherit',
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: sidebarOpen ? 3 : 'auto',
                      justifyContent: 'center',
                      color: location.pathname === item.path ? theme.palette.primary.main : theme.palette.text.secondary,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} sx={{ opacity: sidebarOpen ? 1 : 0 }} />
                </ListItem>
              );
            }
            return null;
          })}
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