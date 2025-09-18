import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Droplets, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  ArrowLeft, 
  Package, 
  TrendingUp, 
  Target, 
  Building,
  MapPin,
  Calendar,
  User,
  AlertTriangle,
  CheckCircle,
  Clock,
  Tag,
  X
} from 'lucide-react';
import { useLiquidationCalculation } from '../hooks/useLiquidationCalculation';

const Liquidation: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchTag, setSearchTag] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedMetric, setSelectedMetric] = useState<string>('');
  const [verificationData, setVerificationData] = useState({
    currentStock: 0,
    physicalStock: 0,
    variance: 0,
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
      status: 'Active' as const,
      priority: 'High' as const,
      metrics: {
        openingStock: { volume: 40, value: 13.80 },
        ytdNetSales: { volume: 310, value: 13.95 },
        liquidation: { volume: 140, value: 9.30 },
        balanceStock: { volume: 210, value: 18.45 },
        liquidationPercentage: 40,
        lastUpdated: new Date().toISOString()
      },
      tags: ['Distributor', 'High', 'Active', 'Delhi NCR', 'North Zone', 'High Performance', 'Premium Partner', 'Fertilizers', 'North Delhi']
    },
    {
      id: 'DIST002',
      distributorName: 'Ram Kumar Distributors',
      distributorCode: 'DLR001',
      territory: 'Green Valley',
      region: 'Delhi NCR',
      zone: 'North Zone',
      status: 'Active' as const,
      priority: 'Medium' as const,
      metrics: {
        openingStock: { volume: 15000, value: 18.75 },
        ytdNetSales: { volume: 6500, value: 8.13 },
        liquidation: { volume: 6200, value: 7.75 },
        balanceStock: { volume: 15300, value: 19.13 },
        liquidationPercentage: 29,
        lastUpdated: new Date().toISOString()
      },
      tags: ['Distributor', 'Medium', 'Active', 'Delhi NCR', 'North Zone', 'Medium Performance', 'Fertilizers', 'Green Valley']
    }
  ];

  // Enhanced distributor data with tags
  const distributorsWithTags = distributorMetrics;

  // Add sample retailer data for demonstration
  const retailerData = [
    {
      id: 'RET001',
      distributorName: 'Green Agro Store',
      distributorCode: 'GAS001',
      territory: 'Sector 15',
      region: 'Delhi NCR',
      zone: 'North Zone',
      status: 'Active' as const,
      priority: 'Medium' as const,
      metrics: {
        openingStock: { volume: 25, value: 0.30 },
        ytdNetSales: { volume: 180, value: 0.85 },
        liquidation: { volume: 85, value: 0.45 },
        balanceStock: { volume: 120, value: 0.70 },
        liquidationPercentage: 41,
        lastUpdated: new Date().toISOString()
      },
      tags: [
        'Retailer', // Main filter option
        'Medium',
        'Active',
        'Delhi NCR',
        'North Zone',
        'Medium Performance',
        'Fertilizers',
        'Sector 15'
      ]
    }
  ];

  // Combine distributors and retailers
  const allEntities = [...distributorsWithTags, ...retailerData];

  // Get all unique tags
  const allTags = Array.from(new Set(allEntities.flatMap(d => d.tags)));
  
  // Prioritize main filter options
  const mainTags = ['Distributor', 'Retailer'];
  const otherTags = allTags.filter(tag => !mainTags.includes(tag));
  const sortedTags = [...mainTags, ...otherTags];
  
  // Filter tags based on search
  const filteredTags = sortedTags.filter(tag => 
    tag.toLowerCase().includes(searchTag.toLowerCase())
  );

  // Filter distributors based on search and tags
  const filteredEntities = allEntities.filter(entity => {
    const matchesSearch = entity.distributorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entity.distributorCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entity.territory.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entity.region.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => entity.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });

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

  const handleViewClick = (metric: string, item?: any) => {
    setSelectedMetric(metric);
    setSelectedItem(item);
    setShowViewModal(true);
  };

  const handleVerifyClick = (item: any) => {
    setSelectedItem(item);
    setVerificationData({
      currentStock: item.metrics.balanceStock.volume,
      physicalStock: item.metrics.balanceStock.volume,
      variance: 0,
      reason: '',
      verifiedBy: user?.name || 'User'
    });
    setShowVerifyModal(true);
  };

  const handleStockChange = (field: 'currentStock' | 'physicalStock', value: number) => {
    const newData = { ...verificationData, [field]: value };
    newData.variance = newData.physicalStock - newData.currentStock;
    setVerificationData(newData);
  };

  const handleVerifySubmit = () => {
    console.log('Stock verification submitted:', {
      itemId: selectedItem.id,
      ...verificationData,
      timestamp: new Date().toISOString()
    });
    
    alert(`Stock verified for ${selectedItem.distributorName}!\nVariance: ${verificationData.variance} ${selectedItem.metrics.balanceStock.volume > 1000 ? 'Kg' : 'L'}`);
    setShowVerifyModal(false);
    setSelectedItem(null);
  };

  const getTagColor = (tag: string) => {
    if (tag.includes('High')) return 'bg-red-100 text-red-800';
    if (tag.includes('Medium')) return 'bg-yellow-100 text-yellow-800';
    if (tag.includes('Low')) return 'bg-green-100 text-green-800';
    if (tag.includes('Premium')) return 'bg-purple-100 text-purple-800';
    if (tag.includes('Active')) return 'bg-green-100 text-green-800';
    if (tag.includes('Inactive')) return 'bg-gray-100 text-gray-800';
    if (tag.includes('Attention')) return 'bg-red-100 text-red-800';
    if (tag.includes('Performance')) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-600 bg-green-100';
      case 'Inactive': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
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
            <h1 className="text-2xl font-bold text-gray-900">Stock Liquidation</h1>
            <p className="text-gray-600 mt-1">Track and manage distributor stock liquidation</p>
          </div>
        </div>
      </div>

      {/* Overall Metrics */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Stock Liquidation Overview</h2>
            <p className="text-sm text-gray-600 mt-1">Last updated: 15 Sept 2025, 10:00 pm</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 border-l-4 border-orange-500 card-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-orange-800">Opening Stock</h3>
              <button 
                onClick={() => handleViewClick('opening')}
                className="bg-orange-500 text-white px-3 py-1 rounded text-sm hover:bg-orange-600 transition-colors"
              >
                View
              </button>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-orange-800">
                32,660
              </div>
              <div className="text-sm text-orange-600">Kg/Litre</div>
              <div className="text-lg font-semibold text-orange-700">₹190.00L</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border-l-4 border-blue-500 card-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-blue-800">YTD Net Sales</h3>
              <button 
                onClick={() => handleViewClick('sales')}
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
              >
                View
              </button>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-blue-800">
                13,303
              </div>
              <div className="text-sm text-blue-600">Kg/Litre</div>
              <div className="text-lg font-semibold text-blue-700">₹43.70L</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border-l-4 border-green-500 card-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-green-800">Liquidation</h3>
              <button 
                onClick={() => handleViewClick('liquidation')}
                className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors"
              >
                View
              </button>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-green-800">
                12,720
              </div>
              <div className="text-sm text-green-600">Kg/Litre</div>
              <div className="text-lg font-semibold text-green-700">₹55.52L</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border-l-4 border-purple-500 card-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-purple-800">Balance Stock</h3>
              <button 
                onClick={() => handleViewClick('balance')}
                className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600 transition-colors"
              >
                Verify
              </button>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-purple-800">
                33,243
              </div>
              <div className="text-sm text-purple-600">Kg/Litre</div>
              <div className="text-lg font-semibold text-purple-700">₹178.23L</div>
            </div>
          </div>
        </div>
        
        {/* Liquidation Percentage */}
        <div className="mt-6 text-center">
          <div className="text-4xl font-bold text-purple-600 mb-2">28%</div>
          <div className="text-lg text-gray-700">Liquidation Percentage</div>
        </div>
      </div>

      {/* Distributor Entries Section */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Distributor Entries</h2>
        
        {/* Individual Distributor Cards */}
        {distributorsWithTags.map((distributor) => (
          <div key={distributor.id} className="mb-6 last:mb-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Building className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{distributor.distributorName}</h3>
                  <p className="text-sm text-gray-600">Code: {distributor.distributorCode} | DAP (Di-Ammonium Phosphate)</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(distributor.status)}`}>
                  {distributor.status === 'Active' ? 'Active' : 'Inactive'}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(distributor.priority)}`}>
                  {distributor.priority}
                </span>
              </div>
            </div>

            {/* Metric Cards for this distributor */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-500">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-orange-800">Opening Stock</h4>
                  <button 
                    onClick={() => handleViewClick('opening', distributor)}
                    className="bg-orange-500 text-white px-2 py-1 rounded text-xs hover:bg-orange-600 transition-colors"
                  >
                    View
                  </button>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-orange-600">Volume</div>
                  <div className="text-xl font-bold text-orange-800">
                    {distributor.metrics.openingStock.volume.toLocaleString()}
                  </div>
                  <div className="text-sm text-orange-600">Value</div>
                  <div className="text-sm font-semibold text-orange-700">
                    ₹{distributor.metrics.openingStock.value.toFixed(2)}L
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-blue-800">YTD Net Sales</h4>
                  <button 
                    onClick={() => handleViewClick('sales', distributor)}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 transition-colors"
                  >
                    View
                  </button>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-blue-600">Volume</div>
                  <div className="text-xl font-bold text-blue-800">
                    {distributor.metrics.ytdNetSales.volume.toLocaleString()}
                  </div>
                  <div className="text-sm text-blue-600">Value</div>
                  <div className="text-sm font-semibold text-blue-700">
                    ₹{distributor.metrics.ytdNetSales.value.toFixed(2)}L
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-green-800">Liquidation</h4>
                  <button 
                    onClick={() => handleViewClick('liquidation', distributor)}
                    className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600 transition-colors"
                  >
                    View
                  </button>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-green-600">Volume</div>
                  <div className="text-xl font-bold text-green-800">
                    {distributor.metrics.liquidation.volume.toLocaleString()}
                  </div>
                  <div className="text-sm text-green-600">Value</div>
                  <div className="text-sm font-semibold text-green-700">
                    ₹{distributor.metrics.liquidation.value.toFixed(2)}L
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-purple-800">Balance Stock</h4>
                  <button 
                    onClick={() => handleVerifyClick(distributor)}
                    className="bg-purple-500 text-white px-2 py-1 rounded text-xs hover:bg-purple-600 transition-colors"
                  >
                    Verify
                  </button>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-purple-600">Volume</div>
                  <div className="text-xl font-bold text-purple-800">
                    {distributor.metrics.balanceStock.volume.toLocaleString()}
                  </div>
                  <div className="text-sm text-purple-600">Value</div>
                  <div className="text-sm font-semibold text-purple-700">
                    ₹{distributor.metrics.balanceStock.value.toFixed(2)}L
                  </div>
                </div>
              </div>
            </div>

            {/* Liquidation Percentage for this distributor */}
            <div className="text-center py-4">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {distributor.metrics.liquidationPercentage}%
              </div>
              <div className="text-sm text-gray-600">Liquidation</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters with Tag System - Keep existing filters */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <div className="space-y-4">
          {/* Search Section */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-end">
            {/* Search */}
            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search:</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search distributors, retailers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type:</label>
              <select
                value={selectedTags.find(tag => ['Distributor', 'Retailer'].includes(tag)) || 'All'}
                onChange={(e) => {
                  const newTags = selectedTags.filter(tag => !['Distributor', 'Retailer'].includes(tag));
                  if (e.target.value !== 'All') {
                    newTags.push(e.target.value);
                  }
                  setSelectedTags(newTags);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="All">All</option>
                <option value="Distributor">Distributor</option>
                <option value="Retailer">Retailer</option>
              </select>
            </div>
          </div>
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

      {/* Stock Verification Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Stock Verification</h3>
              <button
                onClick={() => setShowVerifyModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              {selectedItem && (
                <>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="font-semibold text-gray-900">{selectedItem.distributorName}</h4>
                    <p className="text-sm text-gray-600">{selectedItem.distributorCode} • {selectedItem.territory}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Stock (System)
                      </label>
                      <input
                        type="number"
                        value={verificationData.currentStock}
                        onChange={(e) => handleStockChange('currentStock', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter current stock"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Physical Stock (Verified)
                      </label>
                      <input
                        type="number"
                        value={verificationData.physicalStock}
                        onChange={(e) => handleStockChange('physicalStock', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter physical stock"
                      />
                    </div>
                    
                    {verificationData.variance !== 0 && (
                      <div className={`p-3 rounded-lg ${verificationData.variance > 0 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Variance:</span>
                          <span className={`font-bold ${verificationData.variance > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {verificationData.variance > 0 ? '+' : ''}{verificationData.variance} {selectedItem.metrics.balanceStock.volume > 1000 ? 'Kg' : 'L'}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Reason for Variance (if any)
                      </label>
                      <textarea
                        value={verificationData.reason}
                        onChange={(e) => setVerificationData(prev => ({ ...prev, reason: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        rows={3}
                        placeholder="Explain any stock variance..."
                      />
                    </div>
                  </div>
                </>
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