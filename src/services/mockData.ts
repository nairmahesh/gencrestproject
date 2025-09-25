/**
 * This file contains mock data that simulates responses from the Gencrest API.
 * The structures are designed to be compatible with the OpenAPI specification.
 */

// Simulates the expected response for GET /api/liquidation/distributor/{distributorId}/summary
export const mockDistributorSummary = {
  id: '1325',
  name: 'SRI RAMA SEEDS AND PESTICIDES',
  location: { latitude: 17.3850, longitude: 78.4867 }, // Hyderabad
  summary: {
    openingStock: { vol: 40, value: 0.38 },
    ytdNetSales: { vol: 310, value: 1.93 },
    liquidation: { vol: 140, value: 0.93 },
    balanceStock: { vol: 210, value: 1.38 },
    percentLiquidation: 40,
  }
};

// Simulates the expected response for GET /api/distributors/{distributorId}/products
export const mockDistributorProducts = [
  { sku: 'GC-P-001', name: 'Product Alpha', lastBalance: 90 },
  { sku: 'GC-P-002', name: 'Product Beta', lastBalance: 50 },
  { sku: 'GC-P-003', name: 'Product Gamma', lastBalance: 75 },
];

// Simulates the expected response for GET /api/distributors/{distributorId}/retailers
export const mockRetailers = [
    { id: 'RET-001', name: 'Kisan Seva Kendra' },
    { id: 'RET-002', name: 'AgroPlus Retail' },
    { id: 'RET-003', name: 'Green Valley Supplies' },
];