import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography, Divider } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Flight } from '../types/flight';

interface FlightAccordionProps {
  flight: Flight;
  isReturn?: boolean;
}

const FlightAccordion: React.FC<FlightAccordionProps> = ({ flight, isReturn = false }) => {
  return (
    <Accordion defaultExpanded={true}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">
          {isReturn ? 'Return Flight' : 'Depart'}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography>{flight.departure}</Typography>
            <Typography>
              {new Date(flight.departureTime).toLocaleDateString('en-US', {
                weekday: 'short',
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}{' '}
              {flight.departureTime.split('T')[1].slice(0, 5)}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography>{flight.duration}</Typography>
            <Divider sx={{ my: 1 }} />
            <Typography>{flight.stops === 0 ? 'Non Stop' : `${flight.stops} Stop`}</Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography>{flight.arrival}</Typography>
            <Typography>
              {new Date(flight.arrivalTime).toLocaleDateString('en-US', {
                weekday: 'short',
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}{' '}
              {flight.arrivalTime.split('T')[1].slice(0, 5)}
            </Typography>
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default FlightAccordion;