import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// --- MOCK DATA ---
const mockOverallSummary = {
  openingStock: { vol: 32660, value: 190.00 },
  ytdNetSales: { vol: 13303, value: 43.70 },
  liquidation: { vol: 12720, value: 55.52 },
  balanceStock: { vol: 33243, value: 178.23 },
  percentLiquidation: 28,
};

const mockDistributorSummary = {
  id: '1325',
  name: 'SRI RAMA SEEDS AND PESTICIDES',
  location: { latitude: 17.5443264, longitude: 78.3941632 },
  summary: {
    openingStock: { vol: 40, value: 0.38 },
    ytdNetSales: { vol: 310, value: 1.93 },
    liquidation: { vol: 140, value: 0.93 },
    balanceStock: { vol: 210, value: 1.38 },
    percentLiquidation: 40,
  }
};

const mockDistributorProducts = [
  { sku: 'GC-P-001', name: 'Product Alpha', lastBalance: 90 },
  { sku: 'GC-P-002', name: 'Product Beta', lastBalance: 50 },
  { sku: 'GC-P-003', name: 'Product Gamma', lastBalance: 75 },
];
// --- END MOCK DATA ---

export const fetchLiquidationSummary = createAsyncThunk('liquidation/fetchSummary', async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockOverallSummary;
});

export const fetchDistributorSummary = createAsyncThunk(
  'liquidation/fetchDistributorSummary',
  async (distributorId: string) => {
    console.log(`Fetching summary for distributor ID: ${distributorId}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockDistributorSummary;
  }
);

export const fetchDistributorProducts = createAsyncThunk(
  'liquidation/fetchDistributorProducts',
  async (distributorId: string) => {
    console.log(`Fetching products for distributor ID: ${distributorId}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockDistributorProducts;
  }
);

interface LiquidationState {
  overallSummary: typeof mockOverallSummary | null;
  selectedDistributor: typeof mockDistributorSummary | null;
  distributorProducts: typeof mockDistributorProducts;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: LiquidationState = {
  overallSummary: null,
  selectedDistributor: null,
  distributorProducts: [],
  status: 'idle',
  error: null,
};

const liquidationSlice = createSlice({
  name: 'liquidation',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLiquidationSummary.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchLiquidationSummary.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.overallSummary = action.payload;
      })
      .addCase(fetchLiquidationSummary.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch summary';
      })
      .addCase(fetchDistributorSummary.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchDistributorSummary.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedDistributor = action.payload;
      })
      .addCase(fetchDistributorSummary.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch distributor summary';
      })
      .addCase(fetchDistributorProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDistributorProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.distributorProducts = action.payload;
      })
      .addCase(fetchDistributorProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch products';
      });
  },
});

export const liquidationReducer = liquidationSlice.reducer;