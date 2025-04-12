import React from 'react';
import { Box } from '@mui/material';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import FlightResults from '../components/FlightResults';
import PromoBanner from '../components/PromoBanner';

const LandingPage: React.FC = () => {
  return (
    <Box className="landing-page">
      <Header />
      <Box sx={{ px: 2, py: 4, flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <SearchBar />
        <FlightResults />
        <Box sx={{ mt: 4, width: '100%', maxWidth: 1200 }}>
          <PromoBanner
            image="https://via.placeholder.com/1200x300.png?text=Umrah+Package"
            title="UMRAH PACKAGE"
            subtitle="with the lowest price"
          />
          <Box sx={{ mt: 2 }}>
            <PromoBanner
              image="https://via.placeholder.com/1200x300.png?text=Discount+Banner"
              title="10% DISCOUNT"
              subtitle="on domestic & international air-tickets"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LandingPage;