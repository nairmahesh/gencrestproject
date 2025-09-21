import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LiveMeetings from './LiveMeetings';
import { 
  Users, 
  Target, 
  Calendar, 
  MapPin, 
  AlertTriangle,
  TrendingUp,
  CheckCircle,
  Clock,
  Award,
  BarChart3,
  PieChart,
  ArrowUp,
  ArrowDown,
  Eye,
  Filter,
  Search,
  ChevronRight,
  User,
  Building,
  Activity,
  Crown,
  Shield,
  ArrowLeft
} from 'lucide-react';

interface RegionalStats {
  totalRBHs: number;
  totalTSMs: number;
  totalMDOs: number;
  ytdActivities: {
    planned: number;
    done: number;
    percentage: number;
  };
  monthlyActivities: {
    planned: number;
    done: number;
    pending: number;
  };
  marketingCampaigns: {
    active: number;
    completed: number;
    budget: number;
    spent: number;
  };
  averagePerformance: number;
  totalExceptions: number;
}

interface RBHUnderRMM {
  id: string;
  name: string;
  employeeCode: string;
  region: string;
  tsmCount: number;
  mdoCount: number;
  performance: number;
  ytdActivities: {
    planned: number;
    done: number;
    percentage: number;
  };
  exceptions: number;
  marketingBudget: number;
  marketingSpent: number;
}

