import { useState, useEffect, useCallback } from 'react';

interface LiquidationMetrics {
  openingStock: { volume: number; value: number };
  ytdNetSales: { volume: number; value: number };
  liquidation: { volume: number; value: number };
  balanceStock: { volume: number; value: number };
  liquidationPercentage: number;
  lastUpdated: string;
}

interface DistributorLiquidation {
  id: string;
  distributorName: string;
  distributorCode: string;
  metrics: LiquidationMetrics;
  territory: string;
  region: string;
  zone: string;
  status: 'Active' | 'Inactive';
  priority: 'High' | 'Medium' | 'Low';
}

interface ProductSKU {
  skuCode: string;
  skuName: string;
  unit: string;
  openingStock: number;
  ytdSales: number;
  liquidated: number;
  currentStock: number;
  unitPrice: number;
}

interface ProductData {
  productId: string;
  productCode: string;
  productName: string;
  category: string;
  skus: ProductSKU[];
}

// Business Logic Constants
const BUSINESS_RULES = {
  // CRITICAL BUSINESS DEFINITION: Liquidation = Stock sold to FARMERS ONLY (non-returnable)
  // Stock sold to retailers is NOT liquidation as it can be returned to distributor
  LIQUIDATION_DEFINITION: 'farmer_sales_only_non_returnable',
  // Liquidation percentage calculation: Liquidation / (Opening Stock + YTD Net Sales) * 100
  LIQUIDATION_FORMULA: 'liquidation_over_total_available',
  // Balance stock calculation: Opening Stock + YTD Net Sales - Liquidation
  BALANCE_FORMULA: 'opening_plus_ytd_minus_liquidation',
  // Value calculations based on weighted average unit prices
  VALUE_CALCULATION: 'weighted_average_pricing',
  // Minimum liquidation target percentage
  TARGET_LIQUIDATION_PERCENTAGE: 50,
  // Currency format
  CURRENCY_FORMAT: 'INR_LAKHS',
  // Stock movement types
  STOCK_MOVEMENTS: {
    LIQUIDATION: 'farmer_sales_only', // Only farmer sales count as liquidation
    RETAILER_SALES: 'retailer_transfer', // Retailer sales are transfers, not liquidation
    RETURNS: 'distributor_returns' // Only from retailers back to distributor
  }
};

