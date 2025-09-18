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
    liquidationRate: d.metrics.liquidationPercentage,
    status: d.status,
    priority: d.priority,
    metrics: d.metrics
  }));

  const getSKUData = (distributorId: string) => {
    return [
      {
        skuCode: 'DAP-25KG',
        skuName: 'DAP 25kg Bag',
        unit: 'Kg',
        invoices: [
          {
            invoiceNumber: 'INV-2024-001',
            invoiceDate: '2024-08-01',
            currentStock: 50,
            batchNumber: 'BATCH-001'
          },
          {
            invoiceNumber: 'INV-2024-002', 
            invoiceDate: '2024-08-07',
            currentStock: 30,
            batchNumber: 'BATCH-002'
          },
          {
            invoiceNumber: 'INV-2024-003',
            invoiceDate: '2024-08-10', 
            currentStock: 25,
            batchNumber: 'BATCH-003'
          }
        ]
      },
      {
        skuCode: 'DAP-50KG',
        skuName: 'DAP 50kg Bag',
        unit: 'Kg',
        invoices: [
          {
            invoiceNumber: 'INV-2024-004',
            invoiceDate: '2024-08-01',
            currentStock: 40,
            batchNumber: 'BATCH-004'
          },
          {
            invoiceNumber: 'INV-2024-005',
            invoiceDate: '2024-08-07',
            currentStock: 35,
            batchNumber: 'BATCH-005'
          }
        ]
      }
    ];
  };

  const getSKUColor = (skuCode: string) => {
    switch (skuCode) {
      case 'DAP-25KG': return 'bg-blue-600 text-white';
      case 'DAP-50KG': return 'bg-green-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getMetricData = (metric: string, distributorId: string) => {
    const skuData = getSKUData(distributorId);

    switch (metric) {
      case 'opening':
        const totalOpeningVolume = skuData.reduce((sum, sku) => 
          sum + sku.invoices.reduce((invSum, inv) => invSum + Math.round(inv.currentStock * 0.25), 0), 0
        );
        return {
          title: 'Opening Stock',
          totalVolume: totalOpeningVolume,
          data: skuData
        };
      case 'sales':
        const totalSalesVolume = skuData.reduce((sum, sku) => 
          sum + sku.invoices.reduce((invSum, inv) => invSum + Math.round(inv.currentStock * 0.1), 0), 0
        );
        return {
          title: 'YTD Net Sales',
          totalVolume: totalSalesVolume,
          data: skuData
        };
      case 'liquidation':
        const totalLiquidationVolume = skuData.reduce((sum, sku) => 
          sum + sku.invoices.reduce((invSum, inv) => invSum + Math.round(inv.currentStock * 0.25), 0), 0
        );
        return {
          title: 'Liquidation',
          totalVolume: totalLiquidationVolume,
          data: skuData
        };
      case 'balance':
        const totalBalanceVolume = skuData.reduce((sum, sku) => 
          sum + sku.invoices.reduce((invSum, inv) => invSum + inv.currentStock, 0), 0
        );
        return {
          title: 'Balance Stock',
          totalVolume: totalBalanceVolume,
          data: skuData
        };
      default:
        return { title: '', totalVolume: 0, data: [] };
    }
  };

  const handleVerifyClick = (distributor: any) => {
    setSelectedDistributor(distributor);
    
    // Initialize verification data for multiple invoices
    const skuData = getSKUData(distributor.id);
    const skuVerifications: Record<string, { current: number; physical: number; variance: number }> = {};
    
    skuData.forEach(sku => {
      sku.invoices.forEach(invoice => {
        const key = `${sku.skuCode}-${invoice.invoiceNumber}`;
        skuVerifications[key] = {
          current: invoice.currentStock,
          physical: 0,
          variance: -invoice.currentStock
        };
      });
    });

    setVerificationData({ skuVerifications, remarks: '' });
    setShowVerifyModal(true);
  };

  const handleViewClick = (distributor: any, metric: string) => {
    setSelectedDistributor(distributor);
    setSelectedMetric(metric);
    setShowViewModal(true);
  };

  const handleSKUStockChange = (skuCode: string, invoiceNumber: string, field: 'current' | 'physical', value: number) => {
    setVerificationData((prev: any) => {
      const updated = { ...prev };
      const key = `${skuCode}-${invoiceNumber}`;
      if (!updated.skuVerifications[key]) {
        updated.skuVerifications[key] = { current: 0, physical: 0, variance: 0 };
      }
      
      updated.skuVerifications[key][field] = value;
      updated.skuVerifications[key].variance = 
        updated.skuVerifications[key].physical - updated.skuVerifications[key].current;
      
      return updated;
    });
  };

  const renderDashboard = () => (
    <div className="p-4 space-y-4">
      {/* Header */}
      {user?.role === 'TSM' ? (
        <div className="space-y-3">
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

          {/* Critical Alerts Section */}
          {activeAlerts.length > 0 && (
            <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-red-500">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <h3 className="font-semibold text-sm text-red-800">Critical Alerts</h3>
                  <span className="w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                    {activeAlerts.length}
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
                      <span className="text-xs opacity-75">
                        {new Date(alert.timestamp).toLocaleTimeString('en-IN', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                    <p className="text-xs">{alert.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
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
              {/* Team vs Personal Stats */}
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h3 className="font-semibold text-sm mb-3 flex items-center">
                    <Users className="w-4 h-4 mr-2 text-blue-600" />
                    Team Performance
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
                </div>

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

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-lg p-3 shadow-sm text-center">
                  <div className="text-lg font-bold text-blue-600">{tsmPersonalStats.teamManagement.totalMDOs}</div>
                  <div className="text-xs text-gray-600">Total MDOs</div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm text-center">
                  <div className="text-lg font-bold text-green-600">{tsmPersonalStats.teamManagement.topPerformers}</div>
                  <div className="text-xs text-gray-600">Top Performers</div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm text-center">
                  <div className="text-lg font-bold text-red-600">{tsmPersonalStats.teamManagement.needsAttention}</div>
                  <div className="text-xs text-gray-600">Need Attention</div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm text-center">
                  <div className="text-lg font-bold text-purple-600">{teamAggregates.averagePerformance}%</div>
                  <div className="text-xs text-gray-600">Avg Performance</div>
                </div>
              </div>

              {/* Exceptions Alert */}
              {allExceptions.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <h3 className="font-semibold text-red-800 text-sm">Active Exceptions ({allExceptions.length})</h3>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {allExceptions.slice(0, 2).map((exception) => (
                      <div key={exception.id} className="bg-white rounded p-2 border border-red-200">
                        <p className="text-xs font-medium text-gray-900">{exception.description}</p>
                        <p className="text-xs text-gray-600">{exception.mdoName}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                {activeAlerts.length}
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
                    {new Date(alert.timestamp).toLocaleTimeString('en-IN', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
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

  const renderTSMDashboard = () => (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-4 text-white">
        <h2 className="text-lg font-bold mb-1">TSM Dashboard</h2>
        <p className="text-sm opacity-90">{user?.name}</p>
        <div className="flex justify-between items-end mt-3">
          <div>
            <div className="text-2xl font-bold">{teamAggregates.monthlyActivities.done}</div>
            <div className="text-xs opacity-80">Team Activities Done</div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold">{tsmPersonalStats.monthlyActivities.done}</div>
            <div className="text-xs opacity-80">Your Activities</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
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

      {/* Content based on selected view */}
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
              <h3 className="font-semibold text-base mb-3 flex items-center">
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
              
          {/* Exceptions Alert */}
          {allExceptions.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <h3 className="font-semibold text-red-800 text-sm">Active Exceptions ({allExceptions.length})</h3>
                </div>
              </div>
              <div className="space-y-2">
                {allExceptions.slice(0, 2).map((exception) => (
                  <div key={exception.id} className="bg-white rounded p-2 border border-red-200">
                    <p className="text-xs font-medium text-gray-900">{exception.description}</p>
                    <p className="text-xs text-gray-600">{exception.mdoName}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
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
    </div>
  );

  const renderLiquidation = () => (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h2 className="text-lg font-bold mb-2">Stock Liquidation</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-xl font-bold text-purple-600">28%</div>
            <div className="text-xs text-gray-600">Overall Rate</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900">{distributors.length}</div>
            <div className="text-xs text-gray-600">Distributors</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search distributors..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Distributors List */}
      <div className="space-y-3">
        {distributors.map((distributor) => (
          <div key={distributor.id} className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-sm">{distributor.name}</h3>
                <p className="text-xs text-gray-600">{distributor.code} • {distributor.territory}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-purple-600">{distributor.liquidationRate}%</div>
                <div className="text-xs text-gray-600">Liquidation</div>
              </div>
            </div>
            
            {/* Mobile Metrics Cards */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-orange-50 rounded p-2 text-center">
                <div className="text-sm font-bold text-orange-800">{distributor.metrics.openingStock.volume}</div>
                <div className="text-xs text-orange-600">Opening</div>
                <button 
                  onClick={() => handleViewClick(distributor, 'opening')}
                  className="text-xs text-orange-600 underline mt-1"
                >
                  View
                </button>
              </div>
              <div className="bg-blue-50 rounded p-2 text-center">
                <div className="text-sm font-bold text-blue-800">{distributor.metrics.ytdNetSales.volume}</div>
                <div className="text-xs text-blue-600">Sales</div>
                <button 
                  onClick={() => handleViewClick(distributor, 'sales')}
                  className="text-xs text-blue-600 underline mt-1"
                >
                  View
                </button>
              </div>
              <div className="bg-green-50 rounded p-2 text-center">
                <div className="text-sm font-bold text-green-800">{distributor.metrics.liquidation.volume}</div>
                <div className="text-xs text-green-600">Liquidated</div>
                <button 
                  onClick={() => handleViewClick(distributor, 'liquidation')}
                  className="text-xs text-green-600 underline mt-1"
                >
                  View
                </button>
              </div>
              <div className="bg-purple-50 rounded p-2 text-center">
                <div className="text-sm font-bold text-purple-800">{distributor.metrics.balanceStock.volume}</div>
                <div className="text-xs text-purple-600">Balance</div>
                <button 
                  onClick={() => handleVerifyClick(distributor)}
                  className="text-xs text-green-600 underline mt-1"
                >
                  Verify
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTasks = () => (
    <div className="p-4 space-y-4">
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h2 className="text-lg font-bold mb-3">Today's Tasks</h2>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <MapPin className="w-4 h-4 text-yellow-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Visit SRI RAMA SEEDS</p>
              <p className="text-xs text-gray-600">10:00 AM • Stock verification</p>
            </div>
            <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">Pending</span>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Monthly Report</p>
              <p className="text-xs text-gray-600">Due: Jan 25 • Sales performance</p>
            </div>
            <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">In Progress</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTracker = () => (
    <div className="p-4 space-y-4">
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h2 className="text-lg font-bold mb-3">Route Tracker</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Ram Kumar</p>
                <p className="text-xs text-gray-600">Completed • 11:30 AM</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Navigation className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Suresh Traders</p>
                <p className="text-xs text-gray-600">In Progress • 2:30 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="p-4 space-y-4">
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h2 className="text-lg font-bold mb-3">Reports</h2>
        <div className="space-y-3">
          <div className="p-3 border border-gray-200 rounded-lg">
            <h3 className="font-medium text-sm">Daily Visit Report</h3>
            <p className="text-xs text-gray-600 mb-2">3 visits completed today</p>
            <button className="w-full bg-purple-600 text-white py-2 rounded-lg text-sm">
              Generate Report
            </button>
          </div>
          
          <div className="p-3 border border-gray-200 rounded-lg">
            <h3 className="font-medium text-sm">Monthly Performance</h3>
            <p className="text-xs text-gray-600 mb-2">Sales: ₹4.2L | Target: ₹5L</p>
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return user?.role === 'TSM' ? renderTSMDashboard() : renderDashboard();
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
    <div className="max-w-sm mx-auto bg-gray-100 min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">G</span>
          </div>
          <div>
            <h1 className="font-bold text-gray-900">Gencrest</h1>
            <p className="text-xs text-gray-600">Activity Tracker</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-600">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 relative">
            <div className="w-2 h-2 bg-red-500 rounded-full absolute top-1 right-1"></div>
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {renderContent()}
      </div>

      {/* Stock Verification Modal for Mobile */}
      {showVerifyModal && selectedDistributor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Stock Verification</h3>
                <p className="text-sm text-gray-600">{selectedDistributor.name}</p>
              </div>
              <button
                onClick={() => setShowVerifyModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-4">
                {getSKUData(selectedDistributor.id).map((sku) => (
                  <div key={sku.skuCode} className="bg-gray-50 rounded-lg p-3">
                    {/* SKU Header */}
                    <div className="mb-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getSKUColor(sku.skuCode)}`}>
                          {sku.skuName}
                        </span>
                        <span className="text-xs text-gray-600">SKU: {sku.skuCode}</span>
                      </div>
                    </div>
                    
                    {/* Invoice-wise verification */}
                    <div className="space-y-3">
                      {sku.invoices.map((invoice) => {
                        const verificationKey = `${sku.skuCode}-${invoice.invoiceNumber}`;
                        const variance = verificationData.skuVerifications?.[verificationKey]?.variance || 0;
                        
                        return (
                          <div key={invoice.invoiceNumber} className="bg-white rounded-lg border p-3">
                            {/* Invoice Info */}
                            <div className="mb-2">
                              <div className="flex items-center justify-between">
                                <p className="text-xs font-medium text-gray-900">{invoice.invoiceNumber}</p>
                                <p className="text-xs text-gray-500">{invoice.batchNumber}</p>
                              </div>
                              <p className="text-xs text-gray-500">{new Date(invoice.invoiceDate).toLocaleDateString()}</p>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="grid grid-cols-2 gap-3">
                                {/* Current Stock */}
                                <div>
                                  <p className="text-xs text-gray-600 mb-1">Current Stock</p>
                                  <input
                                    type="number"
                                    value={verificationData.skuVerifications?.[verificationKey]?.current || invoice.currentStock}
                                    onChange={(e) => handleSKUStockChange(sku.skuCode, invoice.invoiceNumber, 'current', parseInt(e.target.value) || 0)}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-center text-sm"
                                    readOnly
                                  />
                                </div>
                                
                                <div>
                                  <p className="text-xs text-gray-600 mb-1">Physical Stock</p>
                                  <input
                                    type="number"
                                    value={verificationData.skuVerifications?.[verificationKey]?.physical || ''}
                                    onChange={(e) => handleSKUStockChange(sku.skuCode, invoice.invoiceNumber, 'physical', parseInt(e.target.value) || 0)}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-center text-sm"
                                    placeholder="Enter"
                                  />
                                </div>
                              </div>
                              
                              {/* Variance */}
                              {variance !== 0 && (
                                <div className={`p-2 rounded text-xs ${
                                  variance > 0 ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                                }`}>
                                  Variance: {variance > 0 ? '+' : ''}{variance} {sku.unit}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Remarks */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                <textarea
                  value={verificationData.remarks || ''}
                  onChange={(e) => setVerificationData((prev: any) => ({ ...prev, remarks: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  rows={2}
                  placeholder="Add verification remarks..."
                />
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
                className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm"
              >
                Verify Stock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal for Mobile */}
      {showViewModal && selectedDistributor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b bg-blue-100">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{getMetricData(selectedMetric, selectedDistributor.id).title}</h3>
                <p className="text-sm text-gray-600">{selectedDistributor.name}</p>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-2 hover:bg-blue-200 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Total Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Total {getMetricData(selectedMetric, selectedDistributor.id).title}</h4>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {getMetricData(selectedMetric, selectedDistributor.id).totalVolume}
                  </div>
                  <div className="text-sm text-gray-600">Total Volume (Kg/Litre)</div>
                </div>
              </div>

              {/* SKU Breakdown */}
              <div className="space-y-4">
                {getMetricData(selectedMetric, selectedDistributor.id).data.map((sku: any) => (
                  <div key={sku.skuCode} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getSKUColor(sku.skuCode)}`}>
                        {sku.skuName}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      {sku.invoices.map((invoice: any, index: number) => {
                        let calculatedValue = 0;
                        switch (selectedMetric) {
                          case 'opening':
                            calculatedValue = Math.round(invoice.currentStock * 0.25);
                            break;
                          case 'sales':
                            calculatedValue = Math.round(invoice.currentStock * 0.1);
                            break;
                          case 'liquidation':
                            calculatedValue = Math.round(invoice.currentStock * 0.25);
                            break;
                          case 'balance':
                            calculatedValue = invoice.currentStock;
                            break;
                        }
                        
                        return (
                          <div key={index} className="bg-white rounded border p-2">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-xs font-medium">{invoice.invoiceNumber}</p>
                                <p className="text-xs text-gray-500">{new Date(invoice.invoiceDate).toLocaleDateString()}</p>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-bold">{calculatedValue}</div>
                                <div className="text-xs text-gray-600">{sku.unit}</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end p-4 border-t">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-200 px-2 py-1">
        <div className="flex justify-around">
          {[
            { id: 'dashboard', icon: Home, label: 'Dashboard' },
            { id: 'tracker', icon: MapPin, label: 'Tracker' },
            { id: 'tasks', icon: CheckSquare, label: 'Tasks' },
            { id: 'liquidation', icon: Droplets, label: 'Liquidation' },
            { id: 'reports', icon: FileText, label: 'Reports' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'text-purple-600 bg-purple-50'
                  : 'text-gray-600'
              }`}
            >
              <tab.icon className="w-5 h-5 mb-1" />
              <span className="text-xs">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Critical Alerts Modal */}
      {showCriticalAlerts && renderCriticalAlertsModal()}
    </div>
  );
};

export default MobileApp;