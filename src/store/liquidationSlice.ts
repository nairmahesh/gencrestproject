import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mockDistributorSummary, mockDistributorProducts } from '../services/mockData';

export const fetchDistributorSummary = createAsyncThunk(
  'liquidation/fetchDistributorSummary',
  async (distributorId: string) => {
    console.log(`Fetching summary for distributor ID: ${distributorId}`);
    // REAL API CALL (when ready): return await apiService.getDistributorSummary(distributorId);
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockDistributorSummary;
  }
);

export const fetchDistributorProducts = createAsyncThunk(
  'liquidation/fetchDistributorProducts',
  async (distributorId: string) => {
    console.log(`Fetching products for distributor ID: ${distributorId}`);
    // REAL API CALL (when ready): return await apiService.getProductsForDistributor(distributorId);
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockDistributorProducts;
  }
);

interface LiquidationState {
  selectedDistributor: typeof mockDistributorSummary | null;
  distributorProducts: typeof mockDistributorProducts;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: LiquidationState = {
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