import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home, 
  Users, 
  ShoppingCart, 
  Droplets, 
  FileText, 
  Bell, 
  DollarSign, 
  AlertTriangle, 
  Route,
  ArrowLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  MapPin,
  Calendar,
  Target,
  TrendingUp,
  Package,
  Building,
  User,
  Phone,
  Mail,
  Navigation,
  Car,
  Plus,
  Filter,
  Search,
  Eye,
  Edit,
  X,
  Camera,
  Upload,
  Video,
  Image as ImageIcon,
  Minus,
  Save,
  ChevronDown
} from 'lucide-react';
import { useLiquidationCalculation } from '../hooks/useLiquidationCalculation';
import { useGeolocation } from '../hooks/useGeolocation';

interface ProofItem {
  id: string;
  type: 'photo' | 'video' | 'signature';
  url: string;
  timestamp: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  metadata: {
    fileSize: number;
    duration?: number; // for videos
    resolution?: string;
  };
}

const MobileApp: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [liquidationView, setLiquidationView] = useState<'team' | 'self'>('team');
  const [activeLiquidationTab, setActiveLiquidationTab] = useState<'team' | 'self'>('team');
  const [selectedDistributor, setSelectedDistributor] = useState<any>(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [editingStock, setEditingStock] = useState(false);
  const [tempStock, setTempStock] = useState(0);
  const [showCriticalAlerts, setShowCriticalAlerts] = useState(false);
  const [selectedAlertCategory, setSelectedAlertCategory] = useState('All');
  const [showTravelModal, setShowTravelModal] = useState(false);
  const [uploadedProofs, setUploadedProofs] = useState<ProofItem[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [selectedModal, setSelectedModal] = useState<string | null>(null);
  const [showPlanModal, setShowPlanModal] = useState(false);

  const currentPlan = {
    id: 'PLAN-2024-01',
    title: 'January 2024 Monthly Plan',
    createdBy: 'Priya Sharma',
    createdByRole: 'TSM',
    createdDate: '2024-01-15',
    approvedBy: 'Amit Patel',
    approvedDate: '2024-01-16',
    status: 'Approved',
    period: 'January 2024',
    activities: {
      planned: 45,
      completed: 38,
      pending: 7
    },
    targets: {
      visits: 35,
      sales: 500000,
      newCustomers: 8
    }
  };

  const { distributorMetrics } = useLiquidationCalculation();
  const { latitude, longitude, error: locationError } = useGeolocation();

  // Sample distributor data
  const distributors = [
    {
      id: '1',
      name: 'Green Agro Store',
      code: 'GAS001',
      openingStock: { volume: '2,500', value: '3.2' },
      ytdNetSales: { volume: '1,800', value: '2.4' },
      liquidation: { volume: '700', value: '0.8' },
      balanceStock: { volume: '700', value: '0.8' }
    }
  ];

  // Sample distributor detail data
  const getDistributorDetail = (id: string) => ({
    id,
    retailerName: 'Green Agro Store',
    retailerCode: 'GAS001',
    productName: 'DAP (Di-Ammonium Phosphate)',
    skuName: 'DAP 25kg Bag',
    assignedStock: 50,
    currentStock: 35,
    liquidatedStock: 15,
    liquidationPercentage: 30,
    hasSignature: false,
    hasDocuments: false,
    lastUpdated: '2024-01-20'
  });

  const handleDistributorClick = (distributor: any) => {
    setSelectedDistributor(distributor);
    setTempStock(getDistributorDetail(distributor.id).currentStock);
  };

  const handleStockUpdate = () => {
    setEditingStock(false);
    // In real app, this would update the backend
    console.log('Stock updated to:', tempStock);
  };

  const handleVerifyStock = () => {
    setShowVerifyModal(true);
  };

  const handleSignature = () => {
    setShowSignatureModal(true);
  };

  const handleDocumentUpload = () => {
    setShowDocumentModal(true);
  };

  const handleSaveAndExit = () => {
    setSelectedModal(null);
    alert('Stock verification saved successfully!');
  };

  const generateProofItem = (type: 'photo' | 'video' | 'signature', file?: File): ProofItem => {
    const now = new Date();
    return {
      id: `proof_${Date.now()}`,
      type,
      url: file ? URL.createObjectURL(file) : '/placeholder-image.jpg',
      timestamp: now.toISOString(),
      location: {
        latitude: latitude || 28.6139,
        longitude: longitude || 77.2090,
        address: 'Current Location'
      },
      metadata: {
        fileSize: file?.size || 0,
        duration: type === 'video' ? 30 : undefined,
        resolution: '1920x1080'
      }
    };
  };

  const handleCameraCapture = (type: 'photo' | 'video') => {
    setIsCapturing(true);
    
    // Simulate camera capture
    setTimeout(() => {
      const newProof = generateProofItem(type);
      setUploadedProofs(prev => [...prev, newProof]);
      setIsCapturing(false);
      setShowDocumentModal(false);
      alert(`${type === 'photo' ? 'Photo' : 'Video'} captured with location and timestamp!`);
    }, 2000);
  };

  const handleFileUpload = (files: FileList) => {
    Array.from(files).forEach(file => {
      const type = file.type.startsWith('video/') ? 'video' : 'photo';
      const newProof = generateProofItem(type, file);
      setUploadedProofs(prev => [...prev, newProof]);
    });
    setShowDocumentModal(false);
  };

  const handleSignatureCapture = () => {
    const newProof = generateProofItem('signature');
    setUploadedProofs(prev => [...prev, newProof]);
    setShowSignatureModal(false);
    alert('Signature captured with location and timestamp!');
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('en-IN'),
      time: date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const criticalAlerts = [
    {
      id: '1',
      type: 'Stock Variance',
      message: 'GREEN AGRO: 25kg difference detected',
      severity: 'High',
      time: '2 hours ago',
      module: 'Liquidation'
    },
    {
      id: '2',
      type: 'Route Deviation',
      message: 'MDO deviated from planned route',
      severity: 'Medium',
      time: '4 hours ago',
      module: 'Field Visits'
    },
    {
      id: '3',
      type: 'Missing Proof',
      message: '3 visits without photos',
      severity: 'High',
      time: '6 hours ago',
      module: 'Field Visits'
    },
    {
      id: '4',
      type: 'Payment Overdue',
      message: 'Ram Kumar: ₹25,000 overdue',
      severity: 'High',
      time: '1 day ago',
      module: 'Collections'
    }
  ];

  const filteredAlerts = selectedAlertCategory === 'All' 
    ? criticalAlerts 
    : criticalAlerts.filter(alert => alert.module === selectedAlertCategory);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const renderDashboard = () => (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">SK</span>
              </div>
              <div>
                <h2 className="font-bold">Sandeep</h2>
                <p className="text-sm opacity-90">Kumar</p>
              </div>
            </div>
            <p className="text-xs opacity-80">TSM - Delhi Region</p>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setShowTravelModal(true)}
              className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center hover:bg-yellow-600 transition-colors relative"
            >
              <DollarSign className="w-3 h-3 text-white" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">4</span>
            </button>
            <button 
              onClick={() => setShowCriticalAlerts(true)}
              className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors relative"
            >
              <AlertTriangle className="w-3 h-3 text-white" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">3</span>
            </button>
            <button className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
              <Route className="w-3 h-3 text-white" />
            </button>
            <button className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors relative">
              <Bell className="w-3 h-3 text-white" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">3</span>
            </button>
          </div>
        </div>
      </div>

      {/* Monthly Plan Status Line */}
      <div 
        className="bg-blue-50 border border-blue-200 rounded-lg p-3 cursor-pointer hover:bg-blue-100 transition-colors"
        onClick={() => setShowPlanModal(true)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Monthly Plan - Approved</span>
          </div>
          <ChevronDown className="w-4 h-4 text-blue-600" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-purple-500 rounded-lg p-4 text-white">
          <h3 className="text-sm opacity-90 mb-1">Team Members</h3>
          <div className="text-2xl font-bold">4</div>
          <p className="text-xs opacity-80">MDOs under TSM</p>
          <p className="text-xs opacity-70">All active today</p>
        </div>
        <div className="bg-pink-500 rounded-lg p-4 text-white">
          <h3 className="text-sm opacity-90 mb-1">Activities Done</h3>
          <div className="text-2xl font-bold">1374</div>
          <p className="text-xs opacity-80">out of 1620 planned</p>
          <p className="text-xs opacity-70">85% Achievement Rate</p>
        </div>
      </div>

      {/* Live Meetings Section */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <h3 className="font-semibold text-sm text-gray-900">Live Meetings</h3>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-green-600 font-semibold text-sm">2 Active</span>
            <button className="text-gray-400">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="space-y-3">
          {/* Rajesh Kumar Meeting */}
          <div className="bg-green-50 rounded-lg p-3 border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-semibold text-sm text-gray-900">Rajesh Kumar</span>
              </div>
              <div className="text-right">
                <div className="text-green-600 font-semibold text-sm">25 min</div>
                <div className="text-xs text-gray-500">Started 10:45 AM</div>
              </div>
            </div>
            <div className="text-xs text-gray-600">
              <p className="font-medium">Ram Kumar Farm</p>
              <p>Green Valley, Sector 12</p>
            </div>
          </div>

          {/* Priya Sharma Meeting */}
          <div className="bg-green-50 rounded-lg p-3 border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-semibold text-sm text-gray-900">Priya Sharma</span>
              </div>
              <div className="text-right">
                <div className="text-green-600 font-semibold text-sm">15 min</div>
                <div className="text-xs text-gray-500">Started 11:20 AM</div>
              </div>
            </div>
            <div className="text-xs text-gray-600">
              <p className="font-medium">Sunrise Agro Store</p>
              <p>Market Road, Anand</p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Performance */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="font-semibold text-sm text-gray-900 mb-3">MDO Activity Breakdown</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Rajesh Kumar</p>
                <p className="text-xs text-blue-600">Farmer Visits: 18/20</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-green-600">90%</p>
              <p className="text-xs text-blue-500">Achievement</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Priya Sharma</p>
                <p className="text-xs text-green-600">Product Demos: 14/16</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-green-600">88%</p>
              <p className="text-xs text-green-500">Achievement</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Amit Singh</p>
                <p className="text-xs text-purple-600">Dealer Meetings: 10/12</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-green-600">83%</p>
              <p className="text-xs text-purple-500">Achievement</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Neha Gupta</p>
                <p className="text-xs text-orange-600">Stock Reviews: 8/10</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-green-600">80%</p>
              <p className="text-xs text-orange-500">Achievement</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTracker = () => (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-bold text-gray-900">Team Tracker</h2>
      
      <div className="space-y-3">
        {[
          { name: 'Rajesh Kumar', location: 'Green Valley', status: 'Active', time: '2h 15m' },
          { name: 'Priya Sharma', location: 'Market Road', status: 'Active', time: '1h 45m' },
          { name: 'Amit Singh', location: 'Industrial Area', status: 'Break', time: '15m' },
        ].map((member, index) => (
          <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  member.status === 'Active' ? 'bg-green-500' : 'bg-yellow-500'
                }`}></div>
                <div>
                  <p className="font-medium text-sm">{member.name}</p>
                  <p className="text-xs text-gray-600">{member.location}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">{member.time}</p>
                <p className="text-xs text-gray-500">{member.status}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTasks = () => (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-bold text-gray-900">Orders</h2>
      
      <div className="space-y-3">
        {[
          { id: 'SO-001', customer: 'Ram Kumar', amount: '₹45,000', status: 'Pending' },
          { id: 'SO-002', customer: 'Green Agro', amount: '₹32,000', status: 'Approved' },
          { id: 'SO-003', customer: 'Suresh Traders', amount: '₹28,000', status: 'Delivered' },
        ].map((order, index) => (
          <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{order.id}</p>
                <p className="text-xs text-gray-600">{order.customer}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">{order.amount}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                  order.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLiquidation = () => (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-bold text-gray-900">Liquidation</h2>
      
      {/* Team/Self Tabs - Only show for TSM and above */}
      {['TSM', 'RBH', 'RMM', 'ZBH', 'MH', 'VP_SM', 'MD', 'CHRO', 'CFO'].includes('TSM') && (
        <div className="bg-white rounded-lg p-1 shadow-sm mb-4">
          <div className="flex space-x-1">
            <button 
              onClick={() => setActiveLiquidationTab('team')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeLiquidationTab === 'team'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Team
            </button>
            <button 
              onClick={() => setActiveLiquidationTab('self')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeLiquidationTab === 'self'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Self
            </button>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-orange-50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-orange-600">
            {activeLiquidationTab === 'team' ? '32,660' : '5,420'}
          </div>
          <div className="text-xs text-orange-600">Opening Stock</div>
        </div>
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-green-600">
            {activeLiquidationTab === 'team' ? '28%' : '25%'}
          </div>
          <div className="text-xs text-green-600">Liquidation Rate</div>
        </div>
      </div>

      <div className="space-y-3">
        {(activeLiquidationTab === 'team' ? distributorMetrics : [
          {
            id: 'SELF_001',
            distributorName: 'Personal Territory - Ram Kumar',
            distributorCode: 'PT001',
            metrics: {
              liquidationPercentage: 25
            }
          },
          {
            id: 'SELF_002', 
            distributorName: 'Personal Territory - Suresh Traders',
            distributorCode: 'PT002',
            metrics: {
              liquidationPercentage: 23
            }
          }
        ]).slice(0, 3).map((distributor) => (
          <div 
            key={distributor.id} 
            className="bg-white rounded-lg p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleDistributorClick(distributor)}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-medium text-sm">{distributor.distributorName}</p>
                <p className="text-xs text-gray-600">{distributor.distributorCode}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-purple-600">{distributor.metrics.liquidationPercentage}%</p>
                <p className="text-xs text-gray-500">Liquidation</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full" 
                style={{ width: `${distributor.metrics.liquidationPercentage}%` }}
              ></div>
            </div>
            <div className="mt-2 flex justify-end">
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Distributor Detail View
  const renderDistributorDetail = () => {
    if (!selectedDistributor) return null;
    
    const detail = getDistributorDetail(selectedDistributor.id);
    
    return (
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-4">
          <button
            onClick={() => setSelectedDistributor(null)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-gray-900">{detail.retailerName}</h2>
            <p className="text-sm text-gray-600">{detail.retailerCode}</p>
          </div>
        </div>

        {/* Product Info */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">{detail.productName}</h3>
          <p className="text-sm text-blue-600">{detail.skuName}</p>
        </div>

        {/* Stock Cards */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-orange-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-orange-600">{detail.assignedStock}</div>
            <div className="text-xs text-orange-600">Assigned</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-blue-600">{editingStock ? tempStock : detail.currentStock}</div>
            <div className="text-xs text-blue-600">Current</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-green-600">{detail.liquidatedStock}</div>
            <div className="text-xs text-green-600">Liquidated</div>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Liquidation Progress</span>
            <span>{detail.liquidationPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full" 
              style={{ width: `${detail.liquidationPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Stock Update Section */}
        {editingStock ? (
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-3">Update Current Stock</h4>
            <div className="flex items-center space-x-3 mb-4">
              <button
                onClick={() => setTempStock(Math.max(0, tempStock - 1))}
                className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                value={tempStock}
                onChange={(e) => setTempStock(parseInt(e.target.value) || 0)}
                className="flex-1 text-center text-xl font-bold border border-gray-300 rounded-lg py-2"
              />
              <button
                onClick={() => setTempStock(tempStock + 1)}
                className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleStockUpdate}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium"
              >
                Save
              </button>
              <button
                onClick={() => setEditingStock(false)}
                className="flex-1 bg-gray-500 text-white py-2 rounded-lg font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-3">Actions</h4>
            <div className="space-y-2">
              <button
                onClick={() => setEditingStock(true)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium flex items-center justify-center"
              >
                <Edit className="w-4 h-4 mr-2" />
                Update Stock
              </button>
              <button
                onClick={handleVerifyStock}
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium flex items-center justify-center"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Verify Stock
              </button>
              <button
                onClick={handleSignature}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-medium flex items-center justify-center"
              >
                <FileText className="w-4 h-4 mr-2" />
                E-Signature
              </button>
              <button
                onClick={handleDocumentUpload}
                className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium flex items-center justify-center relative"
              >
                <Camera className="w-4 h-4 mr-2" />
                Upload Document
                {uploadedProofs.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 text-white rounded-full text-xs flex items-center justify-center">
                    {uploadedProofs.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Uploaded Proofs Section */}
        {uploadedProofs.length > 0 && (
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-3">Uploaded Proofs ({uploadedProofs.length})</h4>
            <div className="space-y-3">
              {uploadedProofs.slice(-3).map((proof) => {
                const { date, time } = formatTimestamp(proof.timestamp);
                return (
                  <div key={proof.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        proof.type === 'photo' ? 'bg-blue-100' :
                        proof.type === 'video' ? 'bg-purple-100' :
                        'bg-green-100'
                      }`}>
                        {proof.type === 'photo' && <ImageIcon className="w-5 h-5 text-blue-600" />}
                        {proof.type === 'video' && <Video className="w-5 h-5 text-purple-600" />}
                        {proof.type === 'signature' && <FileText className="w-5 h-5 text-green-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm capitalize">
                          {proof.type === 'photo' ? 'Photo Captured' : 
                           proof.type === 'video' ? 'Video Recorded' : 
                           'Signature Captured'}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {date}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {time}
                          </span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span>{proof.location.latitude.toFixed(4)}, {proof.location.longitude.toFixed(4)}</span>
                        </div>
                        {proof.metadata.fileSize > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            Size: {(proof.metadata.fileSize / 1024).toFixed(1)} KB
                            {proof.type === 'video' && proof.metadata.duration && (
                              <span> • {proof.metadata.duration}s</span>
                            )}
                          </div>
                        )}
                      </div>
                      <button className="text-blue-600 text-xs">
                        View
                      </button>
                    </div>
                    
                    {/* Timestamp Verification Badge */}
                    <div className="mt-2 flex items-center justify-center">
                      <button 
                        onClick={() => setSelectedModal(`balance-${selectedDistributor.id}`)}
                        className="bg-green-600 text-white px-2 py-1 rounded text-xs flex items-center hover:bg-green-700"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified with GPS & Time
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            {uploadedProofs.length > 3 && (
              <p className="text-center text-xs text-gray-500">
                +{uploadedProofs.length - 3} more proofs
              </p>
            )}
          </div>
        )}

        {/* Status Indicators */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h4 className="font-semibold text-gray-900 mb-3">Verification Status</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Signature</span>
              <span className={`text-sm font-medium ${
                uploadedProofs.some(p => p.type === 'signature') ? 'text-green-600' : 'text-red-600'
              }`}>
                {uploadedProofs.some(p => p.type === 'signature') ? 'Completed' : 'Pending'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Documents</span>
              <span className={`text-sm font-medium ${
                uploadedProofs.some(p => p.type === 'photo' || p.type === 'video') ? 'text-green-600' : 'text-red-600'
              }`}>
                {uploadedProofs.some(p => p.type === 'photo' || p.type === 'video') ? 'Uploaded' : 'Pending'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Location</span>
              <span className={`text-sm font-medium ${latitude && longitude ? 'text-green-600' : 'text-red-600'}`}>
                {latitude && longitude ? 'Verified' : 'Pending'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Last Updated</span>
              <span className="text-sm text-gray-500">{new Date(detail.lastUpdated).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Verification Modal
  const renderVerificationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-sm max-h-[80vh] overflow-hidden">
        <div className="bg-purple-100 p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Stock Verification</h3>
            <button
              onClick={() => setShowVerifyModal(false)}
              className="p-1 hover:bg-purple-200 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="p-4 space-y-4">
          <div className="bg-blue-50 rounded-lg p-3">
            <h4 className="font-semibold text-blue-800 mb-2">DAP 25kg Bag</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-blue-700">Invoice 1:</span>
                <input
                  type="number"
                  placeholder="105"
                  className="w-16 px-2 py-1 border border-blue-300 rounded text-sm text-center"
                />
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-blue-700">Invoice 2:</span>
                <input
                  type="number"
                  placeholder="105"
                  className="w-16 px-2 py-1 border border-blue-300 rounded text-sm text-center"
                />
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-3">
            <h4 className="font-semibold text-green-800 mb-2">DAP 50kg Bag</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-green-700">Invoice 1:</span>
                <input
                  type="number"
                  placeholder="105"
                  className="w-16 px-2 py-1 border border-green-300 rounded text-sm text-center"
                />
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-green-700">Invoice 2:</span>
                <input
                  type="number"
                  placeholder="105"
                  className="w-16 px-2 py-1 border border-green-300 rounded text-sm text-center"
                />
              </div>
            </div>
          </div>
          
          <button
            onClick={() => {
              setShowVerifyModal(false);
              alert('Stock verified successfully!');
            }}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium"
          >
            Verify Stock
          </button>
        </div>
      </div>
    </div>
  );

  // E-Signature Modal
  const renderSignatureModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-sm max-h-[80vh] overflow-hidden">
        <div className="bg-green-100 p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">E-Signature</h3>
            <button
              onClick={() => setShowSignatureModal(false)}
              className="p-1 hover:bg-green-200 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="p-4 space-y-4">
          {isCapturing && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-sm text-green-800">Capturing signature with location...</p>
            </div>
          )}
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 h-40 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <FileText className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">Signature Pad</p>
              <p className="text-xs">Draw your signature here</p>
            </div>
          </div>
          
          {/* Location Info */}
          <div className={`p-2 rounded-lg text-xs ${
            latitude && longitude 
              ? 'bg-green-50 text-green-700' 
              : 'bg-red-50 text-red-700'
          }`}>
            <div className="flex items-center justify-center space-x-1">
              <MapPin className="w-3 h-3" />
              <span>
                {latitude && longitude 
                  ? `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
                  : 'Location not available'
                }
              </span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg">
              Clear
            </button>
            <button
              onClick={handleSignatureCapture}
              disabled={isCapturing || (!latitude || !longitude)}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg disabled:opacity-50"
            >
              {isCapturing ? 'Saving...' : 'Save with Location'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Document Upload Modal
  const renderDocumentModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-sm max-h-[80vh] overflow-hidden">
        <div className="bg-orange-100 p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Upload Documents</h3>
            <button
              onClick={() => setShowDocumentModal(false)}
              className="p-1 hover:bg-orange-200 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="p-4 space-y-4">
          {isCapturing && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-sm text-blue-800">Capturing with location...</p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => handleCameraCapture('photo')}
              disabled={isCapturing}
              className="bg-blue-600 text-white py-4 rounded-lg flex flex-col items-center disabled:opacity-50 hover:bg-blue-700 transition-colors"
            >
              <Camera className="w-7 h-7 mb-2" />
              <span className="text-sm font-medium">Click Pic</span>
              <span className="text-xs opacity-90">With timestamp</span>
            </button>
            <label className="bg-purple-600 text-white py-4 rounded-lg flex flex-col items-center cursor-pointer hover:bg-purple-700 transition-colors">
              <Upload className="w-7 h-7 mb-2" />
              <span className="text-sm font-medium">Upload Doc</span>
              <span className="text-xs opacity-90">From gallery</span>
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                className="hidden"
              />
            </label>
          </div>
          
          {/* Video Capture Option */}
          <div className="text-center">
            <button 
              onClick={() => handleCameraCapture('video')}
              disabled={isCapturing}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg flex items-center justify-center disabled:opacity-50 hover:bg-indigo-700 transition-colors"
            >
              <Video className="w-5 h-5 mr-2" />
              <span className="font-medium">Record Video</span>
              <span className="text-xs opacity-90 ml-2">• With location & time</span>
            </button>
          </div>
          
          {/* Location Status */}
          <div className={`p-3 rounded-lg border ${
            latitude && longitude 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center space-x-2">
              <MapPin className={`w-4 h-4 ${latitude && longitude ? 'text-green-600' : 'text-red-600'}`} />
              <span className={`text-sm font-medium ${latitude && longitude ? 'text-green-800' : 'text-red-800'}`}>
                {latitude && longitude 
                  ? `Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
                  : 'Location access required'
                }
              </span>
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <Clock className={`w-3 h-3 ${latitude && longitude ? 'text-green-600' : 'text-red-600'}`} />
              <span className={`text-xs ${latitude && longitude ? 'text-green-700' : 'text-red-700'}`}>
                {new Date().toLocaleString('en-IN')}
              </span>
            </div>
            {locationError && (
              <p className="text-xs text-red-600 mt-1">{locationError}</p>
            )}
          </div>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            {uploadedProofs.length > 0 ? (
              <div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {uploadedProofs.slice(-3).map((proof) => (
                    <div key={proof.id} className="relative">
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        {proof.type === 'video' ? (
                          <div className="w-full h-full flex items-center justify-center bg-purple-100">
                            <Video className="w-6 h-6 text-purple-600" />
                          </div>
                        ) : proof.type === 'signature' ? (
                          <div className="w-full h-full flex items-center justify-center bg-green-100">
                            <FileText className="w-6 h-6 text-green-600" />
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-blue-100">
                            <ImageIcon className="w-6 h-6 text-blue-600" />
                          </div>
                        )}
                      </div>
                      <div className="absolute top-1 right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-green-600 font-medium">{uploadedProofs.length} proofs uploaded</p>
              </div>
            ) : (
              <div>
                <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No documents uploaded</p>
              </div>
            )}
          </div>
          
          {uploadedProofs.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-3">
              <h5 className="font-semibold text-blue-800 mb-2">Latest Proof Details</h5>
              {uploadedProofs.slice(-1).map((proof) => {
                const { date, time } = formatTimestamp(proof.timestamp);
                return (
                  <div key={proof.id} className="text-xs text-blue-700 space-y-1">
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span className="font-medium capitalize">{proof.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span className="font-medium">{date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time:</span>
                      <span className="font-medium">{time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Location:</span>
                      <span className="font-medium">{proof.location.latitude.toFixed(4)}, {proof.location.longitude.toFixed(4)}</span>
                    </div>
                    {proof.metadata.fileSize > 0 && (
                      <div className="flex justify-between">
                        <span>Size:</span>
                        <span className="font-medium">{(proof.metadata.fileSize / 1024).toFixed(1)} KB</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-bold text-gray-900">More</h2>
      
      <div className="grid grid-cols-2 gap-3">
        <button className="bg-white rounded-lg p-4 shadow-sm text-center">
          <FileText className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <p className="text-sm font-medium">Reports</p>
        </button>
        <button className="bg-white rounded-lg p-4 shadow-sm text-center">
          <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <p className="text-sm font-medium">Contacts</p>
        </button>
        <button className="bg-white rounded-lg p-4 shadow-sm text-center">
          <Calendar className="w-6 h-6 text-purple-600 mx-auto mb-2" />
          <p className="text-sm font-medium">Planning</p>
        </button>
        <button className="bg-white rounded-lg p-4 shadow-sm text-center">
          <Car className="w-6 h-6 text-orange-600 mx-auto mb-2" />
          <p className="text-sm font-medium">Travel</p>
        </button>
      </div>
    </div>
  );

  // Critical Alerts Modal
  const renderCriticalAlertsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-sm max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowCriticalAlerts(false)}
                className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-white" />
              </button>
              <div>
                <h3 className="text-lg font-semibold">Critical Alerts</h3>
                <p className="text-sm opacity-90">{criticalAlerts.length} active alerts</p>
              </div>
            </div>
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
        
        <div className="p-4">
          {/* Filter */}
          <div className="mb-4">
            <select
              value={selectedAlertCategory}
              onChange={(e) => setSelectedAlertCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="All">All Modules</option>
              <option value="Liquidation">Liquidation</option>
              <option value="Field Visits">Field Visits</option>
              <option value="Collections">Collections</option>
            </select>
          </div>
          
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {filteredAlerts.map((alert) => (
              <div key={alert.id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                        {alert.severity}
                      </span>
                      <span className="text-xs text-gray-500">{alert.module}</span>
                    </div>
                    <h4 className="font-medium text-sm text-gray-900">{alert.type}</h4>
                    <p className="text-xs text-gray-600 mt-1">{alert.message}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{alert.time}</span>
                  <button className="text-blue-600 text-xs hover:text-blue-800">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Travel Reimbursement Modal
  const renderTravelReimbursementModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-sm max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowTravelModal(false)}
                className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-white" />
              </button>
              <div>
                <h3 className="text-lg font-semibold">Team Travel</h3>
                <p className="text-sm opacity-90">Reimbursement</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <DollarSign className="w-4 h-4" />
              <AlertTriangle className="w-4 h-4" />
              <Route className="w-4 h-4" />
              <Bell className="w-4 h-4" />
            </div>
          </div>
        </div>
        
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">1895</div>
              <div className="text-xs text-blue-600">Total KMs</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-600">1850</div>
              <div className="text-xs text-green-600">Approved KMs</div>
            </div>
          </div>

          {/* Pending Approval Alert */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              <span className="font-semibold text-sm text-orange-800">Pending Approval</span>
            </div>
            <p className="text-sm text-orange-700">45 KMs awaiting team approval</p>
          </div>

          {/* Cost Breakdown */}
          <div className="mb-4">
            <h4 className="font-semibold text-sm text-gray-900 mb-3">Cost Breakdown (Team)</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Fuel Cost:</span>
                <span className="font-semibold text-gray-900">₹8,527</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Daily Allowance:</span>
                <span className="font-semibold text-gray-900">₹12,000</span>
              </div>
              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-900">Total Team Claim:</span>
                  <span className="font-bold text-green-600">₹20,527</span>
                </div>
              </div>
            </div>
          </div>

          {/* TSM Personal Travel */}
          <div className="mb-4 bg-purple-50 rounded-lg p-3 border border-purple-200">
            <h4 className="font-semibold text-sm text-purple-900 mb-3">Your Travel (Sandeep Kumar)</h4>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="text-center p-2 bg-white rounded">
                <div className="text-lg font-bold text-purple-600">285</div>
                <div className="text-xs text-purple-600">Your KMs</div>
              </div>
              <div className="text-center p-2 bg-white rounded">
                <div className="text-lg font-bold text-green-600">₹3,420</div>
                <div className="text-xs text-green-600">Your Claim</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-purple-700">Fuel Cost:</span>
                <span className="font-semibold">₹1,710</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-purple-700">Daily Allowance:</span>
                <span className="font-semibold">₹1,710</span>
              </div>
              <div className="border-t border-purple-200 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-purple-900">Your Total:</span>
                  <span className="font-bold text-purple-600">₹3,420</span>
                </div>
              </div>
            </div>
          </div>

          {/* Team Recent Days */}
          <div>
            <h4 className="font-semibold text-sm text-gray-900 mb-3">Team Recent Days</h4>
            <div className="space-y-2">
              {/* TSM's own travel first */}
              <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-purple-900">Sandeep Kumar (You)</span>
                  <span className="text-xs text-purple-600">Jan 21</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-purple-700">Delhi → Regional Office (35 km)</span>
                  <span className="text-sm font-semibold text-purple-600">₹420</span>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-900">Rajesh Kumar</span>
                  <span className="text-xs text-gray-500">Jan 20</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Delhi → Gurgaon (45 km)</span>
                  <span className="text-sm font-semibold text-green-600">₹540</span>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-900">Priya Sharma</span>
                  <span className="text-xs text-gray-500">Jan 19</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Delhi → Noida (32 km)</span>
                  <span className="text-sm font-semibold text-green-600">₹384</span>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-900">Amit Singh</span>
                  <span className="text-xs text-gray-500">Jan 18</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Delhi → Faridabad (28 km)</span>
                  <span className="text-sm font-semibold text-yellow-600">₹336</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (selectedDistributor) {
      return renderDistributorDetail();
    }
    
    switch (activeTab) {
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
  // If user is MDO, show MDO-specific mobile interface
  if (user?.role === 'MDO') {
    return (
      <div className="max-w-sm mx-auto bg-white min-h-screen flex flex-col">
        {/* MDO Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold">{user.name}</h1>
              <p className="text-blue-100 text-sm">MDO - {user.territory}</p>
            </div>
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* MDO Quick Stats */}
        <div className="p-4 bg-gray-50">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-blue-600">8</div>
              <div className="text-xs text-gray-600">Today's Visits</div>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-green-600">3</div>
              <div className="text-xs text-gray-600">Completed</div>
            </div>
          </div>
        </div>

        {/* MDO Main Content */}
        <div className="flex-1 p-4 space-y-4">
          {activeTab === 'home' && (
            <div className="space-y-4">
              {/* Today's Schedule */}
              <div className="bg-white rounded-lg p-4 border">
                <h3 className="font-semibold text-gray-900 mb-3">Today's Schedule</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-2 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Ram Kumar Farm</p>
                      <p className="text-xs text-gray-600">10:00 AM - Product Demo</p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Completed</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-2 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Suresh Traders</p>
                      <p className="text-xs text-gray-600">2:30 PM - Stock Review</p>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">In Progress</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Amit Agro Solutions</p>
                      <p className="text-xs text-gray-600">4:00 PM - Payment Collection</p>
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">Pending</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg p-4 border">
                <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button className="bg-purple-500 text-white p-3 rounded-lg text-sm font-medium">
                    Start Visit
                  </button>
                  <button className="bg-green-500 text-white p-3 rounded-lg text-sm font-medium">
                    Take Photo
                  </button>
                  <button className="bg-blue-500 text-white p-3 rounded-lg text-sm font-medium">
                    Create Order
                  </button>
                  <button className="bg-orange-500 text-white p-3 rounded-lg text-sm font-medium">
                    Collection
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tracker' && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border">
                <h3 className="font-semibold text-gray-900 mb-3">Activity Tracker</h3>
                <div className="space-y-3">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-800">38</div>
                      <div className="text-xs text-blue-600">Activities Completed</div>
                    </div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-800">45</div>
                      <div className="text-xs text-orange-600">Monthly Target</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border">
                <h3 className="font-semibold text-gray-900 mb-3">My Tasks</h3>
                <div className="space-y-2">
                  <div className="p-2 bg-red-50 rounded border-l-4 border-red-500">
                    <p className="text-sm font-medium">Visit SRI RAMA SEEDS</p>
                    <p className="text-xs text-gray-600">Due: Today</p>
                  </div>
                  <div className="p-2 bg-yellow-50 rounded border-l-4 border-yellow-500">
                    <p className="text-sm font-medium">Monthly Sales Report</p>
                    <p className="text-xs text-gray-600">Due: Jan 25</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'liquidation' && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border">
                <h3 className="font-semibold text-gray-900 mb-3">Stock Liquidation</h3>
                <div className="space-y-3">
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="text-center">
                      <div className="text-xl font-bold text-green-800">28%</div>
                      <div className="text-xs text-green-600">Liquidation Rate</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>SRI RAMA SEEDS</span>
                      <span className="font-semibold text-green-600">71%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Ram Kumar</span>
                      <span className="font-semibold text-yellow-600">29%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border">
                <h3 className="font-semibold text-gray-900 mb-3">Reports</h3>
                <div className="space-y-2">
                  <button className="w-full bg-purple-100 text-purple-700 p-3 rounded-lg text-sm font-medium text-left">
                    Daily Activity Report
                  </button>
                  <button className="w-full bg-blue-100 text-blue-700 p-3 rounded-lg text-sm font-medium text-left">
                    Weekly Performance
                  </button>
                  <button className="w-full bg-green-100 text-green-700 p-3 rounded-lg text-sm font-medium text-left">
                    Monthly Summary
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MDO Footer Navigation */}
        <div className="bg-white border-t border-gray-200 p-2 mt-auto">
          <div className="flex justify-around items-center">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                activeTab === 'home' ? 'text-purple-600 bg-purple-50' : 'text-gray-600'
              }`}
            >
              <Home className="w-5 h-5 mb-1" />
              <span className="text-xs">Home</span>
            </button>
            
            <button
              onClick={() => setActiveTab('tracker')}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                activeTab === 'tracker' ? 'text-purple-600 bg-purple-50' : 'text-gray-600'
              }`}
            >
              <Activity className="w-5 h-5 mb-1" />
              <span className="text-xs">Tracker</span>
            </button>
            
            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                activeTab === 'tasks' ? 'text-purple-600 bg-purple-50' : 'text-gray-600'
              }`}
            >
              <CheckSquare className="w-5 h-5 mb-1" />
              <span className="text-xs">Tasks</span>
            </button>
            
            <button
              onClick={() => setActiveTab('liquidation')}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                activeTab === 'liquidation' ? 'text-purple-600 bg-purple-50' : 'text-gray-600'
              }`}
            >
              <Droplets className="w-5 h-5 mb-1" />
              <span className="text-xs">Liquidation</span>
            </button>
            
            <button
              onClick={() => setActiveTab('reports')}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                activeTab === 'reports' ? 'text-purple-600 bg-purple-50' : 'text-gray-600'
              }`}
            >
              <FileText className="w-5 h-5 mb-1" />
              <span className="text-xs">Reports</span>
            </button>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="max-w-sm mx-auto bg-gray-100 min-h-screen flex flex-col">
      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-white border-t border-gray-200 px-4 py-2 z-40">
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
            <ShoppingCart className="w-5 h-5 mb-1" />
            <span className="text-xs">Orders</span>
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
      
      {/* Travel Reimbursement Modal */}
      {showTravelModal && renderTravelReimbursementModal()}

      {/* Monthly Plan Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b bg-blue-50">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Current Monthly Plan</h3>
                <p className="text-sm text-blue-600">{currentPlan.title}</p>
              </div>
              <button
                onClick={() => setShowPlanModal(false)}
                className="p-2 hover:bg-blue-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto max-h-[calc(80vh-120px)]">
              <div className="space-y-4">
                {/* Plan Status */}
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-green-800">Plan Status</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      {currentPlan.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs text-green-700">
                    <div>
                      <span className="font-medium">Created by:</span>
                      <div>{currentPlan.createdBy} ({currentPlan.createdByRole})</div>
                    </div>
                    <div>
                      <span className="font-medium">Created on:</span>
                      <div>{new Date(currentPlan.createdDate).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <span className="font-medium">Approved by:</span>
                      <div>{currentPlan.approvedBy}</div>
                    </div>
                    <div>
                      <span className="font-medium">Approved on:</span>
                      <div>{new Date(currentPlan.approvedDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>

                {/* Activities Progress */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Activities Progress</h4>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="text-lg font-bold text-blue-600">{currentPlan.activities.planned}</div>
                      <div className="text-xs text-gray-600">Planned</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-600">{currentPlan.activities.completed}</div>
                      <div className="text-xs text-gray-600">Completed</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-orange-600">{currentPlan.activities.pending}</div>
                      <div className="text-xs text-gray-600">Pending</div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{Math.round((currentPlan.activities.completed / currentPlan.activities.planned) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(currentPlan.activities.completed / currentPlan.activities.planned) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Monthly Targets */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Monthly Targets</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Dealer Visits</span>
                      <span className="font-semibold text-gray-900">{currentPlan.targets.visits}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Sales Target</span>
                      <span className="font-semibold text-gray-900">₹{(currentPlan.targets.sales / 100000).toFixed(1)}L</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">New Customers</span>
                      <span className="font-semibold text-gray-900">{currentPlan.targets.newCustomers}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-2">
                  <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors">
                    View Full Plan Details
                  </button>
                  <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                    Update Progress
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Modal - Mobile Version */}
      {selectedModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
          <div className="bg-white rounded-xl w-full max-w-sm max-h-[90vh] overflow-hidden">
            {(() => {
              const [type, distributorId] = selectedModal.split('-');
              const distributor = distributors.find(d => d.id === distributorId);
              
              if (!distributor) return null;

              const modalData = {
                opening: { title: 'Opening Stock', subtitle: 'SKU-wise opening stock breakdown', volume: distributor.openingStock.volume, value: distributor.openingStock.value },
                ytd: { title: 'YTD Net Sales', subtitle: 'SKU-wise sales performance', volume: distributor.ytdNetSales.volume, value: distributor.ytdNetSales.value },
                liquidation: { title: 'Liquidation', subtitle: 'SKU-wise liquidation breakdown', volume: distributor.liquidation.volume, value: distributor.liquidation.value },
                balance: { title: 'Balance Stock', subtitle: 'SKU-wise stock verification', volume: distributor.balanceStock.volume, value: distributor.balanceStock.value }
              }[type];
      
              if (!modalData) return null;

              return (
                <>
                  {/* Modal Header */}
                  <div className="bg-blue-50 p-4 border-b border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{modalData.title} - {distributor.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{modalData.subtitle}</p>
                      </div>
                      <button
                        onClick={() => setSelectedModal(null)}
                        className="p-2 hover:bg-blue-100 rounded-full transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4 overflow-y-auto max-h-[calc(90vh-200px)]">
                    <div className="space-y-4">
                      {/* Total Summary */}
                      <div className="text-center bg-gray-50 rounded-xl p-4">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Total {modalData.title}</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-2xl font-bold text-gray-900">{modalData.volume}</div>
                            <div className="text-xs text-gray-600">Total Volume (Kg/Litre)</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-gray-900">₹{modalData.value}L</div>
                            <div className="text-xs text-gray-600">Total Value</div>
                          </div>
                        </div>
                      </div>

                      {/* SKU Breakdown */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Invoice-wise Breakdown</h4>
                        
                        {/* DAP 25kg */}
                        <div className="mb-4">
                          <div className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium mb-3 inline-block">
                            DAP 25kg Bag
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="space-y-2">
                               <div className="grid grid-cols-3 gap-2 text-xs font-medium text-gray-700">
                                <span>Invoice</span>
                                <span>Volume</span>
                                <span>Value</span>
                              </div>
                              <div className="grid grid-cols-3 gap-2 text-xs">
                                <span>INV-001</span>
                                <span>1,250 Kg</span>
                                <span>₹1.6L</span>
                              </div>
                              <div className="grid grid-cols-3 gap-2 text-xs">
                                <span>INV-002</span>
                                <span>900 Kg</span>
                                <span>₹1.2L</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* DAP 50kg */}
                        <div className="mb-4">
                          <div className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-medium mb-3 inline-block">
                            DAP 50kg Bag
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="space-y-2">
                              <div className="grid grid-cols-3 gap-2 text-xs font-medium text-gray-700">
                                <span>Invoice</span>
                                <span>Volume</span>
                                <span>Value</span>
                              </div>
                              <div className="grid grid-cols-3 gap-2 text-xs">
                                <span>INV-003</span>
                                <span>350 Kg</span>
                                <span>₹0.4L</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Verification Modal */}
      {showVerifyModal && renderVerificationModal()}

      {/* Signature Modal */}
      {showSignatureModal && renderSignatureModal()}

      {/* Document Modal */}
      {showDocumentModal && renderDocumentModal()}
    </div>
  );
};

export default MobileApp;