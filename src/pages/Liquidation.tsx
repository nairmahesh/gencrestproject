import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  TrendingUp, 
  Droplets, 
  Target, 
  Users, 
  Building, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  ArrowLeft,
  Info,
  Calculator,
  X,
  DollarSign
} from 'lucide-react';

interface LiquidationEntry {
  id: string;
  dealerId: string;
  dealerName: string;
  dealerCode: string;
  dealerType: 'Distributor' | 'Retailer';
  dealerAddress: string;
  dealerPhone: string;
  territory: string;
  region: string;
  zone: string;
  assignedMDO?: string;
  assignedTSM?: string;
  
  // Stock Data
  openingStock: {
    volume: number;
    value: number;
  };
  ytdNetSales: {
    volume: number;
    value: number;
  };
  liquidation: {
    volume: number;
    value: number;
  };
  balanceStock: {
    volume: number;
    value: number;
  };
  
  // Calculated Metrics
  liquidationPercentage: number;
  targetLiquidation: number;
  
  // Status and Tracking
  liquidationStatus: 'Pending' | 'In Progress' | 'Completed' | 'Verified';
  lastStockUpdateDate: string;
  lastStockUpdateBy: string;
  
  // Verification
  hasDistributorSignature: boolean;
  hasLetterheadDeclaration: boolean;
  verificationDate?: string;
  
  // Additional Info
  priority: 'High' | 'Medium' | 'Low';
  remarks?: string;
  approvalStatus: 'Pending' | 'Approved' | 'Rejected';
  approvedBy?: string;
  approvedDate?: string;
}

