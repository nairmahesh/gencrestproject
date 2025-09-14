import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Target, Award, Calendar, Users, DollarSign, ArrowLeft } from 'lucide-react';

interface PerformanceMetric {
  id: string;
  title: string;
  current: number;
  target: number;
  unit: string;
  period: string;
  trend: 'up' | 'down' | 'stable';
  percentage: number;
}

interface Incentive {
  id: string;
  title: string;
  amount: number;
  status: 'Earned' | 'Pending' | 'Paid';
  period: string;
  criteria: string;
}

const Performance: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('Monthly');

  const metrics: PerformanceMetric[] = [
    {
      id: '1',
      title: 'Visits Completed',
      current: 87,
      target: 100,
      unit: 'visits',
      period: 'This Month',
      trend: 'up',
      percentage: 87
    },
    {
      id: '2',
      title: 'Sales Volume',
      current: 450000,
      target: 500000,
      unit: 'INR',
      period: 'This Month',
      trend: 'up',
      percentage: 90
    },
    {
      id: '3',
      title: 'New Customers',
      current: 12,
      target: 15,
      unit: 'customers',
      period: 'This Month',
      trend: 'stable',
      percentage: 80
    },
    {
      id: '4',
      title: 'Liquidation Rate',
      current: 75,
      target: 80,
      unit: '%',
      period: 'This Month',
      trend: 'up',
      percentage: 94
    }
  ];

  const incentives: Incentive[] = [
    {
      id: '1',
      title: 'Monthly Sales Target',
      amount: 15000,
      status: 'Earned',
      period: 'January 2024',
      criteria: 'Achieved 90% of monthly sales target'
    },
    {
      id: '2',
      title: 'Customer Acquisition Bonus',
      amount: 8000,
      status: 'Pending',
      period: 'January 2024',
      criteria: 'Added 12 new customers this month'
    },
    {
      id: '3',
      title: 'Liquidation Excellence',
      amount: 5000,
      status: 'Paid',
      period: 'December 2023',
      criteria: 'Achieved 95% liquidation rate'
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingUp className="w-4 h-4 text-red-600 transform rotate-180" />;
      default:
        return <TrendingUp className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Earned':
        return 'text-green-700 bg-green-100';
      case 'Pending':
        return 'text-yellow-700 bg-yellow-100';
      case 'Paid':
        return 'text-blue-700 bg-blue-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const totalIncentives = incentives.reduce((sum, incentive) => sum + incentive.amount, 0);
  const earnedIncentives = incentives.filter(i => i.status === 'Earned' || i.status === 'Paid').reduce((sum, incentive) => sum + incentive.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Performance & Incentives</h1>
            <p className="text-gray-600 mt-1">Track your performance metrics and earned incentives</p>
          </div>
        </div>
        <div className="mt-4 sm:mt-0">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="Quarterly">Quarterly</option>
            <option value="Yearly">Yearly</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overall Performance</p>
              <p className="text-2xl font-bold text-gray-900">88%</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Incentives</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalIncentives.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Earned This Month</p>
              <p className="text-2xl font-bold text-gray-900">₹{earnedIncentives.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Award className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {metrics.map((metric) => (
            <div key={metric.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">{metric.title}</h3>
                <div className="flex items-center space-x-1">
                  {getTrendIcon(metric.trend)}
                  <span className={`text-sm ${getTrendColor(metric.trend)}`}>
                    {metric.percentage}%
                  </span>
                </div>
              </div>
              
              <div className="mb-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>
                    {metric.unit === 'INR' 
                      ? `₹${metric.current.toLocaleString()}` 
                      : `${metric.current} ${metric.unit}`
                    }
                  </span>
                  <span>
                    Target: {metric.unit === 'INR' 
                      ? `₹${metric.target.toLocaleString()}` 
                      : `${metric.target} ${metric.unit}`
                    }
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${Math.min(metric.percentage, 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <p className="text-xs text-gray-500">{metric.period}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Incentives */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Incentives & Rewards</h2>
        <div className="space-y-4">
          {incentives.map((incentive) => (
            <div key={incentive.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{incentive.title}</h3>
                    <p className="text-sm text-gray-600">{incentive.period}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">₹{incentive.amount.toLocaleString()}</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(incentive.status)}`}>
                    {incentive.status}
                  </span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 ml-13">{incentive.criteria}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Trend</h2>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Performance chart will be displayed here</p>
            <p className="text-sm text-gray-400">Integration with analytics dashboard</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Performance;