const RMMDashboard: React.FC = () => {
  const { user } = useAuth();
  const [selectedView, setSelectedView] = useState<'overview' | 'rbh-details' | 'marketing'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [liveMeetings, setLiveMeetings] = useState([
    {
      id: 'LM001',
      participantName: 'Amit Patel',
      participantRole: 'RBH',
      location: 'Regional Conference Room',
      address: 'Delhi NCR Regional Office',
      startTime: '11:00 AM',
      duration: 60,
      status: 'active' as const,
      type: 'Meeting' as const,
      phone: '+91 76543 21098',
      notes: 'Quarterly business review with RBH team'
    }
  ]);

  // Sample RBH data under RMM
  const rbhStats: RBHUnderRMM[] = [
    {
      id: 'RBH001',
      name: 'Amit Patel',
      employeeCode: 'RBH001',
      region: 'Delhi NCR',
      tsmCount: 2,
      mdoCount: 5,
      performance: 87,
      ytdActivities: {
        planned: 480,
        done: 408,
        percentage: 85
      },
      exceptions: 5,
      marketingBudget: 500000,
      marketingSpent: 425000
    },
    {
      id: 'RBH002',
      name: 'Kavita Singh',
      employeeCode: 'RBH002',
      region: 'Punjab',
      tsmCount: 3,
      mdoCount: 8,
      performance: 91,
      ytdActivities: {
        planned: 720,
        done: 648,
        percentage: 90
      },
      exceptions: 2,
      marketingBudget: 750000,
      marketingSpent: 680000
    }
  ];

  // Aggregate regional stats
  const regionalStats: RegionalStats = {
    totalRBHs: rbhStats.length,
    totalTSMs: rbhStats.reduce((sum, rbh) => sum + rbh.tsmCount, 0),
    totalMDOs: rbhStats.reduce((sum, rbh) => sum + rbh.mdoCount, 0),
    ytdActivities: {
      planned: rbhStats.reduce((sum, rbh) => sum + rbh.ytdActivities.planned, 0),
      done: rbhStats.reduce((sum, rbh) => sum + rbh.ytdActivities.done, 0),
      percentage: Math.round((rbhStats.reduce((sum, rbh) => sum + rbh.ytdActivities.done, 0) / rbhStats.reduce((sum, rbh) => sum + rbh.ytdActivities.planned, 0)) * 100)
    },
    monthlyActivities: {
      planned: 40,
      done: 36,
      pending: 4
    },
    marketingCampaigns: {
      active: 5,
      completed: 12,
      budget: rbhStats.reduce((sum, rbh) => sum + rbh.marketingBudget, 0),
      spent: rbhStats.reduce((sum, rbh) => sum + rbh.marketingSpent, 0)
    },
    averagePerformance: Math.round(rbhStats.reduce((sum, rbh) => sum + rbh.performance, 0) / rbhStats.length),
    totalExceptions: rbhStats.reduce((sum, rbh) => sum + rbh.exceptions, 0)
  };

  const handleEndMeeting = (meetingId: string) => {
    setLiveMeetings(prev => prev.filter(meeting => meeting.id !== meetingId));
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Regional Marketing Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Regional Performance</h3>
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-800">{regionalStats.ytdActivities.percentage}%</div>
              <div className="text-sm text-orange-600">YTD Achievement</div>
              <div className="text-xs text-gray-500 mt-1">{regionalStats.ytdActivities.done}/{regionalStats.ytdActivities.planned}</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-800">{regionalStats.averagePerformance}%</div>
              <div className="text-sm text-blue-600">Avg Performance</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Marketing Budget</h3>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Target className="w-5 h-5 text-green-600" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-800">₹{(regionalStats.marketingCampaigns.budget / 100000).toFixed(1)}L</div>
              <div className="text-sm text-green-600">Total Budget</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-800">₹{(regionalStats.marketingCampaigns.spent / 100000).toFixed(1)}L</div>
              <div className="text-sm text-purple-600">Spent</div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Meetings */}
      <LiveMeetings 
        meetings={liveMeetings}
        onEndMeeting={handleEndMeeting}
        userRole="RMM"
      />

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 card-shadow text-center">
          <div className="text-2xl font-bold text-orange-600">{regionalStats.totalRBHs}</div>
          <div className="text-sm text-gray-600">RBHs</div>
        </div>
        <div className="bg-white rounded-xl p-4 card-shadow text-center">
          <div className="text-2xl font-bold text-green-600">{regionalStats.totalTSMs}</div>
          <div className="text-sm text-gray-600">TSMs</div>
        </div>
        <div className="bg-white rounded-xl p-4 card-shadow text-center">
          <div className="text-2xl font-bold text-blue-600">{regionalStats.totalMDOs}</div>
          <div className="text-sm text-gray-600">MDOs</div>
        </div>
        <div className="bg-white rounded-xl p-4 card-shadow text-center">
          <div className="text-2xl font-bold text-red-600">{regionalStats.totalExceptions}</div>
          <div className="text-sm text-gray-600">Exceptions</div>
        </div>
      </div>

      {/* Marketing Campaigns */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Marketing Campaigns</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-800">{regionalStats.marketingCampaigns.active}</div>
            <div className="text-sm text-blue-600">Active Campaigns</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-800">{regionalStats.marketingCampaigns.completed}</div>
            <div className="text-sm text-green-600">Completed</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-800">{Math.round((regionalStats.marketingCampaigns.spent / regionalStats.marketingCampaigns.budget) * 100)}%</div>
            <div className="text-sm text-purple-600">Budget Utilized</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRBHDetails = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        {rbhStats.map((rbh) => (
          <div key={rbh.id} className="bg-white rounded-xl p-6 card-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Building className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{rbh.name}</h3>
                  <p className="text-gray-600">{rbh.employeeCode} • {rbh.region}</p>
                  <p className="text-sm text-gray-500">{rbh.tsmCount} TSMs, {rbh.mdoCount} MDOs</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {rbh.exceptions > 0 && (
                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                    {rbh.exceptions} Exception{rbh.exceptions !== 1 ? 's' : ''}
                  </span>
                )}
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  rbh.performance >= 90 ? 'bg-green-100 text-green-800' :
                  rbh.performance >= 80 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {rbh.performance}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-orange-50 rounded-lg p-4">
                <h4 className="font-semibold text-orange-800 mb-3">Activities</h4>
                <div className="text-center">
                  <div className="text-xl font-bold text-orange-900">{rbh.ytdActivities.done}</div>
                  <div className="text-xs text-orange-600">YTD Completed</div>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-orange-200 rounded-full h-2">
                    <div 
                      className="bg-orange-600 h-2 rounded-full" 
                      style={{ width: `${rbh.ytdActivities.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-3">Team Structure</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-900">{rbh.tsmCount}</div>
                    <div className="text-xs text-green-600">TSMs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-900">{rbh.mdoCount}</div>
                    <div className="text-xs text-green-600">MDOs</div>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-semibold text-purple-800 mb-3">Marketing Budget</h4>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-900">₹{(rbh.marketingSpent / 100000).toFixed(1)}L</div>
                  <div className="text-xs text-purple-600">Spent</div>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-purple-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: `${(rbh.marketingSpent / rbh.marketingBudget) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button className="bg-orange-100 text-orange-700 px-4 py-2 rounded-lg hover:bg-orange-200 transition-colors flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                View TSM Details
              </button>
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                Marketing Report
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMarketing = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 card-shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Marketing Campaign Management</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-800">{regionalStats.marketingCampaigns.active}</div>
            <div className="text-sm text-blue-600">Active Campaigns</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-800">{regionalStats.marketingCampaigns.completed}</div>
            <div className="text-sm text-green-600">Completed</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-800">₹{(regionalStats.marketingCampaigns.spent / 100000).toFixed(1)}L</div>
            <div className="text-sm text-purple-600">Total Spent</div>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { name: 'Farmer Meet Campaign - Delhi', budget: 200000, spent: 180000, status: 'Active', region: 'Delhi NCR' },
            { name: 'Product Demo Series - Punjab', budget: 300000, spent: 285000, status: 'Completed', region: 'Punjab' },
            { name: 'Digital Marketing Push', budget: 150000, spent: 120000, status: 'Active', region: 'Multi-Region' }
          ].map((campaign, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                  <p className="text-sm text-gray-600">{campaign.region}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  campaign.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {campaign.status}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Budget: ₹{(campaign.budget / 100000).toFixed(1)}L</span>
                <span>Spent: ₹{(campaign.spent / 100000).toFixed(1)}L ({Math.round((campaign.spent / campaign.budget) * 100)}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="gradient-bg rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">RMM Dashboard - {user?.name}</h1>
            <p className="text-white/90">Regional Marketing Manager</p>
            <p className="text-white/80 text-sm mt-1">{user?.region || 'North Region'}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{regionalStats.marketingCampaigns.active}</div>
            <div className="text-white/90 text-sm">Active Campaigns</div>
            <div className="text-white/80 text-xs mt-1">
              ₹{(regionalStats.marketingCampaigns.spent / 100000).toFixed(1)}L Spent
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl p-2 card-shadow">
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedView('overview')}
            className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
              selectedView === 'overview'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Regional Overview
          </button>
          <button
            onClick={() => setSelectedView('rbh-details')}
            className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
              selectedView === 'rbh-details'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            RBH Details
          </button>
          <button
            onClick={() => setSelectedView('marketing')}
            className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
              selectedView === 'marketing'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Marketing
          </button>
        </div>
      </div>

      {/* Content */}
      {selectedView === 'overview' && renderOverview()}
      {selectedView === 'rbh-details' && renderRBHDetails()}
      {selectedView === 'marketing' && renderMarketing()}
    </div>
  );
};

export default RMMDashboard;