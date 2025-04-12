import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography
} from '@mui/material';
import React from 'react';
import { Flight } from '../types/flight';

interface FlightAccordionProps {
  flight: Flight;
  isReturn?: boolean; // Flag to style return flight differently
}

const FlightAccordion: React.FC<FlightAccordionProps> = ({ flight, isReturn = false }) => {
  return (
    <Accordion defaultExpanded={true}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">
          {isReturn ? 'Return Flight' : 'Outbound Flight'} - {flight.airline} ({flight.flightNumber})
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box>
          <Typography>
            <strong>Departure:</strong> {flight.departure} at{' '}
            {new Date(flight.departureTime).toLocaleString()}
          </Typography>
          <Typography>
            <strong>Arrival:</strong> {flight.arrival} at{' '}
            {new Date(flight.arrivalTime).toLocaleString()}
          </Typography>
          <Typography>
            <strong>Duration:</strong> {flight.duration}
          </Typography>
          <Typography>
            <strong>Price:</strong> ${flight.price}
          </Typography>
          <Typography>
            <strong>Stops:</strong> {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop(s)`}
          </Typography>
          <Typography>
            <strong>Class:</strong> {flight.classType}
          </Typography>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default FlightAccordion;