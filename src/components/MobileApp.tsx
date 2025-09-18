import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home, 
  MapPin, 
  ShoppingCart, 
  Droplets, 
  Users, 
  Calendar,
  TrendingUp,
  Bell,
  Search,
  Package,
  Target,
  Building,
  Filter,
  X,
  Eye,
  Edit,
  CheckCircle,
  Clock,
  Plus,
  FileText,
  MoreHorizontal,
  Car,
  Award,
  Menu,
  Settings,
  BarChart3,
  Download
} from 'lucide-react';

const MobileApp: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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
          <h1 className="text-xl font-bold text-gray-900">Good Morning, {user?.name.split(' ')[0] || 'User'}!</h1>
          <p className="text-sm text-gray-600">{user?.role} - {user?.territory || user?.region || 'Territory'}</p>
        </div>
        <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold">
            {user?.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
          </span>
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

  const renderTracker = () => (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Activity Tracker</h2>
          <p className="text-sm text-gray-600">Track your monthly and annual activities</p>
        </div>
      </div>

      {/* Activity Summary Cards */}
      <div className="space-y-4">
        {/* Monthly Activities */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Monthly Activities</h3>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-xl font-bold text-orange-800">45</div>
              <div className="text-xs text-orange-600">Planned</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-xl font-bold text-green-800">38</div>
              <div className="text-xs text-green-600">Done</div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>84%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '84%' }}></div>
            </div>
          </div>
        </div>

        {/* Annual Activities */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Annual Activities</h3>
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-xl font-bold text-orange-800">540</div>
              <div className="text-xs text-orange-600">Planned</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-xl font-bold text-green-800">456</div>
              <div className="text-xs text-green-600">Done</div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>84%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: '84%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl p-3 shadow-sm text-center">
          <div className="text-lg font-bold text-blue-600">3</div>
          <div className="text-xs text-gray-600">Pending Tasks</div>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm text-center">
          <div className="text-lg font-bold text-green-600">2</div>
          <div className="text-xs text-gray-600">Scheduled</div>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm text-center">
          <div className="text-lg font-bold text-yellow-600">1</div>
          <div className="text-xs text-gray-600">In Progress</div>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm text-center">
          <div className="text-lg font-bold text-purple-600">5</div>
          <div className="text-xs text-gray-600">Completed</div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-semibold mb-3">Recent Activities</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Visit completed</p>
              <p className="text-xs text-gray-500">SRI RAMA SEEDS - 2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Meeting scheduled</p>
              <p className="text-xs text-gray-500">Ram Kumar - Tomorrow 10:00 AM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTasks = () => (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Tasks</h2>
        <button className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center text-sm">
          <Plus className="w-4 h-4 mr-1" />
          Add Task
        </button>
      </div>
      
      <div className="space-y-3">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">Visit SRI RAMA SEEDS</h3>
            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">High</span>
          </div>
          <p className="text-sm text-gray-600 mb-2">Stock verification and liquidation tracking</p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              <span>Due: Jan 22, 2024</span>
            </div>
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">Pending</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">Monthly Sales Report</h3>
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Medium</span>
          </div>
          <p className="text-sm text-gray-600 mb-2">Prepare and submit monthly sales performance report</p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              <span>Due: Jan 25, 2024</span>
            </div>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">In Progress</span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">Product Training</h3>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Low</span>
          </div>
          <p className="text-sm text-gray-600 mb-2">Attend new product training session</p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center">
              <CheckCircle className="w-3 h-3 mr-1" />
              <span>Completed: Jan 20, 2024</span>
            </div>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">Completed</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Reports</h2>
          <p className="text-sm text-gray-600">Generate and view reports</p>
        </div>
      </div>

      {/* Report Categories */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Sales Report</h3>
          <p className="text-xs text-gray-600 mb-3">Monthly sales performance</p>
          <button className="w-full bg-blue-600 text-white py-2 px-3 rounded-lg text-xs hover:bg-blue-700">
            Generate
          </button>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <MapPin className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Visit Report</h3>
          <p className="text-xs text-gray-600 mb-3">Field visit summary</p>
          <button className="w-full bg-green-600 text-white py-2 px-3 rounded-lg text-xs hover:bg-green-700">
            Generate
          </button>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Droplets className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Liquidation</h3>
          <p className="text-xs text-gray-600 mb-3">Stock liquidation report</p>
          <button className="w-full bg-purple-600 text-white py-2 px-3 rounded-lg text-xs hover:bg-purple-700">
            Generate
          </button>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Award className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Performance</h3>
          <p className="text-xs text-gray-600 mb-3">Monthly performance</p>
          <button className="w-full bg-orange-600 text-white py-2 px-3 rounded-lg text-xs hover:bg-orange-700">
            Generate
          </button>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-semibold mb-3">Recent Reports</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Sales Report - January</p>
                <p className="text-xs text-gray-500">Generated 2 days ago</p>
              </div>
            </div>
            <button className="text-blue-600 hover:text-blue-800">
              <Download className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <FileText className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Visit Report - Week 3</p>
                <p className="text-xs text-gray-500">Generated 5 days ago</p>
              </div>
            </div>
            <button className="text-green-600 hover:text-green-800">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMore = () => (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">More</h2>
          <p className="text-sm text-gray-600">Additional features and settings</p>
        </div>
      </div>

      {/* Additional Features */}
      <div className="space-y-3">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold mb-3">Features</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium">Field Visits</p>
                  <p className="text-xs text-gray-500">Manage customer visits</p>
                </div>
              </div>
              <span className="text-gray-400">›</span>
            </button>
            
            <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium">Sales Orders</p>
                  <p className="text-xs text-gray-500">Manage customer orders</p>
                </div>
              </div>
              <span className="text-gray-400">›</span>
            </button>
            
            <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium">Contacts</p>
                  <p className="text-xs text-gray-500">Manage dealer network</p>
                </div>
              </div>
              <span className="text-gray-400">›</span>
            </button>
            
            <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <Car className="w-4 h-4 text-orange-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium">Travel & Expenses</p>
                  <p className="text-xs text-gray-500">Track travel claims</p>
                </div>
              </div>
              <span className="text-gray-400">›</span>
            </button>
            
            <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Award className="w-4 h-4 text-yellow-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium">Performance</p>
                  <p className="text-xs text-gray-500">View performance metrics</p>
                </div>
              </div>
              <span className="text-gray-400">›</span>
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold mb-3">Settings</h3>
          <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <Settings className="w-4 h-4 text-gray-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">App Settings</p>
                <p className="text-xs text-gray-500">Preferences and configuration</p>
              </div>
            </div>
            <span className="text-gray-400">›</span>
          </button>
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
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Search & Filters</h3>
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors relative"
          >
            <Filter className="w-4 h-4 text-gray-600" />
            {(selectedType !== 'All Types' || selectedRegion !== 'All Regions') && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                {(selectedType !== 'All Types' ? 1 : 0) + (selectedRegion !== 'All Regions' ? 1 : 0)}
              </span>
            )}
          </button>
        </div>
        
        {/* Search Bar - Always Visible */}
        <div className="mb-3">
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
        </div>
        
        {/* Accordion Filters */}
        {showMobileFilters && (
          <div className="space-y-3 border-t pt-3">
            {/* Type Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Type:</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm bg-white"
              >
                <option value="All Types">All</option>
                <option value="Distributor">Distributor</option>
                <option value="Retailer">Retailer</option>
              </select>
            </div>
            
            {/* Region Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Region:</label>
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
            
            {/* Active Filters Display */}
            {(selectedType !== 'All Types' || selectedRegion !== 'All Regions') && (
              <div>
                <p className="text-xs font-medium text-gray-700 mb-2">Active Filters:</p>
                <div className="flex flex-wrap gap-1">
                  {selectedType !== 'All Types' && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {selectedType}
                      <button
                        onClick={() => setSelectedType('All Types')}
                        className="ml-1 hover:bg-purple-200 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {selectedRegion !== 'All Regions' && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {selectedRegion}
                      <button
                        onClick={() => setSelectedRegion('All Regions')}
                        className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}
            
            {/* Clear All Filters */}
            {(selectedType !== 'All Types' || selectedRegion !== 'All Regions') && (
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center text-sm border border-red-300"
              >
                <X className="w-4 h-4 mr-1" />
                Clear All Filters
              </button>
            )}
          </div>
        )}
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
      case 'tracker':
        return renderTracker();
      case 'liquidation':
        return renderLiquidation();
      case 'tasks':
        return renderTasks();
      case 'reports':
        return renderReports();
      case 'more':
        return renderMore();
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
            <h1 className="font-semibold">{user?.name || 'User'}</h1>
            <p className="text-xs opacity-90">{user?.role} - {user?.territory || user?.region || 'Territory'}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Bell className="w-6 h-6" />
          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold">
              {user?.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
            </span>
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
            { id: 'dashboard', icon: Home, label: 'Home' },
            { id: 'tracker', icon: TrendingUp, label: 'Tracker' },
            { id: 'tasks', icon: CheckCircle, label: 'Tasks' },
            { id: 'liquidation', icon: Droplets, label: 'Liquidation' },
            { id: 'reports', icon: FileText, label: 'Reports' },
            { id: 'more', icon: MoreHorizontal, label: '•••' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'text-purple-600 bg-purple-50'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              <tab.icon className="w-4 h-4 mb-1" />
              <span className="text-xs">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileApp;