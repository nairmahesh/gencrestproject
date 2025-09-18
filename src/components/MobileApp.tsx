import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLiquidationCalculation } from '../hooks/useLiquidationCalculation';
import { 
  Home, 
  MapPin, 
  CheckSquare, 
  Droplets, 
  FileText,
  User,
  Calendar,
  Package,
  TrendingUp,
  Target,
  Building,
  Search,
  Filter,
  Eye,
  CheckCircle,
  X,
  Save,
  Plus,
  Minus,
  Phone,
  Mail,
  Navigation,
  Clock,
  DollarSign,
  Camera,
  Upload,
  Users,
  AlertTriangle,
  Award,
  Activity,
  BarChart3,
  Bell,
  Battery,
  MapPinOff,
  Route,
  Shield
} from 'lucide-react';

interface CriticalAlert {
  id: string;
  type: 'location' | 'battery' | 'boundary' | 'route_deviation';
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: string;
  userId: string;
  userName: string;
  isActive: boolean;
  duration?: string;
  distance?: string;
}

interface MobileAppProps {}

const MobileApp: React.FC<MobileAppProps> = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDistributor, setSelectedDistributor] = useState<any>(null);
  const [selectedMetric, setSelectedMetric] = useState<string>('');
  const [verificationData, setVerificationData] = useState<any>({});
  const [selectedView, setSelectedView] = useState<'overview' | 'team' | 'exceptions'>('overview');
  const [showCriticalAlerts, setShowCriticalAlerts] = useState(false);
  const [selectedAlertCategory, setSelectedAlertCategory] = useState('All');

  const { distributorMetrics } = useLiquidationCalculation();

  // Critical Alerts Data
  const criticalAlerts: CriticalAlert[] = [
    {
      id: 'CA001',
      type: 'location',
      title: 'Priya Sharma',
      description: 'Location services disabled for 15 mins',
      severity: 'high',
      timestamp: '2024-01-20T14:25:00Z',
      userId: 'MDO002',
      userName: 'Priya Sharma',
      isActive: true,
      duration: '15 mins'
    },
    {
      id: 'CA002',
      type: 'battery',
      title: 'Rajesh Kumar',
      description: 'Battery at 18% during active visit',
      severity: 'medium',
      timestamp: '2024-01-20T14:20:00Z',
      userId: 'MDO001',
      userName: 'Rajesh Kumar',
      isActive: true
    },
    {
      id: 'CA003',
      type: 'boundary',
      title: 'Rajesh Kumar',
      description: '2.5km outside territory boundary',
      severity: 'high',
      timestamp: '2024-01-20T14:15:00Z',
      userId: 'MDO001',
      userName: 'Rajesh Kumar',
      isActive: true,
      distance: '2.5km'
    },
    {
      id: 'CA004',
      type: 'route_deviation',
      title: 'Vijay Verma',
      description: 'Route deviation of 30.2 km detected',
      severity: 'high',
      timestamp: '2024-01-20T14:10:00Z',
      userId: 'MDO003',
      userName: 'Vijay Verma',
      isActive: true,
      distance: '30.2 km'
    }
  ];

  const getAlertIcon = (type: CriticalAlert['type']) => {
    switch (type) {
      case 'location': return <MapPinOff className="w-4 h-4" />;
      case 'battery': return <Battery className="w-4 h-4" />;
      case 'boundary': return <Shield className="w-4 h-4" />;
      case 'route_deviation': return <Route className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getAlertColor = (severity: CriticalAlert['severity']) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAlertCategoryColor = (category: string) => {
    switch (category) {
      case 'Location': return 'bg-red-100 text-red-800';
      case 'Battery': return 'bg-orange-100 text-orange-800';
      case 'Geofence': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const activeAlerts = criticalAlerts.filter(alert => alert.isActive);
  const filteredAlerts = selectedAlertCategory === 'All' 
    ? activeAlerts 
    : activeAlerts.filter(alert => {
        switch (selectedAlertCategory) {
          case 'Location': return alert.type === 'location';
          case 'Battery': return alert.type === 'battery';
          case 'Geofence': return alert.type === 'boundary' || alert.type === 'route_deviation';
          default: return true;
        }
      });

  // Sample MDO data for TSM
  const mdoStats = [
    {
      id: 'MDO001',
      name: 'Rajesh Kumar',
      employeeCode: 'MDO001',
      territory: 'North Delhi',
      ytdActivities: { planned: 540, done: 456, percentage: 84 },
      monthlyActivities: { planned: 45, done: 38, pending: 7, pendingPercentage: 16, completedPercentage: 84 },
      exceptions: [
        { id: 'EX001', type: 'route_deviation', description: 'Route deviation on Jan 18', severity: 'Medium', date: '2024-01-18', status: 'Open' },
        { id: 'EX002', type: 'missing_proof', description: 'Missing visit photos', severity: 'High', date: '2024-01-19', status: 'Open' }
      ],
      performance: { visitCompliance: 85, targetAchievement: 88, liquidationRate: 72 },
      regionEffort: { territory: 'North Delhi', activitiesCompleted: 38, hoursSpent: 342, visitCount: 28 }
    },
    {
      id: 'MDO002',
      name: 'Amit Singh',
      employeeCode: 'MDO002',
      territory: 'South Delhi',
      ytdActivities: { planned: 540, done: 432, percentage: 80 },
      monthlyActivities: { planned: 45, done: 36, pending: 9, pendingPercentage: 20, completedPercentage: 80 },
      exceptions: [
        { id: 'EX003', type: 'insufficient_hours', description: 'Only 7.5 hours on Jan 17', severity: 'High', date: '2024-01-17', status: 'Open' }
      ],
      performance: { visitCompliance: 82, targetAchievement: 85, liquidationRate: 68 },
      regionEffort: { territory: 'South Delhi', activitiesCompleted: 36, hoursSpent: 324, visitCount: 26 }
    },
    {
      id: 'MDO003',
      name: 'Priya Verma',
      employeeCode: 'MDO003',
      territory: 'East Delhi',
      ytdActivities: { planned: 540, done: 486, percentage: 90 },
      monthlyActivities: { planned: 45, done: 41, pending: 4, pendingPercentage: 9, completedPercentage: 91 },
      exceptions: [],
      performance: { visitCompliance: 92, targetAchievement: 94, liquidationRate: 78 },
      regionEffort: { territory: 'East Delhi', activitiesCompleted: 41, hoursSpent: 369, visitCount: 32 }
    }
  ];

  // TSM personal stats
  const tsmPersonalStats = {
    ytdActivities: { planned: 240, done: 216, percentage: 90 },
    monthlyActivities: { planned: 20, done: 18, pending: 2, pendingPercentage: 10, completedPercentage: 90 },
    teamManagement: {
      totalMDOs: mdoStats.length,
      activeMDOs: mdoStats.length,
      topPerformers: mdoStats.filter(m => m.performance.targetAchievement >= 90).length,
      needsAttention: mdoStats.filter(m => m.exceptions.length > 0).length
    },
    approvals: { pending: 5, approved: 23, rejected: 2 }
  };

  // Team aggregates
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

  const getExceptionColor = (type: string) => {
    switch (type) {
      case 'route_deviation': return 'bg-yellow-100 text-yellow-800';
      case 'insufficient_hours': return 'bg-red-100 text-red-800';
      case 'missing_proof': return 'bg-orange-100 text-orange-800';
      case 'late_submission': return 'bg-purple-100 text-purple-800';
      case 'target_miss': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'text-red-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  // Sample data for mobile app
  const distributors = distributorMetrics.map(d => ({
    id: d.id,
    name: d.distributorName,
    code: d.distributorCode,
    territory: d.territory,
    region: d.region,
    status: d.status,
    priority: d.priority,
    metrics: d.metrics
  }));

  const handleVerifyClick = (distributor: any) => {
    setSelectedDistributor(distributor);
    setShowVerifyModal(true);
  };

  const handleViewClick = (distributor: any, metric: string) => {
    setSelectedDistributor(distributor);
    setSelectedMetric(metric);
    setShowViewModal(true);
  };

  const renderDashboard = () => (
    <div className="p-4 space-y-4">
      {/* Header with Critical Alerts */}
      {user?.role === 'TSM' ? (
        <div className="space-y-3">
          {/* TSM Header with Icons */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SK</span>
                </div>
                <div>
                  <h2 className="text-base font-bold">Sandeep Kumar</h2>
                  <p className="text-xs opacity-90">TSM - Delhi Region</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                  <DollarSign className="w-3 h-3 text-white" />
                </div>
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center relative">
                  <AlertTriangle className="w-3 h-3 text-white" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">4</span>
                </div>
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <Route className="w-3 h-3 text-white" />
                </div>
                <button 
                  onClick={() => setShowCriticalAlerts(true)}
                  className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center relative"
                >
                  <Bell className="w-3 h-3 text-white" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-white text-red-500 rounded-full text-xs flex items-center justify-center font-bold">3</span>
                </button>
              </div>
            </div>
          </div>

          {/* Critical Alerts Section - Always Visible */}
          <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-red-500">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <h3 className="font-semibold text-sm text-red-800">Critical Alerts</h3>
                <span className="w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                  4 Active
                </span>
              </div>
              <button 
                onClick={() => setShowCriticalAlerts(true)}
                className="text-red-600 text-xs font-medium"
              >
                View All
              </button>
            </div>
            
            <div className="space-y-2">
              {activeAlerts.slice(0, 2).map((alert) => (
                <div key={alert.id} className={`p-2 rounded-lg border ${getAlertColor(alert.severity)}`}>
                  <div className="flex items-center space-x-2 mb-1">
                    {getAlertIcon(alert.type)}
                    <span className="font-medium text-xs">{alert.userName}</span>
                    <span className={`px-1 py-0.5 rounded text-xs ${
                      alert.severity === 'high' ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'
                    }`}>
                      {alert.severity} priority
                    </span>
                    <span className="text-xs opacity-75">2 mins ago</span>
                  </div>
                  <p className="text-xs">{alert.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-4 text-white">
          <h2 className="text-lg font-bold mb-1">Good Morning!</h2>
          <p className="text-sm opacity-90">Today's Activities</p>
          <div className="flex justify-between items-end mt-3">
            <div>
              <div className="text-2xl font-bold">8</div>
              <div className="text-xs opacity-80">Visits Planned</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">3</div>
              <div className="text-xs opacity-80">Completed</div>
            </div>
          </div>
        </div>
      )}

      {/* TSM Navigation Tabs */}
      {user?.role === 'TSM' && (
        <div className="bg-white rounded-lg p-2 shadow-sm">
          <div className="flex space-x-1">
            <button
              onClick={() => setSelectedView('overview')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs transition-colors ${
                selectedView === 'overview'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setSelectedView('team')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs transition-colors ${
                selectedView === 'team'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600'
              }`}
            >
              Team
            </button>
            <button
              onClick={() => setSelectedView('exceptions')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs transition-colors relative ${
                selectedView === 'exceptions'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600'
              }`}
            >
              Exceptions
              {allExceptions.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                  {allExceptions.length}
                </span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* TSM Content */}
      {user?.role === 'TSM' ? (
        <>
          {selectedView === 'overview' && (
            <div className="space-y-4">
              {/* MDO Team Performance First */}
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h3 className="font-semibold text-base mb-3 flex items-center">
                    <Users className="w-4 h-4 mr-2 text-blue-600" />
                    MDO Team Performance
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-800">{teamAggregates.ytdActivities.percentage}%</div>
                      <div className="text-xs text-blue-600">YTD Achievement</div>
                      <div className="text-xs text-gray-500">{teamAggregates.ytdActivities.done}/{teamAggregates.ytdActivities.planned}</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-800">{teamAggregates.monthlyActivities.completedPercentage}%</div>
                      <div className="text-xs text-green-600">Monthly Progress</div>
                      <div className="text-xs text-gray-500">{teamAggregates.monthlyActivities.done}/{teamAggregates.monthlyActivities.planned}</div>
                    </div>
                  </div>
                  
                  {/* MDO Summary Stats */}
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="bg-white rounded-lg p-3 border text-center">
                      <div className="text-lg font-bold text-blue-600">{tsmPersonalStats.teamManagement.totalMDOs}</div>
                      <div className="text-xs text-gray-600">Total MDOs</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border text-center">
                      <div className="text-lg font-bold text-green-600">{tsmPersonalStats.teamManagement.topPerformers}</div>
                      <div className="text-xs text-gray-600">Top Performers</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border text-center">
                      <div className="text-lg font-bold text-red-600">{tsmPersonalStats.teamManagement.needsAttention}</div>
                      <div className="text-xs text-gray-600">Need Attention</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border text-center">
                      <div className="text-lg font-bold text-purple-600">{teamAggregates.averagePerformance}%</div>
                      <div className="text-xs text-gray-600">Avg Performance</div>
                    </div>
                  </div>
                </div>

                {/* TSM Personal Performance Second */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h3 className="font-semibold text-sm mb-3 flex items-center">
                    <Target className="w-4 h-4 mr-2 text-purple-600" />
                    Your Performance
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-lg font-bold text-purple-800">{tsmPersonalStats.ytdActivities.percentage}%</div>
                      <div className="text-xs text-purple-600">YTD Achievement</div>
                      <div className="text-xs text-gray-500">{tsmPersonalStats.ytdActivities.done}/{tsmPersonalStats.ytdActivities.planned}</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-lg font-bold text-orange-800">{tsmPersonalStats.monthlyActivities.completedPercentage}%</div>
                      <div className="text-xs text-orange-600">Monthly Progress</div>
                      <div className="text-xs text-gray-500">{tsmPersonalStats.monthlyActivities.done}/{tsmPersonalStats.monthlyActivities.planned}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedView === 'team' && (
            <div className="space-y-3">
              {mdoStats.map((mdo) => (
                <div key={mdo.id} className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-sm">{mdo.name}</h3>
                      <p className="text-xs text-gray-600">{mdo.employeeCode} • {mdo.territory}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-purple-600">{mdo.performance.targetAchievement}%</div>
                      <div className="text-xs text-gray-600">Target</div>
                    </div>
                  </div>

                  {/* YTD vs Monthly */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-blue-50 rounded p-2 text-center">
                      <div className="text-sm font-bold text-blue-800">{mdo.ytdActivities.percentage}%</div>
                      <div className="text-xs text-blue-600">YTD</div>
                      <div className="text-xs text-gray-500">{mdo.ytdActivities.done}/{mdo.ytdActivities.planned}</div>
                    </div>
                    <div className="bg-green-50 rounded p-2 text-center">
                      <div className="text-sm font-bold text-green-800">{mdo.monthlyActivities.completedPercentage}%</div>
                      <div className="text-xs text-green-600">Monthly</div>
                      <div className="text-xs text-gray-500">{mdo.monthlyActivities.done}/{mdo.monthlyActivities.planned}</div>
                    </div>
                  </div>

                  {/* Region Effort */}
                  <div className="bg-gray-50 rounded p-2 mb-3">
                    <div className="text-xs text-gray-600 mb-1">Region Effort - {mdo.regionEffort.territory}</div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-sm font-bold">{mdo.regionEffort.activitiesCompleted}</div>
                        <div className="text-xs text-gray-600">Activities</div>
                      </div>
                      <div>
                        <div className="text-sm font-bold">{mdo.regionEffort.hoursSpent}</div>
                        <div className="text-xs text-gray-600">Hours</div>
                      </div>
                      <div>
                        <div className="text-sm font-bold">{mdo.regionEffort.visitCount}</div>
                        <div className="text-xs text-gray-600">Visits</div>
                      </div>
                    </div>
                  </div>

                  {/* Exceptions */}
                  {mdo.exceptions.length > 0 && (
                    <div className="bg-red-50 rounded p-2">
                      <div className="text-xs text-red-800 font-medium mb-1">
                        {mdo.exceptions.length} Exception{mdo.exceptions.length !== 1 ? 's' : ''}
                      </div>
                      {mdo.exceptions.slice(0, 1).map((ex) => (
                        <div key={ex.id} className="text-xs text-red-700">
                          {ex.description}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {selectedView === 'exceptions' && (
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold text-sm mb-3">Exception Summary</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-red-50 rounded p-2 text-center">
                    <div className="text-sm font-bold text-red-800">{allExceptions.filter(e => e.type === 'route_deviation').length}</div>
                    <div className="text-xs text-red-600">Route Issues</div>
                  </div>
                  <div className="bg-orange-50 rounded p-2 text-center">
                    <div className="text-sm font-bold text-orange-800">{allExceptions.filter(e => e.type === 'insufficient_hours').length}</div>
                    <div className="text-xs text-orange-600">Hour Issues</div>
                  </div>
                  <div className="bg-yellow-50 rounded p-2 text-center">
                    <div className="text-sm font-bold text-yellow-800">{allExceptions.filter(e => e.type === 'missing_proof').length}</div>
                    <div className="text-xs text-yellow-600">Missing Proofs</div>
                  </div>
                  <div className="bg-purple-50 rounded p-2 text-center">
                    <div className="text-sm font-bold text-purple-800">{allExceptions.filter(e => e.type === 'late_submission').length}</div>
                    <div className="text-xs text-purple-600">Late Submissions</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {allExceptions.map((exception) => (
                  <div key={exception.id} className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className={`w-4 h-4 ${getSeverityColor(exception.severity)}`} />
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getExceptionColor(exception.type)}`}>
                          {exception.type.replace('_', ' ')}
                        </span>
                      </div>
                      <span className={`text-xs font-medium ${getSeverityColor(exception.severity)}`}>
                        {exception.severity}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-gray-900 mb-1">{exception.description}</p>
                    <p className="text-xs text-gray-600">{exception.mdoName} • {new Date(exception.date).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Regular Dashboard for non-TSM users */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-lg font-bold text-blue-600">85%</div>
              <div className="text-xs text-gray-600">Visit Target</div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-lg font-bold text-green-600">₹4.2L</div>
              <div className="text-xs text-gray-600">Sales MTD</div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold mb-3">Recent Activities</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Visit completed</p>
                  <p className="text-xs text-gray-600">SRI RAMA SEEDS - 2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Package className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New order received</p>
                  <p className="text-xs text-gray-600">Green Agro - ₹45,000</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  // Critical Alerts Modal
  const renderCriticalAlertsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md max-h-[80vh] overflow-hidden">
        <div className="bg-red-50 p-4 border-b border-red-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h3 className="text-lg font-semibold text-red-800">Critical Alerts</h3>
              <span className="w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                4 Active
              </span>
            </div>
            <button
              onClick={() => setShowCriticalAlerts(false)}
              className="p-1 hover:bg-red-100 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>
        
        {/* Alert Categories */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex space-x-2 overflow-x-auto">
            <button
              onClick={() => setSelectedAlertCategory('All')}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                selectedAlertCategory === 'All' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedAlertCategory('Location')}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                selectedAlertCategory === 'Location' ? 'bg-red-600 text-white' : getAlertCategoryColor('Location')
              }`}
            >
              Location
            </button>
            <button
              onClick={() => setSelectedAlertCategory('Battery')}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                selectedAlertCategory === 'Battery' ? 'bg-red-600 text-white' : getAlertCategoryColor('Battery')
              }`}
            >
              Battery
            </button>
            <button
              onClick={() => setSelectedAlertCategory('Geofence')}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                selectedAlertCategory === 'Geofence' ? 'bg-red-600 text-white' : getAlertCategoryColor('Geofence')
              }`}
            >
              Geofence
            </button>
          </div>
        </div>
        
        <div className="p-4 overflow-y-auto max-h-[50vh]">
          <div className="space-y-3">
            {filteredAlerts.map((alert) => (
              <div key={alert.id} className={`p-3 rounded-lg border ${getAlertColor(alert.severity)}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getAlertIcon(alert.type)}
                    <span className="font-medium text-sm">{alert.userName}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      alert.severity === 'high' ? 'bg-red-500 text-white' :
                      alert.severity === 'medium' ? 'bg-orange-500 text-white' :
                      'bg-yellow-500 text-white'
                    }`}>
                      {alert.severity} priority
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    2 mins ago
                  </span>
                </div>
                
                <p className="text-sm mb-3">{alert.description}</p>
                
                <div className="flex space-x-2">
                  <button className="flex-1 bg-purple-600 text-white py-2 px-3 rounded-lg text-xs">
                    View Details
                  </button>
                  <button className="flex-1 bg-gray-500 text-white py-2 px-3 rounded-lg text-xs">
                    Mark Resolved
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {filteredAlerts.length === 0 && (
            <div className="text-center py-8">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No active alerts in this category</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderTracker = () => (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-bold">Activity Tracker</h2>
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <p className="text-gray-600">Track your daily activities and routes</p>
      </div>
    </div>
  );

  const renderTasks = () => (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-bold">Tasks</h2>
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <p className="text-gray-600">Manage your pending tasks</p>
      </div>
    </div>
  );

  const renderLiquidation = () => (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-bold mb-4">Stock Liquidation</h2>
      
      {/* Distributor Cards */}
      <div className="space-y-4">
        {distributors.map((distributor) => (
          <div key={distributor.id} className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-sm">{distributor.name}</h3>
                <p className="text-xs text-gray-600">{distributor.code} • {distributor.territory}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                distributor.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {distributor.status}
              </span>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-orange-50 rounded p-2 text-center">
                <div className="text-sm font-bold text-orange-800">{distributor.metrics.openingStock.volume}</div>
                <div className="text-xs text-orange-600">Opening</div>
              </div>
              <div className="bg-blue-50 rounded p-2 text-center">
                <div className="text-sm font-bold text-blue-800">{distributor.metrics.ytdNetSales.volume}</div>
                <div className="text-xs text-blue-600">YTD Sales</div>
              </div>
              <div className="bg-green-50 rounded p-2 text-center">
                <div className="text-sm font-bold text-green-800">{distributor.metrics.liquidation.volume}</div>
                <div className="text-xs text-green-600">Liquidation</div>
              </div>
              <div className="bg-purple-50 rounded p-2 text-center">
                <div className="text-sm font-bold text-purple-800">{distributor.metrics.balanceStock.volume}</div>
                <div className="text-xs text-purple-600">Balance</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Liquidation %</span>
                <span>{distributor.metrics.liquidationPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full" 
                  style={{ width: `${Math.min(100, distributor.metrics.liquidationPercentage)}%` }}
                ></div>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex space-x-2">
              <button 
                onClick={() => handleVerifyClick(distributor)}
                className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg text-sm flex items-center justify-center"
              >
                <CheckCircle className="w-3 h-3 mr-1 inline" />
                Verify
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Verification Modal */}
      {showVerifyModal && selectedDistributor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm max-h-[80vh] overflow-hidden">
            <div className="bg-blue-100 p-4 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{selectedDistributor.name}</h3>
                  <p className="text-sm text-gray-600">{selectedDistributor.code}</p>
                </div>
                <button
                  onClick={() => setShowVerifyModal(false)}
                  className="p-1 hover:bg-blue-200 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="p-4 overflow-y-auto">
              <h4 className="font-semibold mb-4">Stock Verification</h4>
              
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">DAP 25kg Bag</span>
                    <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">DAP-25KG</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-600">System Stock</label>
                      <input
                        type="number"
                        value="105"
                        readOnly
                        className="w-full px-2 py-1 border rounded text-sm bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Physical Stock</label>
                      <input
                        type="number"
                        placeholder="105"
                        className="w-full px-2 py-1 border rounded text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">DAP 50kg Bag</span>
                    <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">DAP-50KG</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-600">System Stock</label>
                      <input
                        type="number"
                        value="105"
                        readOnly
                        className="w-full px-2 py-1 border rounded text-sm bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Physical Stock</label>
                      <input
                        type="number"
                        placeholder="105"
                        className="w-full px-2 py-1 border rounded text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 p-4 border-t">
              <button
                onClick={() => setShowVerifyModal(false)}
                className="flex-1 py-2 border border-gray-300 rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert(`Stock verified for ${selectedDistributor.name}!`);
                  setShowVerifyModal(false);
                }}
                className="flex-1 py-2 bg-green-600 text-white rounded-lg text-sm"
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderReports = () => (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-bold">Reports</h2>
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <p className="text-gray-600">Generate and view reports</p>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'tracker':
        return renderTracker();
      case 'tasks':
        return renderTasks();
      case 'liquidation':
        return renderLiquidation();
      case 'reports':
        return renderReports();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="max-w-sm mx-auto bg-gray-100 min-h-screen relative">
      {/* Content */}
      <div className="pb-20">
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              activeTab === 'dashboard' ? 'text-purple-600 bg-purple-50' : 'text-gray-600'
            }`}
          >
            <Home className="w-5 h-5 mb-1" />
            <span className="text-xs">Home</span>
          </button>
          
          <button
            onClick={() => setActiveTab('tracker')}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              activeTab === 'tracker' ? 'text-purple-600 bg-purple-50' : 'text-gray-600'
            }`}
          >
            <Users className="w-5 h-5 mb-1" />
            <span className="text-xs">Team</span>
          </button>
          
          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              activeTab === 'tasks' ? 'text-purple-600 bg-purple-50' : 'text-gray-600'
            }`}
          >
            <CheckSquare className="w-5 h-5 mb-1" />
            <span className="text-xs">Tasks</span>
          </button>
          
          <button
            onClick={() => setActiveTab('liquidation')}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              activeTab === 'liquidation' ? 'text-purple-600 bg-purple-50' : 'text-gray-600'
            }`}
          >
            <Droplets className="w-5 h-5 mb-1" />
            <span className="text-xs">Liquidation</span>
          </button>
          
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              activeTab === 'reports' ? 'text-purple-600 bg-purple-50' : 'text-gray-600'
            }`}
          >
            <FileText className="w-5 h-5 mb-1" />
            <span className="text-xs">More</span>
          </button>
        </div>
      </div>

      {/* Critical Alerts Modal */}
      {showCriticalAlerts && renderCriticalAlertsModal()}
    </div>
  );
};

export default MobileApp;