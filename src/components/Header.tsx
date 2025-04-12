import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

const Header: React.FC = () => {
  return (
    <AppBar position="static" sx={{ bgcolor: 'transparent', boxShadow: 'none', py: 1 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo */}
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4CAF50' }}>
          FLYFAR <span style={{ color: '#000' }}>TECH</span>
        </Typography>

        {/* Navigation Buttons */}
        <Box>
          <Button
            variant="contained"
            sx={{
              bgcolor: '#4CAF50',
              color: 'white',
              mr: 1,
              borderRadius: 20,
              '&:hover': { bgcolor: '#45a049' },
            }}
          >
            Travel Agency
          </Button>
          <Button
            variant="contained"
            sx={{
              bgcolor: '#5C6BC0',
              color: 'white',
              borderRadius: 20,
              '&:hover': { bgcolor: '#4a5ba8' },
            }}
          >
            Login / Sign Up
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;