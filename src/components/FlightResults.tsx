import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FlightIcon from '@mui/icons-material/Flight';
import LuggageIcon from '@mui/icons-material/Luggage';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Slider,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
    duration: rawFlight.triptype === 'RoundTrip' ? (isReturn ? rawFlight.backflightduration : rawFlight.goflightduration) : rawFlight.goflightduration,
    price: rawFlight.customerPrice,
    stops: transit === '0' ? 0 : 1,
    classType: rawFlight.class,
  };
};

const FlightResults: React.FC = () => {
  const navigate = useNavigate();
  const rawFlights = useSelector((state: RootState) => state.flight.flights) as RawFlight[];
  const searchParams = useSelector((state: RootState) => state.flight.searchParams);

  // Map RawFlights to Flights
  const flights: Flight[] = rawFlights.map((rawFlight) => {
    const flight = mapRawFlightToFlight(rawFlight);
    if (rawFlight.triptype === 'RoundTrip' && rawFlight.segments.back.length > 0) {
      flight.returnFlight = mapRawFlightToFlight(rawFlight, true);
    }
    return flight;
  });

  // Filter states
  const [priceRange, setPriceRange] = useState<number[]>([11128, 24796]); // Updated max for RoundTrip
  const [fareType, setFareType] = useState({ refundable: false, nonRefundable: false });
  const [stops, setStops] = useState({ nonStop: false, oneStop: false });
  const [sortBy, setSortBy] = useState<'cheapest' | 'fastest'>('cheapest');

  // Filter logic
  const filteredFlights = flights
    .filter((flight) => {
      const price = flight.price;
      return price >= priceRange[0] && price <= priceRange[1];
    })
    .filter((flight) => {
      const rawFlight = rawFlights.find((f) => f.uId === flight.id)!;
      if (fareType.refundable && fareType.nonRefundable) return true;
      if (fareType.refundable) return rawFlight.refundable === 'Refundable';
      if (fareType.nonRefundable) return rawFlight.refundable !== 'Refundable';
      return true;
    })
    .filter((flight) => {
      if (stops.nonStop && stops.oneStop) return true;
      if (stops.nonStop) return flight.stops === 0;
      if (stops.oneStop) return flight.stops === 1;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'cheapest') {
        return a.price - b.price;
      } else {
        const aDuration = parseInt(a.duration.split('H')[0]) * 60 + parseInt(a.duration.split(' ')[1].replace('Min', ''));
        const bDuration = parseInt(b.duration.split('H')[0]) * 60 + parseInt(b.duration.split(' ')[1].replace('Min', ''));
        return aDuration - bDuration;
      }
    });

  const handlePriceRangeChange = (_: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  };

  const handleModifySearch = () => {
    navigate('/');
  };

  if (!flights.length) return null;

  return (
    <Box sx={{ display: 'flex', mt: 4, maxWidth: 1200, width: '100%', gap: 2 }}>
      {/* Filter Sidebar */}
      <Box sx={{ width: 250, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">FILTER</Typography>
          <Button
            onClick={() => {
              setPriceRange([11128, 24796]);
              setFareType({ refundable: false, nonRefundable: false });
              setStops({ nonStop: false, oneStop: false });
            }}
          >
            RESET
          </Button>
        </Box>

        {/* Sort By */}
        <Box sx={{ mb: 2 }}>
          <Button
            variant={sortBy === 'cheapest' ? 'contained' : 'outlined'}
            onClick={() => setSortBy('cheapest')}
            sx={{ mr: 1, bgcolor: sortBy === 'cheapest' ? '#32D094' : 'white', color: sortBy === 'cheapest' ? 'white' : '#32D094' }}
          >
            Cheapest
          </Button>
          <Button
            variant={sortBy === 'fastest' ? 'contained' : 'outlined'}
            onClick={() => setSortBy('fastest')}
            sx={{ bgcolor: sortBy === 'fastest' ? '#32D094' : 'white', color: sortBy === 'fastest' ? 'white' : '#32D094' }}
          >
            Fastest
          </Button>
        </Box>

        {/* Price Range */}
        <Box sx={{ mb: 2 }}>
          <Typography>Price Range</Typography>
          <Slider
            value={priceRange}
            onChange={handlePriceRangeChange}
            valueLabelDisplay="auto"
            min={11128}
            max={24796}
            sx={{ color: '#32D094' }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography>৳ {priceRange[0]}</Typography>
            <Typography>৳ {priceRange[1]}</Typography>
          </Box>
        </Box>

        {/* Fare Type */}
        <Box sx={{ mb: 2 }}>
          <Typography>Fare Type</Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={fareType.refundable}
                onChange={(e) => setFareType({ ...fareType, refundable: e.target.checked })}
              />
            }
            label="Refundable"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={fareType.nonRefundable}
                onChange={(e) => setFareType({ ...fareType, nonRefundable: e.target.checked })}
              />
            }
            label="Non Refundable"
          />
        </Box>

        {/* Stops */}
        <Box>
          <Typography>Stops</Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={stops.nonStop}
                onChange={(e) => setStops({ ...stops, nonStop: e.target.checked })}
              />
            }
            label="Non Stop"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={stops.oneStop}
                onChange={(e) => setStops({ ...stops, oneStop: e.target.checked })}
              />
            }
            label="One Stop"
          />
        </Box>
      </Box>

      {/* Flight Results */}
      <Box sx={{ flex: 1 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">
            {searchParams.from} - {searchParams.to} | Total {filteredFlights.length} Flights
            <br />
            {searchParams.departureDate} - {searchParams.returnDate || 'N/A'} | 1 Traveler
          </Typography>
          <Box>
            <Button
              variant="contained"
              onClick={handleModifySearch}
              sx={{ bgcolor: '#32D094', color: 'white', ml: 3 }}
            >
              Modify Search
            </Button>
          </Box>
        </Box>

        {/* Flight Cards as Accordions */}
        {filteredFlights.map((flight) => {
          const rawFlight = rawFlights.find((f) => f.uId === flight.id)!;

          return (
            <Accordion key={flight.id} sx={{ mb: 2, borderRadius: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{ bgcolor: '#f5f5f5', borderRadius: 1 }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <img
                      src="https://via.placeholder.com/40.png?text=BS"
                      alt={flight.airline}
                      style={{ width: 40, height: 40 }}
                    />
                    <Box>
                      <Typography variant="body1">{flight.airline}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {rawFlight.career} {flight.flightNumber}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6">{rawFlight.godeparture}</Typography>
                    <Typography>{flight.departureTime.split('T')[1].slice(0, 5)}</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <FlightIcon sx={{ transform: 'rotate(90deg)', color: '#32D094' }} />
                    <Typography>{flight.duration}</Typography>
                    <Typography>{flight.stops === 0 ? 'Non Stop' : 'One Stop'}</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6">{rawFlight.goarrival}</Typography>
                    <Typography>{flight.arrivalTime.split('T')[1].slice(0, 5)}</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h6">৳ {flight.price}</Typography>
                    <Typography color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                      ৳ {flight.price + 1000}
                    </Typography>
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {/* Outbound Segment Details */}
                  <Box>
                    <Typography variant="h6">Outbound Flight</Typography>
                    <Typography>
                      Departure: {rawFlight.godeparture} ({flight.departureTime.split('T')[1].slice(0, 5)}) - {rawFlight.godepartureDate}
                    </Typography>
                    <Typography>
                      Arrival: {rawFlight.goarrival} ({flight.arrivalTime.split('T')[1].slice(0, 5)}) - {rawFlight.goarrivalDate}
                    </Typography>
                    <Typography>Duration: {flight.duration}</Typography>
                    <Typography>Stops: {flight.stops === 0 ? 'Non Stop' : '1 Stop'}</Typography>
                  </Box>

                  {/* Return Segment Details (if applicable) */}
                  {flight.returnFlight && (
                    <Box>
                      <Typography variant="h6">Return Flight</Typography>
                      <Typography>
                        Departure: {rawFlight.backdeparture} ({flight.returnFlight.departureTime.split('T')[1].slice(0, 5)}) - {rawFlight.backdepartureDate}
                      </Typography>
                      <Typography>
                        Arrival: {rawFlight.backarrival} ({flight.returnFlight.arrivalTime.split('T')[1].slice(0, 5)}) - {rawFlight.backarrivalDate}
                      </Typography>
                      <Typography>Duration: {flight.returnFlight.duration}</Typography>
                      <Typography>Stops: {flight.returnFlight.stops === 0 ? 'Non Stop' : '1 Stop'}</Typography>
                    </Box>
                  )}

                  {/* Additional Details */}
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Typography>{rawFlight.refundable}</Typography>
                    <Typography>Class: {flight.classType}</Typography>
                    <Typography>
                      <LuggageIcon sx={{ verticalAlign: 'middle', mr: 0.5 }} /> {rawFlight.bags} Kg
                    </Typography>
                  </Box>

                  {/* Buttons */}
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <Button
                      variant="text"
                      onClick={() => navigate(`/flight-details/${flight.id}`)}
                      sx={{ color: '#5C6BC0' }}
                    >
                      Flight Details
                    </Button>
                    <Button
                      variant="contained"
                      sx={{ bgcolor: '#5C6BC0', color: 'white', '&:hover': { bgcolor: '#4a5ba8' } }}
                    >
                      Book Now
                    </Button>
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>
    </Box>
  );
};

export default FlightResults;