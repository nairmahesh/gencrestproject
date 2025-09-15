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
  Droplets,
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
  Trash2,
  Download,
  Upload,
  Star,
  Heart,
  Share,
  Bookmark,
  MessageCircle,
  Send,
  Mic,
  Image,
  FileText,
  Zap,
  Award,
  Activity
} from 'lucide-react';

interface MobileAppProps {
  children?: React.ReactNode;
}

const MobileApp: React.FC<MobileAppProps> = ({ children }) => {
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
    { id: 'visits', label: 'Visits', icon: MapPin },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
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
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-6 shadow-lg text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-1">Good Morning!</h2>
            <p className="text-blue-100">Rajesh Kumar</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">8</div>
            <div className="text-blue-100 text-sm">Visits today</div>
          </div>
        </div>
        <div className="text-blue-100 text-sm mt-2">
          {currentTime.toLocaleDateString('en-IN', { 
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </div>

      {/* Stock Overview Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-4 shadow-lg border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 text-white" />
            </div>
          </div>
          <h4 className="text-sm font-bold text-orange-800 mb-1">Opening Stock</h4>
          <p className="text-xs text-orange-600 mb-2">As of 1st April 2025</p>
          <div className="space-y-1 text-center">
            <div className="text-lg font-bold text-orange-900">32,660</div>
            <div className="text-xs text-orange-700">Kg/Litre</div>
            <div className="text-sm font-semibold text-orange-800 border-t border-orange-300 pt-1">₹190.00L</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 shadow-lg border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
          </div>
          <h4 className="text-sm font-bold text-blue-800 mb-1">YTD Net Sales</h4>
          <p className="text-xs text-blue-600 mb-2">April - Aug, 2025</p>
          <div className="space-y-1 text-center">
            <div className="text-lg font-bold text-blue-900">13,303</div>
            <div className="text-xs text-blue-700">Kg/Litre</div>
            <div className="text-sm font-semibold text-blue-800 border-t border-blue-300 pt-1">₹43.70L</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 shadow-lg border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <Droplets className="w-4 h-4 text-white" />
            </div>
          </div>
          <h4 className="text-sm font-bold text-green-800 mb-1">Liquidation</h4>
          <p className="text-xs text-green-600 mb-2">As of Aug (YTD)</p>
          <div className="space-y-1 text-center">
            <div className="text-lg font-bold text-green-900">12,720</div>
            <div className="text-xs text-green-700">Kg/Litre</div>
            <div className="text-sm font-semibold text-green-800 border-t border-green-300 pt-1">₹55.52L</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 shadow-lg border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 text-white" />
            </div>
          </div>
          <h4 className="text-sm font-bold text-purple-800 mb-1">Balance Stock</h4>
          <p className="text-xs text-purple-600 mb-2">&nbsp;</p>
          <div className="space-y-1 text-center">
            <div className="text-lg font-bold text-purple-900">33,243</div>
            <div className="text-xs text-purple-700">Kg/Litre</div>
            <div className="text-sm font-semibold text-purple-800 border-t border-purple-300 pt-1">₹178.23L</div>
          </div>
        </div>
      </div>

      {/* Liquidation Percentage */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-6 shadow-lg text-white">
        <h4 className="text-lg font-bold mb-2">Liquidation Progress</h4>
        <div className="text-5xl font-bold mb-2">28%</div>
        <p className="text-blue-100 text-sm mb-4">Achieved of 50% Target</p>
        <div className="w-full bg-white bg-opacity-30 rounded-full h-3 mb-2">
          <div className="bg-white h-3 rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (28 / 50) * 100)}%` }}></div>
        </div>
        <div className="flex justify-between text-xs text-blue-100">
          <span>0%</span>
          <span>Target: 50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Today's Stats */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Performance</h3>
        <div className="grid grid-cols-2 gap-4">
          {todayStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <span className="text-xs text-gray-500">Target: {stat.target}</span>
              </div>
              <div className="text-xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Liquidation Tracking */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Liquidation Tracking</h3>
          <span className="text-sm text-gray-500">3 entries</span>
        </div>
        <div className="space-y-4">
          {[
            { 
              dealer: 'SRI RAMA SEEDS', 
              type: 'Distributor', 
              product: 'Multiple Products', 
              assigned: 50, 
              current: 35, 
              liquidated: 15, 
              percentage: 40, 
              assignedValue: 0.60, 
              currentValue: 0.42, 
              liquidatedValue: 0.18, 
              priority: 'high',
              breakdown: {
                toFarmers: 10,
                toRetailers: 5
              }
            },
            { 
              dealer: 'Ram Kumar Distributors', 
              type: 'Distributor', 
              product: 'NPK Fertilizer', 
              assigned: 80, 
              current: 60, 
              liquidated: 20, 
              percentage: 25, 
              assignedValue: 0.96, 
              currentValue: 0.72, 
              liquidatedValue: 0.24, 
              priority: 'medium',
              breakdown: {
                toFarmers: 15,
                toRetailers: 5
              }
            },
            { 
              dealer: 'Green Agro Store', 
              type: 'Retailer', 
              product: 'DAP', 
              assigned: 100, 
              current: 75, 
              liquidated: 25, 
              percentage: 25, 
              assignedValue: 1.20, 
              currentValue: 0.90, 
              liquidatedValue: 0.30, 
              priority: 'low',
              breakdown: {
                toFarmers: 20,
                toRetailers: 5
              }
            }
          ].map((item, index) => (
            <div key={index} className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-gray-900 text-sm">{item.dealer}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.type === 'Distributor' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {item.type}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">{item.product}</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-purple-600">{item.percentage}%</span>
                  <div className={`w-2 h-2 rounded-full mt-1 ml-auto ${
                    item.priority === 'high' ? 'bg-red-500' :
                    item.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                <div className="bg-orange-50 rounded-lg p-2 text-center">
                  <div className="text-orange-600 font-medium">Assigned</div>
                  <div className="font-bold text-orange-800">{item.assigned}</div>
                  <div className="text-orange-600">₹{item.assignedValue}L</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-2 text-center">
                  <div className="text-blue-600 font-medium">Current</div>
                  <div className="font-bold text-blue-800">{item.current}</div>
                  <div className="text-blue-600">₹{item.currentValue}L</div>
                </div>
                <div className="bg-green-50 rounded-lg p-2 text-center">
                  <div className="text-green-600 font-medium">Liquidated</div>
                  <div className="font-bold text-green-800">{item.liquidated}</div>
                  <div className="text-green-600">₹{item.liquidatedValue}L</div>
                </div>
              </div>
              
              {/* Liquidation Breakdown */}
              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <h5 className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
                  <Users className="w-3 h-3 mr-1" />
                  Liquidated to whom? (Total: {item.liquidated} Kg)
                </h5>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-green-100 rounded p-2 text-center">
                    <div className="text-xs text-green-600">Farmers</div>
                    <div className="font-bold text-green-800">{item.breakdown.toFarmers}</div>
                  </div>
                  <div className="bg-blue-100 rounded p-2 text-center">
                    <div className="text-xs text-blue-600">Retailers</div>
                    <div className="font-bold text-blue-800">{item.breakdown.toRetailers}</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{item.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-2">
                  <button className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                    Track
                  </button>
                  <button className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium">
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Visits */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Visits</h3>
          <button className="text-blue-600 text-sm font-medium">View All</button>
        </div>
        <div className="space-y-4">
          {upcomingVisits.map((visit) => (
            <div key={visit.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    visit.status === 'in-progress' ? 'bg-green-500' : 
                    visit.priority === 'high' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-900">{visit.customer}</span>
                </div>
                <span className="text-xs text-gray-500">{visit.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{visit.location}</span>
                </div>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {visit.type}
                </span>
              </div>
            </div>
          ))}
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
            className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-xl text-sm font-medium">
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
                <button className="text-blue-600 text-sm font-medium">View Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContactsContent = () => (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex space-x-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search distributors, retailers..."
            className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button className="bg-white p-3 rounded-2xl border border-gray-200 shadow-sm">
          <Filter className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium whitespace-nowrap">
          All
        </button>
        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium whitespace-nowrap">
          Distributors
        </button>
        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium whitespace-nowrap">
          Retailers
        </button>
        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium whitespace-nowrap">
          High Priority
        </button>
      </div>

      {/* Contact Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-purple-50 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">45</div>
          <div className="text-sm text-purple-700">Total</div>
        </div>
        <div className="bg-green-50 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-green-600">12</div>
          <div className="text-sm text-green-700">Distributors</div>
        </div>
        <div className="bg-blue-50 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">33</div>
          <div className="text-sm text-blue-700">Retailers</div>
        </div>
      </div>

      {/* Contact List */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Contacts</h3>
        <div className="space-y-4">
          {[
            { name: 'Ram Kumar', company: 'Ram Kumar Distributors', phone: '+91 98765 43210', type: 'Distributor' },
            { name: 'Suresh Sharma', company: 'Suresh Traders', phone: '+91 87654 32109', type: 'Dealer' },
            { name: 'Amit Patel', company: 'Green Agro Store', phone: '+91 76543 21098', type: 'Retailer' }
          ].map((contact, index) => (
            <div key={index} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-semibold">{contact.name.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{contact.name}</h4>
                  <p className="text-sm text-gray-600">{contact.company}</p>
                  <p className="text-xs text-gray-500">{contact.phone}</p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {contact.type}
                  </span>
                  <div className="flex space-x-2">
                    <button className="p-2 bg-green-100 rounded-full">
                      <Phone className="w-4 h-4 text-green-600" />
                    </button>
                    <button className="p-2 bg-blue-100 rounded-full">
                      <MessageCircle className="w-4 h-4 text-blue-600" />
                    </button>
                  </div>
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
          { label: 'Liquidation', value: '65%', icon: Droplets, color: 'text-orange-600' }
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
      {/* Mobile Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setShowSidebar(true)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <span className="font-semibold text-gray-900">Gencrest</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowNotifications(true)}
              className="relative p-2 rounded-full hover:bg-gray-100"
            >
              <Bell className="w-6 h-6 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 pb-20">
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-40">
        <div className="flex justify-around">
          {navigationTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-2 px-3 rounded-xl transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600'
              }`}
            >
              <tab.icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sidebar */}
      {showSidebar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="fixed inset-y-0 left-0 w-80 bg-white shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">G</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Gencrest</h3>
                  <p className="text-sm text-gray-600">Sales Executive</p>
                </div>
              </div>
              <button
                onClick={() => setShowSidebar(false)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {[
                { label: 'Profile', icon: User },
                { label: 'Settings', icon: Settings },
                { label: 'Help & Support', icon: MessageCircle },
                { label: 'Logout', icon: LogOut }
              ].map((item, index) => (
                <button
                  key={index}
                  className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-100 text-left"
                >
                  <item.icon className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <button
                onClick={() => setShowNotifications(false)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-xl border ${
                    notification.unread ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{notification.title}</h4>
                    {notification.unread && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                  <p className="text-xs text-gray-500">{notification.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button className="fixed bottom-20 right-4 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center z-40 active:scale-95 transition-transform">
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
};

export default MobileApp;