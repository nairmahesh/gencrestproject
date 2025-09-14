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
    balanceStock: { volume: 33243, value: 178.23 },
    liquidationPercentage: 0
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
        balanceStock: { volume: 210, value: 1.38 },
        liquidationPercentage: 0
      }
    }
  ]);

  // Calculate liquidation percentage
  const calculateLiquidationPercentage = (metrics: LiquidationMetrics): number => {
    // Method 1: Liquidation / Opening Stock
    // return Math.round((metrics.liquidation.volume / metrics.openingStock.volume) * 100);
    
    // Method 2: Liquidation / YTD Sales (more common in business)
    if (metrics.ytdNetSales.volume === 0) return 0;
    return Math.round((metrics.liquidation.volume / metrics.ytdNetSales.volume) * 100);
    
    // Method 3: Based on value instead of volume
    // return Math.round((metrics.liquidation.value / metrics.ytdNetSales.value) * 100);
  };

  // Update calculations when metrics change
  useEffect(() => {
    setOverallMetrics(prev => ({
      ...prev,
      liquidationPercentage: calculateLiquidationPercentage(prev)
    }));

    setDistributorMetrics(prev => 
      prev.map(distributor => ({
        ...distributor,
        metrics: {
          ...distributor.metrics,
          liquidationPercentage: calculateLiquidationPercentage(distributor.metrics)
        }
      }))
    );
  }, [overallMetrics.liquidation, overallMetrics.ytdNetSales, overallMetrics.openingStock]);

  // Update overall metrics
  const updateOverallMetrics = (newMetrics: Partial<LiquidationMetrics>) => {
    setOverallMetrics(prev => {
      const updated = { ...prev, ...newMetrics };
      return {
        ...updated,
        liquidationPercentage: calculateLiquidationPercentage(updated)
      };
    });

    // Sync changes to distributor records if needed
    syncToDistributors(newMetrics);
  };

  // Update distributor metrics
  const updateDistributorMetrics = (distributorId: string, newMetrics: Partial<LiquidationMetrics>) => {
    setDistributorMetrics(prev => 
      prev.map(distributor => {
        if (distributor.id === distributorId) {
          const updated = { ...distributor.metrics, ...newMetrics };
          return {
            ...distributor,
            metrics: {
              ...updated,
              liquidationPercentage: calculateLiquidationPercentage(updated)
            }
          };
        }
        return distributor;
      })
    );

    // Sync changes back to overall metrics
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

    setOverallMetrics({
      openingStock: { volume: totalOpeningVolume, value: totalOpeningValue },
      ytdNetSales: { volume: totalYtdVolume, value: totalYtdValue },
      liquidation: { volume: totalLiquidationVolume, value: totalLiquidationValue },
      balanceStock: { volume: totalBalanceVolume, value: totalBalanceValue },
      liquidationPercentage: calculateLiquidationPercentage({
        openingStock: { volume: totalOpeningVolume, value: totalOpeningValue },
        ytdNetSales: { volume: totalYtdVolume, value: totalYtdValue },
        liquidation: { volume: totalLiquidationVolume, value: totalLiquidationValue },
        balanceStock: { volume: totalBalanceVolume, value: totalBalanceValue },
        liquidationPercentage: 0
      })
    });
  };

  // Sync overall changes to distributors (proportional distribution)
  const syncToDistributors = (newMetrics: Partial<LiquidationMetrics>) => {
    // This would implement proportional distribution logic
    // For now, we'll keep distributor data independent
    console.log('Syncing to distributors:', newMetrics);
  };

  return {
    overallMetrics,
    distributorMetrics,
    updateOverallMetrics,
    updateDistributorMetrics,
    calculateLiquidationPercentage
  };
};