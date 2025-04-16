import { Box } from '@mui/material';
import React from 'react';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';

const LandingPage: React.FC = () => {
  return (
    <Box className="landing-page" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Box
        sx={{
          px: { xs: 1, sm: 2, md: 3 },
          py: { xs: 2, sm: 3, md: 4 },
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <SearchBar />
      </Box>
    </Box>
  );
};

export default LandingPage;