export const useLiquidationCalculation = () => {
  // Core metrics state
  const [overallMetrics, setOverallMetrics] = useState<LiquidationMetrics>({
    openingStock: { volume: 32660, value: 40.55 },
    ytdNetSales: { volume: 23303, value: 27.36 },
    liquidation: { volume: 12720, value: 16.55 },
    balanceStock: { volume: 43243, value: 51.36 },
    liquidationPercentage: 28,
    lastUpdated: new Date().toISOString()
  });

  const [distributorMetrics, setDistributorMetrics] = useState<DistributorLiquidation[]>([
    {
      id: 'DIST001',
      distributorName: 'SRI RAMA SEEDS AND PESTICIDES',
      distributorCode: '1325',
      territory: 'North Delhi',
      region: 'Delhi NCR',
      zone: 'North Zone',
      status: 'Active',
      priority: 'High',
      metrics: {
        openingStock: { volume: 420, value: 5.67 }, // 2 SKUs × 2 invoices × 105 × 0.5 = 420
        ytdNetSales: { volume: 168, value: 2.27 }, // 2 SKUs × 2 invoices × 105 × 0.2 = 168  
        liquidation: { volume: 210, value: 2.84 }, // 2 SKUs × 2 invoices × 105 × 0.25 = 210
        balanceStock: { volume: 378, value: 5.10 }, // 420 + 168 - 210 = 378
        liquidationPercentage: 36, // 210 / (420 + 168) × 100 = 36%
        lastUpdated: new Date().toISOString()
      }
    },
    {
      id: 'DIST002',
      distributorName: 'Ram Kumar Distributors',
      distributorCode: 'DLR001',
      territory: 'Green Valley',
      region: 'Delhi NCR',
      zone: 'North Zone',
      status: 'Active',
      priority: 'Medium',
      metrics: {
        openingStock: { volume: 15000, value: 18.75 },
        ytdNetSales: { volume: 6500, value: 8.13 },
        liquidation: { volume: 6200, value: 7.75 },
        balanceStock: { volume: 15300, value: 19.13 },
        liquidationPercentage: 29,
        lastUpdated: new Date().toISOString()
      }
    },
    {
      id: 'DIST003',
      distributorName: 'Green Agro Solutions',
      distributorCode: 'GAS001',
      territory: 'Sector 8',
      region: 'Delhi NCR',
      zone: 'North Zone',
      status: 'Active',
      priority: 'Low',
      metrics: {
        openingStock: { volume: 17620, value: 21.70 },
        ytdNetSales: { volume: 6493, value: 6.57 },
        liquidation: { volume: 6380, value: 7.22 },
        balanceStock: { volume: 17733, value: 21.05 },
        liquidationPercentage: 26,
        lastUpdated: new Date().toISOString()
      }
    }
  ]);

  // Product-level data for detailed tracking
  const [productData, setProductData] = useState<ProductData[]>([
    {
      productId: 'P001',
      productCode: 'FERT001',
      productName: 'DAP (Di-Ammonium Phosphate)',
      category: 'Fertilizers',
      skus: [
        {
          skuCode: 'DAP-25KG',
          skuName: 'DAP 25kg Bag',
          unit: 'Kg',
          openingStock: 15000,
          ytdSales: 6500,
          liquidated: 6200,
          currentStock: 15300,
          unitPrice: 1350
        },
        {
          skuCode: 'DAP-50KG',
          skuName: 'DAP 50kg Bag',
          unit: 'Kg',
          openingStock: 10000,
          ytdSales: 4300,
          liquidated: 4100,
          currentStock: 10200,
          unitPrice: 2700
        }
      ]
    }
  ]);

  // Perfect Business Logic Calculations
  const calculateLiquidationMetrics = useCallback((
    openingStock: { volume: number; value: number },
    ytdNetSales: { volume: number; value: number },
    liquidation: { volume: number; value: number }
  ): LiquidationMetrics => {
    
    // BUSINESS RULE 1: Balance Stock = Opening Stock + YTD Net Sales - Liquidation
    const balanceStockVolume = Math.max(0, openingStock.volume + ytdNetSales.volume - liquidation.volume);
    const balanceStockValue = Math.max(0, openingStock.value + ytdNetSales.value - liquidation.value);
    
    // BUSINESS RULE 2: Liquidation % = Liquidation / (Opening Stock + YTD Net Sales) * 100
    const totalAvailableStock = Math.max(1, openingStock.volume + ytdNetSales.volume); // Prevent division by zero
    const liquidationPercentage = totalAvailableStock > 0 
      ? Math.round((liquidation.volume / totalAvailableStock) * 100) 
      : 0;
    
    return {
      openingStock,
      ytdNetSales,
      liquidation,
      balanceStock: {
        volume: balanceStockVolume,
        value: Number(balanceStockValue.toFixed(2))
      },
      liquidationPercentage,
      lastUpdated: new Date().toISOString()
    };
  }, []);

  // Aggregate distributor metrics to overall metrics
  const aggregateOverallMetrics = useCallback(() => {
    const totalOpeningVolume = distributorMetrics.reduce((sum, d) => sum + d.metrics.openingStock.volume, 0);
    const totalOpeningValue = distributorMetrics.reduce((sum, d) => sum + (d.metrics.openingStock.value || 0), 0);
    const totalYtdVolume = distributorMetrics.reduce((sum, d) => sum + d.metrics.ytdNetSales.volume, 0);
    const totalYtdValue = distributorMetrics.reduce((sum, d) => sum + (d.metrics.ytdNetSales.value || 0), 0);
    const totalLiquidationVolume = distributorMetrics.reduce((sum, d) => sum + d.metrics.liquidation.volume, 0);
    const totalLiquidationValue = distributorMetrics.reduce((sum, d) => sum + (d.metrics.liquidation.value || 0), 0);

    const aggregatedMetrics = calculateLiquidationMetrics(
      { volume: totalOpeningVolume, value: totalOpeningValue },
      { volume: totalYtdVolume, value: totalYtdValue },
      { volume: totalLiquidationVolume, value: totalLiquidationValue }
    );

    setOverallMetrics(aggregatedMetrics);
  }, [distributorMetrics, calculateLiquidationMetrics]);

  // Update distributor metrics with perfect calculations
  const updateDistributorMetrics = useCallback((
    distributorId: string, 
    updates: Partial<{
      openingStock: { volume: number; value: number };
      ytdNetSales: { volume: number; value: number };
      liquidation: { volume: number; value: number };
    }>
  ) => {
    setDistributorMetrics(prev => 
      prev.map(distributor => {
        if (distributor.id === distributorId) {
          const currentMetrics = distributor.metrics;
          const newOpeningStock = updates.openingStock || currentMetrics.openingStock;
          const newYtdNetSales = updates.ytdNetSales || currentMetrics.ytdNetSales;
          const newLiquidation = updates.liquidation || currentMetrics.liquidation;

          const recalculatedMetrics = calculateLiquidationMetrics(
            newOpeningStock,
            newYtdNetSales,
            newLiquidation
          );

          return {
            ...distributor,
            metrics: recalculatedMetrics
          };
        }
        return distributor;
      })
    );
  }, [calculateLiquidationMetrics]);

  // Update overall metrics and cascade to distributors proportionally
  const updateOverallMetrics = useCallback((
    updates: Partial<{
      openingStock: { volume: number; value: number };
      ytdNetSales: { volume: number; value: number };
      liquidation: { volume: number; value: number };
    }>
  ) => {
    const currentMetrics = overallMetrics;
    const newOpeningStock = updates.openingStock || currentMetrics.openingStock;
    const newYtdNetSales = updates.ytdNetSales || currentMetrics.ytdNetSales;
    const newLiquidation = updates.liquidation || currentMetrics.liquidation;

    const recalculatedMetrics = calculateLiquidationMetrics(
      newOpeningStock,
      newYtdNetSales,
      newLiquidation
    );

    setOverallMetrics(recalculatedMetrics);

    // Cascade changes to distributors proportionally
    if (updates.ytdNetSales || updates.liquidation) {
      setDistributorMetrics(prev => 
        prev.map(distributor => {
          let updatedMetrics = { ...distributor.metrics };

          // Proportional update for YTD Net Sales
          if (updates.ytdNetSales) {
            const currentShare = distributor.metrics.ytdNetSales.volume / currentMetrics.ytdNetSales.volume;
            if (currentShare > 0) {
              updatedMetrics.ytdNetSales = {
                volume: Math.round(newYtdNetSales.volume * currentShare),
                value: Number((newYtdNetSales.value * currentShare).toFixed(2))
              };
            }
          }

          // Proportional update for Liquidation
          if (updates.liquidation) {
            const currentShare = distributor.metrics.liquidation.volume / currentMetrics.liquidation.volume;
            if (currentShare > 0) {
              updatedMetrics.liquidation = {
                volume: Math.round(newLiquidation.volume * currentShare),
                value: Number((newLiquidation.value * currentShare).toFixed(2))
              };
            }
          }

          // Recalculate with perfect business logic
          const finalMetrics = calculateLiquidationMetrics(
            updatedMetrics.openingStock,
            updatedMetrics.ytdNetSales,
            updatedMetrics.liquidation
          );

          return {
            ...distributor,
            metrics: finalMetrics
          };
        })
      );
    }
  }, [overallMetrics, calculateLiquidationMetrics]);

  // Update product-level data and cascade to distributors
  const updateProductData = useCallback((
    productId: string,
    skuCode: string,
    updates: Partial<ProductSKU>
  ) => {
    setProductData(prev => 
      prev.map(product => {
        if (product.productId === productId) {
          const updatedSKUs = product.skus.map(sku => {
            if (sku.skuCode === skuCode) {
              const updatedSKU = { ...sku, ...updates };
              
              // Recalculate current stock based on business logic
              if (updates.openingStock !== undefined || updates.ytdSales !== undefined || updates.liquidated !== undefined) {
                updatedSKU.currentStock = (updatedSKU.openingStock || 0) + (updatedSKU.ytdSales || 0) - (updatedSKU.liquidated || 0);
              }
              
              return updatedSKU;
            }
            return sku;
          });

          return {
            ...product,
            skus: updatedSKUs
          };
        }
        return product;
      })
    );
  }, []);

  // NEW: Track farmer sales from retailers and update distributor liquidation
  const recordFarmerSaleFromRetailer = useCallback((
    distributorId: string,
    retailerId: string,
    productId: string,
    skuCode: string,
    quantitySoldToFarmer: number,
    saleValue: number
  ) => {
    // Update distributor's liquidation count when retailer sells to farmer
    setDistributorMetrics(prev => 
      prev.map(distributor => {
        if (distributor.id === distributorId) {
          const updatedLiquidation = {
            volume: distributor.metrics.liquidation.volume + quantitySoldToFarmer,
            value: distributor.metrics.liquidation.value + saleValue
          };

          // Recalculate metrics with new farmer sale
          const recalculatedMetrics = calculateLiquidationMetrics(
            distributor.metrics.openingStock,
            distributor.metrics.ytdNetSales,
            updatedLiquidation
          );

          return {
            ...distributor,
            metrics: recalculatedMetrics
          };
        }
        return distributor;
      })
    );

    // Also update product-level data
    setProductData(prev => 
      prev.map(product => {
        if (product.productId === productId) {
          const updatedSKUs = product.skus.map(sku => {
            if (sku.skuCode === skuCode) {
              return {
                ...sku,
                liquidated: sku.liquidated + quantitySoldToFarmer
              };
            }
            return sku;
          });

          return {
            ...product,
            skus: updatedSKUs
          };
        }
        return product;
      })
    );

    console.log(`🌾 FARMER SALE RECORDED: ${quantitySoldToFarmer} units sold to farmer via retailer ${retailerId} - Distributor ${distributorId} liquidation updated`);
  }, [calculateLiquidationMetrics]);

  // NEW: Get real-time farmer sales tracking
  const getFarmerSalesTracking = useCallback(() => {
    const totalFarmerSales = distributorMetrics.reduce((sum, d) => sum + d.metrics.liquidation.volume, 0);
    const totalFarmerSalesValue = distributorMetrics.reduce((sum, d) => sum + d.metrics.liquidation.value, 0);
    
    return {
      totalFarmerSales,
      totalFarmerSalesValue,
      distributorBreakdown: distributorMetrics.map(d => ({
        distributorId: d.id,
        distributorName: d.distributorName,
        farmerSales: d.metrics.liquidation.volume,
        farmerSalesValue: d.metrics.liquidation.value,
        liquidationRate: d.metrics.liquidationPercentage
      }))
    };
  }, [distributorMetrics]);
  // Validation functions
  const validateMetrics = useCallback((metrics: LiquidationMetrics): boolean => {
    // Business rule validation
    const calculatedBalance = metrics.openingStock.volume + metrics.ytdNetSales.volume - metrics.liquidation.volume;
    const calculatedPercentage = (metrics.openingStock.volume + metrics.ytdNetSales.volume) > 0 
      ? Math.round((metrics.liquidation.volume / (metrics.openingStock.volume + metrics.ytdNetSales.volume)) * 100)
      : 0;

    return Math.abs(calculatedBalance - metrics.balanceStock.volume) < 0.01 &&
           Math.abs(calculatedPercentage - metrics.liquidationPercentage) < 1;
  }, []);

  // Auto-aggregate when distributor metrics change
  useEffect(() => {
    aggregateOverallMetrics();
  }, [distributorMetrics, aggregateOverallMetrics]);

  // Performance metrics calculation
  const getPerformanceMetrics = useCallback(() => {
    const totalDistributors = distributorMetrics.length;
    const activeDistributors = distributorMetrics.filter(d => d.status === 'Active').length;
    const highPriorityDistributors = distributorMetrics.filter(d => d.priority === 'High').length;
    const averageLiquidationRate = distributorMetrics.reduce((sum, d) => sum + d.metrics.liquidationPercentage, 0) / totalDistributors;
    const targetAchievers = distributorMetrics.filter(d => d.metrics.liquidationPercentage >= BUSINESS_RULES.TARGET_LIQUIDATION_PERCENTAGE).length;

    return {
      totalDistributors,
      activeDistributors,
      highPriorityDistributors,
      averageLiquidationRate: Math.round(averageLiquidationRate),
      targetAchievers,
      targetAchievementRate: Math.round((targetAchievers / totalDistributors) * 100)
    };
  }, [distributorMetrics]);

  return {
    // Core data
    overallMetrics,
    distributorMetrics,
    productData,
    
    // Update functions
    updateOverallMetrics,
    updateDistributorMetrics,
    updateProductData,
    recordFarmerSaleFromRetailer,
    
    // Calculation functions
    calculateLiquidationMetrics,
    aggregateOverallMetrics,
    
    // Validation
    validateMetrics,
    
    // Performance metrics
    getPerformanceMetrics,
    getFarmerSalesTracking,
    
    // Business rules
    BUSINESS_RULES
  };
};