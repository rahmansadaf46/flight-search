import EventIcon from '@mui/icons-material/Event';
import FlightIcon from '@mui/icons-material/Flight';
import FlightOutlinedIcon from '@mui/icons-material/FlightOutlined';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CloseIcon from '@mui/icons-material/Close';
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  IconButton,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import flightsData from '../data/flights.json';
import { setFlights, setLoading, setSearchParams } from '../store/slices/flightSlice';
import { SearchParams } from '../types/flight';

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
  const [tripLegs, setTripLegs] = useState([
    {
      from: airports[0],
      to: airports[1],
      departureDate: dayjs('2025-04-17'),
    },
  ]);
  const [returnDate, setReturnDate] = useState(dayjs('2025-04-19'));
  const [formData, setFormData] = useState({
    adults: 1,
    children: 0,
    infants: 0,
    travelClass: 'Economy',
  });
  const dispatch = useDispatch();

  const handleTabChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTab(event.target.value as 'roundway' | 'oneway' | 'multicity');
    // Reset trip legs to one when switching tabs

    setTripLegs([
      {
        from: airports[0],
        to: airports[1],
        departureDate: dayjs('2025-04-17'),
      },
    ]);
  };

  const handleAddCity = () => {
    setTripLegs([
      ...tripLegs,
      {
        from: airports[0],
        to: airports[1],
        departureDate: dayjs('2025-04-16'),
      },
    ]);
  };

  const handleRemoveLeg = (index: number) => {
    if (tripLegs.length > 1) {
      setTripLegs(tripLegs.filter((_, i) => i !== index));
    }
  };

  const handleLegChange = (index: number, field: 'from' | 'to' | 'departureDate', value: typeof airports[0] | dayjs.Dayjs) => {
    const updatedLegs = [...tripLegs];
    updatedLegs[index] = { ...updatedLegs[index], [field]: value };
    setTripLegs(updatedLegs);
  };

  const handleSearch = () => {
    if (tab === 'multicity') {
      const searchParams: SearchParams = {
        tripType: 'multicity',
        legs: tripLegs.map((leg, index) => ({
          from: leg.from.code,
          to: leg.to.code,
          departureDate: leg.departureDate.format('YYYY-MM-DD'),
          tripType: 'multicity',
          legNumber: index + 1,
        })),
      };
      dispatch(setSearchParams(searchParams));
    } else {
      const searchParams: SearchParams = {
        from: tripLegs[0].from.code,
        to: tripLegs[0].to.code,
        departureDate: tripLegs[0].departureDate.format('YYYY-MM-DD'),
        tripType: tab === 'roundway' ? 'roundtrip' : tab,
        ...(tab === 'roundway' && { returnDate: returnDate.format('YYYY-MM-DD') }),
      };
      dispatch(setSearchParams(searchParams));
    }
    dispatch(setLoading());

    setTimeout(() => {
      dispatch(setFlights(flightsData.map((flight) => ({ ...flight, ischeap: flight.ischeap ?? false }))));
    }, 500);
  };

  return (
    <Box sx={{ p: 3, display: 'flex', borderRadius: 2, minWidth: 1200, width: '100%' }}>
      <Paper sx={{ p: 3, borderRadius: 2, width: '100%' }}>
        {/* Round-Way, One-Way, Multi-City Tabs as Radio Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'start', mb: 2 }}>
          <RadioGroup row value={tab} onChange={handleTabChange}>
            <FormControlLabel
              value="roundway"
              control={<Radio />}
              label="ROUND-WAY"
              sx={{
                '& .MuiRadio-root': {
                  color: '#32D094',
                  '&.Mui-checked': { color: '#32D094' },
                },
                '& .MuiFormControlLabel-label': {
                  color: tab === 'roundway' ? '#32D094' : 'text.secondary',
                },
              }}
            />
            <FormControlLabel
              value="oneway"
              control={<Radio />}
              label="ONE-WAY"
              sx={{
                '& .MuiRadio-root': {
                  color: '#32D094',
                  '&.Mui-checked': { color: '#32D094' },
                },
                '& .MuiFormControlLabel-label': {
                  color: tab === 'oneway' ? '#32D094' : 'text.secondary',
                },
              }}
            />
            <FormControlLabel
              value="multicity"
              control={<Radio />}
              label="MULTI-CITY"
              sx={{
                '& .MuiRadio-root': {
                  color: '#32D094',
                  '&.Mui-checked': { color: '#32D094' },
                },
                '& .MuiFormControlLabel-label': {
                  color: tab === 'multicity' ? '#32D094' : 'text.secondary',
                },
              }}
            />
          </RadioGroup>
        </Box>

        {/* Search Form */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {tripLegs.map((leg, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'center', position: 'relative' }}>
              {/* From Card */}
              <Paper
                elevation={0}
                sx={{
                  flex: 1,
                  minWidth: 200,
                  p: 2,
                  borderRadius: 1,
                }}
              >
                <Typography variant="inherit" sx={{ textAlign: 'center' }}>
                  From
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ color: '#32D094', fontWeight: 'bold', textAlign: 'center', mt: 1, mb: 3 }}
                >
                  {leg.from.code}
                </Typography>
                <Autocomplete
                  options={airports}
                  getOptionLabel={(option) => `${option.name} (${option.code})`}
                  value={leg.from}
                  onChange={(_, newValue) =>
                    handleLegChange(index, 'from', newValue || airports[0])
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      placeholder="From"
                      InputProps={{
                        ...params.InputProps,
                        disableUnderline: true,
                        startAdornment: (
                          <>
                            <LocationOnIcon sx={{ color: '#32D094', mr: 1 }} />
                            {params.InputProps.startAdornment}
                          </>
                        ),
                      }}
                      sx={{ '& .MuiInputBase-input': { fontSize: '0.9rem', color: 'text.secondary' } }}
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
                  sx={{ '& .MuiAutocomplete-inputRoot': { paddingLeft: '0 !important' }, mb: tab === 'multicity' ? 11 : 0 }}
                />
                {(tab === 'roundway' || tab === 'oneway') && (<Box sx={{ mt: 1 }}>
                  <DatePicker
                    label=""
                    value={leg.departureDate}
                    onChange={(newValue) =>
                      handleLegChange(index, 'departureDate', newValue || dayjs('2025-04-17'))
                    }
                    slots={{
                      openPickerIcon: () => <EventIcon sx={{ color: '#32D094' }} />,
                    }}
                    slotProps={{
                      textField: {
                        variant: 'filled',
                        sx: {
                          '& .MuiFilledInput-root': {
                            backgroundColor: '#E8F0FE',
                            borderRadius: 1,
                            '&:before, &:after': { borderBottom: 'none' },
                            '&:hover:before': { borderBottom: 'none' },
                          },
                          '& .MuiInputBase-input': { padding: '8px 12px', fontSize: '0.9rem' },
                          width: '100%',
                        },
                      },
                    }}
                    format="DD MMM YY"
                  />
                </Box>)}

              </Paper>

              {/* Plane Icons */}
              <Box sx={{ display: 'flex', alignItems: 'center', mx: 2, flexDirection: 'column', gap: 1 }}>
                <FlightIcon sx={{ fontSize: 60, mb: tab === 'multicity' ? 14 : tab === 'roundway' ? -4 : 10, color: '#32D094', transform: 'rotate(90deg)' }} />
                {tab === 'roundway' && index === 0 && (
                  <FlightOutlinedIcon
                    sx={{ fontSize: 60, color: '#32D094', transform: 'rotate(270deg)' }}
                  />
                )}
              </Box>

              {/* To Card */}
              <Paper
                elevation={0}
                sx={{
                  flex: 1,
                  minWidth: 200,
                  p: 2,
                  borderRadius: 1,
                }}
              >
                <Typography variant="inherit" sx={{ textAlign: 'center' }}>
                  To
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ color: '#32D094', fontWeight: 'bold', textAlign: 'center', mt: 1, mb: 3 }}
                >
                  {leg.to.code}
                </Typography>
                <Autocomplete
                  options={airports}
                  getOptionLabel={(option) => `${option.name} (${option.code})`}
                  value={leg.to}
                  onChange={(_, newValue) =>
                    handleLegChange(index, 'to', newValue || airports[1])
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      placeholder="To"
                      InputProps={{
                        ...params.InputProps,
                        disableUnderline: true,
                        startAdornment: (
                          <>
                            <LocationOnIcon sx={{ color: '#32D094', mr: 1 }} />
                            {params.InputProps.startAdornment}
                          </>
                        ),
                      }}
                      sx={{ '& .MuiInputBase-input': { fontSize: '0.9rem', color: 'text.secondary' } }}
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
                  sx={{ '& .MuiAutocomplete-inputRoot': { paddingLeft: '0 !important' } }}
                />
                {(tab === 'roundway' || tab === 'multicity') && (
                  <Box sx={{ mt: 1 }}>
                    <DatePicker
                      label=""
                      value={returnDate}
                      onChange={(newValue) =>
                        setReturnDate(newValue || dayjs('2025-04-19'))
                      }
                      slots={{
                        openPickerIcon: () => <EventIcon sx={{ color: '#32D094' }} />,
                      }}
                      slotProps={{
                        textField: {
                          variant: 'filled',
                          sx: {
                            '& .MuiFilledInput-root': {
                              backgroundColor: '#E8F0FE',
                              borderRadius: 1,
                              '&:before, &:after': { borderBottom: 'none' },
                              '&:hover:before': { borderBottom: 'none' },
                            },
                            '& .MuiInputBase-input': { padding: '8px 12px', fontSize: '0.9rem' },
                            width: '100%',
                          },
                        },
                      }}
                      format="DD MMM YY"
                    />
                  </Box>
                )}
                {tab !== 'roundway' && (
                  <Box sx={{ mt: 1, visibility: 'hidden' }}>
                    <DatePicker
                      label=""
                      value={returnDate}
                      onChange={(newValue) =>
                        setReturnDate(newValue || dayjs('2025-04-19'))
                      }
                      slots={{
                        openPickerIcon: () => <EventIcon sx={{ color: '#32D094' }} />,
                      }}
                      slotProps={{
                        textField: {
                          variant: 'filled',
                          sx: {
                            '& .MuiFilledInput-root': {
                              backgroundColor: '#E8F0FE',
                              borderRadius: 1,
                              '&:before, &:after': { borderBottom: 'none' },
                              '&:hover:before': { borderBottom: 'none' },
                            },
                            '& .MuiInputBase-input': { padding: '8px 12px', fontSize: '0.9rem' },
                            width: '100%',
                          },
                        },
                      }}
                      format="DD MMM YY"
                    />
                  </Box>
                )}
              </Paper>

              {/* Delete Button for Multi-City Legs */}
              {tab === 'multicity' && index > 0 && (
                <IconButton
                  onClick={() => handleRemoveLeg(index)}
                  sx={{ position: 'absolute', right: 0, top: 0, transform: 'translateY(-50%)' }}
                >
                  <CloseIcon sx={{ color: 'red', fontSize: '15px', border: '1px solid red', borderRadius: '50px' }} />
                </IconButton>
              )}
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Passenger and Class Selection */}
      <Paper sx={{ p: 3, borderRadius: 2, maxWidth: 400, width: '100%', height: 'auto' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 200, height: '100%', justifyContent: 'space-between' }}>
          {/* Passenger and Class Selection */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <FormControl sx={{ width: '100%' }}>
              <Select
                value={formData.adults}
                onChange={(e) => setFormData({ ...formData, adults: Number(e.target.value) })}
                displayEmpty
                variant="filled"
                sx={{
                  backgroundColor: '#E8F0FE',
                  borderRadius: 1,
                  '&:before, &:after': { borderBottom: 'none' },
                  '& .MuiSelect-select': { padding: '8px 24px 8px 12px', fontSize: '0.9rem' },
                }}
              >
                <MenuItem value="" disabled>
                  Adults
                </MenuItem>
                {[1, 2, 3, 4, 5].map((num) => (
                  <MenuItem key={num} value={num}>
                    {num} Adult{num > 1 ? 's' : ''}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ width: '100%' }}>
              <Select
                value={formData.children}
                onChange={(e) => setFormData({ ...formData, children: Number(e.target.value) })}
                displayEmpty
                variant="filled"
                sx={{
                  backgroundColor: '#E8F0FE',
                  borderRadius: 1,
                  '&:before, &:after': { borderBottom: 'none' },
                  '& .MuiSelect-select': { padding: '8px 24px 8px 12px', fontSize: '0.9rem' },
                }}
              >
                <MenuItem value="" disabled>
                  Children
                </MenuItem>
                {[0, 1, 2, 3, 4].map((num) => (
                  <MenuItem key={num} value={num}>
                    {num} Child{num !== 1 ? 'ren' : ''}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ width: '100%' }}>
              <Select
                value={formData.infants}
                onChange={(e) => setFormData({ ...formData, infants: Number(e.target.value) })}
                displayEmpty
                variant="filled"
                sx={{
                  backgroundColor: '#E8F0FE',
                  borderRadius: 1,
                  '&:before, &:after': { borderBottom: 'none' },
                  '& .MuiSelect-select': { padding: '8px 24px 8px 12px', fontSize: '0.9rem' },
                }}
              >
                <MenuItem value="" disabled>
                  Infants
                </MenuItem>
                {[0, 1, 2, 3, 4].map((num) => (
                  <MenuItem key={num} value={num}>
                    {num} Infant{num > 1 ? 's' : ''}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ width: '100%' }}>
              <Select
                value={formData.travelClass}
                onChange={(e) => setFormData({ ...formData, travelClass: e.target.value })}
                variant="filled"
                sx={{
                  backgroundColor: '#E8F0FE',
                  borderRadius: 1,
                  '&:before, &:after': { borderBottom: 'none' },
                  '& .MuiSelect-select': { padding: '8px 24px 8px 12px', fontSize: '0.9rem' },
                }}
              >
                <MenuItem value="Economy">Economy</MenuItem>
                <MenuItem value="Business">Business</MenuItem>
                <MenuItem value="First">First</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Search Button */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button
              variant="contained"
              onClick={handleSearch}
              sx={{
                bgcolor: '#32D094',
                color: 'white',
                height: 36,
                borderRadius: 1,
                px: 4,
                textTransform: 'uppercase',
                fontWeight: 'bold',
              }}
            >
              Search For Flight
            </Button>
            {tab === 'multicity' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  variant="contained"
                  onClick={handleAddCity}
                  sx={{
                    bgcolor: '#32D094',
                    color: 'white',
                    height: 36,
                    borderRadius: 1,
                    px: 4,
                    textTransform: 'uppercase',
                    fontWeight: 'bold',
                  }}
                >
                  Add City
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default SearchBar;