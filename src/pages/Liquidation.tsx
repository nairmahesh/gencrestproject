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
  
  const { 
    overallMetrics, 
    distributorMetrics, 
    getPerformanceMetrics 
  } = useLiquidationCalculation();
  
  const performanceMetrics = getPerformanceMetrics();

  // Enhanced distributor data with tags
  const distributorsWithTags = distributorMetrics.map(distributor => ({
    ...distributor,
    tags: [
      'Distributor', // Main filter option
      distributor.priority,
      distributor.status,
      distributor.region,
      distributor.zone,
      distributor.metrics.liquidationPercentage >= 50 ? 'High Performance' : 
      distributor.metrics.liquidationPercentage >= 30 ? 'Medium Performance' : 'Low Performance',
      distributor.metrics.liquidationPercentage < 25 ? 'Needs Attention' : '',
      distributor.distributorName.includes('SRI') ? 'Premium Partner' : '',
      'Fertilizers',
      distributor.territory
    ].filter(Boolean)
  }));

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
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Overall Liquidation Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-orange-50 rounded-xl p-4 text-center border border-orange-200">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-orange-800 mb-1">
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
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search distributors, territories, regions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          
          {/* Tag Search and Selection */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search tags (Priority, Performance, Region, etc.)..."
                  value={searchTag}
                  onChange={(e) => setSearchTag(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
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
          
          {/* Available Tags */}
          {searchTag && (
            <div className="border-t pt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Available Filters:</p>
              
              {/* Main Filter Options */}
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-600 mb-2">Type:</p>
                <div className="flex flex-wrap gap-2">
                  {mainTags.filter(tag => tag.toLowerCase().includes(searchTag.toLowerCase())).map(tag => (
                    <button
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        selectedTags.includes(tag)
                          ? 'bg-purple-600 text-white'
                          : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Other Filter Options */}
              {otherTags.filter(tag => tag.toLowerCase().includes(searchTag.toLowerCase())).length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-2">Other Filters:</p>
                  <div className="flex flex-wrap gap-2">
                    {otherTags.filter(tag => tag.toLowerCase().includes(searchTag.toLowerCase())).map(tag => (
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
            </div>
          )}
          
          {/* Selected Tags */}
          {selectedTags.length > 0 && (
            <div className="border-t pt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Active Filters:</p>
              <div className="flex flex-wrap gap-2">
                {selectedTags.map(tag => (
                  <span
                    key={tag}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getTagColor(tag)}`}
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-2 hover:bg-black hover:bg-opacity-10 rounded-full p-0.5"
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

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          Showing {filteredEntities.length} of {allEntities.length} entries
          {selectedTags.length > 0 && (
            <span className="ml-2">
              (filtered by {selectedTags.length} tag{selectedTags.length !== 1 ? 's' : ''})
            </span>
          )}
        </span>
        <div className="flex items-center space-x-4">
          <span>Distributors: {filteredEntities.filter(d => d.tags.includes('Distributor')).length}</span>
          <span>Retailers: {filteredEntities.filter(d => d.tags.includes('Retailer')).length}</span>
          <span>Active: {filteredEntities.filter(d => d.status === 'Active').length}</span>
          <span>Avg Liquidation: {Math.round(filteredEntities.reduce((sum, d) => sum + d.metrics.liquidationPercentage, 0) / filteredEntities.length || 0)}%</span>
        </div>
      </div>

      {/* Distributors List */}
      <div className="space-y-4">
        {filteredEntities.map((distributor) => (
          <div key={distributor.id} className="bg-white rounded-xl p-6 card-shadow card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  {distributor.tags.includes('Distributor') ? (
                    <Building className="w-6 h-6 text-purple-600" />
                  ) : (
                    <Building className="w-6 h-6 text-blue-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{distributor.distributorName}</h3>
                  <p className="text-sm text-gray-600">{distributor.distributorCode} • {distributor.territory}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(distributor.status)}`}>
                  {distributor.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(distributor.priority)}`}>
                  {distributor.priority}
                </span>
              </div>
            </div>

            {/* Liquidation Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-lg font-bold text-orange-800">
                  {distributor.metrics.openingStock.volume.toLocaleString()}
                </div>
                <div className="text-xs text-orange-600">Opening Stock</div>
                <div className="text-xs text-orange-700">₹{distributor.metrics.openingStock.value.toFixed(2)}L</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-800">
                  {distributor.metrics.ytdNetSales.volume.toLocaleString()}
                </div>
                <div className="text-xs text-blue-600">YTD Sales</div>
                <div className="text-xs text-blue-700">₹{distributor.metrics.ytdNetSales.value.toFixed(2)}L</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-800">
                  {distributor.metrics.liquidation.volume.toLocaleString()}
                </div>
                <div className="text-xs text-green-600">Liquidated</div>
                <div className="text-xs text-green-700">₹{distributor.metrics.liquidation.value.toFixed(2)}L</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-lg font-bold text-purple-800">
                  {distributor.metrics.liquidationPercentage}%
                </div>
                <div className="text-xs text-purple-600">Liquidation Rate</div>
                <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                  <div 
                    className="bg-purple-600 h-1 rounded-full" 
                    style={{ width: `${Math.min(distributor.metrics.liquidationPercentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Distributor Tags */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {distributor.tags.slice(0, 4).map((tag, index) => (
                  <span
                    key={index}
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getTagColor(tag)}`}
                  >
                    {tag}
                  </span>
                ))}
                {distributor.tags.length > 4 && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    +{distributor.tags.length - 4} more
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{distributor.region} • {distributor.zone}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>Updated: {new Date(distributor.metrics.lastUpdated).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button 
                onClick={() => navigate(`/retailer-liquidation/${distributor.id}`)}
                className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-200 transition-colors flex items-center"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </button>
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                <Edit className="w-4 h-4 mr-2" />
                Update Stock
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredEntities.length === 0 && (
        <div className="text-center py-12">
          <Droplets className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No entries found</p>
        </div>
      )}
    </div>
  );
};

export default Liquidation;