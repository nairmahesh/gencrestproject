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
  Shield
} from 'lucide-react';

interface MDOStats {
  id: string;
  name: string;
  employeeCode: string;
  territory: string;
  ytdActivities: {
    planned: number;
    done: number;
    percentage: number;
  };
  monthlyActivities: {
    planned: number;
    done: number;
    pending: number;
    pendingPercentage: number;
    completedPercentage: number;
  };
  performance: number;
  exceptions: number;
  lastVisit: string;
  status: 'Active' | 'Inactive';
}

const TSMDashboard: React.FC = () => {
  const { user } = useAuth();
  const [selectedView, setSelectedView] = useState<'overview' | 'mdo-details'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [liveMeetings, setLiveMeetings] = useState([
    {
      id: 'LM001',
      participantName: 'Rajesh Kumar',
      participantRole: 'MDO',
      location: 'Ram Kumar Farm',
      address: 'Green Valley, Sector 12',
      startTime: '10:45 AM',
      duration: 25,
      status: 'active' as const,
      type: 'Visit' as const,
      phone: '+91 98765 43210',
      notes: 'Product demonstration in progress'
    },
    {
      id: 'LM002',
      participantName: 'Amit Singh',
      participantRole: 'MDO',
      location: 'Suresh Traders',
      address: 'Market Area, Sector 8',
      startTime: '11:20 AM',
      duration: 15,
      status: 'active' as const,
      type: 'Demo' as const,
      phone: '+91 87654 32109',
      notes: 'Stock review and liquidation discussion'
    }
  ]);

  // Sample MDO data under TSM
  const mdoStats: MDOStats[] = [
    {
      id: 'MDO001',
      name: 'Rajesh Kumar',
      employeeCode: 'MDO001',
      territory: 'North Delhi',
      ytdActivities: {
        planned: 240,
        done: 216,
        percentage: 90
      },
      monthlyActivities: {
        planned: 20,
        done: 18,
        pending: 2,
        pendingPercentage: 10,
        completedPercentage: 90
      },
      performance: 88,
      exceptions: 2,
      lastVisit: '2024-01-20',
      status: 'Active'
    },
    {
      id: 'MDO002',
      name: 'Amit Singh',
      employeeCode: 'MDO002',
      territory: 'South Delhi',
      ytdActivities: {
        planned: 240,
        done: 192,
        percentage: 80
      },
      monthlyActivities: {
        planned: 20,
        done: 16,
        pending: 4,
        pendingPercentage: 20,
        completedPercentage: 80
      },
      performance: 85,
      exceptions: 1,
      lastVisit: '2024-01-19',
      status: 'Active'
    },
    {
      id: 'MDO003',
      name: 'Priya Verma',
      employeeCode: 'MDO003',
      territory: 'East Delhi',
      ytdActivities: {
        planned: 240,
        done: 228,
        percentage: 95
      },
      monthlyActivities: {
        planned: 20,
        done: 19,
        pending: 1,
        pendingPercentage: 5,
        completedPercentage: 95
      },
      performance: 94,
      exceptions: 0,
      lastVisit: '2024-01-21',
      status: 'Active'
    }
  ];

  // Aggregate team stats
  const teamAggregates = {
    totalMDOs: mdoStats.length,
    ytdActivities: {
      planned: mdoStats.reduce((sum, mdo) => sum + mdo.ytdActivities.planned, 0),
      done: mdoStats.reduce((sum, mdo) => sum + mdo.ytdActivities.done, 0),
      percentage: Math.round((mdoStats.reduce((sum, mdo) => sum + mdo.ytdActivities.done, 0) / mdoStats.reduce((sum, mdo) => sum + mdo.ytdActivities.planned, 0)) * 100)
    },
    monthlyActivities: {
      planned: mdoStats.reduce((sum, mdo) => sum + mdo.monthlyActivities.planned, 0),
      done: mdoStats.reduce((sum, mdo) => sum + mdo.monthlyActivities.done, 0),
      pending: mdoStats.reduce((sum, mdo) => sum + mdo.monthlyActivities.pending, 0)
    },
    totalExceptions: mdoStats.reduce((sum, mdo) => sum + mdo.exceptions, 0),
    averagePerformance: Math.round(mdoStats.reduce((sum, mdo) => sum + mdo.performance, 0) / mdoStats.length)
  };

  const handleEndMeeting = (meetingId: string) => {
    setLiveMeetings(prev => prev.filter(meeting => meeting.id !== meetingId));
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Team Performance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Team Performance</h3>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-800">{teamAggregates.ytdActivities.percentage}%</div>
              <div className="text-sm text-green-600">YTD Achievement</div>
              <div className="text-xs text-gray-500 mt-1">{teamAggregates.ytdActivities.done}/{teamAggregates.ytdActivities.planned}</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-800">{Math.round((teamAggregates.monthlyActivities.done / teamAggregates.monthlyActivities.planned) * 100)}%</div>
              <div className="text-sm text-blue-600">Monthly Progress</div>
              <div className="text-xs text-gray-500 mt-1">{teamAggregates.monthlyActivities.done}/{teamAggregates.monthlyActivities.planned}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Team Structure</h3>
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Building className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-800">{teamAggregates.totalMDOs}</div>
              <div className="text-sm text-purple-600">MDOs</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-800">{teamAggregates.averagePerformance}%</div>
              <div className="text-sm text-orange-600">Avg Performance</div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 card-shadow text-center">
          <div className="text-2xl font-bold text-green-600">{mdoStats.filter(mdo => mdo.performance >= 90).length}</div>
          <div className="text-sm text-gray-600">Top Performers</div>
        </div>
        <div className="bg-white rounded-xl p-4 card-shadow text-center">
          <div className="text-2xl font-bold text-yellow-600">{mdoStats.filter(mdo => mdo.performance >= 80 && mdo.performance < 90).length}</div>
          <div className="text-sm text-gray-600">Good Performers</div>
        </div>
        <div className="bg-white rounded-xl p-4 card-shadow text-center">
          <div className="text-2xl font-bold text-red-600">{teamAggregates.totalExceptions}</div>
          <div className="text-sm text-gray-600">Active Exceptions</div>
        </div>
        <div className="bg-white rounded-xl p-4 card-shadow text-center">
          <div className="text-2xl font-bold text-blue-600">{teamAggregates.monthlyActivities.pending}</div>
          <div className="text-sm text-gray-600">Pending Activities</div>
        </div>
      </div>
    </div>
  );

  const renderMDODetails = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        {mdoStats.map((mdo) => (
          <div key={mdo.id} className="bg-white rounded-xl p-6 card-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{mdo.name}</h3>
                  <p className="text-gray-600">{mdo.employeeCode} • {mdo.territory}</p>
                  <p className="text-sm text-gray-500">Last visit: {new Date(mdo.lastVisit).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {mdo.exceptions > 0 && (
                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                    {mdo.exceptions} Exception{mdo.exceptions !== 1 ? 's' : ''}
                  </span>
                )}
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  mdo.performance >= 90 ? 'bg-green-100 text-green-800' :
                  mdo.performance >= 80 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {mdo.performance}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-3">YTD Activities</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-900">{mdo.ytdActivities.done}</div>
                    <div className="text-xs text-blue-600">Done</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-900">{mdo.ytdActivities.planned}</div>
                    <div className="text-xs text-blue-600">Planned</div>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-blue-600 mb-1">
                    <span>Progress</span>
                    <span>{mdo.ytdActivities.percentage}%</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${mdo.ytdActivities.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-3">Monthly Activities</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-900">{mdo.monthlyActivities.done}</div>
                    <div className="text-xs text-green-600">Done</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-800">{mdo.monthlyActivities.pending}</div>
                    <div className="text-xs text-orange-600">Pending</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-800">{mdo.monthlyActivities.planned}</div>
                    <div className="text-xs text-gray-600">Planned</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </button>
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                Performance Report
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="gradient-bg rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">TSM Dashboard - {user?.name}</h1>
            <p className="text-white/90">Territory Sales Manager</p>
            <p className="text-white/80 text-sm mt-1">{user?.territory || 'Delhi Territory'}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{teamAggregates.monthlyActivities.done}</div>
            <div className="text-white/90 text-sm">Team Activities</div>
            <div className="text-white/80 text-xs mt-1">
              {teamAggregates.monthlyActivities.pending} Pending
            </div>
          </div>
        </div>
      </div>

      {/* Live Meetings */}
      <LiveMeetings 
        meetings={liveMeetings}
        onEndMeeting={handleEndMeeting}
        userRole="TSM"
      />

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
            Team Overview
          </button>
          <button
            onClick={() => setSelectedView('mdo-details')}
            className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
              selectedView === 'mdo-details'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            MDO Details
          </button>
        </div>
      </div>

      {/* Content */}
      {selectedView === 'overview' ? renderOverview() : renderMDODetails()}
    </div>
  );

  const handleEndMeeting = (meetingId: string) => {
    setLiveMeetings(prev => prev.filter(meeting => meeting.id !== meetingId));
  };
};

export default TSMDashboard;