import { Box } from '@mui/material';
import React from 'react';
import FlightResults from '../components/FlightResults';
import Header from '../components/Header';

const FlightResultsPage: React.FC = () => {
    return (
        <Box className="landing-page">
            <Header />
            <Box sx={{ px: 2, py: 4, flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <FlightResults />
            </Box>
        </Box>
    );
};

export default FlightResultsPage;