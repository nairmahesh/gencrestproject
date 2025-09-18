import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Droplets, 
  TrendingUp, 
  Package, 
  Target, 
  Building, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  ArrowLeft,
  X,
  Users,
  Save,
  Edit,
  Minus
} from 'lucide-react';
import { useLiquidationCalculation } from '../hooks/useLiquidationCalculation';
import { useAuth } from '../contexts/AuthContext';

interface SKUData {
  skuCode: string;
  skuName: string;
  unit: string;
  invoiceDate: string;
  invoiceNumber: string;
  openingStock: number;
  ytdSales: number;
  liquidation: number;
  currentStock: number;
  unitPrice: number;
  totalValue: number;
}

interface RetailerDistribution {
  id: string;
  name: string;
  quantities: { [skuCode: string]: number };
}

const Liquidation: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchTag, setSearchTag] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedMetric, setSelectedMetric] = useState<string>('');
  const [showSKUModal, setShowSKUModal] = useState(false);
  const [showRetailerModal, setShowRetailerModal] = useState(false);
  const [showStockUpdateModal, setShowStockUpdateModal] = useState(false);
  const [selectedSKU, setSelectedSKU] = useState<SKUData | null>(null);
  const [stockReduction, setStockReduction] = useState<{ [skuCode: string]: number }>({});
  const [saleType, setSaleType] = useState<'farmer' | 'retailer' | ''>('');
  const [retailerCount, setRetailerCount] = useState(1);
  const [retailers, setRetailers] = useState<RetailerDistribution[]>([
    { id: '1', name: '', quantities: {} }
  ]);
  const [verificationData, setVerificationData] = useState({
    skuVerifications: {} as { [skuCode: string]: { current: number; physical: number; variance: number } },
    reason: '',
    verifiedBy: user?.name || 'User'
  });
  
  // Fallback data in case hook fails
  const overallMetrics = {
    openingStock: { volume: 32660, value: 40.55 },
    ytdNetSales: { volume: 23303, value: 27.36 },
    liquidation: { volume: 12720, value: 16.55 },
    balanceStock: { volume: 43243, value: 51.36 },
    liquidationPercentage: 28,
    lastUpdated: new Date().toISOString()
  };

  const distributorMetrics = [
    {
      id: 'DIST001',
      distributorName: 'SRI RAMA SEEDS AND PESTICIDES',
      distributorCode: '1325',
      territory: 'North Delhi',
      region: 'Delhi NCR',
      zone: 'North Zone',
      status: 'Active',
      priority: 'High',
      metrics: {
        openingStock: { volume: 40, value: 13.80 },
        ytdNetSales: { volume: 310, value: 13.95 },
        liquidation: { volume: 140, value: 9.30 },
        balanceStock: { volume: 210, value: 18.45 },
        liquidationPercentage: 40,
        lastUpdated: new Date().toISOString()
      }
    },
    {
      id: 'DIST002',
      distributorName: 'Ram Kumar Distributors',
      distributorCode: 'DLR001',
      territory: 'Green Valley',
      region: 'Delhi NCR',
      zone: 'North Zone',
      status: 'Active',
      priority: 'Medium',
      metrics: {
        openingStock: { volume: 15000, value: 18.75 },
        ytdNetSales: { volume: 6500, value: 8.13 },
        liquidation: { volume: 6200, value: 7.75 },
        balanceStock: { volume: 15300, value: 19.13 },
        liquidationPercentage: 29,
        lastUpdated: new Date().toISOString()
      }
    },
    {
      id: 'DIST003',
      distributorName: 'Green Agro Solutions',
      distributorCode: 'GAS001',
      territory: 'Sector 8',
      region: 'Delhi NCR',
      zone: 'North Zone',
      status: 'Active',
      priority: 'Low',
      metrics: {
        openingStock: { volume: 17620, value: 21.70 },
        ytdNetSales: { volume: 6493, value: 6.57 },
        liquidation: { volume: 6380, value: 7.22 },
        balanceStock: { volume: 17733, value: 21.05 },
        liquidationPercentage: 26,
        lastUpdated: new Date().toISOString()
      }
    }
  ];

  const allTags = [
    'High Priority', 'Medium Priority', 'Low Priority',
    'North Delhi', 'Green Valley', 'Sector 8',
    'Active', 'Pending Review', 'Overdue',
    'Fertilizers', 'Seeds', 'Pesticides'
  ];

  const filteredTags = allTags.filter(tag => 
    tag.toLowerCase().includes(searchTag.toLowerCase())
  );

  const filteredDistributors = distributorMetrics.filter(distributor => {
    const matchesSearch = distributor.distributorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         distributor.distributorCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         distributor.territory.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => {
                         if (tag.includes('Priority')) return distributor.priority === tag.split(' ')[0];
                         if (tag === 'Active') return distributor.status === 'Active';
                         return distributor.territory.includes(tag) || distributor.region.includes(tag);
                       });
    
    return matchesSearch && matchesTags;
  });

  const getStatusColor = (status: string) => {
    return status === 'Active' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const removeTag = (tag: string) => {
    setSelectedTags(prev => prev.filter(t => t !== tag));
  };

  const clearAllTags = () => {
    setSelectedTags([]);
  };

  // Sample SKU data for distributors
  const getSKUData = (distributorId: string): SKUData[] => {
    return [
      {
        skuCode: 'DAP-25KG',
        skuName: 'DAP 25kg Bag',
        unit: 'Kg',
        invoiceDate: '2024-01-15',
        invoiceNumber: 'INV-2024-001',
        openingStock: 20,
        ytdSales: 155,
        liquidation: 70,
        currentStock: 105,
        unitPrice: 1350,
        totalValue: 141750
      },
      {
        skuCode: 'DAP-50KG',
        skuName: 'DAP 50kg Bag',
        unit: 'Kg',
        invoiceDate: '2024-01-15',
        invoiceNumber: 'INV-2024-001',
        openingStock: 20,
        ytdSales: 155,
        liquidation: 70,
        currentStock: 105,
        unitPrice: 2700,
        totalValue: 283500
      },
      {
        skuCode: 'UREA-25KG',
        skuName: 'Urea 25kg Bag',
        unit: 'Kg',
        invoiceDate: '2024-01-16',
        invoiceNumber: 'INV-2024-002',
        openingStock: 0,
        ytdSales: 0,
        liquidation: 0,
        currentStock: 0,
        unitPrice: 600,
        totalValue: 0
      }
    ];
  };

  const handleViewClick = (metric: string, item?: any) => {
    if (item) {
      // Show SKU-wise details for specific distributor
      setSelectedItem(item);
      setSelectedMetric(metric);
      setShowSKUModal(true);
    } else {
      // Show overall metrics
      setSelectedMetric(metric);
      setSelectedItem(null);
      setShowViewModal(true);
    }
  };

  const handleVerifyClick = (item: any) => {
    setSelectedItem(item);
    
    // Initialize SKU verification data
    const skuData = getSKUData(item.id);
    const skuVerifications: { [skuCode: string]: { current: number; physical: number; variance: number } } = {};
    
    skuData.forEach(sku => {
      skuVerifications[sku.skuCode] = {
        current: sku.currentStock,
        physical: 0,
        variance: 0
      };
    });
    
    setVerificationData({
      skuVerifications,
      reason: '',
      verifiedBy: user?.name || 'User'
    });
    setShowVerifyModal(true);
  };

  const handleSKUStockChange = (skuCode: string, field: 'current' | 'physical', value: number) => {
    setVerificationData(prev => {
      const newVerifications = { ...prev.skuVerifications };
      newVerifications[skuCode] = { ...newVerifications[skuCode], [field]: value };
      newVerifications[skuCode].variance = newVerifications[skuCode].physical - newVerifications[skuCode].current;
      
      return {
        ...prev,
        skuVerifications: newVerifications
      };
    });
  };

  const handleVerifySubmit = () => {
    const totalVariance = Object.values(verificationData.skuVerifications)
      .reduce((sum, sku) => sum + Math.abs(sku.variance), 0);
    
    console.log('Stock verification submitted:', {
      itemId: selectedItem.id,
      skuVerifications: verificationData.skuVerifications,
      reason: verificationData.reason,
      totalVariance,
      timestamp: new Date().toISOString()
    });
    
    alert(`Stock verified for ${selectedItem.distributorName}!\nTotal Variance: ${totalVariance} units across ${Object.keys(verificationData.skuVerifications).length} SKUs`);
    setShowVerifyModal(false);
    setSelectedItem(null);
  };

  const handleSKUStockUpdate = (skuCode: string, newStock: number, originalStock: number) => {
    const reduction = originalStock - newStock;
    if (reduction > 0) {
      setSelectedSKU(getSKUData(selectedItem.id).find(sku => sku.skuCode === skuCode) || null);
      setStockReduction(prev => ({ ...prev, [skuCode]: reduction }));
      setSaleType('');
      setShowSKUModal(false); // Close SKU modal first
      setTimeout(() => setShowStockUpdateModal(true), 100); // Open stock update modal
    }
  };

  const handleRetailerCountChange = (count: number) => {
    setRetailerCount(count);
    const newRetailers: RetailerDistribution[] = [];
    for (let i = 0; i < count; i++) {
      newRetailers.push({
        id: (i + 1).toString(),
        name: retailers[i]?.name || '',
        quantities: retailers[i]?.quantities || {}
      });
    }
    setRetailers(newRetailers);
  };

  const handleRetailerQuantityChange = (retailerIndex: number, skuCode: string, quantity: number) => {
    setRetailers(prev => 
      prev.map((retailer, index) => 
        index === retailerIndex 
          ? { ...retailer, quantities: { ...retailer.quantities, [skuCode]: quantity } }
          : retailer
      )
    );
  };

  const getTotalRetailerQuantity = (skuCode: string) => {
    return retailers.reduce((sum, retailer) => sum + (retailer.quantities[skuCode] || 0), 0);
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
            <h1 className="text-2xl font-bold text-gray-900">Stock Liquidation</h1>
            <p className="text-gray-600 mt-1">Track and manage distributor stock liquidation</p>
          </div>
        </div>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add Entry
        </button>
      </div>

      {/* Overall Metrics */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Overall Stock Liquidation</h3>
            <p className="text-sm text-gray-600 mt-1">Last updated: {new Date(overallMetrics.lastUpdated).toLocaleDateString()}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-purple-600">{overallMetrics.liquidationPercentage}%</div>
            <div className="text-sm text-gray-600">Liquidation Rate</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-orange-50 rounded-xl p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Opening Stock</h4>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-orange-800">32,660</div>
              <div className="text-sm text-orange-600">Kg/Litre</div>
              <div className="text-base font-semibold text-orange-700">₹40.55L</div>
              <button 
                onClick={() => handleViewClick('opening')}
                className="bg-orange-500 text-white px-3 py-1 rounded text-sm hover:bg-orange-600 transition-colors"
              >
                View
              </button>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">YTD Net Sales</h4>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-blue-800">23,303</div>
              <div className="text-sm text-blue-600">Kg/Litre</div>
              <div className="text-base font-semibold text-blue-700">₹27.36L</div>
              <button 
                onClick={() => handleViewClick('sales')}
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
              >
                View
              </button>
            </div>
          </div>

          <div className="bg-green-50 rounded-xl p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <Droplets className="w-6 h-6 text-white" />
              </div>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Liquidation</h4>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-green-800">12,720</div>
              <div className="text-sm text-green-600">Kg/Litre</div>
              <div className="text-base font-semibold text-green-700">₹16.55L</div>
              <button 
                onClick={() => handleViewClick('liquidation')}
                className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors"
              >
                View
              </button>
            </div>
          </div>

          <div className="bg-purple-50 rounded-xl p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Balance Stock</h4>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-purple-800">43,243</div>
              <div className="text-sm text-purple-600">Kg/Litre</div>
              <div className="text-base font-semibold text-purple-700">₹51.36L</div>
              <button 
                onClick={() => handleViewClick('balance')}
                className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600 transition-colors"
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Main Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search distributors, codes, territories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            {/* Tag Search */}
            <div className="flex-1">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search tags..."
                  value={searchTag}
                  onChange={(e) => setSearchTag(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Clear All Button */}
            {selectedTags.length > 0 && (
              <button
                onClick={clearAllTags}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center"
              >
                <X className="w-4 h-4 mr-1" />
                Clear All
              </button>
            )}
          </div>
          
          {searchTag && (
            <div className="border-t pt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Available Tags:</p>
              <div className="flex flex-wrap gap-2">
                {filteredTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {selectedTags.length > 0 && (
            <div className="border-t pt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Active Filters:</p>
              <div className="flex flex-wrap gap-2">
                {selectedTags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-2 hover:bg-purple-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Distributor Entries */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Distributor Entries</h3>
          <div className="text-sm text-gray-600">
            Showing {filteredDistributors.length} of {distributorMetrics.length} distributors
          </div>
        </div>

        <div className="space-y-6">
          {filteredDistributors.map((distributor) => (
            <div key={distributor.id} className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Building className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{distributor.distributorName}</h4>
                    <p className="text-sm text-gray-600">Code: {distributor.distributorCode} • {distributor.territory}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(distributor.status)}`}>
                    {distributor.status}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(distributor.priority)}`}>
                    {distributor.priority}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-orange-50 rounded-xl p-4 text-center">
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <h5 className="text-sm font-semibold text-orange-700 mb-2">Opening Stock</h5>
                  <div className="space-y-2">
                    <div className="text-xl font-bold text-orange-800">{distributor.metrics.openingStock.volume}</div>
                    <div className="text-sm text-orange-600">Value: ₹{distributor.metrics.openingStock.value.toFixed(2)}L</div>
                    <button 
                      onClick={() => handleViewClick('opening', distributor)}
                      className="bg-orange-500 text-white px-2 py-1 rounded text-xs hover:bg-orange-600 transition-colors"
                    >
                      View
                    </button>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <h5 className="text-sm font-semibold text-blue-700 mb-2">YTD Net Sales</h5>
                  <div className="space-y-2">
                    <div className="text-xl font-bold text-blue-800">{distributor.metrics.ytdNetSales.volume}</div>
                    <div className="text-sm text-blue-600">Value: ₹{distributor.metrics.ytdNetSales.value.toFixed(2)}L</div>
                    <button 
                      onClick={() => handleViewClick('sales', distributor)}
                      className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 transition-colors"
                    >
                      View
                    </button>
                  </div>
                </div>

                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Droplets className="w-5 h-5 text-white" />
                  </div>
                  <h5 className="text-sm font-semibold text-green-700 mb-2">Liquidation</h5>
                  <div className="space-y-2">
                    <div className="text-xl font-bold text-green-800">{distributor.metrics.liquidation.volume}</div>
                    <div className="text-sm text-green-600">Value: ₹{distributor.metrics.liquidation.value.toFixed(2)}L</div>
                    <button 
                      onClick={() => handleViewClick('liquidation', distributor)}
                      className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600 transition-colors"
                    >
                      View
                    </button>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-xl p-4 text-center">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <h5 className="text-sm font-semibold text-purple-700 mb-2">Balance Stock</h5>
                  <div className="space-y-2">
                    <div className="text-xl font-bold text-purple-800">{distributor.metrics.balanceStock.volume}</div>
                    <div className="text-sm text-purple-600">Value: ₹{distributor.metrics.balanceStock.value.toFixed(2)}L</div>
                    <button 
                      onClick={() => handleVerifyClick(distributor)}
                      className="bg-purple-500 text-white px-2 py-1 rounded text-xs hover:bg-purple-600 transition-colors"
                    >
                      Verify
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Liquidation Progress</span>
                  <span>{distributor.metrics.liquidationPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full" 
                    style={{ width: `${Math.min(distributor.metrics.liquidationPercentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View Details Modal */}
      {showViewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedMetric === 'opening' ? 'Opening Stock Details' :
                   selectedMetric === 'sales' ? 'YTD Net Sales Details' :
                   selectedMetric === 'liquidation' ? 'Liquidation Details' :
                   'Balance Stock Details'}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedItem ? `${selectedItem.distributorName} (${selectedItem.distributorCode})` : 'Overall metrics'}
                </p>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {selectedItem 
                    ? selectedItem.metrics[selectedMetric === 'opening' ? 'openingStock' : 
                                          selectedMetric === 'sales' ? 'ytdNetSales' :
                                          selectedMetric === 'liquidation' ? 'liquidation' : 'balanceStock'].volume.toLocaleString()
                    : overallMetrics[selectedMetric === 'opening' ? 'openingStock' : 
                                    selectedMetric === 'sales' ? 'ytdNetSales' :
                                    selectedMetric === 'liquidation' ? 'liquidation' : 'balanceStock'].volume.toLocaleString()
                  }
                </div>
                <div className="text-lg text-gray-600 mb-2">Kg/Litre</div>
                <div className="text-2xl font-semibold text-gray-700">
                  ₹{selectedItem 
                      ? selectedItem.metrics[selectedMetric === 'opening' ? 'openingStock' : 
                                            selectedMetric === 'sales' ? 'ytdNetSales' :
                                            selectedMetric === 'liquidation' ? 'liquidation' : 'balanceStock'].value.toFixed(2)
                      : overallMetrics[selectedMetric === 'opening' ? 'openingStock' : 
                                      selectedMetric === 'sales' ? 'ytdNetSales' :
                                      selectedMetric === 'liquidation' ? 'liquidation' : 'balanceStock'].value.toFixed(2)
                    }L
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="font-medium">
                      {new Date(selectedItem?.metrics.lastUpdated || overallMetrics.lastUpdated).toLocaleDateString()}
                    </span>
                  </div>
                  {selectedItem && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Territory:</span>
                        <span className="font-medium">{selectedItem.territory}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Region:</span>
                        <span className="font-medium">{selectedItem.region}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedItem.status)}`}>
                          {selectedItem.status}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SKU Details Modal */}
      {showSKUModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedMetric === 'opening' ? 'Opening Stock' :
                   selectedMetric === 'sales' ? 'YTD Net Sales' :
                   selectedMetric === 'liquidation' ? 'Liquidation' :
                   'Balance Stock'} - SKU Details
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedItem.distributorName} ({selectedItem.distributorCode})
                </p>
              </div>
              <button
                onClick={() => setShowSKUModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-6">
                {getSKUData(selectedItem.id).map((sku) => (
                  <div key={sku.skuCode} className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{sku.skuName}</h4>
                        <p className="text-sm text-gray-600">SKU: {sku.skuCode} | Unit: {sku.unit}</p>
                        <p className="text-sm text-gray-500">
                          Invoice: {sku.invoiceNumber} | Date: {new Date(sku.invoiceDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">₹{sku.unitPrice.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">per {sku.unit}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="bg-orange-50 rounded-lg p-4 text-center">
                        <h5 className="text-sm font-medium text-orange-700 mb-2">Opening Stock</h5>
                        <div className="text-xl font-bold text-orange-800">{sku.openingStock}</div>
                        <div className="text-xs text-orange-600">{sku.unit}</div>
                      </div>
                      
                      <div className="bg-blue-50 rounded-lg p-4 text-center">
                        <h5 className="text-sm font-medium text-blue-700 mb-2">YTD Sales</h5>
                        <div className="text-xl font-bold text-blue-800">{sku.ytdSales}</div>
                        <div className="text-xs text-blue-600">{sku.unit}</div>
                      </div>
                      
                      <div className="bg-green-50 rounded-lg p-4 text-center">
                        <h5 className="text-sm font-medium text-green-700 mb-2">Liquidation</h5>
                        <div className="text-xl font-bold text-green-800">{sku.liquidation}</div>
                        <div className="text-xs text-green-600">{sku.unit}</div>
                      </div>
                      
                      <div className="bg-purple-50 rounded-lg p-4 text-center">
                        <h5 className="text-sm font-medium text-purple-700 mb-2">Current Stock</h5>
                        <div className="flex items-center justify-center space-x-2">
                          <input
                            type="number"
                            defaultValue={sku.currentStock}
                            id={`stock-${sku.skuCode}`}
                            className="w-16 text-center text-lg font-bold text-purple-800 bg-transparent border-b-2 border-purple-300 focus:border-purple-500 outline-none"
                          />
                        </div>
                        <div className="text-xs text-purple-600">{sku.unit}</div>
                        <button
                          onClick={() => {
                            const input = document.getElementById(`stock-${sku.skuCode}`) as HTMLInputElement;
                            const newStock = parseInt(input.value) || 0;
                            if (newStock !== sku.currentStock) {
                              handleSKUStockUpdate(sku.skuCode, newStock, sku.currentStock);
                            }
                          }}
                          className="mt-2 bg-purple-600 text-white px-2 py-1 rounded text-xs hover:bg-purple-700"
                        >
                          Update Stock
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Total Value:</span>
                          <span className="font-semibold ml-2">₹{sku.totalValue.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Liquidation %:</span>
                          <span className="font-semibold ml-2">
                            {Math.round((sku.liquidation / (sku.openingStock + sku.ytdSales)) * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stock Update Modal */}
      {showStockUpdateModal && selectedSKU && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Stock Update - {selectedSKU.skuName}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Reduction: {stockReduction[selectedSKU.skuCode]} {selectedSKU.unit} | Invoice: {selectedSKU.invoiceNumber}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowStockUpdateModal(false);
                  setShowSKUModal(true);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Sale Type Selection */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Where was this {selectedSKU.skuName} sold?
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div 
                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                      saleType === 'farmer' 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                    onClick={() => setSaleType('farmer')}
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-green-600" />
                      </div>
                      <h5 className="text-lg font-semibold text-gray-900 mb-2">Sold to Farmer</h5>
                      <p className="text-sm text-gray-600">Direct liquidation (counts as liquidation)</p>
                    </div>
                  </div>
                  
                  <div 
                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                      saleType === 'retailer' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => setSaleType('retailer')}
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Building className="w-8 h-8 text-blue-600" />
                      </div>
                      <h5 className="text-lg font-semibold text-gray-900 mb-2">Sold to Retailer(s)</h5>
                      <p className="text-sm text-gray-600">Transfer to retailers (not liquidation yet)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Retailer Details */}
              {saleType === 'retailer' && (
                <div className="bg-blue-50 rounded-xl p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="text-lg font-semibold text-blue-800">Retailer Distribution</h5>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-blue-700">How many retailers?</span>
                      <select
                        value={retailerCount}
                        onChange={(e) => handleRetailerCountChange(parseInt(e.target.value))}
                        className="px-3 py-1 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        {[1,2,3,4,5].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {retailers.slice(0, retailerCount).map((retailer, index) => (
                      <div key={retailer.id} className="bg-white rounded-lg p-4 border border-blue-200">
                        <div className="flex items-center justify-between mb-3">
                          <h6 className="font-semibold text-gray-900">Retailer {index + 1}</h6>
                        </div>
                        
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Retailer Name
                          </label>
                          <input
                            type="text"
                            value={retailer.name}
                            onChange={(e) => {
                              setRetailers(prev => 
                                prev.map((r, i) => 
                                  i === index ? { ...r, name: e.target.value } : r
                                )
                              );
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter retailer name"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Quantity for {selectedSKU.skuCode}
                          </label>
                          <input
                            type="number"
                            value={retailer.quantities[selectedSKU.skuCode] || 0}
                            onChange={(e) => handleRetailerQuantityChange(index, selectedSKU.skuCode, parseInt(e.target.value) || 0)}
                            max={stockReduction[selectedSKU.skuCode]}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter quantity"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Available: {stockReduction[selectedSKU.skuCode]} {selectedSKU.unit}
                          </p>
                        </div>
                        
                        {getTotalRetailerQuantity(selectedSKU.skuCode) > stockReduction[selectedSKU.skuCode] && (
                          <div className="mt-3 p-2 bg-red-100 border border-red-300 rounded text-sm text-red-800">
                            ⚠️ Total quantity cannot exceed available stock ({stockReduction[selectedSKU.skuCode]} {selectedSKU.unit})
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* Summary */}
                  <div className="mt-6 bg-white rounded-lg p-4">
                    <h6 className="font-semibold text-gray-900 mb-3">Distribution Summary</h6>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{selectedSKU.skuCode}:</span>
                      <span className="font-medium">
                        {getTotalRetailerQuantity(selectedSKU.skuCode)} / {stockReduction[selectedSKU.skuCode]} {selectedSKU.unit}
                        {getTotalRetailerQuantity(selectedSKU.skuCode) === stockReduction[selectedSKU.skuCode] && (
                          <CheckCircle className="w-4 h-4 text-green-600 inline ml-1" />
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Farmer Sale */}
              {saleType === 'farmer' && (
                <div className="bg-green-50 rounded-xl p-6">
                  <h5 className="text-lg font-semibold text-green-800 mb-4">Farmer Sale Details</h5>
                  <div className="bg-white rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">{selectedSKU.skuCode}</span>
                      <span className="text-lg font-bold text-green-600">
                        {stockReduction[selectedSKU.skuCode]} {selectedSKU.unit}
                      </span>
                    </div>
                    <p className="text-sm text-green-700">✅ This counts as liquidation</p>
                    <p className="text-xs text-gray-600">Invoice: {selectedSKU.invoiceNumber}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3 p-6 border-t">
              <button
                onClick={() => {
                  setShowStockUpdateModal(false);
                  setShowSKUModal(true);
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log('Stock reduction processed:', {
                    skuCode: selectedSKU.skuCode,
                    saleType,
                    stockReduction,
                    retailers: saleType === 'retailer' ? retailers.slice(0, retailerCount) : null
                  });
                  alert(`Stock movement recorded for ${selectedSKU.skuCode}!`);
                  setShowStockUpdateModal(false);
                  setShowSKUModal(true);
                }}
                disabled={!saleType}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stock Verification Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Stock Verification</h3>
              <button
                onClick={() => setShowVerifyModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {selectedItem && (
                <div className="space-y-6">
                  <div className="bg-blue-100 border border-blue-300 rounded-lg p-4">
                    <h4 className="font-bold text-blue-900 text-lg">{selectedItem.distributorName}</h4>
                    <p className="text-sm text-gray-600">{selectedItem.distributorCode} • {selectedItem.territory}</p>
                  </div>
                  
                  {/* SKU-wise Verification */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">SKU-wise Stock Verification</h4>
                    <div className="space-y-4">
                      {getSKUData(selectedItem.id).map((sku) => (
                        <div key={sku.skuCode} className="bg-white rounded-lg border border-gray-200 p-4">
                          <div className="mb-4">
                            <p className="text-sm text-gray-600">SKU: {sku.skuCode} | Invoice: {sku.invoiceNumber}</p>
                            <p className="text-xs text-gray-500">Date: {new Date(sku.invoiceDate).toLocaleDateString()}</p>
                          </div>
                          
                          {/* Single line layout: SKU Name - Current Stock - Physical Stock */}
                          <div className="flex items-center space-x-6">
                            {/* SKU Name */}
                            <div className="flex-1">
                              <h5 className="font-semibold text-gray-900">{sku.skuName}</h5>
                            </div>
                            
                            {/* Current Stock */}
                            <div className="text-center">
                              <p className="text-sm font-medium text-gray-700 mb-2">Current Stock (System)</p>
                              <input
                                type="number"
                                value={verificationData.skuVerifications[sku.skuCode]?.current || sku.currentStock}
                                onChange={(e) => handleSKUStockChange(sku.skuCode, 'current', parseInt(e.target.value) || 0)}
                                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center"
                                placeholder="0"
                              />
                            </div>
                            
                            {/* Physical Stock */}
                            <div className="text-center">
                              <p className="text-sm font-medium text-gray-700 mb-2">Physical Stock (Verified)</p>
                              <input
                                type="number"
                                value={verificationData.skuVerifications[sku.skuCode]?.physical || ''}
                                onChange={(e) => handleSKUStockChange(sku.skuCode, 'physical', parseInt(e.target.value) || 0)}
                                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center"
                                placeholder="Enter count"
                              />
                            </div>
                          </div>
                          
                          {verificationData.skuVerifications[sku.skuCode] && verificationData.skuVerifications[sku.skuCode].variance !== 0 && (
                            <div className={`mt-3 p-3 rounded-lg ${
                              (verificationData.skuVerifications[sku.skuCode]?.variance || 0) > 0 
                                ? 'bg-green-50 border border-green-200' 
                                : 'bg-red-50 border border-red-200'
                            }`}>
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Variance for {sku.skuCode}:</span>
                                <span className={`font-bold ${
                                  (verificationData.skuVerifications[sku.skuCode]?.variance || 0) > 0 
                                    ? 'text-green-600' 
                                    : 'text-red-600'
                                }`}>
                                  {(verificationData.skuVerifications[sku.skuCode]?.variance || 0) > 0 ? '+' : ''}
                                  {verificationData.skuVerifications[sku.skuCode]?.variance || 0} {sku.unit}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                    
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Overall Reason for Variance (if any)
                    </label>
                    <textarea
                      value={verificationData.reason}
                      onChange={(e) => setVerificationData(prev => ({ ...prev, reason: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      rows={3}
                      placeholder="Explain any stock variance across SKUs..."
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex space-x-3 p-4 border-t">
              <button
                onClick={() => setShowVerifyModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifySubmit}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Verify Stock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Liquidation;