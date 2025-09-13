import React, { useState, useEffect } from 'react';
import { 
  Home, 
  MapPin, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Menu,
  Bell,
  Search,
  Plus,
  Camera,
  Navigation,
  Phone,
  CheckCircle,
  Clock,
  Target,
  DollarSign,
  Package,
  Calendar,
  User,
  Settings,
  LogOut,
  X,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Filter,
  Eye,
  Edit,
  Download,
  Star,
  MessageCircle,
  Activity,
  Wifi,
  Battery,
  Signal,
  Droplets
} from 'lucide-react';

const MobileAppDesign: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showSidebar, setShowSidebar] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const navigationTabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'tasks', label: 'Tasks', icon: CheckCircle },
    { id: 'liquidation', label: 'Liquidation', icon: Droplets },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'more', label: 'More', icon: Menu },
  ];

  const quickActions = [
    { id: 'new-visit', label: 'New Visit', icon: Plus, color: 'bg-blue-500' },
    { id: 'check-in', label: 'Check In', icon: Navigation, color: 'bg-green-500' },
    { id: 'camera', label: 'Camera', icon: Camera, color: 'bg-purple-500' },
    { id: 'call', label: 'Call', icon: Phone, color: 'bg-orange-500' },
  ];

  const todayStats = [
    { label: 'Visits', value: '8', target: '10', icon: MapPin, color: 'text-blue-600' },
    { label: 'Orders', value: '₹45K', target: '₹50K', icon: ShoppingCart, color: 'text-green-600' },
    { label: 'Calls', value: '12', target: '15', icon: Phone, color: 'text-purple-600' },
    { label: 'Tasks', value: '6/8', target: '8', icon: CheckCircle, color: 'text-orange-600' },
  ];

  const upcomingVisits = [
    {
      id: '1',
      customer: 'Ram Kumar Distributors',
      time: '10:30 AM',
      location: 'Green Valley, Sector 12',
      type: 'Product Demo',
      status: 'scheduled',
      priority: 'high'
    },
    {
      id: '2',
      customer: 'Suresh Traders',
      time: '2:00 PM',
      location: 'Market Area, Sector 8',
      type: 'Stock Review',
      status: 'in-progress',
      priority: 'medium'
    },
    {
      id: '3',
      customer: 'Amit Agro Solutions',
      time: '4:30 PM',
      location: 'Industrial Area',
      type: 'Payment Collection',
      status: 'scheduled',
      priority: 'high'
    }
  ];

  const notifications = [
    {
      id: '1',
      title: 'Visit Reminder',
      message: 'Ram Kumar Distributors visit in 30 minutes',
      time: '5 min ago',
      type: 'reminder',
      unread: true
    },
    {
      id: '2',
      title: 'New Order',
      message: 'Green Agro Store placed order worth ₹25,000',
      time: '1 hour ago',
      type: 'order',
      unread: true
    },
    {
      id: '3',
      title: 'Stock Alert',
      message: 'Low stock detected at 3 locations',
      time: '2 hours ago',
      type: 'alert',
      unread: false
    }
  ];

  const renderHomeContent = () => (
    <div className="space-y-6">
      {/* Header with Greeting */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">Good Morning!</h2>
            <p className="text-purple-100">Ready for today?</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">3</div>
            <div className="text-purple-100 text-sm">visits planned</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">3</div>
          <div className="text-sm text-gray-600">Completed</div>
          <div className="text-xs text-gray-500">visits today</div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Target className="w-6 h-6 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">2</div>
          <div className="text-sm text-gray-600">Pending</div>
          <div className="text-xs text-gray-500">tasks left</div>
        </div>
      </div>

      {/* Next Visit */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Next Visit</h3>
          </div>
          <button className="text-purple-600 text-sm font-medium">View All</button>
        </div>
        
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">Ram Kumar</h4>
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                <Clock className="w-4 h-4" />
                <span>11:00 AM</span>
                <span>•</span>
                <span>Green Valley, Sector 12</span>
              </div>
            </div>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
              View
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderVisitsContent = () => (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex space-x-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search visits..."
            className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <button className="bg-white p-3 rounded-2xl border border-gray-200 shadow-sm">
          <Filter className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Visit Status Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">3</div>
          <div className="text-sm text-blue-700">Scheduled</div>
        </div>
        <div className="bg-green-50 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-green-600">2</div>
          <div className="text-sm text-green-700">Completed</div>
        </div>
        <div className="bg-yellow-50 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">1</div>
          <div className="text-sm text-yellow-700">In Progress</div>
        </div>
      </div>

      {/* Visit List */}
      <div className="space-y-4">
        {upcomingVisits.map((visit) => (
          <div key={visit.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">{visit.customer}</h4>
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                  <Clock className="w-4 h-4" />
                  <span>{visit.time}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{visit.location}</span>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  visit.status === 'in-progress' ? 'bg-green-100 text-green-800' :
                  visit.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {visit.status.replace('-', ' ')}
                </span>
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                  {visit.type}
                </span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              {visit.status === 'scheduled' && (
                <button className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-xl text-sm font-medium">
                  Start Visit
                </button>
              )}
              {visit.status === 'in-progress' && (
                <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-xl text-sm font-medium">
                  Complete Visit
                </button>
              )}
              <button className="p-2 border border-gray-200 rounded-xl">
                <Phone className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-2 border border-gray-200 rounded-xl">
                <Navigation className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderOrdersContent = () => (
    <div className="space-y-6">
      {/* Order Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <ShoppingCart className="w-5 h-5 text-green-600" />
            <span className="text-xs text-green-600">This Month</span>
          </div>
          <div className="text-xl font-bold text-green-800">₹4.2L</div>
          <div className="text-sm text-green-700">Total Orders</div>
        </div>
        <div className="bg-blue-50 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <span className="text-xs text-blue-600">Pending</span>
          </div>
          <div className="text-xl font-bold text-blue-800">12</div>
          <div className="text-sm text-blue-700">Orders</div>
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
        <div className="space-y-4">
          {[
            { id: 'SO-001', customer: 'Ram Kumar', amount: '₹45,000', status: 'pending', date: 'Today' },
            { id: 'SO-002', customer: 'Suresh Traders', amount: '₹32,000', status: 'approved', date: 'Yesterday' },
            { id: 'SO-003', customer: 'Green Agro', amount: '₹28,000', status: 'delivered', date: '2 days ago' }
          ].map((order) => (
            <div key={order.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900">{order.customer}</h4>
                  <p className="text-sm text-gray-600">{order.id}</p>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{order.amount}</div>
                  <div className="text-xs text-gray-500">{order.date}</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'approved' ? 'bg-green-100 text-green-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {order.status}
                </span>
                <button className="text-purple-600 text-sm font-medium">View Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLiquidationContent = () => (
    <div className="space-y-6">
      {/* Liquidation Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-purple-50 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">85%</div>
          <div className="text-sm text-purple-700">Target</div>
        </div>
        <div className="bg-green-50 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-green-600">68%</div>
          <div className="text-sm text-green-700">Achieved</div>
        </div>
        <div className="bg-blue-50 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">12</div>
          <div className="text-sm text-blue-700">Pending</div>
        </div>
      </div>

      {/* Liquidation List */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Liquidations</h3>
        <div className="space-y-4">
          {[
            { name: 'SRI RAMA SEEDS', product: 'DAP 50kg', percentage: '75%', status: 'In Progress' },
            { name: 'Green Agro Store', product: 'NPK 25kg', percentage: '90%', status: 'Completed' },
            { name: 'Suresh Traders', product: 'Urea 50kg', percentage: '45%', status: 'Pending' }
          ].map((item, index) => (
            <div key={index} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Droplets className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-600">{item.product}</p>
                  <p className="text-xs text-gray-500">Liquidation: {item.percentage}</p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    item.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    item.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {item.status}
                  </span>
                  <button className="text-blue-600 text-sm font-medium">View Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderReportsContent = () => (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">Performance Overview</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-2xl font-bold">88%</div>
            <div className="text-green-100 text-sm">Overall Score</div>
          </div>
          <div>
            <div className="text-2xl font-bold">₹15K</div>
            <div className="text-green-100 text-sm">Incentives</div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Visit Target', value: '85%', icon: Target, color: 'text-blue-600' },
          { label: 'Sales Target', value: '92%', icon: TrendingUp, color: 'text-green-600' },
          { label: 'Collection', value: '78%', icon: DollarSign, color: 'text-purple-600' },
          { label: 'Liquidation', value: '65%', icon: Package, color: 'text-orange-600' }
        ].map((metric, index) => (
          <div key={index} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <metric.icon className={`w-5 h-5 ${metric.color}`} />
              <span className="text-lg font-bold text-gray-900">{metric.value}</span>
            </div>
            <div className="text-sm text-gray-600">{metric.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Reports */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Reports</h3>
        <div className="space-y-4">
          {[
            { title: 'Monthly Sales Report', date: 'Jan 2024', type: 'Sales', status: 'completed' },
            { title: 'Visit Summary', date: 'This Week', type: 'Visits', status: 'pending' },
            { title: 'Liquidation Analysis', date: 'Q4 2023', type: 'Stock', status: 'completed' }
          ].map((report, index) => (
            <div key={index} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">{report.title}</h4>
                  <p className="text-sm text-gray-600">{report.date}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {report.type}
                  </span>
                  <button className="p-2 bg-gray-100 rounded-full">
                    <Download className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return renderHomeContent();
      case 'visits': return renderVisitsContent();
      case 'orders': return renderOrdersContent();
      case 'contacts': return renderContactsContent();
      case 'reports': return renderReportsContent();
      default: return renderHomeContent();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Phone Frame */}
      <div className="max-w-sm mx-auto bg-black rounded-3xl p-2 shadow-2xl">
        {/* Phone Screen */}
        <div className="bg-white rounded-2xl overflow-hidden h-[800px] relative">
          {/* Status Bar */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 flex items-center justify-between text-white text-sm">
            <div className="flex items-center space-x-1">
              <span className="font-medium">2:40</span>
            </div>
            <div className="flex items-center space-x-1">
              <Signal className="w-4 h-4" />
              <Wifi className="w-4 h-4" />
              <span className="text-xs">76%</span>
              <Battery className="w-4 h-4" />
            </div>
          </div>

          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">RK</span>
                </div>
                <div>
                  <h3 className="font-semibold">Rajesh Kumar</h3>
                  <p className="text-sm text-purple-100">MDO - North Delhi</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5" />
                <button className="relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">3</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 px-4 py-6 pb-24 overflow-y-auto">
            {renderContent()}
          </div>

          {/* Bottom Navigation - Matching the screenshot icons */}
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
            <div className="flex justify-around">
              {navigationTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center py-2 px-3 rounded-xl transition-colors ${
                    activeTab === tab.id
                      ? 'text-purple-600 bg-purple-50'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileAppDesign;