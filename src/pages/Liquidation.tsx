import React, { useState } from 'react';
import { 
  Building, 
  Package, 
  TrendingUp, 
  Droplets, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Phone, 
  User, 
  Eye, 
  Edit, 
  FileText, 
  Plus, 
  Minus,
  X,
  Save,
  Search,
  Filter,
  Download,
  Upload,
  Camera,
  Target,
  DollarSign,
  Calendar,
  Users,
  ShoppingCart,
  ArrowRight,
  Info,
  Bell,
  UserPlus,
  FileSignature,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SignatureCapture } from '../components/SignatureCapture';

interface ProductStock {
  id: string;
  productCode: string;
  productName: string;
  skuCode: string;
  skuName: string;
  unit: string;
  erpLastBalance: number;
  currentStock: number;
  variance: number;
  variancePercentage: number;
  unitPrice: number;
  hasBalance: boolean;
  isVerified: boolean;
}

interface RetailerSale {
  id: string;
  retailerId?: string;
  retailerCode?: string;
  retailerName: string;
  retailerPhone?: string;
  retailerAddress?: string;
  isNewRetailer: boolean;
  quantity: number;
  unitPrice: number;
  totalValue: number;
  saleDate: string;
  paymentStatus: 'Paid' | 'Pending' | 'Partial';
  paymentMode: 'Cash' | 'Credit' | 'UPI' | 'Cheque';
  needsLiquidationTracking: boolean;
}

interface FarmerSale {
  id: string;
  farmerName: string;
  farmerPhone?: string;
  village: string;
  quantity: number;
  unitPrice: number;
  totalValue: number;
  saleDate: string;
  paymentMode: 'Cash' | 'UPI' | 'Credit';
}

interface ReturnDetails {
  id: string;
  returnFromType: 'Retailer' | 'Damage' | 'Other';
  returnFromName: string;
  quantity: number;
  reason: string;
  returnDate: string;
  requiresDeclaration: boolean;
  hasDeclaration: boolean;
}

interface StockVariance {
  skuId: string;
  varianceType: 'Sold to Retailer' | 'Sold to Farmer' | 'Return';
  retailerSales?: RetailerSale[];
  farmerSales?: FarmerSale[];
  returns?: ReturnDetails[];
}

interface LiquidationEntry {
  id: string;
  distributorId: string;
  distributorName: string;
  distributorCode: string;
  distributorAddress: string;
  distributorPhone: string;
  territory: string;
  region: string;
  zone: string;
  
  openingStock: number;
  ytdSales: number;
  liquidation: number;
  balanceStock: number;
  liquidationRate: number;
  
  status: 'Pending' | 'In Progress' | 'Completed' | 'Verified';
  lastUpdated: string;
  updatedBy: string;
  hasSignature: boolean;
  
  stockDetails: ProductStock[];
  salesBreakdown: any[];
}

