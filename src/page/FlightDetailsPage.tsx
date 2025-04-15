import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Container, Typography, Button, Box, Divider } from '@mui/material';
import FlightAccordion from '../components/FlightAccordion';
import { RootState } from '../store/store';
import { Flight, RawFlight } from '../types/flight';

// Helper function to map RawFlight to Flight
const mapRawFlightToFlight = (rawFlight: RawFlight, isReturn = false): Flight => {
  const segment = isReturn ? rawFlight.segments.back[0] : rawFlight.segments.go[0];
  const transit = isReturn ? rawFlight.transit.back.transit1 : rawFlight.transit.go.transit1;

  return {
    id: rawFlight.uId,
    airline: rawFlight.careerName,
    flightNumber: segment.marketingflight,
    departure: segment.departureAirport,
    departureTime: segment.departureTime,
    arrival: segment.arrivalAirport,
    arrivalTime: segment.arrivalTime,
    duration: segment.flightduration,
    price: rawFlight.customerPrice,
    stops: transit === '0' ? 0 : 1,
    classType: rawFlight.class,
  };
};

const FlightDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const rawFlights = useSelector((state: RootState) => state.flight.flights) as RawFlight[];

  // Find the raw flight by ID and map it to Flight
  const rawFlight = rawFlights.find((f) => f.uId === id);
  if (!rawFlight) {
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

  const flight = mapRawFlightToFlight(rawFlight);
  if (rawFlight.segments.back.length > 0) {
    flight.returnFlight = mapRawFlightToFlight(rawFlight, true);
  }

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Flight Details
      </Typography>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <img
            src="https://via.placeholder.com/40.png?text=BS"
            alt={flight.airline}
            style={{ width: 40, height: 40 }}
          />
          <Typography variant="h6">{flight.airline}</Typography>
        </Box>
        <FlightAccordion flight={flight} />
        {flight.returnFlight && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" sx={{ mb: 1, color: '#4CAF50' }}>
              Return Flight
            </Typography>
            <FlightAccordion flight={flight.returnFlight} isReturn={true} />
          </>
        )}
        <Box sx={{ mt: 2, textAlign: 'right' }}>
          <Typography>Total (include VAT)</Typography>
          <Typography variant="h6">Fare: ৳ {flight.price}</Typography>
          <Button
            variant="contained"
            sx={{ mt: 1, bgcolor: '#4CAF50', color: 'white', '&:hover': { bgcolor: '#45a049' } }}
          >
            Book & Hold
          </Button>
        </Box>
      </Box>
      <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 2 }}>
        Back to Search
      </Button>
    </Container>
  );
};

export default FlightDetailsPage;