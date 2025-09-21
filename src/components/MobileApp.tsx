import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home, 
  Users, 
  ShoppingCart, 
  Droplets, 
  FileText, 
  CheckSquare, 
  Activity,
  MapPin,
  Calendar,
  Clock,
  Target,
  TrendingUp,
  Package,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  User,
  Building,
  Phone,
  Mail,
  Camera,
  Upload,
  X,
  Plus,
  Minus,
  Edit,
  Save,
  ChevronDown,
  ChevronUp,
  Bell,
  Star,
  Award,
  Navigation
} from 'lucide-react';
import { useLiquidationCalculation } from '../hooks/useLiquidationCalculation';
import { useGeolocation } from '../hooks/useGeolocation';

const MobileApp: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [currentView, setCurrentView] = useState('dashboard');
  const [liveMeetingsExpanded, setLiveMeetingsExpanded] = useState(true);
  const [monthlyPlanExpanded, setMonthlyPlanExpanded] = useState(false);
  const { overallMetrics } = useLiquidationCalculation();
  const { latitude, longitude } = useGeolocation();

  const currentUserRole = user?.role || 'MDO';

  // Notification data
  const notifications = {
    tasks: 4,
    alerts: 3,
    messages: 5,
    approvals: 2
  };

  // Sample data for different tabs
  const teamMembers = [
    { id: '1', name: 'Rajesh Kumar', role: 'MDO', status: 'Active', location: 'North Delhi' },
    { id: '2', name: 'Amit Singh', role: 'MDO', status: 'Active', location: 'South Delhi' },
    { id: '3', name: 'Priya Verma', role: 'MDO', status: 'Active', location: 'East Delhi' }
  ];

  const orders = [
    { id: '1', customer: 'Ram Kumar', amount: 45000, status: 'Pending', date: '2024-01-20' },
    { id: '2', customer: 'Suresh Traders', amount: 32000, status: 'Approved', date: '2024-01-19' },
    { id: '3', customer: 'Green Agro', amount: 28000, status: 'Delivered', date: '2024-01-18' }
  ];

  const liquidationData = [
    { id: '1', distributor: 'SRI RAMA SEEDS', percentage: 71, status: 'Good' },
    { id: '2', distributor: 'Ram Kumar Distributors', percentage: 29, status: 'Needs Attention' },
    { id: '3', distributor: 'Green Agro Solutions', percentage: 26, status: 'Needs Attention' }
  ];

  const renderHomeContent = () => (
    <div className="flex-1 p-4 space-y-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
          <h3 className="text-sm font-medium opacity-90">Team Members</h3>
          <div className="text-2xl font-bold">4</div>
          <p className="text-xs opacity-75">MDOs under TSM</p>
          <p className="text-xs opacity-75">All active today</p>
        </div>
        
        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-4 text-white">
          <h3 className="text-sm font-medium opacity-90">Activities Done</h3>
          <div className="text-2xl font-bold">1374</div>
          <p className="text-xs opacity-75">out of 1620 planned</p>
          <p className="text-xs opacity-75">85% Achievement Rate</p>
        </div>
      </div>

      {/* Live Meetings Section */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex items-center justify-between mb-3">
        <div 
          className="flex items-center justify-between cursor-pointer hover:bg-gray-50 -mx-2 px-2 py-1 rounded-lg transition-colors"
          onClick={() => setLiveMeetingsExpanded(!liveMeetingsExpanded)}
        >
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-900">Live Meetings</span>
          </div>
          <div className="flex items-center space-x-1 text-green-600">
            <span className="text-sm font-medium">2 Active</span>
            {liveMeetingsExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
        </div>
        
        {/* Meeting Items - Conditionally Rendered */}
        {liveMeetingsExpanded && (
          <div className="space-y-3">
            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium text-gray-900">Rajesh Kumar</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">25 min</div>
                  <div className="text-xs text-gray-500">Started 10:45 AM</div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      alert('Meeting ended');
                    }}
                    className="mt-1 text-red-600 hover:text-red-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p>Ram Kumar Farm</p>
                <p>Green Valley, Sector 12</p>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="font-medium text-gray-900">Amit Singh</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">15 min</div>
                  <div className="text-xs text-gray-500">Started 11:20 AM</div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      alert('Meeting ended');
                    }}
                    className="mt-1 text-red-600 hover:text-red-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p>Suresh Traders</p>
                <p>Market Area, Sector 8</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Monthly Plan Section */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div 
          className="flex items-center justify-between cursor-pointer hover:bg-gray-50 -mx-2 px-2 py-1 rounded-lg transition-colors"
          onClick={() => setMonthlyPlanExpanded(!monthlyPlanExpanded)}
        >
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-900">Monthly Plan - Approved</span>
          </div>
          {monthlyPlanExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
        
        {monthlyPlanExpanded && (
          <div className="mt-3 space-y-2">
            <div className="bg-blue-50 rounded-lg p-3">
              <h4 className="font-medium text-blue-800 mb-2">January 2024 Plan</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p>Created by: Priya Sharma (TSM)</p>
                <p>Approved by: Amit Patel (RBH)</p>
                <p>Activities: 45 planned, 38 completed</p>
                <p>Progress: 84%</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderTeamContent = () => (
    <div className="flex-1 p-4 space-y-4">
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Members</h3>
        <div className="space-y-3">
          {teamMembers.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{member.name}</h4>
                  <p className="text-sm text-gray-600">{member.role} • {member.location}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                member.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {member.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderOrdersContent = () => (
    <div className="flex-1 p-4 space-y-4">
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{order.customer}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                  order.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>₹{order.amount.toLocaleString()}</span>
                <span>{new Date(order.date).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLiquidationContent = () => (
    <div className="flex-1 p-4 space-y-4">
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Liquidation Status</h3>
        <div className="space-y-3">
          {liquidationData.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{item.distributor}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.status === 'Good' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {item.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Liquidation Progress</span>
                <span className="font-semibold text-gray-900">{item.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full" 
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMoreContent = () => (
    <div className="flex-1 p-4 space-y-4">
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-blue-600 text-white p-3 rounded-lg flex items-center justify-center">
            <MapPin className="w-4 h-4 mr-2" />
            New Visit
          </button>
          <button className="bg-green-600 text-white p-3 rounded-lg flex items-center justify-center">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Create Order
          </button>
          <button className="bg-purple-600 text-white p-3 rounded-lg flex items-center justify-center">
            <DollarSign className="w-4 h-4 mr-2" />
            Payment
          </button>
          <button className="bg-orange-600 text-white p-3 rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 mr-2" />
            Report
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
        <div className="space-y-3">
          <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg">Profile Settings</button>
          <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg">Notifications</button>
          <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg">Sync Data</button>
          <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg text-red-600">Logout</button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return renderHomeContent();
      case 'team':
        return renderTeamContent();
      case 'orders':
        return renderOrdersContent();
      case 'liquidation':
        return renderLiquidationContent();
      case 'more':
        return renderMoreContent();
      default:
        return renderHomeContent();
    }
  };

  return (
    <div className="max-w-sm mx-auto bg-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'SK'}
              </span>
            </div>
            <div>
              <h2 className="font-bold">Sandeep</h2>
              <p className="text-sm opacity-90">Kumar</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs opacity-90">{currentUserRole}</p>
            <p className="text-xs opacity-75">Delhi Region</p>
          </div>
        </div>
        
        {/* Notification Icons - Now Clickable */}
        <div className="flex justify-end space-x-2">
          <button className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center hover:bg-yellow-600 transition-colors">
            <span className="text-white text-xs font-bold">{notifications.tasks}</span>
          </button>
          <button className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
            <span className="text-white text-xs font-bold">{notifications.alerts}</span>
          </button>
          <button className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
            <span className="text-white text-xs font-bold">{notifications.messages}</span>
          </button>
          <button className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
            <span className="text-white text-xs font-bold">{notifications.approvals}</span>
          </button>
        </div>
      </div>

      {/* Monthly Plan Status */}
      <div className="p-4 bg-gray-50">
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-900">Monthly Plan - Approved</span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Main Content - Dynamic based on active tab */}
      {renderContent()}

      {/* Bottom Navigation - Now Functional */}
      <div className="bg-white border-t border-gray-200 p-2">
        <div className="flex justify-around">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              activeTab === 'home' ? 'text-purple-600 bg-purple-50' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Home className="w-5 h-5 mb-1" />
            <span className="text-xs">Home</span>
          </button>
          
          <button
            onClick={() => setActiveTab('team')}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              activeTab === 'team' ? 'text-purple-600 bg-purple-50' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Users className="w-5 h-5 mb-1" />
            <span className="text-xs">Team</span>
          </button>
          
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              activeTab === 'orders' ? 'text-purple-600 bg-purple-50' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <ShoppingCart className="w-5 h-5 mb-1" />
            <span className="text-xs">Orders</span>
          </button>
          
          <button
            onClick={() => setActiveTab('liquidation')}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              activeTab === 'liquidation' ? 'text-purple-600 bg-purple-50' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Droplets className="w-5 h-5 mb-1" />
            <span className="text-xs">Liquidation</span>
          </button>
          
          <button
            onClick={() => setActiveTab('more')}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              activeTab === 'more' ? 'text-purple-600 bg-purple-50' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FileText className="w-5 h-5 mb-1" />
            <span className="text-xs">More</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileApp;