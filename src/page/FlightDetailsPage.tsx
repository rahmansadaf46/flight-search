import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Container, Typography, Button, Box, Divider } from '@mui/material';
import FlightAccordion from '../components/FlightAccordion';
import { RootState } from '../store/store';
import { Flight } from '../types/flight';

const FlightDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const flights = useSelector((state: RootState) => state.flight.flights);
  
  // Find the flight by ID
  const flight = flights.find((f: Flight) => f.id === id);

  if (!flight) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h6" color="error">
          Flight not found.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Back to Search
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Flight Details
      </Typography>
      <Box sx={{ mb: 4 }}>
        <FlightAccordion flight={flight} />
        {flight.returnFlight && (
          <>
            <Divider sx={{ my: 2 }} />
            <FlightAccordion flight={flight.returnFlight} isReturn={true} />
          </>
        )}
      </Box>
      <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 2 }}>
        Back to Search
      </Button>
    </Container>
  );
};

export default FlightDetailsPage;