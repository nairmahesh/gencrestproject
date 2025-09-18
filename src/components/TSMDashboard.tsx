import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
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
  Activity
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
  exceptions: Exception[];
  performance: {
    visitCompliance: number;
    targetAchievement: number;
    liquidationRate: number;
    customerSatisfaction: number;
  };
  regionEffort: {
    territory: string;
    activitiesCompleted: number;
    hoursSpent: number;
    visitCount: number;
  };
}

interface Exception {
  id: string;
  type: 'route_deviation' | 'insufficient_hours' | 'missing_proof' | 'late_submission' | 'target_miss';
  description: string;
  severity: 'High' | 'Medium' | 'Low';
  date: string;
  status: 'Open' | 'Resolved' | 'In Progress';
  mdoId: string;
  mdoName: string;
}

interface TSMPersonalStats {
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
  teamManagement: {
    totalMDOs: number;
    activeMDOs: number;
    topPerformers: number;
    needsAttention: number;
  };
  approvals: {
    pending: number;
    approved: number;
    rejected: number;
  };
}

const TSMDashboard: React.FC = () => {
  const { user } = useAuth();
  const [selectedView, setSelectedView] = useState<'overview' | 'team' | 'personal' | 'exceptions'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTerritory, setFilterTerritory] = useState('All');

  // Sample MDO data under TSM
  const mdoStats: MDOStats[] = [
    {
      id: 'MDO001',
      name: 'Rajesh Kumar',
      employeeCode: 'MDO001',
      territory: 'North Delhi',
      ytdActivities: {
        planned: 540,
        done: 456,
        percentage: 84
      },
      monthlyActivities: {
        planned: 45,
        done: 38,
        pending: 7,
        pendingPercentage: 16,
        completedPercentage: 84
      },
      exceptions: [
        {
          id: 'EX001',
          type: 'route_deviation',
          description: 'Deviated from planned route on Jan 18',
          severity: 'Medium',
          date: '2024-01-18',
          status: 'Open',
          mdoId: 'MDO001',
          mdoName: 'Rajesh Kumar'
        },
        {
          id: 'EX002',
          type: 'missing_proof',
          description: 'Missing visit photos for 3 visits',
          severity: 'High',
          date: '2024-01-19',
          status: 'In Progress',
          mdoId: 'MDO001',
          mdoName: 'Rajesh Kumar'
        }
      ],
      performance: {
        visitCompliance: 85,
        targetAchievement: 88,
        liquidationRate: 72,
        customerSatisfaction: 4.2
      },
      regionEffort: {
        territory: 'North Delhi',
        activitiesCompleted: 38,
        hoursSpent: 342,
        visitCount: 28
      }
    },
    {
      id: 'MDO002',
      name: 'Amit Singh',
      employeeCode: 'MDO002',
      territory: 'South Delhi',
      ytdActivities: {
        planned: 540,
        done: 432,
        percentage: 80
      },
      monthlyActivities: {
        planned: 45,
        done: 36,
        pending: 9,
        pendingPercentage: 20,
        completedPercentage: 80
      },
      exceptions: [
        {
          id: 'EX003',
          type: 'insufficient_hours',
          description: 'Worked only 7.5 hours on Jan 17',
          severity: 'High',
          date: '2024-01-17',
          status: 'Open',
          mdoId: 'MDO002',
          mdoName: 'Amit Singh'
        }
      ],
      performance: {
        visitCompliance: 82,
        targetAchievement: 85,
        liquidationRate: 68,
        customerSatisfaction: 4.0
      },
      regionEffort: {
        territory: 'South Delhi',
        activitiesCompleted: 36,
        hoursSpent: 324,
        visitCount: 26
      }
    },
    {
      id: 'MDO003',
      name: 'Priya Verma',
      employeeCode: 'MDO003',
      territory: 'East Delhi',
      ytdActivities: {
        planned: 540,
        done: 486,
        percentage: 90
      },
      monthlyActivities: {
        planned: 45,
        done: 41,
        pending: 4,
        pendingPercentage: 9,
        completedPercentage: 91
      },
      exceptions: [],
      performance: {
        visitCompliance: 92,
        targetAchievement: 94,
        liquidationRate: 78,
        customerSatisfaction: 4.5
      },
      regionEffort: {
        territory: 'East Delhi',
        activitiesCompleted: 41,
        hoursSpent: 369,
        visitCount: 32
      }
    }
  ];

  // TSM's personal stats
  const tsmPersonalStats: TSMPersonalStats = {
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
    teamManagement: {
      totalMDOs: mdoStats.length,
      activeMDOs: mdoStats.length,
      topPerformers: mdoStats.filter(m => m.performance.targetAchievement >= 90).length,
      needsAttention: mdoStats.filter(m => m.exceptions.length > 0).length
    },
    approvals: {
      pending: 5,
      approved: 23,
      rejected: 2
    }
  };

  // Aggregate team stats
  const teamAggregates = {
    ytdActivities: {
      planned: mdoStats.reduce((sum, mdo) => sum + mdo.ytdActivities.planned, 0),
      done: mdoStats.reduce((sum, mdo) => sum + mdo.ytdActivities.done, 0),
      percentage: Math.round((mdoStats.reduce((sum, mdo) => sum + mdo.ytdActivities.done, 0) / mdoStats.reduce((sum, mdo) => sum + mdo.ytdActivities.planned, 0)) * 100)
    },
    monthlyActivities: {
      planned: mdoStats.reduce((sum, mdo) => sum + mdo.monthlyActivities.planned, 0),
      done: mdoStats.reduce((sum, mdo) => sum + mdo.monthlyActivities.done, 0),
      pending: mdoStats.reduce((sum, mdo) => sum + mdo.monthlyActivities.pending, 0),
      pendingPercentage: Math.round((mdoStats.reduce((sum, mdo) => sum + mdo.monthlyActivities.pending, 0) / mdoStats.reduce((sum, mdo) => sum + mdo.monthlyActivities.planned, 0)) * 100),
      completedPercentage: Math.round((mdoStats.reduce((sum, mdo) => sum + mdo.monthlyActivities.done, 0) / mdoStats.reduce((sum, mdo) => sum + mdo.monthlyActivities.planned, 0)) * 100)
    },
    totalExceptions: mdoStats.reduce((sum, mdo) => sum + mdo.exceptions.length, 0),
    averagePerformance: Math.round(mdoStats.reduce((sum, mdo) => sum + mdo.performance.targetAchievement, 0) / mdoStats.length)
  };

  const allExceptions = mdoStats.flatMap(mdo => mdo.exceptions);
  const filteredExceptions = allExceptions.filter(ex => ex.status === 'Open');

  const getExceptionColor = (type: Exception['type']) => {
    switch (type) {
      case 'route_deviation': return 'bg-yellow-100 text-yellow-800';
      case 'insufficient_hours': return 'bg-red-100 text-red-800';
      case 'missing_proof': return 'bg-orange-100 text-orange-800';
      case 'late_submission': return 'bg-purple-100 text-purple-800';
      case 'target_miss': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: Exception['severity']) => {
    switch (severity) {
      case 'High': return 'text-red-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const filteredMDOs = mdoStats.filter(mdo => {
    const matchesSearch = mdo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mdo.employeeCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTerritory = filterTerritory === 'All' || mdo.territory === filterTerritory;
    return matchesSearch && matchesTerritory;
  });

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Team vs Personal Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Aggregates */}
        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Team Performance</h3>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-800">{teamAggregates.ytdActivities.percentage}%</div>
              <div className="text-sm text-blue-600">YTD Achievement</div>
              <div className="text-xs text-gray-500 mt-1">{teamAggregates.ytdActivities.done}/{teamAggregates.ytdActivities.planned}</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-800">{teamAggregates.monthlyActivities.completedPercentage}%</div>
              <div className="text-sm text-green-600">Monthly Progress</div>
              <div className="text-xs text-gray-500 mt-1">{teamAggregates.monthlyActivities.done}/{teamAggregates.monthlyActivities.planned}</div>
            </div>
          </div>
        </div>

        {/* TSM Personal Stats */}
        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Your Performance</h3>
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-800">{tsmPersonalStats.ytdActivities.percentage}%</div>
              <div className="text-sm text-purple-600">YTD Achievement</div>
              <div className="text-xs text-gray-500 mt-1">{tsmPersonalStats.ytdActivities.done}/{tsmPersonalStats.ytdActivities.planned}</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-800">{tsmPersonalStats.monthlyActivities.completedPercentage}%</div>
              <div className="text-sm text-orange-600">Monthly Progress</div>
              <div className="text-xs text-gray-500 mt-1">{tsmPersonalStats.monthlyActivities.done}/{tsmPersonalStats.monthlyActivities.planned}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 card-shadow text-center">
          <div className="text-2xl font-bold text-blue-600">{tsmPersonalStats.teamManagement.totalMDOs}</div>
          <div className="text-sm text-gray-600">Total MDOs</div>
        </div>
        <div className="bg-white rounded-xl p-4 card-shadow text-center">
          <div className="text-2xl font-bold text-green-600">{tsmPersonalStats.teamManagement.topPerformers}</div>
          <div className="text-sm text-gray-600">Top Performers</div>
        </div>
        <div className="bg-white rounded-xl p-4 card-shadow text-center">
          <div className="text-2xl font-bold text-red-600">{tsmPersonalStats.teamManagement.needsAttention}</div>
          <div className="text-sm text-gray-600">Need Attention</div>
        </div>
        <div className="bg-white rounded-xl p-4 card-shadow text-center">
          <div className="text-2xl font-bold text-purple-600">{teamAggregates.averagePerformance}%</div>
          <div className="text-sm text-gray-600">Avg Performance</div>
        </div>
      </div>

      {/* Exceptions Alert */}
      {filteredExceptions.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h3 className="font-semibold text-red-800">Active Exceptions ({filteredExceptions.length})</h3>
            </div>
            <button 
              onClick={() => setSelectedView('exceptions')}
              className="text-red-600 text-sm hover:text-red-800"
            >
              View All
            </button>
          </div>
          <div className="space-y-2">
            {filteredExceptions.slice(0, 3).map((exception) => (
              <div key={exception.id} className="bg-white rounded-lg p-3 border border-red-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{exception.description}</p>
                    <p className="text-xs text-gray-600">{exception.mdoName} • {new Date(exception.date).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-xs font-medium ${getSeverityColor(exception.severity)}`}>
                    {exception.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderTeamView = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search MDOs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterTerritory}
            onChange={(e) => setFilterTerritory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="All">All Territories</option>
            <option value="North Delhi">North Delhi</option>
            <option value="South Delhi">South Delhi</option>
            <option value="East Delhi">East Delhi</option>
            <option value="West Delhi">West Delhi</option>
          </select>
        </div>
      </div>

      {/* MDO Performance Cards */}
      <div className="space-y-4">
        {filteredMDOs.map((mdo) => (
          <div key={mdo.id} className="bg-white rounded-xl p-6 card-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{mdo.name}</h3>
                  <p className="text-gray-600">{mdo.employeeCode} • {mdo.territory}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {mdo.exceptions.length > 0 && (
                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                    {mdo.exceptions.length} Exception{mdo.exceptions.length !== 1 ? 's' : ''}
                  </span>
                )}
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  mdo.performance.targetAchievement >= 90 ? 'bg-green-100 text-green-800' :
                  mdo.performance.targetAchievement >= 80 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {mdo.performance.targetAchievement}% Target
                </span>
              </div>
            </div>

            {/* YTD vs Monthly Activities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-3">YTD Activities</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-900">{mdo.ytdActivities.planned}</div>
                    <div className="text-xs text-blue-600">Planned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-900">{mdo.ytdActivities.done}</div>
                    <div className="text-xs text-blue-600">Done</div>
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
                    <div className="text-lg font-bold text-green-900">{mdo.monthlyActivities.planned}</div>
                    <div className="text-xs text-green-600">Planned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-900">{mdo.monthlyActivities.done}</div>
                    <div className="text-xs text-green-600">Done</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-800">{mdo.monthlyActivities.pending}</div>
                    <div className="text-xs text-orange-600">Pending</div>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="text-center">
                    <span className="text-green-600 font-semibold">{mdo.monthlyActivities.completedPercentage}% Done</span>
                  </div>
                  <div className="text-center">
                    <span className="text-orange-600 font-semibold">{mdo.monthlyActivities.pendingPercentage}% Pending</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Region-wise Effort */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-gray-800 mb-3">Region-wise Effort - {mdo.regionEffort.territory}</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-gray-900">{mdo.regionEffort.activitiesCompleted}</div>
                  <div className="text-xs text-gray-600">Activities</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">{mdo.regionEffort.hoursSpent}</div>
                  <div className="text-xs text-gray-600">Hours</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">{mdo.regionEffort.visitCount}</div>
                  <div className="text-xs text-gray-600">Visits</div>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="text-center p-2 bg-purple-50 rounded">
                <div className="text-sm font-bold text-purple-800">{mdo.performance.visitCompliance}%</div>
                <div className="text-xs text-purple-600">Visit Compliance</div>
              </div>
              <div className="text-center p-2 bg-blue-50 rounded">
                <div className="text-sm font-bold text-blue-800">{mdo.performance.targetAchievement}%</div>
                <div className="text-xs text-blue-600">Target Achievement</div>
              </div>
              <div className="text-center p-2 bg-green-50 rounded">
                <div className="text-sm font-bold text-green-800">{mdo.performance.liquidationRate}%</div>
                <div className="text-xs text-green-600">Liquidation Rate</div>
              </div>
              <div className="text-center p-2 bg-yellow-50 rounded">
                <div className="text-sm font-bold text-yellow-800">{mdo.performance.customerSatisfaction}</div>
                <div className="text-xs text-yellow-600">Satisfaction</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderExceptions = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 card-shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Exception Management</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-red-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-red-800">{allExceptions.filter(e => e.type === 'route_deviation').length}</div>
            <div className="text-xs text-red-600">Route Deviations</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-orange-800">{allExceptions.filter(e => e.type === 'insufficient_hours').length}</div>
            <div className="text-xs text-orange-600">Hour Violations</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-yellow-800">{allExceptions.filter(e => e.type === 'missing_proof').length}</div>
            <div className="text-xs text-yellow-600">Missing Proofs</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-purple-800">{allExceptions.filter(e => e.type === 'late_submission').length}</div>
            <div className="text-xs text-purple-600">Late Submissions</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-gray-800">{allExceptions.filter(e => e.type === 'target_miss').length}</div>
            <div className="text-xs text-gray-600">Target Misses</div>
          </div>
        </div>

        <div className="space-y-3">
          {allExceptions.map((exception) => (
            <div key={exception.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className={`w-5 h-5 ${getSeverityColor(exception.severity)}`} />
                  <div>
                    <h4 className="font-medium text-gray-900">{exception.description}</h4>
                    <p className="text-sm text-gray-600">{exception.mdoName} • {new Date(exception.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getExceptionColor(exception.type)}`}>
                    {exception.type.replace('_', ' ')}
                  </span>
                  <span className={`text-xs font-medium ${getSeverityColor(exception.severity)}`}>
                    {exception.severity}
                  </span>
                </div>
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
            <h1 className="text-2xl font-bold mb-2">TSM Dashboard - {user?.name}</h1>
            <p className="text-white/90">Territory Sales Manager</p>
            <p className="text-white/80 text-sm mt-1">{user?.territory || 'Delhi Territory'}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{teamAggregates.monthlyActivities.done}</div>
            <div className="text-white/90 text-sm">Team Activities Done</div>
            <div className="text-white/80 text-xs mt-1">
              {teamAggregates.monthlyActivities.pending} Pending
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
            Overview
          </button>
          <button
            onClick={() => setSelectedView('team')}
            className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
              selectedView === 'team'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Team Details
          </button>
          <button
            onClick={() => setSelectedView('exceptions')}
            className={`flex-1 py-2 px-4 rounded-lg transition-colors relative ${
              selectedView === 'exceptions'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Exceptions
            {filteredExceptions.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                {filteredExceptions.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      {selectedView === 'overview' && renderOverview()}
      {selectedView === 'team' && renderTeamView()}
      {selectedView === 'exceptions' && renderExceptions()}
    </div>
  );
};

export default TSMDashboard;