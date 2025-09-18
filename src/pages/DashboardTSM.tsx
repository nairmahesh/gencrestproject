/**
 * File: src/pages/DashboardTSM.tsx
 * Author: GSDP INTEGRATION
 *
 * Purpose: This component renders the dashboard for Territory Sales Managers (TSM).
 * It fetches and displays high-level statistics about their team's performance.
 */

import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Clock, CheckCircle, AlertTriangle, PieChart, Users, TrendingUp, Calendar } from 'lucide-react';

interface TsmDashboardStats {
  monthly: {
    planned: number;
    done: number;
    pendingPercent: number;
    completedPercent: number;
  };
  ytd: {
    planned: number;
    done: number;
  };
  regionEffort: { region: string; effort: number }[];
  exceptions: {
    routeDeviation: number;
    missingProof: number;
  };
}

const DashboardTSM: React.FC = () => {
  const [stats, setStats] = useState<TsmDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTsmStats = async () => {
      try {
        setLoading(true);
        const data = await api.getTsmDashboardStats();
        setStats(data);
        setError(null);
      } catch (err) {
        setError("Failed to load TSM dashboard data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTsmStats();
  }, []);

  if (loading) {
    return <div className="text-center p-8">Loading TSM Dashboard...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-600">{error}</div>;
  }

  if (!stats) {
    return <div className="text-center p-8">No dashboard data available.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Monthly and YTD Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Monthly Activity */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-purple-600" />
            This Month's Activities
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <Clock className="mx-auto w-6 h-6 text-blue-500 mb-2" />
              <div className="text-2xl font-bold text-blue-800">{stats.monthly.planned}</div>
              <p className="text-sm text-blue-700">Planned</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <CheckCircle className="mx-auto w-6 h-6 text-green-500 mb-2" />
              <div className="text-2xl font-bold text-green-800">{stats.monthly.done}</div>
              <p className="text-sm text-green-700">Done</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">Completion Rate: <strong>{stats.monthly.completedPercent}%</strong></p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
              <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${stats.monthly.completedPercent}%` }}></div>
            </div>
          </div>
        </div>

        {/* Year-to-Date Activity */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
            Year-to-Date (YTD)
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <Users className="mx-auto w-6 h-6 text-orange-500 mb-2" />
              <div className="text-2xl font-bold text-orange-800">{stats.ytd.planned}</div>
              <p className="text-sm text-orange-700">Total Planned</p>
            </div>
            <div className="bg-teal-50 p-4 rounded-lg text-center">
              <CheckCircle className="mx-auto w-6 h-6 text-teal-500 mb-2" />
              <div className="text-2xl font-bold text-teal-800">{stats.ytd.done}</div>
              <p className="text-sm text-teal-700">Total Done</p>
            </div>
          </div>
        </div>
      </div>

      {/* Region Effort and Exceptions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Region-Wise Effort */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-indigo-600" />
            Region-Wise Effort
          </h3>
          <div className="space-y-3">
            {stats.regionEffort.length > 0 ? (
              stats.regionEffort.map((region, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{region.region}</span>
                    <span className="text-gray-500">{region.effort} Activities</span>
                  </div>
                  {/* Basic progress bar for visual weight */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${(region.effort / Math.max(...stats.regionEffort.map(r => r.effort))) * 100}%` }}></div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No regional data available.</p>
            )}
          </div>
        </div>

        {/* Exceptions */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
            Exceptions
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div>
                <p className="font-medium text-red-800">Route Deviations</p>
                <p className="text-xs text-red-600">Activities logged &gt;5km from plan</p>
              </div>
              <div className="text-2xl font-bold text-red-600">{stats.exceptions.routeDeviation}</div>
            </div>
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <div>
                <p className="font-medium text-yellow-800">Missing Proofs</p>
                <p className="text-xs text-yellow-600">Completed activities without proof</p>
              </div>
              <div className="text-2xl font-bold text-yellow-600">{stats.exceptions.missingProof}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTSM;