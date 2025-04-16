import { Box } from '@mui/material';
import React from 'react';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';

const LandingPage: React.FC = () => {
  return (
    <Box className="landing-page">
      <Header />
      <Box sx={{ px: 2, py: 4, flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <SearchBar />
      </Box>
    </Box>
  );
};

export default LandingPage;