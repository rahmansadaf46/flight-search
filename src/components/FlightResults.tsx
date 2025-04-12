import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Button,
  Slider,
  Checkbox,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from '@mui/material';
import { RootState } from '../store/store';
import { setSearchParams } from '../store/slices/flightSlice';
import FlightIcon from '@mui/icons-material/Flight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LuggageIcon from '@mui/icons-material/Luggage';

const FlightResults: React.FC = () => {
  const dispatch = useDispatch();
  const flights = useSelector((state: RootState) => state.flight.flights);
  const searchParams = useSelector((state: RootState) => state.flight.searchParams);

  // Filter states
  const [priceRange, setPriceRange] = useState<number[]>([11128, 14622]);
  const [fareType, setFareType] = useState({ refundable: false, nonRefundable: false });
  const [stops, setStops] = useState({ nonStop: false, oneStop: false });
  const [sortBy, setSortBy] = useState<'cheapest' | 'fastest'>('cheapest');

  // Filter logic
  const filteredFlights = flights
    .filter((flight) => {
      const price = flight.customerPrice;
      return price >= priceRange[0] && price <= priceRange[1];
    })
    .filter((flight) => {
      if (fareType.refundable && fareType.nonRefundable) return true;
      if (fareType.refundable) return flight.refundable === 'Refundable';
      if (fareType.nonRefundable) return flight.refundable !== 'Refundable';
      return true;
    })
    .filter((flight) => {
      const goStops = flight.transit.go.transit1 === '0' ? 'Non Stop' : 'One Stop';
      if (stops.nonStop && stops.oneStop) return true;
      if (stops.nonStop) return goStops === 'Non Stop';
      if (stops.oneStop) return goStops === 'One Stop';
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'cheapest') {
        return a.customerPrice - b.customerPrice;
      } else {
        const aDuration = parseInt(a.goflightduration.split('H')[0]) * 60 + parseInt(a.goflightduration.split(' ')[1].replace('Min', ''));
        const bDuration = parseInt(b.goflightduration.split('H')[0]) * 60 + parseInt(b.goflightduration.split(' ')[1].replace('Min', ''));
        return aDuration - bDuration;
      }
    });

  const handlePriceRangeChange = (_: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  };

  const handleModifySearch = () => {
    // Reset search params or navigate back to the search form
    dispatch(setSearchParams({ from: '', to: '', departureDate: '', tripType: 'oneway' }));
  };

  if (!flights.length) return null;

  return (
    <Box sx={{ display: 'flex', mt: 4, maxWidth: 1200, width: '100%', gap: 2 }}>
      {/* Filter Sidebar */}
      <Box sx={{ width: 250, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">FILTER</Typography>
          <Button onClick={() => {
            setPriceRange([11128, 14622]);
            setFareType({ refundable: false, nonRefundable: false });
            setStops({ nonStop: false, oneStop: false });
          }}>
            RESET
          </Button>
        </Box>

        {/* Sort By */}
        <Box sx={{ mb: 2 }}>
          <Button
            variant={sortBy === 'cheapest' ? 'contained' : 'outlined'}
            onClick={() => setSortBy('cheapest')}
            sx={{ mr: 1, bgcolor: sortBy === 'cheapest' ? '#4CAF50' : 'white', color: sortBy === 'cheapest' ? 'white' : '#4CAF50' }}
          >
            Cheapest
          </Button>
          <Button
            variant={sortBy === 'fastest' ? 'contained' : 'outlined'}
            onClick={() => setSortBy('fastest')}
            sx={{ bgcolor: sortBy === 'fastest' ? '#4CAF50' : 'white', color: sortBy === 'fastest' ? 'white' : '#4CAF50' }}
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
            max={14622}
            sx={{ color: '#4CAF50' }}
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
            {searchParams.departureDate} - {searchParams.returnDate} | 1 Traveler
          </Typography>
          <Button
            variant="contained"
            onClick={handleModifySearch}
            sx={{ bgcolor: '#4CAF50', color: 'white', '&:hover': { bgcolor: '#45a049' } }}
          >
            Modify Search
          </Button>
        </Box>

        {/* Flight Cards */}
        {filteredFlights.map((flight) => (
          <Paper key={flight.uId} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
            {/* Main Flight Info */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <img
                  src="https://via.placeholder.com/40.png?text=BS"
                  alt={flight.careerName}
                  style={{ width: 40, height: 40 }}
                />
                <Box>
                  <Typography variant="body1">{flight.careerName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {flight.career} {flight.segments.go[0].marketingflight}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6">{flight.godeparture}</Typography>
                <Typography>{flight.godepartureTime}</Typography>
                <Typography>{flight.godepartureDate}</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <FlightIcon sx={{ transform: 'rotate(90deg)', color: '#4CAF50' }} />
                <Typography>{flight.goflightduration}</Typography>
                <Typography>{flight.transit.go.transit1 === '0' ? 'Non Stop' : 'One Stop'}</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6">{flight.goarrival}</Typography>
                <Typography>{flight.goarrivalTime}</Typography>
                <Typography>{flight.goarrivalDate}</Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h6">৳ {flight.customerPrice}</Typography>
                <Typography color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                  ৳ {parseInt(flight.customerPrice) + 1000}
                </Typography>
              </Box>
            </Box>

            {/* Flight Details Accordion */}
            <Accordion sx={{ mt: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Flight Details</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {/* Outbound Flight */}
                <Typography variant="h6">Depart</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Box>
                    <Typography>{flight.segments.go[0].departureAirport}</Typography>
                    <Typography>{flight.godepartureDate} {flight.godepartureTime}</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography>{flight.goflightduration}</Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography>{flight.transit.go.transit1 === '0' ? 'Non Stop' : 'One Stop'}</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography>{flight.segments.go[0].arrivalAirport}</Typography>
                    <Typography>{flight.goarrivalDate} {flight.goarrivalTime}</Typography>
                  </Box>
                </Box>

                {/* Return Flight */}
                <Typography variant="h6" sx={{ mt: 2 }}>Return Flight</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Box>
                    <Typography>{flight.segments.back[0].departureAirport}</Typography>
                    <Typography>{flight.backdepartureDate} {flight.backdepartureTime}</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography>{flight.backflightduration}</Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography>{flight.transit.back.transit1 === '0' ? 'Non Stop' : 'One Stop'}</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography>{flight.segments.back[0].arrivalAirport}</Typography>
                    <Typography>{flight.backarrivalDate} {flight.backarrivalTime}</Typography>
                  </Box>
                </Box>

                {/* Total Fare */}
                <Box sx={{ mt: 2, textAlign: 'right' }}>
                  <Typography>Total (include VAT)</Typography>
                  <Typography variant="h6">Fare: ৳ {flight.netfare}</Typography>
                  <Button
                    variant="contained"
                    sx={{ mt: 1, bgcolor: '#4CAF50', color: 'white', '&:hover': { bgcolor: '#45a049' } }}
                  >
                    Book & Hold
                  </Button>
                </Box>
              </AccordionDetails>
            </Accordion>

            {/* Flight Info and Book Button */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Typography>{flight.refundable}</Typography>
                <Typography>Class: {flight.class}</Typography>
                <Typography>
                  <LuggageIcon sx={{ verticalAlign: 'middle', mr: 0.5 }} /> {flight.bags} Kg
                </Typography>
              </Box>
              <Button
                variant="contained"
                sx={{ bgcolor: '#5C6BC0', color: 'white', '&:hover': { bgcolor: '#4a5ba8' } }}
              >
                Book Now
              </Button>
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default FlightResults;