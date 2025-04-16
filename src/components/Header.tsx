import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import React from 'react';

const Header: React.FC = () => {
  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: 'transparent',
        boxShadow: 'none',
        py: { xs: 1, sm: 1.5 },
      }}
    >
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'center', sm: 'center' },
          gap: { xs: 2, sm: 0 },
        }}
      >
        {/* Logo */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            color: '#32D094',
            mb: { xs: 1, sm: 0 },
          }}
        >
          FLYFAR <span style={{ color: '#000' }}>TECH</span>
        </Typography>

        {/* Navigation Buttons */}
        <Box
          sx={{
            display: 'flex',
            gap: { xs: 1, sm: 2 },
            flexDirection: { xs: 'row', sm: 'row' },
          }}
        >
          <Box>
          <Button
            variant="contained"
            sx={{
              bgcolor: '#32D094',
              color: 'white',
              mr: { xs: 0, sm: 1 },
              borderRadius: 20,
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            Travel Agency
          </Button>
          </Box>
         <Box>
         <Button
            variant="contained"
            sx={{
              bgcolor: '#5C6BC0',
              color: 'white',
              borderRadius: 20,
              width: { xs: '100%', sm: 'auto' },
              '&:hover': { bgcolor: '#4a5ba8' },
            }}
          >
            Login / Sign Up
          </Button>
         </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;