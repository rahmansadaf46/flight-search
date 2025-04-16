import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import React from 'react';

const Header: React.FC = () => {
  return (
    <AppBar position="static" sx={{ bgcolor: 'transparent', boxShadow: 'none', py: 1 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo */}
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#32D094' }}>
          FLYFAR <span style={{ color: '#000' }}>TECH</span>
        </Typography>

        {/* Navigation Buttons */}
        <Box>
          <Button
            variant="contained"
            sx={{
              bgcolor: '#32D094',
              color: 'white',
              mr: 1,
              borderRadius: 20,
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