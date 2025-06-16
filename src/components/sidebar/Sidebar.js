import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Payment as PaymentIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  Calculate as CalculateIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 280;

const Sidebar = ({ open, onClose }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: <DashboardIcon />,
      roles: ['admin', 'donor', 'acceptor'],
    },
    {
      title: 'Donors',
      path: '/donors',
      icon: <PeopleIcon />,
      roles: ['admin'],
    },
    {
      title: 'Acceptors',
      path: '/acceptors',
      icon: <PeopleIcon />,
      roles: ['admin'],
    },
    {
      title: 'Donations',
      path: '/donations',
      icon: <PaymentIcon />,
      roles: ['admin', 'donor'],
    },
    {
      title: 'Zakat Calculator',
      path: '/zakat-calculator',
      icon: <CalculateIcon />,
      roles: ['admin', 'donor', 'acceptor'],
    },
    {
      title: 'Settings',
      path: '/settings',
      icon: <SettingsIcon />,
      roles: ['admin', 'donor', 'acceptor'],
    },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role)
  );

  const drawer = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #1a237e 0%, #283593 100%)',
        color: 'white',
      }}
    >
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <img 
          src="/logo.png" 
          alt="Logo" 
          style={{ height: 40 }}
        />
      </Box>

      <List sx={{ flexGrow: 1, px: 2 }}>
        {filteredMenuItems.map((item) => (
          <ListItem 
            key={item.path} 
            disablePadding 
            sx={{ 
              mb: 1,
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            <ListItemButton
              onClick={() => {
                navigate(item.path);
                if (isMobile) onClose();
              }}
              selected={location.pathname === item.path}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                },
                borderRadius: '8px',
                py: 1.5,
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.title}
                primaryTypographyProps={{
                  fontSize: '0.95rem',
                  fontWeight: location.pathname === item.path ? 600 : 400,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <ListItemButton
          onClick={() => navigate('/help')}
          sx={{
            borderRadius: '8px',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            },
          }}
        >
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
            <HelpIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Help & Support"
            primaryTypographyProps={{
              fontSize: '0.95rem',
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={open}
      onClose={onClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          border: 'none',
          boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
        },
      }}
    >
      {drawer}
    </Drawer>
  );
};

export default Sidebar; 