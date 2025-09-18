/**
 * File: src/pages/Dashboard.tsx
 * Author: GSDP INTEGRATION
 *
 * Purpose: This component acts as a router to display the correct dashboard
 * based on the authenticated user's role (MDO or TSM).
 */

import React, { useState, useEffect } from 'react';
import { Eye, CheckCircle, Clock, TrendingUp, Target, Droplets } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../auth/AuthContext';
import DashboardTSM from './DashboardTSM'; // Import the new TSM dashboard

// MDO-specific interfaces
interface LiquidationMetrics {
  openingStock: { volume: number; value: number };
  liquidation: { volume: number; value: number };
  balanceStock: { volume: number; value: number };
  liquidationPercentage: number;
}

interface Distributor {
  _id: string;
  name: string;
  code: string;
  openingStock: number;
  currentStock: number;
}

interface MdoSummary {
  total: number;
  done: number;
  planned: number;
  percentCompleted: number;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // States for MDO Dashboard
  const [mdoSummary, setMdoSummary] = useState<MdoSummary | null>(null);
  const [loadingMdoSummary, setLoadingMdoSummary] = useState(true);
  const [overallMetrics, setOverallMetrics] = useState<LiquidationMetrics | null>(null);
  const [loadingLiquidation, setLoadingLiquidation] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    
    // Fetch data only if the user is an MDO
    if (user?.role === 'MDO' || user?.role === 'SO') {
      const fetchMdoData = async () => {
        setLoadingMdoSummary(true);
        setLoadingLiquidation(true);
        try {
          const summaryData = await api.getMdoSummary();
          setMdoSummary(summaryData.summary);

          const { distributors } = await api.getDistributors();
          const totals = distributors.reduce((acc: any, dist: Distributor) => {
            const liquidated = Math.max(0, dist.openingStock - dist.currentStock);
            acc.openingStock += dist.openingStock;
            acc.currentStock += dist.currentStock;
            acc.liquidation += liquidated;
            return acc;
          }, { openingStock: 0, currentStock: 0, liquidation: 0 });

          const liquidationPercentage = totals.openingStock > 0 
            ? Math.round((totals.liquidation / totals.openingStock) * 100) 
            : 0;

          setOverallMetrics({
            openingStock: { volume: totals.openingStock, value: totals.openingStock * 0.005 },
            liquidation: { volume: totals.liquidation, value: totals.liquidation * 0.0005 },
            balanceStock: { volume: totals.currentStock, value: totals.currentStock * 0.004 },
            liquidationPercentage: liquidationPercentage,
          });
        } catch (error) {
          console.error("Error fetching MDO dashboard data:", error);
        } finally {
          setLoadingMdoSummary(false);
          setLoadingLiquidation(false);
        }
      };
      fetchMdoData();
    }
    
    return () => clearInterval(timer);
  }, [user]);

  const renderMdoDashboard = () => (
    <>
      {/* MDO Monthly Activity Summary */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Monthly Activity Summary</h3>
        {loadingMdoSummary ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
            {[...Array(4)].map((_, i) => <div key={i} className="bg-gray-200 h-24 rounded-lg"></div>)}
          </div>
        ) : mdoSummary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <Clock className="mx-auto w-6 h-6 text-blue-500 mb-2" />
              <div className="text-2xl font-bold text-blue-800">{mdoSummary.planned}</div>
              <p className="text-sm text-blue-700">Planned</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <CheckCircle className="mx-auto w-6 h-6 text-green-500 mb-2" />
              <div className="text-2xl font-bold text-green-800">{mdoSummary.done}</div>
              <p className="text-sm text-green-700">Done</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg text-center">
              <TrendingUp className="mx-auto w-6 h-6 text-yellow-500 mb-2" />
              <div className="text-2xl font-bold text-yellow-800">{mdoSummary.percentCompleted}%</div>
              <p className="text-sm text-yellow-700">% Completed</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <Target className="mx-auto w-6 h-6 text-orange-500 mb-2" />
              <div className="text-2xl font-bold text-orange-800">{mdoSummary.total}</div>
              <p className="text-sm text-orange-700">Total Activities</p>
            </div>
          </div>
        )}
      </div>

      {/* Stock Liquidation Overview */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Stock Liquidation Overview</h3>
            <p className="text-sm text-gray-600 mt-1">Aggregated from your assigned distributors</p>
          </div>
          <button
            onClick={() => navigate('/liquidation')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Distributors
          </button>
        </div>
        {loadingLiquidation ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
            {[...Array(4)].map((_, i) => (<div key={i} className="bg-gray-200 rounded-xl h-48"></div>))}
          </div>
        ) : overallMetrics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-orange-50 rounded-xl p-4 border-l-4 border-orange-500">
              <h4 className="font-semibold text-gray-700 mb-2">Opening Stock</h4>
              <div className="text-2xl font-bold text-gray-900">{overallMetrics.openingStock.volume.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Kg/Litre</div>
              <div className="text-sm text-gray-600 mt-2 font-medium">Value: ₹{overallMetrics.openingStock.value.toFixed(2)}L</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4 border-l-4 border-green-500">
              <h4 className="font-semibold text-gray-700 mb-2">Liquidation</h4>
              <div className="text-2xl font-bold text-gray-900">{overallMetrics.liquidation.volume.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Kg/Litre</div>
              <div className="text-sm text-gray-600 mt-2 font-medium">Value: ₹{overallMetrics.liquidation.value.toFixed(2)}L</div>
            </div>
             <div className="bg-indigo-50 rounded-xl p-4 border-l-4 border-indigo-500">
              <h4 className="font-semibold text-gray-700 mb-2">Balance Stock</h4>
              <div className="text-2xl font-bold text-gray-900">{overallMetrics.balanceStock.volume.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Kg/Litre</div>
              <div className="text-sm text-gray-600 mt-2 font-medium">Value: ₹{overallMetrics.balanceStock.value.toFixed(2)}L</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 border-l-4 border-purple-500">
              <h4 className="font-semibold text-gray-700 mb-2">Liquidation Rate</h4>
              <div className="text-3xl font-bold text-purple-700">{overallMetrics.liquidationPercentage}%</div>
              <div className="text-sm text-gray-500">Based on Opening Stock</div>
            </div>
          </div>
        )}
      </div>
    </>
  );

  const renderDashboardByRole = () => {
    switch (user?.role) {
      case 'TSM':
      case 'RMM':
      case 'ZBH':
      case 'ADMIN':
        return <DashboardTSM />;
      case 'MDO':
      case 'SO':
        return renderMdoDashboard();
      default:
        return <div>Loading user role...</div>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="gradient-bg rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Good Morning, {user?.name || 'User'}!</h1>
            <p className="text-white/90">
              {currentTime.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{mdoSummary?.total || '...'}</div>
            <div className="text-white/90 text-sm">Activities this month</div>
          </div>
        </div>
      </div>
      
      {renderDashboardByRole()}
    </div>
  );
};

export default Dashboard;