const Liquidation: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'distributor' | 'product'>('distributor');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showStockModal, setShowStockModal] = useState(false);
  const [showVarianceModal, setShowVarianceModal] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [showRetailerModal, setShowRetailerModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showSalesModal, setShowSalesModal] = useState(false);
  const [selectedDistributor, setSelectedDistributor] = useState<string | null>(null);
  const [selectedSku, setSelectedSku] = useState<string | null>(null);
  const [stockData, setStockData] = useState<{[key: string]: {current: number}}>({});
  const [varianceData, setVarianceData] = useState<{[key: string]: StockVariance}>({});
  const [pendingNotifications, setPendingNotifications] = useState<string[]>([]);

  // Sample liquidation data with more products
  const liquidationData: LiquidationEntry[] = [
    {
      id: 'L001',
      distributorId: 'DIST001',
      distributorName: 'SRI RAMA SEEDS AND PESTICIDES',
      distributorCode: '1325',
      distributorAddress: 'Main Market, Agricultural Zone, Sector 15',
      distributorPhone: '+91 98765 43210',
      territory: 'North Delhi',
      region: 'Delhi NCR',
      zone: 'North Zone',
      
      openingStock: 40,
      ytdSales: 350,
      liquidation: 140,
      balanceStock: 250,
      liquidationRate: 36,
      
      status: 'Pending',
      lastUpdated: '2024-01-20',
      updatedBy: 'MDO001',
      hasSignature: false,
      
      stockDetails: [
        {
          id: 'S001',
          productCode: 'DAP001',
          productName: 'DAP (Di-Ammonium Phosphate)',
          skuCode: 'DAP-25KG',
          skuName: 'DAP 25kg Bag',
          unit: 'Kg',
          erpLastBalance: 100,
          currentStock: 85,
          variance: -15,
          variancePercentage: -15,
          unitPrice: 1350,
          hasBalance: true,
          isVerified: false
        },
        {
          id: 'S002',
          productCode: 'DAP001',
          productName: 'DAP (Di-Ammonium Phosphate)',
          skuCode: 'DAP-50KG',
          skuName: 'DAP 50kg Bag',
          unit: 'Kg',
          erpLastBalance: 50,
          currentStock: 45,
          variance: -5,
          variancePercentage: -10,
          unitPrice: 2700,
          hasBalance: true,
          isVerified: false
        },
        {
          id: 'S003',
          productCode: 'UREA001',
          productName: 'Urea',
          skuCode: 'UREA-25KG',
          skuName: 'Urea 25kg Bag',
          unit: 'Kg',
          erpLastBalance: 80,
          currentStock: 90,
          variance: 10,
          variancePercentage: 12.5,
          unitPrice: 600,
          hasBalance: true,
          isVerified: false
        },
        {
          id: 'S004',
          productCode: 'NPK001',
          productName: 'NPK Complex',
          skuCode: 'NPK-25KG',
          skuName: 'NPK Complex 25kg Bag',
          unit: 'Kg',
          erpLastBalance: 60,
          currentStock: 55,
          variance: -5,
          variancePercentage: -8.3,
          unitPrice: 800,
          hasBalance: true,
          isVerified: false
        },
        {
          id: 'S005',
          productCode: 'PEST001',
          productName: 'Insecticide',
          skuCode: 'PEST-1L',
          skuName: 'Insecticide 1L Bottle',
          unit: 'Litre',
          erpLastBalance: 30,
          currentStock: 25,
          variance: -5,
          variancePercentage: -16.7,
          unitPrice: 400,
          hasBalance: true,
          isVerified: false
        },
        // Additional products with balance stock (not verified)
        {
          id: 'S006',
          productCode: 'MOP001',
          productName: 'MOP (Muriate of Potash)',
          skuCode: 'MOP-25KG',
          skuName: 'MOP 25kg Bag',
          unit: 'Kg',
          erpLastBalance: 40,
          currentStock: 40,
          variance: 0,
          variancePercentage: 0,
          unitPrice: 800,
          hasBalance: true,
          isVerified: false
        },
        {
          id: 'S007',
          productCode: 'SSP001',
          productName: 'SSP (Single Super Phosphate)',
          skuCode: 'SSP-50KG',
          skuName: 'SSP 50kg Bag',
          unit: 'Kg',
          erpLastBalance: 35,
          currentStock: 35,
          variance: 0,
          variancePercentage: 0,
          unitPrice: 800,
          hasBalance: true,
          isVerified: false
        },
        {
          id: 'S008',
          productCode: 'SEED001',
          productName: 'Hybrid Seeds',
          skuCode: 'SEED-1KG',
          skuName: 'Hybrid Seeds 1kg Pack',
          unit: 'Kg',
          erpLastBalance: 25,
          currentStock: 25,
          variance: 0,
          variancePercentage: 0,
          unitPrice: 750,
          hasBalance: true,
          isVerified: false
        }
      ],
      salesBreakdown: []
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'text-yellow-700 bg-yellow-100';
      case 'In Progress':
        return 'text-blue-700 bg-blue-100';
      case 'Completed':
        return 'text-green-700 bg-green-100';
      case 'Verified':
        return 'text-purple-700 bg-purple-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Clock className="w-4 h-4" />;
      case 'In Progress':
        return <Package className="w-4 h-4" />;
      case 'Completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'Verified':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const handleStockUpdate = (skuId: string, value: number) => {
    setStockData(prev => ({
      ...prev,
      [skuId]: { current: value }
    }));
  };

  const calculateVariance = (erpBalance: number, current: number) => {
    const variance = current - erpBalance;
    const percentage = erpBalance > 0 ? (variance / erpBalance) * 100 : 0;
    return { variance, percentage };
  };

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return 'text-red-600 bg-red-50 border-red-200';
    if (variance < 0) return 'text-green-600 bg-green-50 border-green-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const openStockModal = (distributorId: string) => {
    setSelectedDistributor(distributorId);
    setShowStockModal(true);
  };

  const openDetailsModal = (distributorId: string) => {
    setSelectedDistributor(distributorId);
    setShowDetailsModal(true);
  };

  const openSalesModal = (distributorId: string) => {
    setSelectedDistributor(distributorId);
    setShowSalesModal(true);
  };

  const checkPendingEntries = () => {
    const selectedDistributorData = liquidationData.find(d => d.id === selectedDistributor);
    if (!selectedDistributorData) return;

    const unverifiedProducts = selectedDistributorData.stockDetails.filter(
      stock => stock.hasBalance && !stock.isVerified && !(stock.id in stockData)
    );

    if (unverifiedProducts.length > 0) {
      setPendingNotifications([
        `There are ${unverifiedProducts.length} additional products where entries are pending (Only products with balance stock)`
      ]);
      return false;
    }
    return true;
  };

  const processStockEntry = () => {
    const selectedDistributorData = liquidationData.find(d => d.id === selectedDistributor);
    if (!selectedDistributorData) return;

    // Check for pending entries
    if (!checkPendingEntries()) {
      return;
    }

    // Check if all entries have no variance (only e-sign needed)
    const hasVariances = selectedDistributorData.stockDetails.some(stock => {
      const current = stockData[stock.id]?.current ?? stock.currentStock;
      return current !== stock.erpLastBalance;
    });

    if (!hasVariances) {
      // No differences - only e-sign needed
      setShowStockModal(false);
      setShowSignatureModal(true);
      return;
    }

    // Has variances - need to process each variance
    setShowStockModal(false);
    setShowVarianceModal(true);
  };

  const handleVarianceType = (skuId: string, type: 'Sold to Retailer' | 'Sold to Farmer' | 'Return') => {
    setVarianceData(prev => ({
      ...prev,
      [skuId]: { ...prev[skuId], skuId, varianceType: type }
    }));

    if (type === 'Sold to Retailer') {
      setSelectedSku(skuId);
      setShowRetailerModal(true);
    } else if (type === 'Sold to Farmer') {
      // No details needed for farmer sales
      processVariance(skuId, type);
    } else if (type === 'Return') {
      // Process return - needs e-sign or letterhead declaration
      processVariance(skuId, type);
    }
  };

  const processVariance = (skuId: string, type: string) => {
    console.log(`Processing variance for SKU ${skuId} as ${type}`);
    
    if (type === 'Sold to Retailer') {
      // Add notification for pending retailer liquidation tracking
      setPendingNotifications(prev => [
        ...prev,
        `Pending task: Track liquidation from retailer for SKU ${skuId}`
      ]);
    }
  };

  const addRetailerSale = (retailerData: RetailerSale) => {
    if (!selectedSku) return;
    
    setVarianceData(prev => ({
      ...prev,
      [selectedSku]: {
        ...prev[selectedSku],
        retailerSales: [...(prev[selectedSku]?.retailerSales || []), retailerData]
      }
    }));

    // Add notification for retailer liquidation tracking
    setPendingNotifications(prev => [
      ...prev,
      `New retailer added: ${retailerData.retailerName}. Liquidation tracking required.`
    ]);

    setShowRetailerModal(false);
  };

  const selectedDistributorData = liquidationData.find(d => d.id === selectedDistributor);

  const filteredData = liquidationData.filter(entry => {
    const matchesSearch = entry.distributorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.distributorCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || entry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalStats = {
    totalDistributors: liquidationData.length,
    avgLiquidationRate: Math.round(liquidationData.reduce((sum, entry) => sum + entry.liquidationRate, 0) / liquidationData.length),
    pendingEntries: liquidationData.filter(entry => entry.status === 'Pending').length,
    completedEntries: liquidationData.filter(entry => entry.status === 'Completed').length
  };

  return (
    <div className="space-y-6">
      {/* Notifications */}
      {pendingNotifications.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-center mb-2">
            <Bell className="w-5 h-5 text-yellow-600 mr-2" />
            <h3 className="font-medium text-yellow-800">Pending Notifications</h3>
          </div>
          <ul className="space-y-1">
            {pendingNotifications.map((notification, index) => (
              <li key={index} className="text-sm text-yellow-700 flex items-start">
                <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                {notification}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stock Liquidation Tracking</h1>
          <p className="text-gray-600 mt-1">Track and manage distributor stock liquidation</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('distributor')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'distributor'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Distributor wise
            </button>
            <button
              onClick={() => setViewMode('product')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'product'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Product wise
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Distributors</p>
              <p className="text-2xl font-bold text-gray-900">{totalStats.totalDistributors}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Building className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Liquidation Rate</p>
              <p className="text-2xl font-bold text-gray-900">{totalStats.avgLiquidationRate}%</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Droplets className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Entries</p>
              <p className="text-2xl font-bold text-gray-900">{totalStats.pendingEntries}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{totalStats.completedEntries}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-purple-600" />
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
                placeholder="Search distributors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
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
          </div>
        </div>
      </div>

      {/* Distributor Cards */}
      {viewMode === 'distributor' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Showing {filteredData.length} of {liquidationData.length} distributors</p>
          
          {filteredData.map((entry) => (
            <div key={entry.id} className="bg-white rounded-xl p-6 card-shadow card-hover">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Building className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{entry.distributorName}</h3>
                    <p className="text-sm text-gray-600">Code: {entry.distributorCode}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(entry.status)}`}>
                  {getStatusIcon(entry.status)}
                  <span className="ml-1">{entry.status}</span>
                </span>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{entry.openingStock}</div>
                  <div className="text-xs text-orange-700">Opening Stock</div>
                  <div className="text-xs text-orange-600">Kg/Litre</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{entry.ytdSales}</div>
                  <div className="text-xs text-blue-700">YTD Sales</div>
                  <div className="text-xs text-blue-600">Kg/Litre</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{entry.liquidation}</div>
                  <div className="text-xs text-green-700">Liquidation</div>
                  <div className="text-xs text-green-600">Kg/Litre</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{entry.balanceStock}</div>
                  <div className="text-xs text-purple-700">Balance Stock</div>
                  <div className="text-xs text-purple-600">Kg/Litre</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{entry.liquidationRate}%</div>
                  <div className="text-xs text-purple-700">Liquidation Rate</div>
                  <div className="text-xs text-purple-600">Performance</div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  {entry.distributorPhone}
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {entry.distributorAddress}
                </div>
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Last updated: {new Date(entry.lastUpdated).toLocaleDateString()}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => openStockModal(entry.id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Package className="w-4 h-4 mr-2" />
                  Enter Current Stock
                </button>
                <button 
                  onClick={() => openDetailsModal(entry.id)}
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </button>
                <button 
                  onClick={() => openSalesModal(entry.id)}
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Sales Breakdown
                </button>
                <button
                  onClick={() => navigate(`/retailer-liquidation/${entry.id}`)}
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Retailer Tracking
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stock Entry Modal */}
      {showStockModal && selectedDistributorData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Enter Current Stock - Product & SKU wise</h3>
                <p className="text-sm text-gray-600 mt-1">{selectedDistributorData.distributorName}</p>
              </div>
              <button
                onClick={() => setShowStockModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {/* Alert for missing entries */}
              {pendingNotifications.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center mb-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                    <h4 className="font-medium text-yellow-800">Pending Entries Alert</h4>
                  </div>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    {pendingNotifications.map((notification, index) => (
                      <li key={index}>• {notification}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {selectedDistributorData.stockDetails.filter(stock => {
                      const current = stockData[stock.id]?.current ?? stock.currentStock;
                      return current > stock.erpLastBalance;
                    }).length}
                  </div>
                  <div className="text-sm text-red-700">Stock Increases</div>
                  <div className="text-xs text-red-600">Need Explanation</div>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {selectedDistributorData.stockDetails.filter(stock => {
                      const current = stockData[stock.id]?.current ?? stock.currentStock;
                      return current < stock.erpLastBalance;
                    }).length}
                  </div>
                  <div className="text-sm text-green-700">Stock Decreases</div>
                  <div className="text-xs text-green-600">Normal Liquidation</div>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gray-600">
                    {selectedDistributorData.stockDetails.filter(stock => {
                      const current = stockData[stock.id]?.current ?? stock.currentStock;
                      return current === stock.erpLastBalance;
                    }).length}
                  </div>
                  <div className="text-sm text-gray-700">No Change</div>
                  <div className="text-xs text-gray-600">E-Sign Only</div>
                </div>
              </div>

              {/* Stock Entry Form */}
              <div className="space-y-4">
                {selectedDistributorData.stockDetails.map((stock) => {
                  const currentStock = stockData[stock.id]?.current ?? stock.currentStock;
                  const { variance, percentage } = calculateVariance(stock.erpLastBalance, currentStock);
                  
                  return (
                    <div key={stock.id} className="border border-gray-200 rounded-lg p-6 mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{stock.productName}</h4>
                          <p className="text-sm text-gray-600">SKU: {stock.skuCode} | {stock.skuName}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Unit Price</p>
                          <p className="font-medium">₹{stock.unitPrice}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg border">
                          <p className="text-xs text-blue-600 font-medium">ERP Last Balance</p>
                          <p className="text-lg font-bold text-blue-800">{stock.erpLastBalance} {stock.unit}</p>
                          <p className="text-xs text-blue-500">From ERP - Non Editable</p>
                        </div>

                        <div className="text-center p-3 bg-white rounded-lg border-2 border-yellow-300">
                          <p className="text-xs text-gray-600 font-medium">Current Physical Stock</p>
                          <div className="relative">
                            <input
                              type="number"
                              value={currentStock}
                              onChange={(e) => handleStockUpdate(stock.id, parseInt(e.target.value) || 0)}
                              className="w-full text-center text-lg font-bold bg-yellow-50 border border-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500 rounded px-2 py-1"
                              min="0"
                              placeholder="Enter count"
                            />
                            <span className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-800 text-xs px-2 py-1 rounded-full font-bold">EDIT</span>
                          </div>
                          <p className="text-xs text-gray-500">{stock.unit}</p>
                        </div>

                        <div className={`text-center p-3 rounded-lg ${getVarianceColor(variance)}`}>
                          <p className="text-xs text-gray-600 font-medium">Variance</p>
                          <p className={`text-lg font-bold ${variance > 0 ? 'text-red-600' : variance < 0 ? 'text-green-600' : 'text-gray-600'}`}>
                            {variance > 0 ? '+' : ''}{variance} {stock.unit}
                          </p>
                          <p className={`text-xs ${variance > 0 ? 'text-red-500' : variance < 0 ? 'text-green-500' : 'text-gray-500'}`}>
                            {percentage > 0 ? '+' : ''}{percentage.toFixed(1)}%
                          </p>
                        </div>

                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <p className="text-xs text-purple-600 font-medium">Total Value</p>
                          <p className="text-lg font-bold text-purple-800">
                            ₹{(currentStock * stock.unitPrice).toLocaleString()}
                          </p>
                          <p className="text-xs text-purple-600">
                            Variance: ₹{(variance * stock.unitPrice).toLocaleString()}
                          </p>
                        </div>

                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-600 font-medium">Status</p>
                          <div className="mt-1">
                            {variance > 0 ? (
                              <div>
                                <AlertTriangle className="w-6 h-6 text-red-600 mx-auto" />
                                <p className="text-xs text-red-600 font-medium">INCREASE</p>
                              </div>
                            ) : variance < 0 ? (
                              <div>
                                <CheckCircle className="w-6 h-6 text-green-600 mx-auto" />
                                <p className="text-xs text-green-600 font-medium">DECREASE</p>
                              </div>
                            ) : (
                              <div>
                                <Minus className="w-6 h-6 text-gray-600 mx-auto" />
                                <p className="text-xs text-gray-600 font-medium">NO CHANGE</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Explanation dropdown for stock increases */}
                      {variance > 0 && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <label className="block text-sm font-medium text-red-800 mb-2">
                            Stock Increase Detected - Explanation Required:
                          </label>
                          <select 
                            className="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === 'return_from_retailer') {
                                // Show retailer selection modal
                                setSelectedSku(stock.id);
                                setShowRetailerModal(true);
                              }
                            }}
                          >
                            <option value="">Select explanation...</option>
                            <option value="return_from_retailer">Return from Retailer</option>
                            <option value="new_stock_received">New Stock Received</option>
                            <option value="counting_error_previous">Previous Counting Error</option>
                            <option value="other">Other (Specify in notes)</option>
                          </select>
                          
                          {/* Show retailer details if return from retailer is selected */}
                          {stockData[stock.id]?.returnFromRetailer && (
                            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <h5 className="font-medium text-blue-800 mb-2">Return Details:</h5>
                              <div className="text-sm text-blue-700 space-y-1">
                                <p><strong>Retailer:</strong> {stockData[stock.id].returnFromRetailer.name}</p>
                                <p><strong>Code:</strong> {stockData[stock.id].returnFromRetailer.code}</p>
                                <p><strong>Phone:</strong> {stockData[stock.id].returnFromRetailer.phone}</p>
                                <p><strong>Return Quantity:</strong> {variance} {stock.unit}</p>
                                <p><strong>Reason:</strong> {stockData[stock.id].returnFromRetailer.reason}</p>
                              </div>
                              <button
                                onClick={() => {
                                  setSelectedSku(stock.id);
                                  setShowRetailerModal(true);
                                }}
                                className="mt-2 text-blue-600 hover:text-blue-800 text-sm underline"
                              >
                                Edit Return Details
                              </button>
                            </div>
                          )}
                          
                          <p className="text-xs text-red-600 mt-1">
                            This increase will require verification and documentation
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <div className="flex items-center">
                    <Info className="w-4 h-4 mr-2" />
                    <span>All products with balance stock must be verified</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowStockModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={processStockEntry}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                    disabled={false}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Process Entry
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Variance Processing Modal */}
      {showVarianceModal && selectedDistributorData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Process Stock Variances</h3>
                <p className="text-sm text-gray-600 mt-1">Classify each variance type for {selectedDistributorData.distributorName}</p>
              </div>
              <button
                onClick={() => setShowVarianceModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 bg-blue-50 border-b">
              <div className="flex items-center text-blue-800">
                <Info className="w-4 h-4 mr-2" />
                <span className="text-sm">
                  For each stock variance, select how the stock was liquidated or returned
                </span>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="space-y-4">
                {selectedDistributorData.stockDetails
                  .filter(stock => {
                    const current = stockData[stock.id]?.current ?? stock.currentStock;
                    return current !== stock.erpLastBalance;
                  })
                  .map((stock) => {
                    const currentStock = stockData[stock.id]?.current ?? stock.currentStock;
                    const { variance } = calculateVariance(stock.erpLastBalance, currentStock);
                    
                    return (
                      <div key={stock.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-medium text-gray-900">{stock.skuName}</h4>
                            <p className="text-sm text-gray-600">
                              Variance: {variance > 0 ? '+' : ''}{variance} {stock.unit}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <button
                            onClick={() => handleVarianceType(stock.id, 'Sold to Retailer')}
                            className="p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
                          >
                            <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                            <p className="font-medium text-blue-800">Sold to Retailer</p>
                            <p className="text-xs text-blue-600">Add retailer details</p>
                            <p className="text-xs text-blue-600">E-SIGN needed</p>
                          </button>

                          <button
                            onClick={() => handleVarianceType(stock.id, 'Return')}
                            className="p-4 border-2 border-purple-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors"
                          >
                            <Package className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                            <p className="font-medium text-purple-800">Return</p>
                            <p className="text-xs text-purple-600">E-SIGN or</p>
                            <p className="text-xs text-purple-600">Letterhead Declaration</p>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                
                {selectedDistributorData.stockDetails.filter(stock => {
                  const current = stockData[stock.id]?.current ?? stock.currentStock;
                  return current !== stock.erpLastBalance;
                }).length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                    <p className="text-gray-600">No variances detected</p>
                    <p className="text-sm text-gray-500">All stock entries match ERP balance</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Retailer Details Modal */}
      {showRetailerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-900">Return from Retailer - Details Required</h3>
              <button
                onClick={() => setShowRetailerModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-yellow-800">
                  <strong>Stock Increase Detected:</strong> Please specify which retailer returned the stock and provide details for verification.
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Which Retailer Returned Stock? *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter retailer name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Retailer Code *
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Auto-generated or enter"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Retailer Address
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Enter retailer address"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Return Quantity *
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter quantity"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Original Unit Price
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter unit price"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Return Date *
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      defaultValue={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason for Return *
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Select reason...</option>
                    <option value="quality_issue">Quality Issue</option>
                    <option value="wrong_product">Wrong Product Delivered</option>
                    <option value="excess_stock">Excess Stock</option>
                    <option value="expiry_concern">Near Expiry</option>
                    <option value="customer_complaint">Customer Complaint</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowRetailerModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Add return from retailer logic here
                    setShowRetailerModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                >
                  <Package className="w-4 h-4 mr-2" />
                  Record Return
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Signature Modal */}
      <SignatureCapture
        isOpen={showSignatureModal}
        onClose={() => setShowSignatureModal(false)}
        onSave={(signature) => {
          console.log('Signature saved:', signature);
          setShowSignatureModal(false);
          alert('Stock data saved and verified with distributor signature!');
        }}
        title="Distributor Signature Verification"
      />

      {/* View Details Modal */}
      {showDetailsModal && selectedDistributorData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Distributor Details</h3>
                <p className="text-sm text-gray-600 mt-1">{selectedDistributorData.distributorName}</p>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Distributor Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Building className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="font-medium">Name:</span>
                      <span className="ml-2">{selectedDistributorData.distributorName}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="font-medium">Code:</span>
                      <span className="ml-2">{selectedDistributorData.distributorCode}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="font-medium">Phone:</span>
                      <span className="ml-2">{selectedDistributorData.distributorPhone}</span>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-500" />
                      <span className="font-medium">Address:</span>
                      <span className="ml-2">{selectedDistributorData.distributorAddress}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Territory Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="font-medium">Territory:</span>
                      <span className="ml-2">{selectedDistributorData.territory}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="font-medium">Region:</span>
                      <span className="ml-2">{selectedDistributorData.region}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="font-medium">Zone:</span>
                      <span className="ml-2">{selectedDistributorData.zone}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="font-medium">Last Updated:</span>
                      <span className="ml-2">{new Date(selectedDistributorData.lastUpdated).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stock Summary */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-4">Stock Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{selectedDistributorData.openingStock}</div>
                    <div className="text-sm text-orange-700">Opening Stock</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{selectedDistributorData.ytdSales}</div>
                    <div className="text-sm text-blue-700">YTD Sales</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{selectedDistributorData.liquidation}</div>
                    <div className="text-sm text-green-700">Liquidation</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{selectedDistributorData.balanceStock}</div>
                    <div className="text-sm text-purple-700">Balance Stock</div>
                  </div>
                  <div className="text-center p-4 bg-indigo-50 rounded-lg">
                    <div className="text-2xl font-bold text-indigo-600">{selectedDistributorData.liquidationRate}%</div>
                    <div className="text-sm text-indigo-700">Liquidation Rate</div>
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Product & SKU Details</h4>
                <div className="space-y-4">
                  {selectedDistributorData.stockDetails.map((stock) => (
                    <div key={stock.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h5 className="font-medium text-gray-900">{stock.productName}</h5>
                          <p className="text-sm text-gray-600">SKU: {stock.skuCode} | {stock.skuName}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Unit Price</p>
                          <p className="font-medium">₹{stock.unitPrice}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-600">ERP Balance</p>
                          <p className="font-bold text-blue-800">{stock.erpLastBalance} {stock.unit}</p>
                        </div>
                        <div className="text-center p-3 bg-yellow-50 rounded-lg">
                          <p className="text-sm text-yellow-600">Current Stock</p>
                          <p className="font-bold text-yellow-800">{stock.currentStock} {stock.unit}</p>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <p className="text-sm text-green-600">Variance</p>
                          <p className={`font-bold ${stock.variance > 0 ? 'text-red-600' : stock.variance < 0 ? 'text-green-600' : 'text-gray-600'}`}>
                            {stock.variance > 0 ? '+' : ''}{stock.variance} {stock.unit}
                          </p>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <p className="text-sm text-purple-600">Status</p>
                          <div className="flex justify-center">
                            {stock.isVerified ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <Clock className="w-5 h-5 text-yellow-600" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sales Breakdown Modal */}
      {showSalesModal && selectedDistributorData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Sales Breakdown</h3>
                <p className="text-sm text-gray-600 mt-1">{selectedDistributorData.distributorName}</p>
              </div>
              <button
                onClick={() => setShowSalesModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Sales Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-blue-50 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600">₹{(selectedDistributorData.ytdSales * 1000).toLocaleString()}</div>
                  <div className="text-sm text-blue-700">Total Sales Value</div>
                </div>
                <div className="bg-green-50 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-green-600">{selectedDistributorData.ytdSales}</div>
                  <div className="text-sm text-green-700">Total Volume</div>
                </div>
                <div className="bg-purple-50 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600">8</div>
                  <div className="text-sm text-purple-700">Product Lines</div>
                </div>
                <div className="bg-orange-50 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-orange-600">{selectedDistributorData.liquidationRate}%</div>
                  <div className="text-sm text-orange-700">Liquidation Rate</div>
                </div>
              </div>

              {/* Product-wise Sales Breakdown */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-4">Product-wise Sales Performance</h4>
                <div className="space-y-4">
                  {selectedDistributorData.stockDetails.map((stock, index) => {
                    const salesVolume = Math.abs(stock.variance) > 0 ? Math.abs(stock.variance) : Math.floor(stock.erpLastBalance * 0.3);
                    const salesValue = salesVolume * stock.unitPrice;
                    const liquidationRate = stock.erpLastBalance > 0 ? Math.round((salesVolume / stock.erpLastBalance) * 100) : 0;
                    
                    return (
                      <div key={stock.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h5 className="font-medium text-gray-900">{stock.productName}</h5>
                            <p className="text-sm text-gray-600">SKU: {stock.skuCode}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-green-600">₹{salesValue.toLocaleString()}</p>
                            <p className="text-sm text-gray-600">Sales Value</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-600">Opening Stock</p>
                            <p className="font-bold text-blue-800">{stock.erpLastBalance} {stock.unit}</p>
                          </div>
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <p className="text-sm text-green-600">Sales Volume</p>
                            <p className="font-bold text-green-800">{salesVolume} {stock.unit}</p>
                          </div>
                          <div className="text-center p-3 bg-yellow-50 rounded-lg">
                            <p className="text-sm text-yellow-600">Current Stock</p>
                            <p className="font-bold text-yellow-800">{stock.currentStock} {stock.unit}</p>
                          </div>
                          <div className="text-center p-3 bg-purple-50 rounded-lg">
                            <p className="text-sm text-purple-600">Unit Price</p>
                            <p className="font-bold text-purple-800">₹{stock.unitPrice}</p>
                          </div>
                          <div className="text-center p-3 bg-indigo-50 rounded-lg">
                            <p className="text-sm text-indigo-600">Liquidation %</p>
                            <p className="font-bold text-indigo-800">{liquidationRate}%</p>
                          </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="mb-2">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Liquidation Progress</span>
                            <span>{liquidationRate}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-green-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${Math.min(liquidationRate, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Monthly Trend (Sample Data) */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Monthly Sales Trend</h4>
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-center">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => (
                      <div key={month} className="p-3 bg-white rounded-lg">
                        <p className="text-sm text-gray-600">{month}</p>
                        <p className="text-lg font-bold text-blue-600">
                          ₹{((selectedDistributorData.ytdSales * 1000) / 6 * (0.8 + Math.random() * 0.4)).toFixed(0)}
                        </p>
                      </div>
                    ))}
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