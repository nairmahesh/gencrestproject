import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Clock,
  Target,
  DollarSign,
  Package,
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
  Droplets,
  Calendar,
  CheckCircle,
  Building,
  CreditCard,
  Award,
  FileText,
  Truck,
  PieChart,
  ArrowLeft
} from 'lucide-react';

const MobileAppDesign: React.FC = () => {
  const navigate = useNavigate();
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
    { id: 'order', label: 'Order', icon: ShoppingCart, color: 'bg-orange-500' },
    { id: 'payment', label: 'Payment', icon: DollarSign, color: 'bg-indigo-500' },
    { id: 'report', label: 'Report', icon: FileText, color: 'bg-teal-500' },
    { id: 'contact', label: 'Contact', icon: Users, color: 'bg-pink-500' },
    { id: 'plan', label: 'Plan', icon: Calendar, color: 'bg-yellow-500' },
  ];

  const todayStats = [
    { label: 'Visits', value: '8', target: '10', icon: MapPin, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { label: 'Orders', value: '₹45K', target: '₹50K', icon: ShoppingCart, color: 'text-green-600', bgColor: 'bg-green-50' },
    { label: 'Calls', value: '12', target: '15', icon: Phone, color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { label: 'Tasks', value: '6/8', target: '8', icon: CheckCircle, color: 'text-orange-600', bgColor: 'bg-orange-50' },
  ];

  const upcomingVisits = [
    {
      id: '1',
      customer: 'Ram Kumar Distributors',
      customerCode: 'DLR001',
      time: '10:30 AM',
      location: 'Green Valley, Sector 12',
      type: 'Product Demo',
      status: 'scheduled',
      priority: 'high',
      phone: '+91 98765 43210'
    },
    {
      id: '2',
      customer: 'Suresh Traders',
      customerCode: 'DLR002',
      time: '2:00 PM',
      location: 'Market Area, Sector 8',
      type: 'Stock Review',
      status: 'in-progress',
      priority: 'medium',
      phone: '+91 87654 32109'
    },
    {
      id: '3',
      customer: 'Amit Agro Solutions',
      customerCode: 'DLR003',
      time: '4:30 PM',
      location: 'Industrial Area',
      type: 'Payment Collection',
      status: 'scheduled',
      priority: 'high',
      phone: '+91 76543 21098'
    }
  ];

  const recentOrders = [
    { id: 'SO-001', customer: 'Ram Kumar', amount: '₹45,000', status: 'pending', date: 'Today', items: 5 },
    { id: 'SO-002', customer: 'Suresh Traders', amount: '₹32,000', status: 'approved', date: 'Yesterday', items: 3 },
    { id: 'SO-003', customer: 'Green Agro', amount: '₹28,000', status: 'delivered', date: '2 days ago', items: 7 }
  ];

  const liquidationData = [
    { dealer: 'Ram Kumar', product: 'NPK Fertilizer', opening: 100, current: 75, liquidated: 15, percentage: 25 },
    { dealer: 'Suresh Traders', product: 'Urea', opening: 80, current: 60, liquidated: 10, percentage: 25 },
    { dealer: 'Green Agro', product: 'DAP', opening: 120, current: 90, liquidated: 20, percentage: 25 }
  ];

  const contacts = [
    { name: 'Ram Kumar', company: 'Ram Kumar Distributors', phone: '+91 98765 43210', type: 'Distributor', status: 'active' },
    { name: 'Suresh Sharma', company: 'Suresh Traders', phone: '+91 87654 32109', type: 'Dealer', status: 'active' },
    { name: 'Amit Patel', company: 'Green Agro Store', phone: '+91 76543 21098', type: 'Retailer', status: 'active' }
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

  const moreOptions = [
    { id: 'travel', label: 'Travel Claims', icon: Truck, color: 'text-blue-600' },
    { id: 'performance', label: 'Performance', icon: Award, color: 'text-green-600' },
    { id: 'planning', label: 'Planning', icon: Calendar, color: 'text-purple-600' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'text-gray-600' },
    { id: 'help', label: 'Help & Support', icon: MessageCircle, color: 'text-orange-600' },
    { id: 'logout', label: 'Logout', icon: LogOut, color: 'text-red-600' }
  ];

  const renderHomeContent = () => (
    <div className="space-y-6">
      {/* Header with Greeting */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">Good Morning!</h2>
            <p className="text-purple-100">MDO - North Delhi</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">8</div>
            <div className="text-purple-100 text-sm">Visits planned</div>
          </div>
        </div>
        <div className="text-purple-100 text-sm">
          {currentTime.toLocaleDateString('en-IN', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.id}
              className={`${action.color} text-white p-4 rounded-xl flex flex-col items-center space-y-2 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl`}
            >
              <action.icon className="w-6 h-6" />
              <span className="text-xs font-medium text-center leading-tight">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Today's Stats */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Progress</h3>
        <div className="grid grid-cols-2 gap-3">
          {todayStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg p-3 shadow-md border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  Target: {stat.target}
                </span>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Visits */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Next Visits</h3>
          <button 
            onClick={() => setActiveTab('schedule')}
            className="text-purple-600 text-sm font-medium"
          >
            View All
          </button>
        </div>
        <div className="space-y-3">
          {upcomingVisits.slice(0, 2).map((visit) => (
            <div key={visit.id} className="bg-white rounded-lg p-4 shadow-md border border-gray-200">
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

  const renderScheduleContent = () => (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex space-x-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search visits..."
            className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
          />
        </div>
        <button className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <Filter className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Visit Status Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 text-center shadow-lg border-l-4 border-blue-500">
          <div className="text-2xl font-bold text-blue-600">5</div>
          <div className="text-sm text-blue-700">Scheduled</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-lg border-l-4 border-green-500">
          <div className="text-2xl font-bold text-green-600">3</div>
          <div className="text-sm text-green-700">Completed</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-lg border-l-4 border-yellow-500">
          <div className="text-2xl font-bold text-yellow-600">1</div>
          <div className="text-sm text-yellow-700">In Progress</div>
        </div>
      </div>

      {/* Visit List */}
      <div className="space-y-4">
        {upcomingVisits.map((visit) => (
          <div key={visit.id} className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">{visit.customer}</h4>
                <p className="text-xs text-gray-500 mb-2">{visit.customerCode}</p>
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
              <button className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                <Phone className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                <Navigation className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTasksContent = () => (
    <div className="space-y-6">
      {/* Order Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-lg border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-2">
            <ShoppingCart className="w-5 h-5 text-green-600" />
            <span className="text-xs text-green-600">This Month</span>
          </div>
          <div className="text-xl font-bold text-green-800">₹4.2L</div>
          <div className="text-sm text-green-700">Total Orders</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border-l-4 border-blue-500">
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
          {recentOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900">{order.customer}</h4>
                  <p className="text-sm text-gray-600">{order.id} • {order.items} items</p>
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
      {/* Stock Liquidation Overview Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-orange-50 rounded-xl p-4 shadow-lg border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-bold text-gray-900">Opening Stock</h4>
          </div>
          <p className="text-xs text-gray-600 mb-3">As of 1st April 2025</p>
          <div className="space-y-1">
            <div className="text-sm font-semibold text-gray-900">Vol (Kg/Litre) 32660</div>
            <div className="text-sm font-semibold text-gray-900 border-t border-gray-300 pt-1">Value (Rs.Lakhs) 190.00</div>
          </div>
        </div>
        
        <div className="bg-blue-50 rounded-xl p-4 shadow-lg border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-bold text-gray-900">YTD Net Sales</h4>
          </div>
          <p className="text-xs text-gray-600 mb-3">April - Aug,2025</p>
          <div className="space-y-1">
            <div className="text-sm font-semibold text-gray-900">Vol (Kg/Litre) 13303</div>
            <div className="text-sm font-semibold text-gray-900 border-t border-gray-300 pt-1">Value (Rs.Lakhs) 43.70</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-green-50 rounded-xl p-4 shadow-lg border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-bold text-gray-900">Liquidation</h4>
          </div>
          <p className="text-xs text-gray-600 mb-3">As of Aug (YTD)</p>
          <div className="space-y-1">
            <div className="text-sm font-semibold text-gray-900">Vol (Kg/Litre) 12720</div>
            <div className="text-sm font-semibold text-gray-900 border-t border-gray-300 pt-1">Value (Rs.Lakhs) 55.52</div>
          </div>
        </div>
        
        <div className="bg-purple-50 rounded-xl p-4 shadow-lg border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-bold text-gray-900">Balance Stock</h4>
          </div>
          <p className="text-xs text-gray-600 mb-3">&nbsp;</p>
          <div className="space-y-1">
            <div className="text-sm font-semibold text-gray-900">Vol (Kg/Litre) 33243</div>
            <div className="text-sm font-semibold text-gray-900 border-t border-gray-300 pt-1">Value (Rs.Lakhs) 178.23</div>
          </div>
        </div>
      </div>

      {/* Liquidation Percentage Card */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <div className="text-center">
          <h4 className="text-lg font-bold text-gray-900 mb-2">% Liquidation</h4>
          <div className="text-4xl font-bold text-purple-600 mb-4">28%</div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full" style={{ width: '28%' }}></div>
          </div>
        </div>
      </div>

      {/* Liquidation Progress */}
      <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">Overall Progress</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Liquidation Rate</span>
            <span className="font-semibold">39%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full" style={{ width: '39%' }}></div>
          </div>
        </div>
      </div>

      {/* Dealer Liquidation List */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Dealer Liquidation</h3>
        <div className="space-y-4">
          {[
            { dealer: 'SRI RAMA SEEDS AND PESTICIDES', product: 'Multiple Products', opening: 40, current: 210, liquidated: 140, percentage: 40, openingValue: 0.38, currentValue: 1.38, liquidatedValue: 0.93 },
            { dealer: 'Ram Kumar Distributors', product: 'NPK Fertilizer', opening: 100, current: 75, liquidated: 15, percentage: 25, openingValue: 1.20, currentValue: 0.90, liquidatedValue: 0.18 },
            { dealer: 'Green Agro Store', product: 'DAP', opening: 120, current: 90, liquidated: 20, percentage: 25, openingValue: 1.44, currentValue: 1.08, liquidatedValue: 0.24 }
          ].map((item, index) => (
            <div key={index} className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{item.dealer}</h4>
                  <p className="text-sm text-gray-600">{item.product}</p>
                </div>
                <span className="text-sm font-semibold text-purple-600">{item.percentage}%</span>
              </div>
              
              <div className="grid grid-cols-3 gap-3 text-center text-sm mb-2">
                <div>
                  <div className="text-gray-600">Opening</div>
                  <div className="font-semibold">{item.opening}</div>
                  <div className="text-xs text-gray-500">₹{item.openingValue}L</div>
                </div>
                <div>
                  <div className="text-gray-600">Current</div>
                  <div className="font-semibold">{item.current}</div>
                  <div className="text-xs text-gray-500">₹{item.currentValue}L</div>
                </div>
                <div>
                  <div className="text-gray-600">Liquidated</div>
                  <div className="font-semibold text-green-600">{item.liquidated}</div>
                  <div className="text-xs text-gray-500">₹{item.liquidatedValue}L</div>
                </div>
              </div>
              
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${item.percentage}%` }}
                  ></div>
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
      <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-6 text-white shadow-lg">
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
          { label: 'Visit Target', value: '85%', icon: Target, color: 'text-blue-600', borderColor: 'border-blue-500' },
          { label: 'Sales Target', value: '92%', icon: TrendingUp, color: 'text-green-600', borderColor: 'border-green-500' },
          { label: 'Collection', value: '78%', icon: DollarSign, color: 'text-purple-600', borderColor: 'border-purple-500' },
          { label: 'Liquidation', value: '65%', icon: Droplets, color: 'text-orange-600', borderColor: 'border-orange-500' }
        ].map((metric, index) => (
          <div key={index} className={`bg-white rounded-xl p-4 shadow-lg border-l-4 ${metric.borderColor}`}>
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
            { title: 'Monthly Sales Report', date: 'Jan 2024', type: 'Sales', status: 'completed', icon: BarChart3 },
            { title: 'Visit Summary', date: 'This Week', type: 'Visits', status: 'pending', icon: MapPin },
            { title: 'Liquidation Analysis', date: 'Q4 2023', type: 'Stock', status: 'completed', icon: Package }
          ].map((report, index) => (
            <div key={index} className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <report.icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{report.title}</h4>
                    <p className="text-sm text-gray-600">{report.date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {report.type}
                  </span>
                  <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
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

  const renderMoreContent = () => (
    <div className="space-y-6">
      {/* User Profile */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">RK</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Rajesh Kumar</h3>
            <p className="text-sm text-gray-600">MDO - North Delhi</p>
            <p className="text-xs text-gray-500">Employee ID: EMP001</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">88%</div>
            <div className="text-xs text-gray-600">Performance</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">156</div>
            <div className="text-xs text-gray-600">Visits MTD</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">₹4.2L</div>
            <div className="text-xs text-gray-600">Sales MTD</div>
          </div>
        </div>
      </div>

      {/* More Options */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">More Options</h3>
        <div className="space-y-3">
          {moreOptions.map((option) => (
            <button
              key={option.id}
              className="w-full flex items-center space-x-4 p-4 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl hover:bg-gray-50 transition-all"
            >
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <option.icon className={`w-5 h-5 ${option.color}`} />
              </div>
              <span className="flex-1 text-left font-medium text-gray-900">{option.label}</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          ))}
        </div>
      </div>

      {/* Contacts Quick Access */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Contacts</h3>
        <div className="space-y-3">
          {contacts.slice(0, 3).map((contact, index) => (
            <div key={index} className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-semibold text-sm">{contact.name.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{contact.name}</h4>
                  <p className="text-sm text-gray-600">{contact.company}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 bg-green-100 rounded-full hover:bg-green-200 transition-colors">
                    <Phone className="w-4 h-4 text-green-600" />
                  </button>
                  <button className="p-2 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors">
                    <MessageCircle className="w-4 h-4 text-blue-600" />
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
      case 'schedule': return renderScheduleContent();
      case 'tasks': return renderTasksContent();
      case 'liquidation': return renderLiquidationContent();
      case 'reports': return renderReportsContent();
      case 'more': return renderMoreContent();
      default: return renderHomeContent();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="p-4">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>
      </div>
      
      {/* Mobile Phone Frame */}
      <div className="max-w-sm mx-auto bg-black rounded-3xl p-2 shadow-2xl">
        {/* Phone Screen */}
        <div className="bg-white rounded-2xl overflow-hidden h-[800px] relative">
          {/* Status Bar */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 flex items-center justify-between text-white text-sm">
            <div className="flex items-center space-x-1">
              <span className="font-medium">{currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
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

          {/* Bottom Navigation */}
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

          {/* Floating Action Button */}
          <button className="absolute bottom-20 right-4 w-12 h-12 bg-purple-600 text-white rounded-full shadow-lg flex items-center justify-center z-40 active:scale-95 transition-transform">
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileAppDesign;