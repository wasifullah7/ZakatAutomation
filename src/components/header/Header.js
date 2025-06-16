import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Box,
  InputBase,
  Badge,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = ({ onMenuClick, user, isMobile }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    logout();
    navigate('/signin');
  };

  return (
    <AppBar 
      position="fixed" 
      className="app-header"
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        background: 'linear-gradient(90deg, #1a237e 0%, #283593 100%)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ 
            display: { xs: 'none', sm: 'block' },
            fontWeight: 600,
            letterSpacing: '0.5px'
          }}
        >
          Zakat Automation
        </Typography>

        <Box 
          className="header-search"
          sx={{ 
            flexGrow: 1,
            mx: { xs: 1, sm: 3 },
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            px: 2,
            py: 0.5,
          }}
        >
          <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.7)', mr: 1 }} />
          <InputBase
            placeholder="Search..."
            sx={{
              color: 'white',
              '& input::placeholder': {
                color: 'rgba(255, 255, 255, 0.7)',
                opacity: 1,
              },
              '& input': {
                color: 'white',
              },
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton 
            color="inherit"
            className="header-action-button"
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <IconButton
            onClick={handleProfileMenuOpen}
            className="header-action-button"
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <Avatar 
              sx={{ 
                width: 32, 
                height: 32,
                bgcolor: 'primary.light',
                fontSize: '1rem',
                fontWeight: 600,
              }}
            >
              {user?.name?.charAt(0) || <AccountCircleIcon />}
            </Avatar>
          </IconButton>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleProfileMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            elevation: 3,
            sx: {
              mt: 1.5,
              minWidth: 200,
              borderRadius: '8px',
              '& .MuiMenuItem-root': {
                px: 2,
                py: 1.5,
              },
            },
          }}
        >
          <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/profile'); }}>
            <AccountCircleIcon sx={{ mr: 2, color: 'text.secondary' }} />
            Profile
          </MenuItem>
          <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/settings'); }}>
            <SettingsIcon sx={{ mr: 2, color: 'text.secondary' }} />
            Settings
          </MenuItem>
          <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
            <LogoutIcon sx={{ mr: 2 }} />
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 