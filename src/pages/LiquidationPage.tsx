import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DashboardLayout from '../layouts/DashboradLayout';
import DistributorListPage from './DistributorListPage';
import type { AppDispatch, RootState } from '../store/store';
import { fetchMdoData } from '../store/mdoSlice';
import StatCard from '../components/ui/StatCard';
import { LoaderCircle } from 'lucide-react';

const LiquidationPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { liquidationSummary, status } = useSelector((state: RootState) => state.mdo);

  useEffect(() => {
    if (!liquidationSummary) {
      dispatch(fetchMdoData());
    }
  }, [dispatch, liquidationSummary]);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">MDO Liquidation Summary</h1>
      
      {status === 'loading' && !liquidationSummary && <div className="flex justify-center py-12"><LoaderCircle className="animate-spin h-8 w-8" /></div>}

      {liquidationSummary && (
        <div className="mb-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                <StatCard title="Opening Stock" period="As of 1st April 2025" vol={liquidationSummary.openingStock.vol} value={liquidationSummary.openingStock.value} />
                <StatCard title="YTD Net Sales" period="April - Aug, 2025" vol={liquidationSummary.ytdNetSales.vol} value={liquidationSummary.ytdNetSales.value} />
                <StatCard title="Liquidation" period="As of Aug (YTD)" vol={liquidationSummary.liquidation.vol} value={liquidationSummary.liquidation.value} />
                <StatCard title="Balance Stock" vol={liquidationSummary.balanceStock.vol} value={liquidationSummary.balanceStock.value} />
                <StatCard title="% Liquidation" value={liquidationSummary.percentLiquidation} isPercentage />
            </div>
        </div>
      )}
      
      <DistributorListPage />
    </DashboardLayout>
  );
};

export default LiquidationPage;