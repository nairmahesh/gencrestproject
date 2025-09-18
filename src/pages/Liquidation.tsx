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
              <button className="bg-orange-500 text-white px-3 py-1 rounded text-sm hover:bg-orange-600 transition-colors">
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
              <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors">
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
              <button className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors">
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
              <button className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600 transition-colors">
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
                  <button className="bg-orange-500 text-white px-2 py-1 rounded text-xs hover:bg-orange-600 transition-colors">
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
                  <button className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 transition-colors">
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
                  <button className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600 transition-colors">
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
                  <button className="bg-purple-500 text-white px-2 py-1 rounded text-xs hover:bg-purple-600 transition-colors">
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
              {overallMetrics.openingStock.volume.toLocaleString()}
            </div>
            <div className="text-sm text-orange-600 mb-2">Kg/Litre</div>
            <div className="text-sm font-semibold text-orange-700">
              ₹{overallMetrics.openingStock.value.toFixed(2)}L
            </div>
            <div className="text-xs text-orange-600 mt-1">Opening Stock</div>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-blue-800 mb-1">
              {overallMetrics.ytdNetSales.volume.toLocaleString()}
            </div>
            <div className="text-sm text-blue-600 mb-2">Kg/Litre</div>
            <div className="text-sm font-semibold text-blue-700">
              ₹{overallMetrics.ytdNetSales.value.toFixed(2)}L
            </div>
            <div className="text-xs text-blue-600 mt-1">YTD Net Sales</div>
          </div>

          <div className="bg-green-50 rounded-xl p-4 text-center border border-green-200">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Droplets className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-green-800 mb-1">
              {overallMetrics.liquidation.volume.toLocaleString()}
            </div>
            <div className="text-sm text-green-600 mb-2">Kg/Litre</div>
            <div className="text-sm font-semibold text-green-700">
              ₹{overallMetrics.liquidation.value.toFixed(2)}L
            </div>
            <div className="text-xs text-green-600 mt-1">Liquidation</div>
          </div>

          <div className="bg-purple-50 rounded-xl p-4 text-center border border-purple-200">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-purple-800 mb-1">
              {overallMetrics.liquidationPercentage}%
            </div>
            <div className="text-sm text-purple-600 mb-2">Overall</div>
            <div className="text-sm font-semibold text-purple-700">Performance</div>
            <div className="text-xs text-purple-600 mt-1">Liquidation Rate</div>
          </div>
        </div>
      </div>

      {/* Filters with Tag System */}
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
    </div>
  );
};

export default Liquidation;