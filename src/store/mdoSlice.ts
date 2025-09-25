import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock Data based on all MDO-related documents
const mockMdoData = {
  dashboard: {
    ytd: { planned: 120, done: 95 },
    monthly: { planned: 30, done: 22 },
  },
  liquidationSummary: {
    openingStock: { vol: 32660, value: 190.00 },
    ytdNetSales: { vol: 13303, value: 43.70 },
    liquidation: { vol: 12720, value: 55.52 },
    balanceStock: { vol: 33243, value: 178.23 },
    percentLiquidation: 28,
  },
  journeyPlan: [
    { day: "2025-09-25", activity: "Farmer Meets – Small", village: "Village A", distributor: "SRI RAMA SEEDS", target: 10, status: "Done" },
    { day: "2025-09-26", activity: "Farm level demos", village: "Village B", distributor: "National Fertilizers", target: 5, status: "Done" },
    { day: "2025-09-27", activity: "Retailer Day Training Program", village: "Town C", distributor: "Kisan Agri Store", target: 50, status: "Pending" },
    { day: "2025-09-28", activity: "Farmer Meets – Large", village: "Village D", distributor: "SRI RAMA SEEDS", target: 100, status: "Pending" },
  ]
};

export const fetchMdoData = createAsyncThunk('mdo/fetchData', async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockMdoData;
});

interface MdoState {
  dashboard: typeof mockMdoData.dashboard | null;
  liquidationSummary: typeof mockMdoData.liquidationSummary | null;
  journeyPlan: typeof mockMdoData.journeyPlan;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: MdoState = {
  dashboard: null,
  liquidationSummary: null,
  journeyPlan: [],
  status: 'idle',
  error: null,
};

const mdoSlice = createSlice({
  name: 'mdo',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMdoData.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchMdoData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.dashboard = action.payload.dashboard;
        state.liquidationSummary = action.payload.liquidationSummary;
        state.journeyPlan = action.payload.journeyPlan;
      })
      .addCase(fetchMdoData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch MDO data';
      });
  },
});

export const mdoReducer = mdoSlice.reducer;