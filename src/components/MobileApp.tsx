import React, { useState } from 'react';
import { 
  Home, 
  MapPin, 
  ShoppingCart, 
  Droplets, 
  Users, 
  Calendar,
  CreditCard,
  TrendingUp,
  Menu,
  Bell,
  Search,
  Package,
  Target,
  Building,
  Filter,
  X,
  Eye,
  Edit
} from 'lucide-react';

const MobileApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedRegion, setSelectedRegion] = useState('All Regions');

  // Sample liquidation data
  const liquidationData = [
    {
      id: 'DIST001',
      distributorName: 'SRI RAMA SEEDS AND PESTICIDES',
      distributorCode: '1325',
      territory: 'North Delhi',
      region: 'Delhi NCR',
      zone: 'North Zone',
      status: 'Active',
      priority: 'High',
      type: 'Distributor',
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
      type: 'Distributor',
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
      id: 'RET001',
      distributorName: 'Green Agro Store',
      distributorCode: 'GAS001',
      territory: 'Sector 15',
      region: 'Delhi NCR',
      zone: 'North Zone',
      status: 'Active',
      priority: 'Medium',
      type: 'Retailer',
      metrics: {
        openingStock: { volume: 25, value: 0.30 },
        ytdNetSales: { volume: 180, value: 0.85 },
        liquidation: { volume: 85, value: 0.45 },
        balanceStock: { volume: 120, value: 0.70 },
        liquidationPercentage: 41,
        lastUpdated: new Date().toISOString()
      }
    }
  ];

  // Filter data based on search and filters
  const filteredData = liquidationData.filter(item => {
    const matchesSearch = item.distributorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.distributorCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.territory.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'All Types' || item.type === selectedType;
    const matchesRegion = selectedRegion === 'All Regions' || item.region === selectedRegion;
    
    return matchesSearch && matchesType && matchesRegion;
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

  const clearFilters = () => {
    setSelectedType('All Types');
    setSelectedRegion('All Regions');
    setSearchTerm('');
  };

  const renderDashboard = () => (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Good Morning, Rajesh!</h1>
          <p className="text-sm text-gray-600">MDO - North Delhi</p>
        </div>
        <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold">RK</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">8</div>
          <div className="text-xs text-blue-700">Visits Today</div>
        </div>
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-600">₹4.2L</div>
          <div className="text-xs text-green-700">Sales MTD</div>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">28%</div>
          <div className="text-xs text-purple-700">Liquidation</div>
        </div>
        <div className="bg-orange-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">12</div>
          <div className="text-xs text-orange-700">Distributors</div>
        </div>
      </div>

      {/* Stock Overview */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-semibold mb-3">Stock Overview</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-orange-50 rounded-lg p-3 text-center">
            <Package className="w-6 h-6 text-orange-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-orange-800">32,660</div>
            <div className="text-xs text-orange-600">Opening Stock</div>
            <div className="text-xs text-orange-700">₹190.00L</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <TrendingUp className="w-6 h-6 text-blue-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-blue-800">13,303</div>
            <div className="text-xs text-blue-600">YTD Sales</div>
            <div className="text-xs text-blue-700">₹43.70L</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <Droplets className="w-6 h-6 text-green-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-green-800">12,720</div>
            <div className="text-xs text-green-600">Liquidation</div>
            <div className="text-xs text-green-700">₹55.52L</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <Target className="w-6 h-6 text-purple-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-purple-800">28%</div>
            <div className="text-xs text-purple-600">Rate</div>
            <div className="text-xs text-purple-700">Performance</div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-semibold mb-3">Recent Activities</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <MapPin className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Visit completed</p>
              <p className="text-xs text-gray-500">SRI RAMA SEEDS - 2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">New order received</p>
              <p className="text-xs text-gray-500">₹45,000 - 4 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLiquidation = () => (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Stock Liquidation</h2>
          <p className="text-sm text-gray-600">Track and manage distributor stock liquidation</p>
        </div>
      </div>

      {/* Overall Metrics */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-semibold mb-3">Overall Metrics</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-orange-50 rounded-lg p-3 text-center">
            <Package className="w-6 h-6 text-orange-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-orange-800">32,660</div>
            <div className="text-xs text-orange-600">Opening Stock</div>
            <div className="text-xs text-orange-700">₹40.55L</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <TrendingUp className="w-6 h-6 text-blue-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-blue-800">23,303</div>
            <div className="text-xs text-blue-600">YTD Sales</div>
            <div className="text-xs text-blue-700">₹27.36L</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <Droplets className="w-6 h-6 text-green-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-green-800">12,720</div>
            <div className="text-xs text-green-600">Liquidation</div>
            <div className="text-xs text-green-700">₹16.55L</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <Target className="w-6 h-6 text-purple-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-purple-800">28%</div>
            <div className="text-xs text-purple-600">Rate</div>
            <div className="text-xs text-purple-700">Performance</div>
          </div>
        </div>
      </div>

      {/* NEW DROPDOWN FILTERS SECTION */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-semibold mb-3 text-gray-900">Filters</h3>
        <div className="space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search distributors, retailers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm bg-white"
            />
          </div>
          
          {/* Filter Dropdowns */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type:</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm bg-white"
              >
                <option value="All Types">All Types</option>
                <option value="Distributor">Distributor</option>
                <option value="Retailer">Retailer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Region:</label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm bg-white"
              >
                <option value="All Regions">All Regions</option>
                <option value="Delhi NCR">Delhi NCR</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Chennai">Chennai</option>
              </select>
            </div>
          </div>
          
          {/* Clear Filters */}
          {(selectedType !== 'All Types' || selectedRegion !== 'All Regions' || searchTerm) && (
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center text-sm border border-red-300"
            >
              <X className="w-4 h-4 mr-1" />
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Summary */}
      <div className="text-sm text-gray-600 px-1">
        Showing {filteredData.length} of {liquidationData.length} entries
        <div className="flex items-center justify-between mt-1">
          <span>Distributors: {filteredData.filter(d => d.type === 'Distributor').length}</span>
          <span>Retailers: {filteredData.filter(d => d.type === 'Retailer').length}</span>
          <span>Active: {filteredData.filter(d => d.status === 'Active').length}</span>
        </div>
      </div>

      {/* Distributors/Retailers List */}
      <div className="space-y-3">
        {filteredData.map((item) => (
          <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  item.type === 'Distributor' ? 'bg-purple-100' : 'bg-blue-100'
                }`}>
                  <Building className={`w-5 h-5 ${
                    item.type === 'Distributor' ? 'text-purple-600' : 'text-blue-600'
                  }`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{item.distributorName}</h3>
                  <p className="text-xs text-gray-600">{item.distributorCode} • {item.territory}</p>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                  {item.priority}
                </span>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="text-center p-2 bg-orange-50 rounded-lg">
                <div className="text-sm font-bold text-orange-800">
                  {item.metrics.openingStock.volume.toLocaleString()}
                </div>
                <div className="text-xs text-orange-600">Opening</div>
                <div className="text-xs text-orange-700">₹{item.metrics.openingStock.value.toFixed(2)}L</div>
              </div>
              <div className="text-center p-2 bg-blue-50 rounded-lg">
                <div className="text-sm font-bold text-blue-800">
                  {item.metrics.ytdNetSales.volume.toLocaleString()}
                </div>
                <div className="text-xs text-blue-600">YTD Sales</div>
                <div className="text-xs text-blue-700">₹{item.metrics.ytdNetSales.value.toFixed(2)}L</div>
              </div>
              <div className="text-center p-2 bg-green-50 rounded-lg">
                <div className="text-sm font-bold text-green-800">
                  {item.metrics.liquidation.volume.toLocaleString()}
                </div>
                <div className="text-xs text-green-600">Liquidated</div>
                <div className="text-xs text-green-700">₹{item.metrics.liquidation.value.toFixed(2)}L</div>
              </div>
              <div className="text-center p-2 bg-purple-50 rounded-lg">
                <div className="text-sm font-bold text-purple-800">
                  {item.metrics.liquidationPercentage}%
                </div>
                <div className="text-xs text-purple-600">Rate</div>
                <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                  <div 
                    className="bg-purple-600 h-1 rounded-full" 
                    style={{ width: `${Math.min(item.metrics.liquidationPercentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
              <span>{item.region} • {item.zone}</span>
              <span>Updated: {new Date(item.metrics.lastUpdated).toLocaleDateString()}</span>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 bg-purple-100 text-purple-700 px-3 py-2 rounded-lg hover:bg-purple-200 transition-colors flex items-center justify-center text-xs">
                <Eye className="w-3 h-3 mr-1" />
                View Details
              </button>
              <button className="flex-1 border border-gray-300 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center text-xs">
                <Edit className="w-3 h-3 mr-1" />
                Update
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-8">
          <Droplets className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No entries found</p>
        </div>
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'liquidation':
        return renderLiquidation();
      case 'visits':
        return (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Field Visits</h2>
            <p className="text-gray-600">Field visits content coming soon...</p>
          </div>
        );
      case 'orders':
        return (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Sales Orders</h2>
            <p className="text-gray-600">Sales orders content coming soon...</p>
          </div>
        );
      case 'contacts':
        return (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Contacts</h2>
            <p className="text-gray-600">Contacts content coming soon...</p>
          </div>
        );
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="max-w-sm mx-auto bg-gray-50 min-h-screen">
      {/* Mobile Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Menu className="w-6 h-6" />
          <div>
            <h1 className="font-semibold">Rajesh Kumar</h1>
            <p className="text-xs opacity-90">MDO - North Delhi</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Bell className="w-6 h-6" />
          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold">RK</span>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {renderTabContent()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-white border-t border-gray-200">
        <div className="flex justify-around py-2">
          {[
            { id: 'dashboard', icon: Home, label: 'Dashboard' },
            { id: 'visits', icon: MapPin, label: 'Visits' },
            { id: 'orders', icon: ShoppingCart, label: 'Orders' },
            { id: 'liquidation', icon: Droplets, label: 'Liquidation' },
            { id: 'contacts', icon: Users, label: 'Contacts' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'text-purple-600 bg-purple-50'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              <tab.icon className="w-5 h-5 mb-1" />
              <span className="text-xs">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileApp;