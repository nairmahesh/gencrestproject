import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Package, 
  TrendingUp, 
  Droplets, 
  Target, 
  DollarSign,
  Building,
  MapPin,
  Phone,
  Calendar,
  User,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  Edit,
  FileSignature,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  ChevronRight
} from 'lucide-react';
import { useLiquidationCalculation } from '../hooks/useLiquidationCalculation';

interface LiquidationEntry {
  id: string;
  dealerId: string;
  dealerName: string;
  dealerCode: string;
  dealerAddress: string;
  dealerPhone: string;
  territory: string;
  region: string;
  zone: string;
  assignedMDO?: string;
  assignedTSM?: string;
  
  productId: string;
  productName: string;
  productCode: string;
  openingStock: number;
  currentStock: number;
  billingDate: string;
  volume: number;
  grossValue: number;
  netValue: number;
  returns: number;
  status: 'Active' | 'Pending' | 'Completed' | 'Overdue';
  priority: 'High' | 'Medium' | 'Low';
  lastUpdated: string;
  updatedBy: string;
  hasSignature: boolean;
  hasMedia: boolean;
  location?: {
    latitude: number;
    longitude: number;
  };
  timestamp: string;
  liquidationPercentage: number;
  targetLiquidation: number;
  daysOverdue: number;
  remarks?: string;
  approvalStatus: 'Pending' | 'Approved' | 'Rejected';
  approvedBy?: string;
  approvedDate?: string;
  dealerType: string;
}

