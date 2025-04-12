import React, { useState } from 'react';
import {
  Tabs,
  Tab,
  TextField,
  Button,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Autocomplete,
  Paper,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { setSearchParams, setLoading, setFlights } from '../store/slices/flightSlice';
import { SearchParams } from '../types/flight';
import flightsData from '../data/flights.json';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FlightIcon from '@mui/icons-material/Flight';
import dayjs from 'dayjs';
// Sample airport data for autocomplete
const airports = [
  { code: 'DAC', name: "Hazrat Shahjalal Int'l Airport", city: 'Dhaka, BANGLADESH' },
  { code: 'CXB', name: "Cox's Bazar Airport", city: 'Cox’s Bazar, BANGLADESH' },
  { code: 'JED', name: 'Jeddah Int’l', city: 'Jeddah, SAUDI ARABIA' },
  { code: 'MED', name: 'Prince Mohammad Bin Abdulaziz Int’l', city: 'Medina, SAUDI ARABIA' },
  { code: 'DXB', name: 'Dubai Int’l', city: 'Dubai, UNITED ARAB EMIRATES' },
  { code: 'JSR', name: 'Jashore Airport', city: 'Jashore, BANGLADESH' },
  { code: 'BZL', name: 'Barishal Airport', city: 'Barishal, BANGLADESH' },
];

const SearchBar: React.FC = () => {
  const [tab, setTab] = useState<'roundway' | 'oneway' | 'multicity'>('roundway');
  const [formData, setFormData] = useState({
    from: airports[0],
    to: airports[1],
    departureDate: dayjs('2025-04-13'),
    returnDate: dayjs('2025-04-15'),
    adults: 1,
    children: 0,
    infants: 0,
    travelClass: 'Economy',
  });
  const dispatch = useDispatch();

  const handleTabChange = (_: React.SyntheticEvent, newValue: 'roundway' | 'oneway' | 'multicity') => {
    setTab(newValue);
  };

  const handleSearch = () => {
    const searchParams: SearchParams = {
      from: formData.from.code,
      to: formData.to.code,
      departureDate: formData.departureDate.format('YYYY-MM-DD'),
      tripType: tab === 'roundway' ? 'roundtrip' : 'oneway',
      ...(tab === 'roundway' && { returnDate: formData.returnDate.format('YYYY-MM-DD') }),
    };
    dispatch(setSearchParams(searchParams));
    dispatch(setLoading());
  
    setTimeout(() => {
      dispatch(setFlights(flightsData));
    }, 500);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, maxWidth: 900, width: '100%' }}>
      {/* Tabs for Flight, Hotel, Tour, Visa */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Tabs value="flight" centered>
          <Tab label="Flight" value="flight" icon={<FlightIcon />} />
          <Tab label="Hotel" value="hotel" disabled />
          <Tab label="Tour" value="tour" disabled />
          <Tab label="Visa" value="visa" disabled />
        </Tabs>
      </Box>

      {/* Round-Way, One-Way, Multi-City Tabs */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Tabs value={tab} onChange={handleTabChange}>
          <Tab label="Round-Way" value="roundway" />
          <Tab label="One-Way" value="oneway" />
          <Tab label="Multi-City" value="multicity" />
        </Tabs>
      </Box>

      {/* Search Form */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* From Field with Autocomplete */}
        <Box sx={{ flex: 1, minWidth: 200 }}>
          <Autocomplete
            options={airports}
            getOptionLabel={(option) => `${option.name} (${option.code})`}
            value={formData.from}
            onChange={(_, newValue) => setFormData({ ...formData, from: newValue || airports[0] })}
            renderInput={(params) => (
              <TextField
                {...params}
                label="From"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <LocationOnIcon sx={{ color: '#4CAF50', mr: 1 }} />
                      {params.InputProps.startAdornment}
                    </>
                  ),
                }}
              />
            )}
            renderOption={(props, option) => (
              <li {...props}>
                <Box>
                  <Box sx={{ fontWeight: 'bold' }}>{option.name} ({option.code})</Box>
                  <Box sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>{option.city}</Box>
                </Box>
              </li>
            )}
          />
        </Box>

        {/* To Field with Autocomplete */}
        <Box sx={{ flex: 1, minWidth: 200 }}>
          <Autocomplete
            options={airports}
            getOptionLabel={(option) => `${option.name} (${option.code})`}
            value={formData.to}
            onChange={(_, newValue) => setFormData({ ...formData, to: newValue || airports[1] })}
            renderInput={(params) => (
              <TextField
                {...params}
                label="To"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <LocationOnIcon sx={{ color: '#4CAF50', mr: 1 }} />
                      {params.InputProps.startAdornment}
                    </>
                  ),
                }}
              />
            )}
            renderOption={(props, option) => (
              <li {...props}>
                <Box>
                  <Box sx={{ fontWeight: 'bold' }}>{option.name} ({option.code})</Box>
                  <Box sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>{option.city}</Box>
                </Box>
              </li>
            )}
          />
        </Box>

        {/* Dates and Passenger Info */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Departure and Return Dates with DatePicker */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <DatePicker
              label="Departure"
              value={formData.departureDate}
              onChange={(newValue) =>
                setFormData({ ...formData, departureDate: newValue || dayjs('2025-04-13') })
              }
              slotProps={{ textField: { sx: { width: 150 } } }}
            />
            {tab === 'roundway' && (
              <DatePicker
                label="Return"
                value={formData.returnDate}
                onChange={(newValue) =>
                  setFormData({ ...formData, returnDate: newValue || dayjs('2025-04-15') })
                }
                slotProps={{ textField: { sx: { width: 150 } } }}
              />
            )}
            {tab === 'multicity' && (
              <DatePicker
                label="Departure"
                value={formData.departureDate}
                onChange={(newValue) =>
                  setFormData({ ...formData, departureDate: newValue || dayjs('2025-04-13') })
                }
                slotProps={{ textField: { sx: { width: 150 } } }}
              />
            )}
          </Box>

          {/* Passenger and Class Selection */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <FormControl sx={{ width: 100 }}>
              <InputLabel>Adults</InputLabel>
              <Select
                name="adults"
                value={formData.adults}
                onChange={(e) => setFormData({ ...formData, adults: Number(e.target.value) })}
                label="Adults"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <MenuItem key={num} value={num}>
                    {num}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ width: 100 }}>
              <InputLabel>Children</InputLabel>
              <Select
                name="children"
                value={formData.children}
                onChange={(e) => setFormData({ ...formData, children: Number(e.target.value) })}
                label="Children"
              >
                {[0, 1, 2, 3, 4].map((num) => (
                  <MenuItem key={num} value={num}>
                    {num}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ width: 100 }}>
              <InputLabel>Infants</InputLabel>
              <Select
                name="infants"
                value={formData.infants}
                onChange={(e) => setFormData({ ...formData, infants: Number(e.target.value) })}
                label="Infants"
              >
                {[0, 1, 2, 3, 4].map((num) => (
                  <MenuItem key={num} value={num}>
                    {num}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ width: 120 }}>
              <InputLabel>Class</InputLabel>
              <Select
                name="travelClass"
                value={formData.travelClass}
                onChange={(e) => setFormData({ ...formData, travelClass: e.target.value })}
                label="Class"
              >
                <MenuItem value="Economy">Economy</MenuItem>
                <MenuItem value="Business">Business</MenuItem>
                <MenuItem value="First">First</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Search Button and Add City (for Multi-City) */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Button
            variant="contained"
            onClick={handleSearch}
            sx={{
              bgcolor: '#4CAF50',
              color: 'white',
              height: 56,
              borderRadius: 1,
              px: 4,
              '&:hover': { bgcolor: '#45a049' },
            }}
          >
            Search For Flight
          </Button>
          {tab === 'multicity' && (
            <Button
              variant="outlined"
              sx={{
                color: '#4CAF50',
                borderColor: '#4CAF50',
                height: 56,
                borderRadius: 1,
                px: 4,
                '&:hover': { borderColor: '#45a049' },
              }}
              disabled
            >
              Add City
            </Button>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default SearchBar;