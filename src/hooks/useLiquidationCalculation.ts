import { useState, useEffect } from 'react';

interface LiquidationMetrics {
  openingStock: { volume: number; value: number };
  ytdNetSales: { volume: number; value: number };
  liquidation: { volume: number; value: number };
  balanceStock: { volume: number; value: number };
  liquidationPercentage: number;
}

interface DistributorLiquidation {
  id: string;
  distributorName: string;
  distributorCode: string;
  metrics: LiquidationMetrics;
}

export const useLiquidationCalculation = () => {
  const [overallMetrics, setOverallMetrics] = useState<LiquidationMetrics>({
    openingStock: { volume: 32660, value: 190.00 },
    ytdNetSales: { volume: 13303, value: 43.70 },
    liquidation: { volume: 12720, value: 55.52 },
    balanceStock: { volume: 0, value: 0 }, // Will be calculated
    liquidationPercentage: 0 // Will be calculated
  });

  const [distributorMetrics, setDistributorMetrics] = useState<DistributorLiquidation[]>([
    {
      id: 'DIST001',
      distributorName: 'SRI RAMA SEEDS AND PESTICIDES',
      distributorCode: '1325',
      metrics: {
        openingStock: { volume: 40, value: 0.38 },
        ytdNetSales: { volume: 310, value: 1.93 },
        liquidation: { volume: 140, value: 0.93 },
        balanceStock: { volume: 0, value: 0 }, // Will be calculated
        liquidationPercentage: 0 // Will be calculated
      }
    }
  ]);

  // Calculate Balance Stock: Opening Stock + YTD Sales - Liquidation
  const calculateBalanceStock = (opening: number, ytdSales: number, liquidation: number): number => {
    return opening + ytdSales - liquidation;
  };

  // Calculate Liquidation Percentage: Liquidation / (Opening + YTD Net Sales)
  const calculateLiquidationPercentage = (liquidation: number, opening: number, ytdSales: number): number => {
    const denominator = opening + ytdSales;
    if (denominator === 0) return 0;
    return Math.round((liquidation / denominator) * 100);
  };

  // Calculate Value: Volume × Invoice Price (simplified - using average price)
  const calculateValue = (volume: number, category: 'opening' | 'ytd' | 'liquidation' | 'balance'): number => {
    // Average price per Kg/Ltr based on category
    const avgPrices = {
      opening: 5.82, // 190.00L / 32660 Kg
      ytd: 3.28,     // 43.70L / 13303 Kg  
      liquidation: 4.37, // 55.52L / 12720 Kg
      balance: 5.36  // Average of opening and ytd
    };
    
    return (volume * avgPrices[category]) / 1000; // Convert to Lakhs
  };

  // Recalculate all dependent values
  const recalculateMetrics = (metrics: LiquidationMetrics): LiquidationMetrics => {
    // Calculate Balance Stock
    const balanceVolume = calculateBalanceStock(
      metrics.openingStock.volume,
      metrics.ytdNetSales.volume,
      metrics.liquidation.volume
    );
    
    // Calculate Balance Stock Value
    const balanceValue = calculateValue(balanceVolume, 'balance');
    
    // Calculate Liquidation Percentage
    const liquidationPercentage = calculateLiquidationPercentage(
      metrics.liquidation.volume,
      metrics.openingStock.volume,
      metrics.ytdNetSales.volume
    );

    return {
      ...metrics,
      balanceStock: { volume: balanceVolume, value: balanceValue },
      liquidationPercentage
    };
  };

  // Initialize with correct calculations
  useEffect(() => {
    setOverallMetrics(prev => recalculateMetrics(prev));

    setDistributorMetrics(prev => 
      prev.map(distributor => ({
        ...distributor,
        metrics: recalculateMetrics(distributor.metrics)
      }))
    );
  }, []);

  // Update overall metrics with recalculation
  const updateOverallMetrics = (newMetrics: Partial<LiquidationMetrics>) => {
    setOverallMetrics(prev => {
      const merged = { ...prev, ...newMetrics };
      return recalculateMetrics(merged);
    });

    syncToDistributors(newMetrics);
  };

  // Update distributor metrics with recalculation
  const updateDistributorMetrics = (distributorId: string, newMetrics: Partial<LiquidationMetrics>) => {
    setDistributorMetrics(prev => 
      prev.map(distributor => {
        if (distributor.id === distributorId) {
          const merged = { ...distributor.metrics, ...newMetrics };
          return {
            ...distributor,
            metrics: recalculateMetrics(merged)
          };
        }
        return distributor;
      })
    );

    syncToOverall();
  };

  // Sync distributor changes to overall metrics
  const syncToOverall = () => {
    const totalOpeningVolume = distributorMetrics.reduce((sum, d) => sum + d.metrics.openingStock.volume, 0);
    const totalOpeningValue = distributorMetrics.reduce((sum, d) => sum + d.metrics.openingStock.value, 0);
    const totalYtdVolume = distributorMetrics.reduce((sum, d) => sum + d.metrics.ytdNetSales.volume, 0);
    const totalYtdValue = distributorMetrics.reduce((sum, d) => sum + d.metrics.ytdNetSales.value, 0);
    const totalLiquidationVolume = distributorMetrics.reduce((sum, d) => sum + d.metrics.liquidation.volume, 0);
    const totalLiquidationValue = distributorMetrics.reduce((sum, d) => sum + d.metrics.liquidation.value, 0);
    const totalBalanceVolume = distributorMetrics.reduce((sum, d) => sum + d.metrics.balanceStock.volume, 0);
    const totalBalanceValue = distributorMetrics.reduce((sum, d) => sum + d.metrics.balanceStock.value, 0);

    const aggregatedMetrics: LiquidationMetrics = {
      openingStock: { volume: totalOpeningVolume, value: totalOpeningValue },
      ytdNetSales: { volume: totalYtdVolume, value: totalYtdValue },
      liquidation: { volume: totalLiquidationVolume, value: totalLiquidationValue },
      balanceStock: { volume: totalBalanceVolume, value: totalBalanceValue },
      liquidationPercentage: 0
    };

    aggregatedMetrics.liquidationPercentage = calculateLiquidationPercentage(aggregatedMetrics, 'opening');

    setOverallMetrics(aggregatedMetrics);
  };

  // Sync overall changes to distributors (proportional distribution)
  const syncToDistributors = (newMetrics: Partial<LiquidationMetrics>) => {
    if (!newMetrics.ytdNetSales && !newMetrics.liquidation) return;

    setDistributorMetrics(prev => 
      prev.map(distributor => {
        const updatedMetrics = { ...distributor.metrics };
        
        // Proportional update based on current share
        if (newMetrics.ytdNetSales) {
          const currentShare = distributor.metrics.ytdNetSales.volume / overallMetrics.ytdNetSales.volume;
          updatedMetrics.ytdNetSales = {
            volume: Math.round(newMetrics.ytdNetSales.volume * currentShare),
            value: newMetrics.ytdNetSales.value * currentShare
          };
        }
        
        if (newMetrics.liquidation) {
          const currentShare = distributor.metrics.liquidation.volume / overallMetrics.liquidation.volume;
          updatedMetrics.liquidation = {
            volume: Math.round(newMetrics.liquidation.volume * currentShare),
            value: newMetrics.liquidation.value * currentShare
          };
        }
        
        // Recalculate liquidation percentage
        updatedMetrics.liquidationPercentage = calculateLiquidationPercentage(updatedMetrics, 'opening');
        
        return {
          ...distributor,
          metrics: updatedMetrics
        };
      })
    );
  };

  return {
    overallMetrics,
    distributorMetrics,
    updateOverallMetrics,
    updateDistributorMetrics,
    calculateLiquidationPercentage,
    syncToOverall,
    syncToDistributors
  };
};

export { useLiquidationCalculation }