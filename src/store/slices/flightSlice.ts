import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Flight, SearchParams } from '../../types/flight';

interface FlightState {
  searchParams: SearchParams | null;
  flights: Flight[];
  loading: boolean;
  error: string | null;
}

const initialState: FlightState = {
  searchParams: null,
  flights: [],
  loading: false,
  error: null,
};

const flightSlice = createSlice({
  name: 'flight',
  initialState,
  reducers: {
    setSearchParams(state, action: PayloadAction<SearchParams>) {
      state.searchParams = action.payload;
    },
    setFlights(state, action: PayloadAction<Flight[]>) {
      state.flights = action.payload;
      state.loading = false;
    },
    setLoading(state) {
      state.loading = true;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setSearchParams, setFlights, setLoading, setError } = flightSlice.actions;
export default flightSlice.reducer;