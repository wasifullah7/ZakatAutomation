import React from 'react';
import { Box, Container, Typography, Link, useTheme } from '@mui/material';
import { GitHub as GitHubIcon, Twitter as TwitterIcon, LinkedIn as LinkedInIcon } from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {currentYear} Zakat Automation. All rights reserved.
          </Typography>

          <Box
            sx={{
              display: 'flex',
              gap: 2,
              alignItems: 'center',
            }}
          >
            <Link
              href="https://github.com/wasifullah7/ZakatAutomation"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              sx={{
                '&:hover': {
                  color: theme.palette.primary.main,
                },
              }}
            >
              <GitHubIcon />
            </Link>
            <Link
              href="#"
              color="inherit"
              sx={{
                '&:hover': {
                  color: theme.palette.primary.main,
                },
              }}
            >
              <TwitterIcon />
            </Link>
            <Link
              href="#"
              color="inherit"
              sx={{
                '&:hover': {
                  color: theme.palette.primary.main,
                },
              }}
            >
              <LinkedInIcon />
            </Link>
          </Box>

          <Box
            sx={{
              display: 'flex',
              gap: 3,
            }}
          >
            <Link
              href="/privacy"
              color="text.secondary"
              underline="hover"
              sx={{
                fontSize: '0.875rem',
                '&:hover': {
                  color: theme.palette.primary.main,
                },
              }}
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              color="text.secondary"
              underline="hover"
              sx={{
                fontSize: '0.875rem',
                '&:hover': {
                  color: theme.palette.primary.main,
                },
              }}
            >
              Terms of Service
            </Link>
            <Link
              href="/contact"
              color="text.secondary"
              underline="hover"
              sx={{
                fontSize: '0.875rem',
                '&:hover': {
                  color: theme.palette.primary.main,
                },
              }}
            >
              Contact Us
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 