const Liquidation: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showBusinessLogicModal, setShowBusinessLogicModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewModalData, setViewModalData] = useState<{type: string, entry: LiquidationEntry} | null>(null);

  // Sample liquidation data with EXACT values from reference screenshot
  const [liquidationEntries] = useState<LiquidationEntry[]>([
    {
      id: '1',
      dealerId: 'DIST001',
      dealerName: 'SRI RAMA SEEDS AND PESTICIDES',
      dealerCode: '1325',
      dealerType: 'Distributor',
      dealerAddress: 'Agricultural Market, Sector 15, Delhi',
      dealerPhone: '+91 98765 12345',
      territory: 'North Delhi',
      region: 'Delhi NCR',
      zone: 'North Zone',
      assignedMDO: 'MDO001',
      assignedTSM: 'TSM001',
      
      // EXACT VALUES FROM REFERENCE SCREENSHOT
      openingStock: {
        volume: 40,
        value: 13.80  // ₹13.80L
      },
      ytdNetSales: {
        volume: 310,
        value: 13.95  // ₹13.95L
      },
      liquidation: {
        volume: 140,
        value: 9.30   // ₹9.30L
      },
      balanceStock: {
        volume: 210,  // 40 + 310 - 140 = 210
        value: 18.45  // ₹18.45L
      },
      
      liquidationPercentage: 40, // 140 / (40 + 310) * 100 = 40%
      targetLiquidation: 50,
      
      liquidationStatus: 'In Progress',
      lastStockUpdateDate: '2024-01-20',
      lastStockUpdateBy: 'MDO001',
      
      hasDistributorSignature: false,
      hasLetterheadDeclaration: true,
      
      priority: 'High',
      remarks: 'Good progress on liquidation',
      approvalStatus: 'Pending'
    },
    {
      id: '2',
      dealerId: 'DIST002',
      dealerName: 'Ram Kumar Distributors',
      dealerCode: 'DLR001',
      dealerType: 'Distributor',
      dealerAddress: 'Green Valley, Sector 12, Delhi',
      dealerPhone: '+91 98765 54321',
      territory: 'Green Valley',
      region: 'Delhi NCR',
      zone: 'North Zone',
      assignedMDO: 'MDO002',
      assignedTSM: 'TSM001',
      
      openingStock: {
        volume: 15000,
        value: 18.75
      },
      ytdNetSales: {
        volume: 6500,
        value: 8.13
      },
      liquidation: {
        volume: 6200,
        value: 7.75
      },
      balanceStock: {
        volume: 15300,
        value: 19.13
      },
      
      liquidationPercentage: 29,
      targetLiquidation: 50,
      
      liquidationStatus: 'Completed',
      lastStockUpdateDate: '2024-01-19',
      lastStockUpdateBy: 'MDO002',
      
      hasDistributorSignature: true,
      hasLetterheadDeclaration: true,
      verificationDate: '2024-01-19',
      
      priority: 'Medium',
      remarks: 'Completed liquidation process',
      approvalStatus: 'Approved',
      approvedBy: 'RMM001',
      approvedDate: '2024-01-19'
    },
    {
      id: '3',
      dealerId: 'DIST003',
      dealerName: 'Green Agro Solutions',
      dealerCode: 'GAS001',
      dealerType: 'Distributor',
      dealerAddress: 'Market Area, Sector 8, Delhi',
      dealerPhone: '+91 98765 98765',
      territory: 'Sector 8',
      region: 'Delhi NCR',
      zone: 'North Zone',
      assignedMDO: 'MDO003',
      assignedTSM: 'TSM002',
      
      openingStock: {
        volume: 17620,
        value: 21.70
      },
      ytdNetSales: {
        volume: 6493,
        value: 6.57
      },
      liquidation: {
        volume: 6380,
        value: 7.22
      },
      balanceStock: {
        volume: 17733,
        value: 21.05
      },
      
      liquidationPercentage: 26,
      targetLiquidation: 50,
      
      liquidationStatus: 'Pending',
      lastStockUpdateDate: '2024-01-18',
      lastStockUpdateBy: 'MDO003',
      
      hasDistributorSignature: false,
      hasLetterheadDeclaration: false,
      
      priority: 'Low',
      remarks: 'Needs attention for liquidation',
      approvalStatus: 'Pending'
    }
  ]);

  // Calculate overall metrics
  const overallMetrics = {
    totalEntries: liquidationEntries.length,
    activeEntries: liquidationEntries.filter(entry => entry.liquidationStatus !== 'Completed').length,
    pendingEntries: liquidationEntries.filter(entry => entry.liquidationStatus === 'Pending').length,
    overdueEntries: liquidationEntries.filter(entry => entry.priority === 'High').length,
    
    // Aggregate totals
    totalOpeningStock: {
      volume: liquidationEntries.reduce((sum, entry) => sum + entry.openingStock.volume, 0),
      value: liquidationEntries.reduce((sum, entry) => sum + entry.openingStock.value, 0)
    },
    totalYtdNetSales: {
      volume: liquidationEntries.reduce((sum, entry) => sum + entry.ytdNetSales.volume, 0),
      value: liquidationEntries.reduce((sum, entry) => sum + entry.ytdNetSales.value, 0)
    },
    totalLiquidation: {
      volume: liquidationEntries.reduce((sum, entry) => sum + entry.liquidation.volume, 0),
      value: liquidationEntries.reduce((sum, entry) => sum + entry.liquidation.value, 0)
    },
    totalBalanceStock: {
      volume: liquidationEntries.reduce((sum, entry) => sum + entry.balanceStock.volume, 0),
      value: liquidationEntries.reduce((sum, entry) => sum + entry.balanceStock.value, 0)
    }
  };

  // Calculate overall liquidation percentage
  const totalAvailableStock = overallMetrics.totalOpeningStock.volume + overallMetrics.totalYtdNetSales.volume;
  const overallLiquidationPercentage = totalAvailableStock > 0 
    ? Math.round((overallMetrics.totalLiquidation.volume / totalAvailableStock) * 100)
    : 0;

  // Handle view details functionality
  const handleViewDetails = (type: string, entry: LiquidationEntry) => {
    setViewModalData({ type, entry });
    setShowViewModal(true);
  };

  // Handle verify stock functionality
  const handleVerifyStock = (entry: LiquidationEntry) => {
    alert(`Verifying stock for ${entry.dealerName}...\n\nThis will open the stock verification modal with product & SKU wise details.`);
  };
  // Filter entries
  const filteredEntries = liquidationEntries.filter(entry => {
    const matchesSearch = entry.dealerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.dealerCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All' || entry.dealerType === typeFilter;
    const matchesStatus = statusFilter === 'All' || entry.liquidationStatus === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'text-green-700 bg-green-100';
      case 'In Progress':
        return 'text-blue-700 bg-blue-100';
      case 'Verified':
        return 'text-purple-700 bg-purple-100';
      case 'Pending':
        return 'text-yellow-700 bg-yellow-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'In Progress':
        return <Clock className="w-4 h-4" />;
      case 'Verified':
        return <CheckCircle className="w-4 h-4" />;
      case 'Pending':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Stock Liquidation Tracking</h1>
            <p className="text-gray-600">Monitor and manage distributor stock liquidation progress</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowBusinessLogicModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Calculator className="w-4 h-4 mr-2" />
            Business Logic
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Entries</p>
              <p className="text-2xl font-bold text-gray-900">{overallMetrics.totalEntries}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">{overallMetrics.activeEntries}</p>
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
              <p className="text-2xl font-bold text-gray-900">{overallMetrics.pendingEntries}</p>
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
              <p className="text-2xl font-bold text-gray-900">{overallMetrics.overdueEntries}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Overall Liquidation Summary */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Overall Liquidation Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{overallMetrics.totalOpeningStock.volume.toLocaleString()}</div>
            <div className="text-sm text-orange-700">Opening Stock</div>
            <div className="text-xs text-orange-600">₹{overallMetrics.totalOpeningStock.value.toFixed(2)}L</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{overallMetrics.totalYtdNetSales.volume.toLocaleString()}</div>
            <div className="text-sm text-blue-700">YTD Net Sales</div>
            <div className="text-xs text-blue-600">₹{overallMetrics.totalYtdNetSales.value.toFixed(2)}L</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{overallMetrics.totalLiquidation.volume.toLocaleString()}</div>
            <div className="text-sm text-green-700">Liquidation</div>
            <div className="text-xs text-green-600">₹{overallMetrics.totalLiquidation.value.toFixed(2)}L</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{overallMetrics.totalBalanceStock.volume.toLocaleString()}</div>
            <div className="text-sm text-purple-700">Balance Stock</div>
            <div className="text-xs text-purple-600">₹{overallMetrics.totalBalanceStock.value.toFixed(2)}L</div>
          </div>
          <div className="text-center p-4 bg-indigo-50 rounded-lg">
            <div className="text-2xl font-bold text-indigo-600">{overallLiquidationPercentage}%</div>
            <div className="text-sm text-indigo-700">Liquidation Rate</div>
            <div className="text-xs text-indigo-600">Target: 50%</div>
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
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Verified">Verified</option>
            </select>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Liquidation Entries */}
      <div className="space-y-4">
        {filteredEntries.map((entry) => (
          <div key={entry.id} className="bg-white rounded-xl p-6 card-shadow card-hover">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Building className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{entry.dealerName}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>Code: {entry.dealerCode}</span>
                    <span>•</span>
                    <span>{entry.dealerType}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(entry.liquidationStatus)}`}>
                  {getStatusIcon(entry.liquidationStatus)}
                  <span className="ml-1">{entry.liquidationStatus}</span>
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(entry.priority)}`}>
                  {entry.priority}
                </span>
              </div>
            </div>

            {/* Stock Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              {/* Opening Stock */}
              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Package className="w-4 h-4 text-orange-600 mr-1" />
                  <span className="text-xs font-medium text-orange-600">Opening Stock</span>
                  <button 
                    onClick={() => handleViewDetails('opening', entry)}
                    className="ml-2 text-orange-600 hover:bg-orange-100 rounded p-1"
                  >
                    <Eye className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-1">
                  <div className="text-lg font-bold text-orange-800">
                    {entry.openingStock.volume.toLocaleString()}
                  </div>
                  <div className="text-xs text-orange-600">Volume</div>
                  <div className="text-sm font-semibold text-orange-700 border-t border-orange-200 pt-1">
                    ₹{entry.openingStock.value.toFixed(2)}L
                  </div>
                  <div className="text-xs text-orange-500">Value</div>
                </div>
              </div>

              {/* YTD Net Sales */}
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="w-4 h-4 text-blue-600 mr-1" />
                  <span className="text-xs font-medium text-blue-600">YTD Net Sales</span>
                  <button 
                    onClick={() => handleViewDetails('ytd', entry)}
                    className="ml-2 text-blue-600 hover:bg-blue-100 rounded p-1"
                  >
                    <Eye className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-1">
                  <div className="text-lg font-bold text-blue-800">
                    {entry.ytdNetSales.volume.toLocaleString()}
                  </div>
                  <div className="text-xs text-blue-600">Volume</div>
                  <div className="text-sm font-semibold text-blue-700 border-t border-blue-200 pt-1">
                    ₹{entry.ytdNetSales.value.toFixed(2)}L
                  </div>
                  <div className="text-xs text-blue-500">Value</div>
                </div>
              </div>

              {/* Balance Stock */}
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Package className="w-4 h-4 text-purple-600 mr-1" />
                  <span className="text-xs font-medium text-purple-600">Balance Stock</span>
                  <button 
                    onClick={() => handleViewDetails('balance', entry)}
                    className="ml-2 text-purple-600 hover:bg-purple-100 rounded p-1"
                  >
                    <Eye className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-1">
                  <div className="text-lg font-bold text-purple-800">
                    {entry.balanceStock.volume.toLocaleString()}
                  </div>
                  <div className="text-xs text-purple-600">Volume</div>
                  <div className="text-sm font-semibold text-purple-700 border-t border-purple-200 pt-1">
                    ₹{entry.balanceStock.value.toFixed(2)}L
                  </div>
                  <div className="text-xs text-purple-500">Value</div>
                </div>
              </div>

              {/* Liquidation */}
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Droplets className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-xs font-medium text-green-600">Liquidation</span>
                  <button 
                    onClick={() => handleViewDetails('liquidation', entry)}
                    className="ml-2 text-green-600 hover:bg-green-100 rounded p-1"
                  >
                    <Eye className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-1">
                  <div className="text-lg font-bold text-green-800">
                    {entry.liquidation.volume.toLocaleString()}
                  </div>
                  <div className="text-xs text-green-600">Volume</div>
                  <div className="text-sm font-semibold text-green-700 border-t border-green-200 pt-1">
                    ₹{entry.liquidation.value.toFixed(2)}L
                  </div>
                  <div className="text-xs text-green-500">Value</div>
                </div>
              </div>
            </div>

            {/* Liquidation Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">% Liquidation</span>
                <span className="text-2xl font-bold text-purple-600">{entry.liquidationPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (entry.liquidationPercentage / entry.targetLiquidation) * 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>Target: {entry.targetLiquidation}%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-center">
              <button 
                onClick={() => navigate(`/retailer-liquidation/${entry.id}`)}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center font-medium"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </button>
            </div>

            {/* Additional Info */}
            {entry.remarks && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">
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

      {/* Business Logic Modal */}
      {showBusinessLogicModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-900">Business Logic & Calculations</h3>
              <button
                onClick={() => setShowBusinessLogicModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Core Business Formulas</h4>
                  <div className="space-y-3">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h5 className="font-medium text-blue-900">Balance Stock Calculation</h5>
                      <p className="text-blue-800 text-sm mt-1">
                        Balance Stock = Opening Stock + YTD Net Sales - Liquidation
                      </p>
                      <p className="text-blue-600 text-xs mt-2">
                        Example: 210 = 40 + 310 - 140
                      </p>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h5 className="font-medium text-green-900">Liquidation Percentage</h5>
                      <p className="text-green-800 text-sm mt-1">
                        Liquidation % = (Liquidation ÷ (Opening Stock + YTD Net Sales)) × 100
                      </p>
                      <p className="text-green-600 text-xs mt-2">
                        Example: 40% = (140 ÷ (40 + 310)) × 100
                      </p>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h5 className="font-medium text-purple-900">Target Achievement</h5>
                      <p className="text-purple-800 text-sm mt-1">
                        Target Achievement = (Current Liquidation % ÷ Target %) × 100
                      </p>
                      <p className="text-purple-600 text-xs mt-2">
                        Target: 50% liquidation rate benchmark
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Validation Rules</h4>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                      <span>Balance Stock = Opening + YTD Sales - Liquidation</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                      <span>Liquidation % = Liquidation / Total Available Stock</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                      <span>All values must be non-negative</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                      <span>Currency values in Indian Lakhs (L) format</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">System Status</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Last Calculation</span>
                      <span className="text-sm font-medium text-gray-900">
                        {new Date().toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Validation Status</span>
                      <span className="flex items-center text-sm font-medium text-green-600">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        All Valid
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Entries</span>
                      <span className="text-sm font-medium text-gray-900">
                        {liquidationEntries.length} distributors
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {showViewModal && viewModalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-900">
                {viewModalData.type === 'opening' && 'Opening Stock Details'}
                {viewModalData.type === 'ytd' && 'YTD Net Sales Details'}
                {viewModalData.type === 'balance' && 'Balance Stock Details'}
                {viewModalData.type === 'liquidation' && 'Liquidation Details'}
              </h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{viewModalData.entry.dealerName}</h4>
                  <p className="text-sm text-gray-600">Code: {viewModalData.entry.dealerCode}</p>
                  <p className="text-sm text-gray-600">Type: {viewModalData.entry.dealerType}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h5 className="font-medium text-blue-900 mb-2">Volume</h5>
                    <p className="text-2xl font-bold text-blue-800">
                      {viewModalData.type === 'opening' && viewModalData.entry.openingStock.volume.toLocaleString()}
                      {viewModalData.type === 'ytd' && viewModalData.entry.ytdNetSales.volume.toLocaleString()}
                      {viewModalData.type === 'balance' && viewModalData.entry.balanceStock.volume.toLocaleString()}
                      {viewModalData.type === 'liquidation' && viewModalData.entry.liquidation.volume.toLocaleString()}
                    </p>
                    <p className="text-sm text-blue-600">Kg/Litre</p>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4">
                    <h5 className="font-medium text-green-900 mb-2">Value</h5>
                    <p className="text-2xl font-bold text-green-800">
                      ₹{viewModalData.type === 'opening' && viewModalData.entry.openingStock.value.toFixed(2)}
                      {viewModalData.type === 'ytd' && viewModalData.entry.ytdNetSales.value.toFixed(2)}
                      {viewModalData.type === 'balance' && viewModalData.entry.balanceStock.value.toFixed(2)}
                      {viewModalData.type === 'liquidation' && viewModalData.entry.liquidation.value.toFixed(2)}L
                    </p>
                    <p className="text-sm text-green-600">Indian Lakhs</p>
                  </div>
                </div>
                
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h5 className="font-medium text-yellow-900 mb-2">Product & SKU Breakdown</h5>
                  <p className="text-sm text-yellow-700">
                    This section would show detailed product and SKU wise breakdown for {viewModalData.entry.dealerName}.
                  </p>
                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>DAP 25kg Bag</span>
                      <span>15,000 Kg</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>DAP 50kg Bag</span>
                      <span>10,000 Kg</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Urea 25kg Bag</span>
                      <span>5,000 Kg</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Liquidation;