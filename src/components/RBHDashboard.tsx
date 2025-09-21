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

interface TSMStats {
  id: string;
  name: string;
  employeeCode: string;
  territory: string;
  mdoCount: number;
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
  teamPerformance: {
    averageScore: number;
    topPerformers: number;
    needsAttention: number;
  };
  exceptions: number;
  mdos: MDOUnderTSM[];
}

interface MDOUnderTSM {
  id: string;
  name: string;
  employeeCode: string;
  territory: string;
  performance: number;
  activitiesCompleted: number;
  activitiesPlanned: number;
  exceptions: number;
  status: 'Active' | 'Inactive';
}

const RBHDashboard: React.FC = () => {
  const { user } = useAuth();
  const [selectedView, setSelectedView] = useState<'overview' | 'tsm-details' | 'mdo-drill'>('overview');
  const [selectedTSM, setSelectedTSM] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [liveMeetings, setLiveMeetings] = useState([
    {
      id: 'LM001',
      participantName: 'Priya Sharma',
      participantRole: 'TSM',
      location: 'Regional Office',
      address: 'Delhi NCR Office',
      startTime: '2:30 PM',
      duration: 45,
      status: 'active' as const,
      type: 'Meeting' as const,
      phone: '+91 87654 32109',
      notes: 'Monthly review meeting with TSM team'
    },
    {
      id: 'LM002',
      participantName: 'Vikram Patel',
      participantRole: 'TSM',
      location: 'Gurgaon Office',
      address: 'Gurgaon Territory Office',
      startTime: '3:15 PM',
      duration: 30,
      status: 'active' as const,
      type: 'Training' as const,
      phone: '+91 76543 21098',
      notes: 'Product training session'
    }
  ]);

  // Sample TSM data under RBH
  const tsmStats: TSMStats[] = [
    {
      id: 'TSM001',
      name: 'Priya Sharma',
      employeeCode: 'TSM001',
      territory: 'Delhi Territory',
      mdoCount: 3,
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
      teamPerformance: {
        averageScore: 87,
        topPerformers: 2,
        needsAttention: 1
      },
      exceptions: 3,
      mdos: [
        {
          id: 'MDO001',
          name: 'Rajesh Kumar',
          employeeCode: 'MDO001',
          territory: 'North Delhi',
          performance: 88,
          activitiesCompleted: 38,
          activitiesPlanned: 45,
          exceptions: 2,
          status: 'Active'
        },
        {
          id: 'MDO002',
          name: 'Amit Singh',
          employeeCode: 'MDO002',
          territory: 'South Delhi',
          performance: 85,
          activitiesCompleted: 36,
          activitiesPlanned: 45,
          exceptions: 1,
          status: 'Active'
        },
        {
          id: 'MDO003',
          name: 'Priya Verma',
          employeeCode: 'MDO003',
          territory: 'East Delhi',
          performance: 94,
          activitiesCompleted: 41,
          activitiesPlanned: 45,
          exceptions: 0,
          status: 'Active'
        }
      ]
    },
    {
      id: 'TSM002',
      name: 'Vikram Patel',
      employeeCode: 'TSM002',
      territory: 'Gurgaon Territory',
      mdoCount: 2,
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
      teamPerformance: {
        averageScore: 82,
        topPerformers: 1,
        needsAttention: 1
      },
      exceptions: 2,
      mdos: [
        {
          id: 'MDO004',
          name: 'Suresh Kumar',
          employeeCode: 'MDO004',
          territory: 'Gurgaon North',
          performance: 86,
          activitiesCompleted: 34,
          activitiesPlanned: 40,
          exceptions: 1,
          status: 'Active'
        },
        {
          id: 'MDO005',
          name: 'Neha Gupta',
          employeeCode: 'MDO005',
          territory: 'Gurgaon South',
          performance: 78,
          activitiesCompleted: 28,
          activitiesPlanned: 40,
          exceptions: 1,
          status: 'Active'
        }
      ]
    }
  ];

  const handleEndMeeting = (meetingId: string) => {
    setLiveMeetings(prev => prev.filter(meeting => meeting.id !== meetingId));
  };

  // Aggregate regional stats
  const regionalAggregates = {
    totalTSMs: tsmStats.length,
    totalMDOs: tsmStats.reduce((sum, tsm) => sum + tsm.mdoCount, 0),
    ytdActivities: {
      planned: tsmStats.reduce((sum, tsm) => sum + tsm.ytdActivities.planned, 0),
      done: tsmStats.reduce((sum, tsm) => sum + tsm.ytdActivities.done, 0),
      percentage: Math.round((tsmStats.reduce((sum, tsm) => sum + tsm.ytdActivities.done, 0) / tsmStats.reduce((sum, tsm) => sum + tsm.ytdActivities.planned, 0)) * 100)
    },
    monthlyActivities: {
      planned: tsmStats.reduce((sum, tsm) => sum + tsm.monthlyActivities.planned, 0),
      done: tsmStats.reduce((sum, tsm) => sum + tsm.monthlyActivities.done, 0),
      pending: tsmStats.reduce((sum, tsm) => sum + tsm.monthlyActivities.pending, 0)
    },
    totalExceptions: tsmStats.reduce((sum, tsm) => sum + tsm.exceptions, 0),
    averagePerformance: Math.round(tsmStats.reduce((sum, tsm) => sum + tsm.teamPerformance.averageScore, 0) / tsmStats.length)
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Regional Performance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Regional Performance</h3>
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Building className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-800">{regionalAggregates.ytdActivities.percentage}%</div>
              <div className="text-sm text-purple-600">YTD Achievement</div>
              <div className="text-xs text-gray-500 mt-1">{regionalAggregates.ytdActivities.done}/{regionalAggregates.ytdActivities.planned}</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-800">{Math.round((regionalAggregates.monthlyActivities.done / regionalAggregates.monthlyActivities.planned) * 100)}%</div>
              <div className="text-sm text-blue-600">Monthly Progress</div>
              <div className="text-xs text-gray-500 mt-1">{regionalAggregates.monthlyActivities.done}/{regionalAggregates.monthlyActivities.planned}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Team Structure</h3>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-800">{regionalAggregates.totalTSMs}</div>
              <div className="text-sm text-green-600">TSMs</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-800">{regionalAggregates.totalMDOs}</div>
              <div className="text-sm text-orange-600">MDOs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Meetings */}
      <LiveMeetings 
        meetings={liveMeetings}
        onEndMeeting={handleEndMeeting}
        userRole="RBH"
      />

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 card-shadow text-center">
          <div className="text-2xl font-bold text-purple-600">{regionalAggregates.averagePerformance}%</div>
          <div className="text-sm text-gray-600">Avg Performance</div>
        </div>
        <div className="bg-white rounded-xl p-4 card-shadow text-center">
          <div className="text-2xl font-bold text-green-600">{tsmStats.reduce((sum, tsm) => sum + tsm.teamPerformance.topPerformers, 0)}</div>
          <div className="text-sm text-gray-600">Top Performers</div>
        </div>
        <div className="bg-white rounded-xl p-4 card-shadow text-center">
          <div className="text-2xl font-bold text-red-600">{regionalAggregates.totalExceptions}</div>
          <div className="text-sm text-gray-600">Active Exceptions</div>
        </div>
        <div className="bg-white rounded-xl p-4 card-shadow text-center">
          <div className="text-2xl font-bold text-blue-600">{tsmStats.filter(tsm => tsm.teamPerformance.averageScore >= 85).length}</div>
          <div className="text-sm text-gray-600">High Performing TSMs</div>
        </div>
      </div>
    </div>
  );

  const renderTSMDetails = () => (
    <div className="space-y-6">
      {/* TSM Performance Cards */}
      <div className="space-y-4">
        {tsmStats.map((tsm) => (
          <div key={tsm.id} className="bg-white rounded-xl p-6 card-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Crown className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{tsm.name}</h3>
                  <p className="text-gray-600">{tsm.employeeCode} • {tsm.territory}</p>
                  <p className="text-sm text-gray-500">{tsm.mdoCount} MDOs under management</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {tsm.exceptions > 0 && (
                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                    {tsm.exceptions} Exception{tsm.exceptions !== 1 ? 's' : ''}
                  </span>
                )}
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  tsm.teamPerformance.averageScore >= 90 ? 'bg-green-100 text-green-800' :
                  tsm.teamPerformance.averageScore >= 80 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {tsm.teamPerformance.averageScore}% Avg
                </span>
              </div>
            </div>

            {/* TSM Activities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-3">TSM Activities</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-900">{tsm.ytdActivities.done}</div>
                    <div className="text-xs text-green-600">YTD Done</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-900">{tsm.monthlyActivities.done}</div>
                    <div className="text-xs text-green-600">Monthly Done</div>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-green-600 mb-1">
                    <span>Progress</span>
                    <span>{tsm.ytdActivities.percentage}%</span>
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${tsm.ytdActivities.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-3">Team Management</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-900">{tsm.mdoCount}</div>
                    <div className="text-xs text-blue-600">MDOs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-800">{tsm.teamPerformance.topPerformers}</div>
                    <div className="text-xs text-green-600">Top</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-800">{tsm.teamPerformance.needsAttention}</div>
                    <div className="text-xs text-red-600">Alert</div>
                  </div>
                </div>
              </div>
            </div>

            {/* MDO Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-gray-800 mb-3">MDO Team Summary</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-gray-900">
                    {tsm.mdos.reduce((sum, mdo) => sum + mdo.activitiesCompleted, 0)}
                  </div>
                  <div className="text-xs text-gray-600">Total Activities</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">
                    {Math.round((tsm.mdos.reduce((sum, mdo) => sum + mdo.activitiesCompleted, 0) / tsm.mdos.reduce((sum, mdo) => sum + mdo.activitiesPlanned, 0)) * 100)}%
                  </div>
                  <div className="text-xs text-gray-600">Completion Rate</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">
                    {tsm.mdos.reduce((sum, mdo) => sum + mdo.exceptions, 0)}
                  </div>
                  <div className="text-xs text-gray-600">Exceptions</div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setSelectedTSM(tsm.id);
                  setSelectedView('mdo-drill');
                }}
                className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-200 transition-colors flex items-center"
              >
                <Eye className="w-4 h-4 mr-2" />
                View MDO Details
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

  const renderMDODrillDown = () => {
    const selectedTSMData = tsmStats.find(tsm => tsm.id === selectedTSM);
    if (!selectedTSMData) return null;

    return (
      <div className="space-y-6">
        {/* TSM Header */}
        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSelectedView('tsm-details')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Crown className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{selectedTSMData.name}</h2>
                <p className="text-gray-600">{selectedTSMData.territory} - MDO Team Details</p>
              </div>
            </div>
          </div>
        </div>

        {/* MDO Details */}
        <div className="space-y-4">
          {selectedTSMData.mdos.map((mdo) => (
            <div key={mdo.id} className="bg-white rounded-xl p-6 card-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{mdo.name}</h3>
                    <p className="text-gray-600">{mdo.employeeCode} • {mdo.territory}</p>
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

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-800">{mdo.activitiesCompleted}</div>
                  <div className="text-xs text-blue-600">Completed</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-800">{mdo.activitiesPlanned}</div>
                  <div className="text-xs text-gray-600">Planned</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-lg font-bold text-orange-800">{mdo.activitiesPlanned - mdo.activitiesCompleted}</div>
                  <div className="text-xs text-orange-600">Pending</div>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Activity Progress</span>
                  <span>{Math.round((mdo.activitiesCompleted / mdo.activitiesPlanned) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(mdo.activitiesCompleted / mdo.activitiesPlanned) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="gradient-bg rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">RBH Dashboard - {user?.name}</h1>
            <p className="text-white/90">Regional Business Head</p>
            <p className="text-white/80 text-sm mt-1">{user?.region || 'Delhi NCR Region'}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{regionalAggregates.monthlyActivities.done}</div>
            <div className="text-white/90 text-sm">Regional Activities</div>
            <div className="text-white/80 text-xs mt-1">
              {regionalAggregates.monthlyActivities.pending} Pending
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
            onClick={() => setSelectedView('tsm-details')}
            className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
              selectedView === 'tsm-details'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            TSM Details
          </button>
        </div>
      </div>

      {/* Content */}
      {selectedView === 'overview' && renderOverview()}
      {selectedView === 'tsm-details' && renderTSMDetails()}
      {selectedView === 'mdo-drill' && renderMDODrillDown()}
    </div>
  );
};

export default RBHDashboard;