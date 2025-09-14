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
    liquidationPercentage: 28
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
        liquidationPercentage: 40
      }
    }
  ]);

  // Calculate liquidation percentage using different methods
  const calculateLiquidationPercentage = (metrics: LiquidationMetrics, method: 'opening' | 'ytd' | 'custom' = 'opening'): number => {
    switch (method) {
      case 'opening':
        // Method 1: Liquidation / Opening Stock
        return Math.round((metrics.liquidation.volume / metrics.openingStock.volume) * 100);
      
      case 'ytd':
        // Method 2: Liquidation / YTD Sales
        if (metrics.ytdNetSales.volume === 0) return 0;
        return Math.round((metrics.liquidation.volume / metrics.ytdNetSales.volume) * 100);
      
      case 'custom':
        // Method 3: Custom business logic (maintaining current 28%)
        return 28;
      
      default:
        return Math.round((metrics.liquidation.volume / metrics.openingStock.volume) * 100);
    }
  };

  // Helper function to recalculate all metrics
  const recalculateMetrics = (metrics: LiquidationMetrics): LiquidationMetrics => {
    const balanceStock = {
      volume: metrics.openingStock.volume + metrics.ytdNetSales.volume - metrics.liquidation.volume,
      value: metrics.openingStock.value + metrics.ytdNetSales.value - metrics.liquidation.value
    };
    
    const liquidationPercentage = calculateLiquidationPercentage(metrics, 'opening');
    
    return {
      ...metrics,
      balanceStock,
      liquidationPercentage
    };
  };

  // Update calculations when metrics change
  useEffect(() => {
    setOverallMetrics(prev => recalculateMetrics(prev));

    setDistributorMetrics(prev => 
      prev.map(distributor => ({
        ...distributor,
        metrics: recalculateMetrics(distributor.metrics)
      }))
    );
  }, []);

  // Update overall metrics with dynamic calculation
  const updateOverallMetrics = (newMetrics: Partial<LiquidationMetrics>) => {
    setOverallMetrics(prev => {
      const updated = { ...prev, ...newMetrics };
      return recalculateMetrics(updated);
    });

    // Sync changes to distributor records proportionally
    syncToDistributors(newMetrics);
  };

  // Update distributor metrics with dynamic calculation
  const updateDistributorMetrics = (distributorId: string, newMetrics: Partial<LiquidationMetrics>) => {
    setDistributorMetrics(prev => 
      prev.map(distributor => {
        if (distributor.id === distributorId) {
          const updated = { ...distributor.metrics, ...newMetrics };
          return {
            ...distributor,
            metrics: recalculateMetrics(updated)
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

    const aggregatedMetrics: LiquidationMetrics = {
      openingStock: { volume: totalOpeningVolume, value: totalOpeningValue },
      ytdNetSales: { volume: totalYtdVolume, value: totalYtdValue },
      liquidation: { volume: totalLiquidationVolume, value: totalLiquidationValue },
      balanceStock: { volume: totalBalanceVolume, value: totalBalanceValue },
      liquidationPercentage: 0
    };

    aggregatedMetrics.liquidationPercentage = calculateLiquidationPercentage(aggregatedMetrics, 'opening');

    setOverallMetrics(recalculateMetrics(aggregatedMetrics));
  };

  // Sync overall changes to distributors
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
        const recalculated = recalculateMetrics(updatedMetrics);
        
        return {
          ...distributor,
          metrics: recalculated
        };
      })
    );
  };

  return {
    overallMetrics,
    distributorMetrics,
    updateOverallMetrics,
    updateDistributorMetrics,
    syncToOverall,
    syncToDistributors
  };
};


export { useLiquidationCalculation }