const Liquidation: React.FC = () => {
  const navigate = useNavigate();
  const { overallMetrics } = useLiquidationCalculation();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<string>('');

  // Sample liquidation data
  const liquidationEntries: LiquidationEntry[] = [
    {
      id: 'LIQ001',
      dealerId: 'DIST001',
      dealerName: 'SRI RAMA SEEDS AND PESTICIDES',
      dealerCode: '1325',
      dealerType: 'Distributor',
      dealerAddress: 'Main Market, Agricultural Zone',
      dealerPhone: '+91 98765 12345',
      territory: 'North Delhi',
      region: 'Delhi NCR',
      zone: 'North Zone',
      assignedMDO: 'MDO001',
      assignedTSM: 'TSM001',
      
      productId: 'P001',
      productName: 'Multiple Products',
      productCode: 'MULTI',
      openingStock: 40,
      currentStock: 210,
      billingDate: '2024-01-15',
      volume: 140,
      grossValue: 138000,
      netValue: 93000,
      returns: 0,
      status: 'Active',
      priority: 'High',
      lastUpdated: '2024-01-20',
      updatedBy: 'MDO001',
      hasSignature: true,
      hasMedia: true,
      location: {
        latitude: 28.6139,
        longitude: 77.2090
      },
      timestamp: '2024-01-20T10:30:00Z',
      liquidationPercentage: 40,
      targetLiquidation: 50,
      daysOverdue: 0,
      remarks: 'Good progress on liquidation',
      approvalStatus: 'Approved',
      approvedBy: 'TSM001',
      approvedDate: '2024-01-20'
    },
    {
      id: 'LIQ002',
      dealerId: 'DIST002',
      dealerName: 'Ram Kumar Distributors',
      dealerCode: 'DLR001',
      dealerType: 'Distributor',
      dealerAddress: 'Green Valley, Sector 12',
      dealerPhone: '+91 98765 43210',
      territory: 'South Delhi',
      region: 'Delhi NCR',
      zone: 'North Zone',
      assignedMDO: 'MDO001',
      assignedTSM: 'TSM001',
      
      productId: 'P002',
      productName: 'NPK Fertilizer',
      productCode: 'NPK001',
      openingStock: 100,
      currentStock: 75,
      billingDate: '2024-01-10',
      volume: 15,
      grossValue: 120000,
      netValue: 18000,
      returns: 10,
      status: 'Pending',
      priority: 'Medium',
      lastUpdated: '2024-01-19',
      updatedBy: 'MDO001',
      hasSignature: false,
      hasMedia: true,
      location: {
        latitude: 28.5355,
        longitude: 77.3910
      },
      timestamp: '2024-01-19T14:15:00Z',
      liquidationPercentage: 25,
      targetLiquidation: 40,
      daysOverdue: 5,
      remarks: 'Slow liquidation, needs attention',
      approvalStatus: 'Pending',
    },
    {
      id: 'LIQ003',
      dealerId: 'DIST003',
      dealerName: 'Green Agro Store',
      dealerCode: 'DLR003',
      dealerType: 'Retailer',
      dealerAddress: 'Industrial Area, Sector 8',
      dealerPhone: '+91 76543 21098',
      territory: 'East Delhi',
      region: 'Delhi NCR',
      zone: 'North Zone',
      assignedMDO: 'MDO001',
      assignedTSM: 'TSM001',
      
      productId: 'P003',
      productName: 'DAP Fertilizer',
      productCode: 'DAP001',
      openingStock: 120,
      currentStock: 90,
      billingDate: '2024-01-12',
      volume: 20,
      grossValue: 144000,
      netValue: 24000,
      returns: 10,
      status: 'Overdue',
      priority: 'High',
      lastUpdated: '2024-01-18',
      updatedBy: 'MDO001',
      hasSignature: false,
      hasMedia: false,
      location: {
        latitude: 28.4089,
        longitude: 77.3178
      },
      timestamp: '2024-01-18T16:45:00Z',
      liquidationPercentage: 25,
      targetLiquidation: 35,
      daysOverdue: 10,
      remarks: 'Overdue liquidation, immediate action required',
      approvalStatus: 'Rejected',
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'text-green-700 bg-green-100';
      case 'Pending':
        return 'text-yellow-700 bg-yellow-100';
      case 'Completed':
        return 'text-blue-700 bg-blue-100';
      case 'Overdue':
        return 'text-red-700 bg-red-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'text-red-700 bg-red-100';
      case 'Medium':
        return 'text-yellow-700 bg-yellow-100';
      case 'Low':
        return 'text-green-700 bg-green-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <CheckCircle className="w-4 h-4" />;
      case 'Pending':
        return <Clock className="w-4 h-4" />;
      case 'Completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'Overdue':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const filteredEntries = liquidationEntries.filter(entry => {
    const matchesSearch = entry.dealerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.dealerCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All' || entry.dealerType === typeFilter;
    const matchesStatus = statusFilter === 'All' || entry.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || entry.priority === priorityFilter;
    return matchesSearch && matchesType && matchesStatus && matchesPriority;
  });

  const handleMetricClick = (metric: string) => {
    setSelectedMetric(metric);
    setShowDetailModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Stock Liquidation Management</h1>
            <p className="text-gray-600">Track and manage distributor stock liquidation</p>
          </div>
        </div>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add Entry
        </button>
      </div>


        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div 
            className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-orange-500 cursor-pointer hover:shadow-xl transition-all duration-200 hover:scale-105"
            onClick={() => handleMetricClick('opening')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Opening Stock</p>
                <p className="text-2xl font-bold text-gray-900">{overallMetrics.openingStock.volume.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Kg/Litre</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Value: ₹{overallMetrics.openingStock.value.toFixed(2)}L
            </div>
            <div className="mt-3 text-xs text-gray-400">
              Last updated: Jan 20, 2024
            </div>
          </div>

          <div 
            className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500 cursor-pointer hover:shadow-xl transition-all duration-200 hover:scale-105"
            onClick={() => handleMetricClick('sales')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">YTD Net Sales</p>
                <p className="text-2xl font-bold text-gray-900">{overallMetrics.ytdNetSales.volume.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Kg/Litre</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Value: ₹{overallMetrics.ytdNetSales.value.toFixed(2)}L
            </div>
            <div className="mt-3 text-xs text-gray-400">
              Last updated: Jan 20, 2024
            </div>
          </div>

          <div 
            className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-500 cursor-pointer hover:shadow-xl transition-all duration-200 hover:scale-105"
            onClick={() => handleMetricClick('liquidation')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Liquidation</p>
                <p className="text-2xl font-bold text-gray-900">{overallMetrics.liquidation.volume.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Kg/Litre</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Droplets className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Value: ₹{overallMetrics.liquidation.value.toFixed(2)}L
            </div>
            <div className="mt-3 text-xs text-gray-400">
              Last updated: Jan 20, 2024
            </div>
          </div>

          <div 
            className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-purple-500 cursor-pointer hover:shadow-xl transition-all duration-200 hover:scale-105"
            onClick={() => handleMetricClick('balance')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Balance Stock</p>
                <p className="text-2xl font-bold text-gray-900">{overallMetrics.balanceStock.volume.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Kg/Litre</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Value: ₹{overallMetrics.balanceStock.value.toFixed(2)}L
            </div>
            <div className="mt-3 text-xs text-gray-400">
              Last updated: Jan 20, 2024
            </div>
          </div>
        </div>

        {/* Liquidation Percentage Card */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 mb-6">
          <div className="text-center mb-6">
            <h4 className="text-lg font-bold text-gray-900 mb-4">Liquidation Progress</h4>
            <div className="text-4xl font-bold text-purple-600 mb-2">{overallMetrics.liquidationPercentage}%</div>
            <p className="text-sm text-gray-600 mb-4">Overall Performance</p>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-1000" 
                style={{ width: `${overallMetrics.liquidationPercentage}%` }}
              ></div>
            </div>
            
            {/* Progress Labels */}
            <div className="flex justify-between text-xs text-gray-500">
              <span>0%</span>
              <span>100%</span>
            </div>
            
            <div className="mt-3 text-xs text-gray-400">
              Last updated: Jan 20, 2024
            </div>
          </div>
        </div>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Entries</p>
              <p className="text-2xl font-bold text-gray-900">{liquidationEntries.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Building className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">
                {liquidationEntries.filter(e => e.status === 'Active').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {liquidationEntries.filter(e => e.status === 'Pending').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">
                {liquidationEntries.filter(e => e.status === 'Overdue').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by dealer name, code, or product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="All">All Types</option>
              <option value="Distributor">Distributors</option>
              <option value="Retailer">Retailers</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Overdue">Overdue</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="All">All Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Liquidation Entries List */}
      <div className="space-y-4">
        {filteredEntries.map((entry) => (
          <div key={entry.id} className="bg-white rounded-xl p-6 card-shadow card-hover">
            {/* Header with Name and Status */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Building className="w-6 h-6 text-purple-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg truncate" title={entry.dealerName}>
                    {entry.dealerName}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-gray-600">Code: {entry.dealerCode}</span>
                    <span className="text-sm text-gray-400">|</span>
                    <span className="text-sm text-gray-600">{entry.productName}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  entry.dealerType === 'Distributor' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                }`}>
                  {entry.dealerType}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(entry.status)}`}>
                  {getStatusIcon(entry.status)}
                  <span className="ml-1">{entry.status}</span>
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(entry.priority)}`}>
                  {entry.priority}
                </span>
              </div>
            </div>

            {/* Card Layout as per attachment */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Opening Stock Card */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="border-b border-orange-200 pb-2 mb-3">
                  <h4 className="font-semibold text-orange-800">Opening Stock</h4>
                  <p className="text-xs text-orange-600">As of 1st April 2025</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-orange-700">Vol (Kg/Litre)</span>
                    <span className="font-semibold text-orange-800">{entry.openingStock}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-orange-700">Value (Rs.Lakhs)</span>
                    <span className="font-semibold text-orange-800">{(entry.grossValue * 0.0001).toFixed(2)}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Last updated: Jan 20, 2024
                  </div>
                </div>
              </div>

              {/* YTD Net Sales Card */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="border-b border-blue-200 pb-2 mb-3">
                  <h4 className="font-semibold text-blue-800">YTD Net Sales</h4>
                  <p className="text-xs text-blue-600">April - Aug, 2025</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-700">Vol (Kg/Litre)</span>
                    <span className="font-semibold text-blue-800">{Math.round(entry.openingStock * 0.8)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-700">Value (Rs.Lakhs)</span>
                    <span className="font-semibold text-blue-800">{(entry.netValue * 0.0001 * 1.5).toFixed(2)}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Last updated: Jan 20, 2024
                  </div>
                </div>
              </div>

              {/* Liquidation Card */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="border-b border-green-200 pb-2 mb-3">
                  <h4 className="font-semibold text-green-800">Liquidation</h4>
                  <p className="text-xs text-green-600">As of Aug (YTD)</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-green-700">Vol (Kg/Litre)</span>
                    <span className="font-semibold text-green-800">{entry.volume}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-green-700">Value (Rs.Lakhs)</span>
                    <span className="font-semibold text-green-800">{(entry.netValue * 0.0001).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Balance Stock Card */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="border-b border-purple-200 pb-2 mb-3">
                  <h4 className="font-semibold text-purple-800">Balance Stock</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-purple-700">Vol (Kg/Litre)</span>
                    <span className="font-semibold text-purple-800">{entry.currentStock}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-purple-700">Value (Rs.Lakhs)</span>
                    <span className="font-semibold text-purple-800">{(entry.grossValue * 0.0001 * 0.6).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Liquidation Percentage Card */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="border-b border-gray-200 pb-2 mb-3">
                  <h4 className="font-semibold text-gray-800">% Liquidation</h4>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-800 mb-2">{entry.liquidationPercentage}%</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${entry.liquidationPercentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Last updated: Jan 20, 2024
                  </div>
                </div>
              </div>

              {/* Last Updated Info */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="border-b border-gray-200 pb-2 mb-3">
                  <h4 className="font-semibold text-gray-800">Last Updated</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-700">Date</span>
                    <span className="font-semibold text-gray-800">{new Date(entry.lastUpdated).toLocaleDateString()}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Last updated: Jan 20, 2024
                  </div>
                </div>
              </div>
            </div>

            {/* Overdue Alert */}
            {entry.daysOverdue > 0 && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">
                  <AlertTriangle className="w-4 h-4 inline mr-1" />
                  Overdue by {entry.daysOverdue} days - Immediate attention required
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => navigate(`/retailer-liquidation/${entry.id}`)}
                className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-200 transition-colors flex items-center"
              >
                <Eye className="w-4 h-4 mr-2" />
                Track Liquidation
              </button>
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                <Edit className="w-4 h-4 mr-2" />
                Update Stock
              </button>
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                <FileSignature className="w-4 h-4 mr-2" />
                Get Signature
              </button>
            </div>

            {/* Remarks */}
            {entry.remarks && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  <strong>Remarks:</strong> {entry.remarks}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredEntries.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No liquidation entries found</p>
        </div>
      )}
    </div>
  );
};

export default Liquidation;