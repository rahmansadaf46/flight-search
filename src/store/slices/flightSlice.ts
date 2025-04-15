import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RawFlight, SearchParams } from '../../types/flight';

interface FlightState {
  flights: RawFlight[];
  searchParams: SearchParams;
  loading: boolean;
}

const initialState: FlightState = {
  flights: [],
  searchParams: {
    from: '',
    to: '',
    departureDate: '',
    tripType: 'oneway',
  },
  loading: false,
};

const flightSlice = createSlice({
  name: 'flight',
  initialState,
  reducers: {
    setFlights: (state, action: PayloadAction<RawFlight[]>) => {
      state.flights = action.payload;
      state.loading = false;
    },
    setSearchParams: (state, action: PayloadAction<SearchParams>) => {
      state.searchParams = action.payload;
    },
    setLoading: (state) => {
      state.loading = true;
    },
  },
});

export const { setFlights, setSearchParams, setLoading } = flightSlice.actions;
export default flightSlice.reducer;