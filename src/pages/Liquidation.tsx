import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Package, 
  TrendingUp, 
  Users, 
  Droplets,
  Eye,
  Edit,
  CheckCircle,
  AlertTriangle,
  Search,
  Filter,
  Download,
  Plus,
  Building,
  MapPin,
  Calendar,
  Phone,
  DollarSign,
  Target,
  BarChart3,
  Activity,
  Zap,
  Award,
  Clock,
  X,
  Save,
  Camera,
  FileText,
  Signature
} from 'lucide-react';
import { useLiquidationCalculation } from '../hooks/useLiquidationCalculation';

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
  openingStock: { volume: number; value: number };
  ytdNetSales: { volume: number; value: number };
  liquidation: { volume: number; value: number };
  balanceStock: { volume: number; value: number };
  liquidationPercentage: number;
  
  // Status
  status: 'Active' | 'Pending' | 'Completed' | 'Overdue';
  priority: 'High' | 'Medium' | 'Low';
  lastUpdated: string;
  updatedBy: string;
  
  // Verification
  hasSignature: boolean;
  hasMedia: boolean;
  verificationDate?: string;
  
  // Additional Info
  remarks?: string;
  targetLiquidation: number;
  daysOverdue: number;
}

const Liquidation: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);
  const [verificationStep, setVerificationStep] = useState<'photo' | 'signature' | 'complete'>('photo');
  
  // Use dynamic liquidation calculation hook
  const { 
    overallMetrics, 
    distributorMetrics, 
    getPerformanceMetrics,
    BUSINESS_RULES
  } = useLiquidationCalculation();
  
  const performanceMetrics = getPerformanceMetrics();

  // Sample liquidation entries based on distributor metrics
  const [liquidationEntries] = useState<LiquidationEntry[]>([
    {
      id: 'DIST001',
      dealerId: 'DIST001',
      dealerName: 'SRI RAMA SEEDS AND PESTICIDES',
      dealerCode: '1325',
      dealerType: 'Distributor',
      dealerAddress: 'Green Valley, Sector 12, Delhi',
      dealerPhone: '+91 98765 43210',
      territory: 'North Delhi',
      region: 'Delhi NCR',
      zone: 'North Zone',
      assignedMDO: 'MDO001',
      assignedTSM: 'TSM001',
      openingStock: { volume: 40, value: 13.80 },
      ytdNetSales: { volume: 310, value: 13.95 },
      liquidation: { volume: 140, value: 9.30 },
      balanceStock: { volume: 210, value: 18.45 },
      liquidationPercentage: 40,
      status: 'Active',
      priority: 'High',
      lastUpdated: '2024-01-20',
      updatedBy: 'MDO001',
      hasSignature: false,
      hasMedia: false,
      targetLiquidation: 50,
      daysOverdue: 0,
      remarks: 'Stock verification pending'
    },
    {
      id: 'DIST002',
      dealerId: 'DIST002',
      dealerName: 'Ram Kumar Distributors',
      dealerCode: 'DLR001',
      dealerType: 'Distributor',
      dealerAddress: 'Market Area, Sector 8, Delhi',
      dealerPhone: '+91 87654 32109',
      territory: 'Green Valley',
      region: 'Delhi NCR',
      zone: 'North Zone',
      assignedMDO: 'MDO002',
      assignedTSM: 'TSM001',
      openingStock: { volume: 15000, value: 18.75 },
      ytdNetSales: { volume: 6500, value: 8.13 },
      liquidation: { volume: 6200, value: 7.75 },
      balanceStock: { volume: 15300, value: 19.13 },
      liquidationPercentage: 29,
      status: 'Active',
      priority: 'Medium',
      lastUpdated: '2024-01-19',
      updatedBy: 'MDO002',
      hasSignature: true,
      hasMedia: true,
      targetLiquidation: 50,
      daysOverdue: 2,
      remarks: 'Regular follow-up required'
    },
    {
      id: 'DIST003',
      dealerId: 'DIST003',
      dealerName: 'Green Agro Solutions',
      dealerCode: 'GAS001',
      dealerType: 'Distributor',
      dealerAddress: 'Industrial Area, Delhi',
      dealerPhone: '+91 76543 21098',
      territory: 'Sector 8',
      region: 'Delhi NCR',
      zone: 'North Zone',
      assignedMDO: 'MDO003',
      assignedTSM: 'TSM002',
      openingStock: { volume: 17620, value: 21.70 },
      ytdNetSales: { volume: 6493, value: 6.57 },
      liquidation: { volume: 6380, value: 7.22 },
      balanceStock: { volume: 17733, value: 21.05 },
      liquidationPercentage: 26,
      status: 'Pending',
      priority: 'Low',
      lastUpdated: '2024-01-18',
      updatedBy: 'MDO003',
      hasSignature: false,
      hasMedia: false,
      targetLiquidation: 50,
      daysOverdue: 5,
      remarks: 'Awaiting stock verification'
    }
  ]);

  const handleVerify = (entryId: string) => {
    setSelectedEntry(entryId);
    setVerificationStep('photo');
    setShowVerifyModal(true);
  };

  const handleVerificationComplete = () => {
    // Update the entry as verified
    console.log(`Verification completed for entry: ${selectedEntry}`);
    setShowVerifyModal(false);
    setSelectedEntry(null);
    setVerificationStep('photo');
    
    // Show success message
    alert('Stock verification completed successfully!');
  };

  const handleNextStep = () => {
    if (verificationStep === 'photo') {
      setVerificationStep('signature');
    } else if (verificationStep === 'signature') {
      setVerificationStep('complete');
    }
  };

  const filteredEntries = liquidationEntries.filter(entry => {
    const matchesSearch = entry.dealerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.dealerCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All' || entry.dealerType === typeFilter;
    const matchesStatus = statusFilter === 'All' || entry.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-700 bg-green-100';
      case 'Pending': return 'text-yellow-700 bg-yellow-100';
      case 'Completed': return 'text-blue-700 bg-blue-100';
      case 'Overdue': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-700 bg-red-100';
      case 'Medium': return 'text-yellow-700 bg-yellow-100';
      case 'Low': return 'text-green-700 bg-green-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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
            <p className="text-gray-600 mt-1">Track and manage distributor stock liquidation (Farmer Sales Only)</p>
          </div>
        </div>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add Entry
        </button>
      </div>

      {/* Real-time Farmer Sales Tracking */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
          <Users className="w-6 h-6 mr-2" />
          🌾 Real-time Farmer Sales Tracking
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-green-700">{overallMetrics.liquidation.volume.toLocaleString()}</div>
            <div className="text-sm text-green-600">Total Farmer Sales (Kg/L)</div>
            <div className="text-xs text-green-500 mt-1">Direct + Via Retailers</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-green-700">₹{overallMetrics.liquidation.value.toFixed(2)}L</div>
            <div className="text-sm text-green-600">Total Farmer Sales Value</div>
            <div className="text-xs text-green-500 mt-1">All farmer purchases</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-green-700">{performanceMetrics.totalDistributors}</div>
            <div className="text-sm text-green-600">Active Distributors</div>
            <div className="text-xs text-green-500 mt-1">Contributing to farmer sales</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-green-700">{overallMetrics.liquidationPercentage}%</div>
            <div className="text-sm text-green-600">Overall Liquidation</div>
            <div className="text-xs text-green-500 mt-1">Target: {BUSINESS_RULES.TARGET_LIQUIDATION_PERCENTAGE}%</div>
          </div>
        </div>
        <div className="mt-4 text-sm text-green-600 text-center">
          ⚠️ <strong>CRITICAL:</strong> Any quantity sold from retailer to farmer automatically updates distributor liquidation count
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div 
          className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-orange-500 cursor-pointer hover:shadow-xl transition-all duration-200 hover:scale-105"
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
        </div>

        <div 
          className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500 cursor-pointer hover:shadow-xl transition-all duration-200 hover:scale-105"
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
        </div>

        <div 
          className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-500 cursor-pointer hover:shadow-xl transition-all duration-200 hover:scale-105"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">🌾 Liquidation (All Farmer Sales)</p>
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
          <div className="mt-1 text-xs text-green-600">
            Includes retailer-to-farmer sales
          </div>
        </div>

        <div 
          className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-purple-500 cursor-pointer hover:shadow-xl transition-all duration-200 hover:scale-105"
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
        </div>
      </div>

      {/* Liquidation Progress */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🌾 Overall Liquidation Progress (All Farmer Sales)</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Overall Liquidation Performance (All Farmer Sales)</span>
              <span>{overallMetrics.liquidationPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(100, (overallMetrics.liquidationPercentage / BUSINESS_RULES.TARGET_LIQUIDATION_PERCENTAGE) * 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>Target: {BUSINESS_RULES.TARGET_LIQUIDATION_PERCENTAGE}%</span>
              <span>100%</span>
            </div>
            <div className="text-xs text-green-600 mt-2 text-center">
              ⚠️ Includes all farmer purchases: direct from distributors + via retailers
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
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
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Liquidation Entries */}
      <div className="space-y-4">
        {filteredEntries.map((entry) => (
          <div key={entry.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Building className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{entry.dealerName}</h3>
                  <p className="text-sm text-gray-600">{entry.dealerCode} • {entry.dealerType}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(entry.status)}`}>
                  {entry.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(entry.priority)}`}>
                  {entry.priority}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                <div>
                  <p className="font-medium">Territory: {entry.territory}</p>
                  <p>Region: {entry.region}</p>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-2" />
                <div>
                  <p className="font-medium">MDO: {entry.assignedMDO}</p>
                  <p>TSM: {entry.assignedTSM}</p>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <div>
                  <p className="font-medium">Updated: {new Date(entry.lastUpdated).toLocaleDateString()}</p>
                  <p>By: {entry.updatedBy}</p>
                </div>
              </div>
            </div>

            {/* Stock Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-orange-50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-orange-800">{entry.openingStock.volume}</div>
                <div className="text-xs text-orange-600">Opening Stock</div>
                <div className="text-xs text-orange-500">₹{entry.openingStock.value}L</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-blue-800">{entry.ytdNetSales.volume}</div>
                <div className="text-xs text-blue-600">YTD Net Sales</div>
                <div className="text-xs text-blue-500">₹{entry.ytdNetSales.value}L</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-green-800">{entry.liquidation.volume}</div>
                <div className="text-xs text-green-600">🌾 Liquidation</div>
                <div className="text-xs text-green-500">₹{entry.liquidation.value}L</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 text-center relative">
                <div className="text-lg font-bold text-purple-800">{entry.balanceStock.volume}</div>
                <div className="text-xs text-purple-600">Balance Stock</div>
                <div className="text-xs text-purple-500">₹{entry.balanceStock.value}L</div>
                <button 
                  onClick={() => handleVerify(entry.id)}
                  className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full hover:bg-purple-700 transition-colors"
                >
                  Verify
                </button>
              </div>
            </div>

            {/* Liquidation Progress */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>% Liquidation</span>
                <span>{entry.liquidationPercentage}% (Target: {entry.targetLiquidation}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, (entry.liquidationPercentage / entry.targetLiquidation) * 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>Target: {entry.targetLiquidation}%</span>
                <span>100%</span>
              </div>
            </div>

            {entry.remarks && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">{entry.remarks}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => navigate(`/retailer-liquidation/${entry.id}`)}
                className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-200 transition-colors flex items-center"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </button>
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </button>
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              {entry.daysOverdue > 0 && (
                <span className="bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm font-medium flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  {entry.daysOverdue} days overdue
                </span>
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

      {/* Verification Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Stock Verification
              </h3>
              <button
                onClick={() => setShowVerifyModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {verificationStep === 'photo' && (
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Take Photo</h4>
                  <p className="text-gray-600 mb-6">Capture a photo of the current stock for verification</p>
                  <button
                    onClick={handleNextStep}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Capture Photo
                  </button>
                </div>
              )}

              {verificationStep === 'signature' && (
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Signature className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Get Signature</h4>
                  <p className="text-gray-600 mb-6">Obtain dealer signature to confirm stock verification</p>
                  <button
                    onClick={handleNextStep}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                  >
                    <FileText className="w-5 h-5 mr-2" />
                    Get Signature
                  </button>
                </div>
              )}

              {verificationStep === 'complete' && (
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-purple-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Verification Complete</h4>
                  <p className="text-gray-600 mb-6">Stock verification has been completed successfully</p>
                  <button
                    onClick={handleVerificationComplete}
                    className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    Save Verification
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Liquidation;