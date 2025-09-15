import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, TrendingUp, Droplets, Target, Users, Building, Search, Filter, Eye, Edit, CheckCircle, Clock, AlertTriangle, ArrowLeft, Info, Calculator, X, DollarSign, FileSignature as Signature, Save, Plus, Minus } from 'lucide-react';

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

interface StockVerificationModal {
  isOpen: boolean;
  entry: LiquidationEntry | null;
}

interface LiquidationModal {
  isOpen: boolean;
  skuCode: string;
  skuName: string;
  originalQty: number;
  newQty: number;
  liquidatedQty: number;
}

const Liquidation: React.FC = () => {
  const navigate = useNavigate();
  
  // State variables
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewModalData, setViewModalData] = useState<{ type: string; entry: LiquidationEntry } | null>(null);
  const [stockVerificationModal, setStockVerificationModal] = useState<StockVerificationModal>({ isOpen: false, entry: null });
  const [liquidationModal, setLiquidationModal] = useState<LiquidationModal>({ isOpen: false, skuCode: '', skuName: '', originalQty: 0, newQty: 0, liquidatedQty: 0 });
  const [showBusinessLogicModal, setShowBusinessLogicModal] = useState(false);
  const [newLiquidationEntry, setNewLiquidationEntry] = useState({
    id: '',
    type: 'Farmer' as 'Farmer' | 'Retailer',
    recipientName: '',
    recipientCode: '',
    recipientPhone: '',
    recipientAddress: '',
    quantity: 0,
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  // Sample liquidation data with EXACT values from reference screenshot
  const [liquidationEntries, setLiquidationEntries] = useState<LiquidationEntry[]>([
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
        volume: 32,   // Updated to match screenshot
        value: 13.95  // ₹13.95L
      },
      liquidation: {
        volume: 140,
        value: 9.30   // ₹9.30L
      },
      balanceStock: {
        volume: 210,  
        value: 8.28   // ₹8.28L as shown in screenshot
      },
      
      liquidationPercentage: 40, 
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
    setStockVerificationModal({
      isOpen: true,
      entry: entry
    });
  };

  // Handle track liquidation
  const handleTrackLiquidation = (entry: LiquidationEntry) => {
    alert(`Tracking liquidation for ${entry.dealerName}...\n\nThis will show detailed liquidation tracking with farmer-wise breakdown.`);
  };

  // Handle update stock
  const handleUpdateStock = (entry: LiquidationEntry) => {
    alert(`Updating stock for ${entry.dealerName}...\n\nThis will open stock update form with current quantities.`);
  };

  // Handle get signature
  const handleGetSignature = (entry: LiquidationEntry) => {
    alert(`Getting signature from ${entry.dealerName}...\n\nThis will open signature capture interface.`);
  };

  // Filter entries
  const filteredEntries = liquidationEntries.filter(entry => {
    const matchesSearch = entry.dealerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.dealerCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All' || entry.dealerType === typeFilter;
    const matchesStatus = statusFilter === 'All' || entry.liquidationStatus === statusFilter;
    const matchesPriority = priorityFilter === 'All' || entry.priority === priorityFilter;
    return matchesSearch && matchesType && matchesStatus && matchesPriority;
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Stock Liquidation Tracking</h1>
              <p className="text-sm text-gray-600">Monitor and manage dealer stock liquidation progress</p>
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

        {/* Summary Cards - Desktop Grid */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Entries</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{overallMetrics.totalEntries}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{overallMetrics.activeEntries}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{overallMetrics.pendingEntries}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{overallMetrics.overdueEntries}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters - Desktop Layout */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by dealer name, code, or product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[120px]"
            >
              <option value="All">All Types</option>
              <option value="Distributor">Distributors</option>
              <option value="Retailer">Retailers</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[120px]"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[120px]"
            >
              <option value="All">All Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Liquidation Entries - Desktop Cards */}
        <div className="space-y-6">
          {filteredEntries.map((entry) => (
            <div key={entry.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Building className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{entry.dealerName}</h3>
                      <p className="text-sm text-gray-600">Code: {entry.dealerCode} | Multiple Products</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {entry.dealerType}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(entry.liquidationStatus)}`}>
                      {getStatusIcon(entry.liquidationStatus)}
                      <span className="ml-1">{entry.liquidationStatus}</span>
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(entry.priority)}`}>
                      {entry.priority}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Stock Metrics Grid - Exactly like reference */}
                <div className="grid grid-cols-3 gap-6 mb-6">
                  {/* Opening Stock */}
                  <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-orange-700">Opening Stock</span>
                      <button 
                        onClick={() => handleViewDetails('opening', entry)}
                        className="bg-orange-500 text-white px-3 py-1 rounded text-sm font-medium hover:bg-orange-600 transition-colors"
                      >
                        View
                      </button>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-orange-600">Volume</span>
                        <span className="text-xl font-bold text-orange-800">{entry.openingStock.volume}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-orange-600">Value</span>
                        <span className="text-xl font-bold text-orange-800">₹{entry.openingStock.value.toFixed(2)}L</span>
                      </div>
                    </div>
                  </div>

                  {/* YTD Net Sales */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-blue-700">YTD Net Sales</span>
                      <button 
                        onClick={() => handleViewDetails('ytd', entry)}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm font-medium hover:bg-blue-600 transition-colors"
                      >
                        View
                      </button>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-blue-600">Volume</span>
                        <span className="text-xl font-bold text-blue-800">{entry.ytdNetSales.volume}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-blue-600">Value</span>
                        <span className="text-xl font-bold text-blue-800">₹{entry.ytdNetSales.value.toFixed(2)}L</span>
                      </div>
                    </div>
                  </div>

                  {/* Liquidation */}
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-green-700">Liquidation</span>
                      <button 
                        onClick={() => handleViewDetails('liquidation', entry)}
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm font-medium hover:bg-green-600 transition-colors"
                      >
                        View
                      </button>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-green-600">Volume</span>
                        <span className="text-xl font-bold text-green-800">{entry.liquidation.volume}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-green-600">Value</span>
                        <span className="text-xl font-bold text-green-800">₹{entry.liquidation.value.toFixed(2)}L</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Balance Stock and Liquidation Percentage */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  {/* Balance Stock */}
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-purple-700">Balance Stock</span>
                      <button 
                        onClick={() => handleVerifyStock(entry)}
                        className="bg-purple-500 text-white px-3 py-1 rounded text-sm font-medium hover:bg-purple-600 transition-colors"
                      >
                        Verify
                      </button>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-purple-600">Volume</span>
                        <span className="text-xl font-bold text-purple-800">{entry.balanceStock.volume}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-purple-600">Value</span>
                        <span className="text-xl font-bold text-purple-800">₹{entry.balanceStock.value.toFixed(2)}L</span>
                      </div>
                    </div>
                  </div>

                  {/* Liquidation Percentage */}
                  <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-indigo-700">% Liquidation</span>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-indigo-800 mb-2">{entry.liquidationPercentage}%</div>
                      <div className="w-full bg-indigo-200 rounded-full h-2 mb-2">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, (entry.liquidationPercentage / entry.targetLiquidation) * 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-indigo-600">Target: {entry.targetLiquidation}%</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3 mb-4">
                  <button 
                    onClick={() => handleTrackLiquidation(entry)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Track Liquidation
                  </button>
                  
                  <button 
                    onClick={() => handleUpdateStock(entry)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Update Stock
                  </button>
                  
                  <button 
                    onClick={() => handleGetSignature(entry)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                  >
                    <Signature className="w-4 h-4 mr-2" />
                    Get Signature
                  </button>
                </div>

                {/* Remarks */}
                {entry.remarks && (
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-sm text-gray-700">
                      <strong>Remarks:</strong> {entry.remarks}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredEntries.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No liquidation entries found</p>
          </div>
        )}

        {/* Stock Verification Modal */}
        {stockVerificationModal.isOpen && stockVerificationModal.entry && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Stock Verification</h3>
                  <p className="text-sm text-gray-600">Product & SKU wise stock details - Update current stock</p>
                </div>
                <button
                  onClick={() => setStockVerificationModal({ isOpen: false, entry: null })}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                {/* Product Section */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">DAP (Di-Ammonium Phosphate)</h4>
                      <p className="text-sm text-gray-600">Code: FERT001 | Category: Fertilizers</p>
                    </div>
                    <span className="text-sm text-gray-500">Total SKUs: 2</span>
                  </div>

                  {/* SKU Details */}
                  <div className="space-y-4">
                    {/* DAP 25kg Bag */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h5 className="font-medium text-gray-900">DAP 25kg Bag</h5>
                          <p className="text-sm text-gray-600">DAP-25KG</p>
                          <p className="text-xs text-gray-500">Kg</p>
                        </div>
                        <span className="text-xs text-gray-500">Last Updated: 1/20/2024</span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Assigned</div>
                          <div className="text-lg font-bold text-orange-600">50</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Current Stock</div>
                          <input
                            type="number" 
                            defaultValue="27" 
                            className="w-16 text-center text-lg font-bold text-blue-600 border border-blue-300 rounded"
                            onChange={(e) => {
                              const newQty = parseInt(e.target.value) || 0;
                              const originalQty = 35;
                              const liquidatedQty = originalQty - newQty;
                              if (liquidatedQty > 0) {
                                setLiquidationModal({
                                  isOpen: true,
                                  skuCode: 'DAP-25KG',
                                  skuName: 'DAP 25kg Bag',
                                  originalQty: originalQty,
                                  newQty: newQty,
                                  liquidatedQty: liquidatedQty
                                });
                              }
                            }}
                          />
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Liquidated</div>
                          <div className="text-lg font-bold text-green-600">15</div>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="text-xs text-gray-600 mb-1">Liquidation Progress</div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{ width: '30%' }}></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">30%</div>
                      </div>
                      
                      {/* Liquidation Breakdown */}
                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-xs font-medium text-gray-700 mb-2 flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          Liquidated to whom? (Total: 15 Kg)
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-green-100 rounded p-2 text-center">
                            <div className="text-xs text-green-600">🌾 Farmers</div>
                            <div className="font-bold text-green-800">15</div>
                            <div className="text-xs text-green-600">Direct farmer sales</div>
                          </div>
                          <div className="bg-blue-100 rounded p-2 text-center">
                            <div className="text-xs text-blue-600">🏪 Retailers</div>
                            <div className="font-bold text-blue-800">15</div>
                            <div className="text-xs text-blue-600">
                              • Green Agro Store (RET001): 10
                            </div>
                            <div className="text-xs text-blue-600">
                              • Sunrise Traders (RET002): 5
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 p-6 border-t bg-white">
                <button
                  onClick={() => setStockVerificationModal({ isOpen: false, entry: null })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert('Stock updates saved successfully!');
                    setStockVerificationModal({ isOpen: false, entry: null });
                  }}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Save Updates
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Liquidation Modal - "Liquidated to whom?" */}
        {liquidationModal.isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Liquidated to whom?</h3>
                  <p className="text-sm text-gray-600">
                    {liquidationModal.skuName} - Quantity: {liquidationModal.liquidatedQty} Kg
                  </p>
                </div>
                <button
                  onClick={() => setLiquidationModal({ ...liquidationModal, isOpen: false })}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6">
                {/* Transaction Type Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Select Transaction Type</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setNewLiquidationEntry(prev => ({ ...prev, type: 'Farmer' }))}
                      className={`p-6 border-2 rounded-lg text-center transition-colors ${
                        newLiquidationEntry.type === 'Farmer'
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="text-4xl mb-2">🌾</div>
                      <div className="font-medium">Sold to Farmer</div>
                      <div className="text-xs text-gray-500 mt-1">Direct liquidation</div>
                    </button>
                    <button
                      onClick={() => setNewLiquidationEntry(prev => ({ ...prev, type: 'Retailer' }))}
                      className={`p-6 border-2 rounded-lg text-center transition-colors ${
                        newLiquidationEntry.type === 'Retailer'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="text-4xl mb-2">🏪</div>
                      <div className="font-medium">Sold to Retailer</div>
                      <div className="text-xs text-gray-500 mt-1">Requires retailer details</div>
                    </button>
                  </div>
                </div>

                {/* SKU Details Summary */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">SKU Details</h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-sm text-gray-600">Original Qty</div>
                      <div className="text-lg font-bold text-orange-600">{liquidationModal.originalQty}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">New Qty</div>
                      <div className="text-lg font-bold text-blue-600">{liquidationModal.newQty}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">To be Liquidated</div>
                      <div className="text-lg font-bold text-green-600">{liquidationModal.liquidatedQty}</div>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  {/* Quantity (Auto-filled) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantity *</label>
                    <input
                      type="number"
                      value={liquidationModal.liquidatedQty}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                    />
                  </div>

                  {/* Show detailed form only for Retailer */}
                  {newLiquidationEntry.type === 'Retailer' && (
                    <div>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <h4 className="font-medium text-blue-800 mb-2">Retailer Details Required</h4>
                        <p className="text-sm text-blue-600">Please provide complete retailer information for tracking.</p>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Retailer Name *</label>
                          <input
                            type="text"
                            value={newLiquidationEntry.recipientName}
                            onChange={(e) => setNewLiquidationEntry(prev => ({ ...prev, recipientName: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter retailer name"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Retailer Code</label>
                          <input
                            type="text"
                            value={newLiquidationEntry.recipientCode}
                            onChange={(e) => setNewLiquidationEntry(prev => ({ ...prev, recipientCode: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter retailer code"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                          <input
                            type="tel"
                            value={newLiquidationEntry.recipientPhone}
                            onChange={(e) => setNewLiquidationEntry(prev => ({ ...prev, recipientPhone: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter phone number"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                          <input
                            type="text"
                            value={newLiquidationEntry.recipientAddress}
                            onChange={(e) => setNewLiquidationEntry(prev => ({ ...prev, recipientAddress: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter address"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Show simple confirmation for Farmer */}
                  {newLiquidationEntry.type === 'Farmer' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-medium text-green-800 mb-2">Direct Farmer Sale</h4>
                      <p className="text-sm text-green-600">
                        This transaction will be recorded as direct farmer liquidation with quantity: <strong>{liquidationModal.liquidatedQty}</strong> Kg
                      </p>
                      <p className="text-xs text-green-500 mt-2">No additional details required for farmer sales.</p>
                    </div>
                  )}

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                    <textarea
                      value={newLiquidationEntry.notes}
                      onChange={(e) => setNewLiquidationEntry(prev => ({ ...prev, notes: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter any additional notes"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 p-6 border-t bg-white">
                <button
                  onClick={() => setLiquidationModal({ ...liquidationModal, isOpen: false })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Add liquidation entry
                    const entry = {
                      ...newLiquidationEntry,
                      id: Date.now().toString(),
                      quantity: liquidationModal.liquidatedQty
                    };
                    
                    // Show success message
                    alert(`Liquidation recorded successfully!\n\n${entry.type}: ${entry.recipientName || 'Direct Farmer Sale'}\nQuantity: ${entry.quantity} Kg`);
                    
                    // Reset and close modal
                    setNewLiquidationEntry({
                      id: '',
                      type: 'Farmer',
                      recipientName: '',
                      recipientCode: '',
                      recipientPhone: '',
                      recipientAddress: '',
                      quantity: 0,
                      date: new Date().toISOString().split('T')[0],
                      notes: ''
                    });
                    setLiquidationModal({ ...liquidationModal, isOpen: false });
                  }}
                  disabled={
                    newLiquidationEntry.type === 'Retailer' && 
                    (!newLiquidationEntry.recipientName || !newLiquidationEntry.recipientPhone)
                  }
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Record Liquidation
                </button>
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

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-medium text-yellow-800 mb-2">📋 Critical Business Logic - Liquidation Definition:</h3>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• <strong>🌾 LIQUIDATION = Stock sold to FARMERS ONLY</strong> (non-returnable)</li>
                      <li>• <strong>ANY quantity sold from retailer to farmer = LIQUIDATION COUNT ADDED</strong></li>
                      <li>• This appears in distributor and main company dashboard automatically</li>
                      <li>• True liquidation only happens when farmers purchase the stock</li>
                      <li>• Retailer sales are considered stock transfers, not liquidation</li>
                      <li>• Distributor liquidation % includes ALL farmer sales (direct + via retailers)</li>
                      <li>• Target liquidation percentage: 50% (farmer sales only)</li>
                      <li>• Balance stock = Opening + YTD Sales - Farmer Liquidation</li>
                      <li>• <strong>Real-time tracking:</strong> Retailer farmer sales instantly update distributor metrics</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Liquidation;