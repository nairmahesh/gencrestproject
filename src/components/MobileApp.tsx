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
  Calendar,
  MapPin,
  Clock,
  Target,
  TrendingUp,
  Award,
  Bell,
  Settings,
  User,
  Phone,
  Mail,
  Building,
  Package,
  DollarSign,
  Camera,
  Navigation,
  CheckCircle,
  AlertTriangle,
  Plus,
  Filter,
  Search,
  Eye,
  Edit,
  Download,
  Upload,
  Star,
  BarChart3,
  PieChart,
  ArrowUp,
  ArrowDown,
  Zap,
  Shield,
  Crown,
  Save,
  ChevronDown,
  Activity
} from 'lucide-react';

const MobileApp: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('home');

  // If user is MDO, show MDO-specific mobile interface
  if (user?.role === 'MDO') {
    return (
      <div className="max-w-sm mx-auto bg-white min-h-screen flex flex-col">
        {/* MDO Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold">{user.name}</h1>
              <p className="text-blue-100 text-sm">MDO - {user.territory}</p>
            </div>
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* MDO Quick Stats */}
        <div className="p-4 bg-gray-50">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-blue-600">8</div>
              <div className="text-xs text-gray-600">Today's Visits</div>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-green-600">3</div>
              <div className="text-xs text-gray-600">Completed</div>
            </div>
          </div>
        </div>

        {/* MDO Main Content */}
        <div className="flex-1 p-4 space-y-4">
          {activeTab === 'home' && (
            <div className="space-y-4">
              {/* Today's Schedule */}
              <div className="bg-white rounded-lg p-4 border">
                <h3 className="font-semibold text-gray-900 mb-3">Today's Schedule</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-2 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Ram Kumar Farm</p>
                      <p className="text-xs text-gray-600">10:00 AM - Product Demo</p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Completed</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-2 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Suresh Traders</p>
                      <p className="text-xs text-gray-600">2:30 PM - Stock Review</p>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">In Progress</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Amit Agro Solutions</p>
                      <p className="text-xs text-gray-600">4:00 PM - Payment Collection</p>
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">Pending</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg p-4 border">
                <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button className="bg-purple-500 text-white p-3 rounded-lg text-sm font-medium">
                    Start Visit
                  </button>
                  <button className="bg-green-500 text-white p-3 rounded-lg text-sm font-medium">
                    Take Photo
                  </button>
                  <button className="bg-blue-500 text-white p-3 rounded-lg text-sm font-medium">
                    Create Order
                  </button>
                  <button className="bg-orange-500 text-white p-3 rounded-lg text-sm font-medium">
                    Collection
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tracker' && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border">
                <h3 className="font-semibold text-gray-900 mb-3">Activity Tracker</h3>
                <div className="space-y-3">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-800">38</div>
                      <div className="text-xs text-blue-600">Activities Completed</div>
                    </div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-800">45</div>
                      <div className="text-xs text-orange-600">Monthly Target</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border">
                <h3 className="font-semibold text-gray-900 mb-3">My Tasks</h3>
                <div className="space-y-2">
                  <div className="p-2 bg-red-50 rounded border-l-4 border-red-500">
                    <p className="text-sm font-medium">Visit SRI RAMA SEEDS</p>
                    <p className="text-xs text-gray-600">Due: Today</p>
                  </div>
                  <div className="p-2 bg-yellow-50 rounded border-l-4 border-yellow-500">
                    <p className="text-sm font-medium">Monthly Sales Report</p>
                    <p className="text-xs text-gray-600">Due: Jan 25</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'liquidation' && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border">
                <h3 className="font-semibold text-gray-900 mb-3">Stock Liquidation</h3>
                <div className="space-y-3">
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="text-center">
                      <div className="text-xl font-bold text-green-800">28%</div>
                      <div className="text-xs text-green-600">Liquidation Rate</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>SRI RAMA SEEDS</span>
                      <span className="font-semibold text-green-600">71%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Ram Kumar</span>
                      <span className="font-semibold text-yellow-600">29%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border">
                <h3 className="font-semibold text-gray-900 mb-3">Reports</h3>
                <div className="space-y-2">
                  <button className="w-full bg-purple-100 text-purple-700 p-3 rounded-lg text-sm font-medium text-left">
                    Daily Activity Report
                  </button>
                  <button className="w-full bg-blue-100 text-blue-700 p-3 rounded-lg text-sm font-medium text-left">
                    Weekly Performance
                  </button>
                  <button className="w-full bg-green-100 text-green-700 p-3 rounded-lg text-sm font-medium text-left">
                    Monthly Summary
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MDO Footer Navigation */}
        <div className="bg-white border-t border-gray-200 p-2 mt-auto">
          <div className="flex justify-around items-center">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                activeTab === 'home' ? 'text-purple-600 bg-purple-50' : 'text-gray-600'
              }`}
            >
              <Home className="w-5 h-5 mb-1" />
              <span className="text-xs">Home</span>
            </button>
            
            <button
              onClick={() => setActiveTab('tracker')}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                activeTab === 'tracker' ? 'text-purple-600 bg-purple-50' : 'text-gray-600'
              }`}
            >
              <Activity className="w-5 h-5 mb-1" />
              <span className="text-xs">Tracker</span>
            </button>
            
            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                activeTab === 'tasks' ? 'text-purple-600 bg-purple-50' : 'text-gray-600'
              }`}
            >
              <CheckSquare className="w-5 h-5 mb-1" />
              <span className="text-xs">Tasks</span>
            </button>
            
            <button
              onClick={() => setActiveTab('liquidation')}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                activeTab === 'liquidation' ? 'text-purple-600 bg-purple-50' : 'text-gray-600'
              }`}
            >
              <Droplets className="w-5 h-5 mb-1" />
              <span className="text-xs">Liquidation</span>
            </button>
            
            <button
              onClick={() => setActiveTab('reports')}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                activeTab === 'reports' ? 'text-purple-600 bg-purple-50' : 'text-gray-600'
              }`}
            >
              <FileText className="w-5 h-5 mb-1" />
              <span className="text-xs">Reports</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // TSM Mobile Interface
  return (
    <div className="max-w-sm mx-auto bg-white min-h-screen flex flex-col">
      {/* TSM Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">Gencrest Mobile</h1>
            <p className="text-purple-100 text-sm">TSM Dashboard</p>
          </div>
          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <User className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Role Banner */}
      <div className="bg-purple-100 p-3 border-b">
        <div className="text-center">
          <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            TSM - Delhi Region
          </span>
        </div>
      </div>

      {/* Monthly Plan Status */}
      <div className="p-4 bg-blue-50 border-b">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-900">📋 Monthly Plan - Approved</p>
            <p className="text-xs text-blue-700">85% Achievement Rate</p>
          </div>
          <ChevronDown className="w-4 h-4 text-blue-600" />
        </div>
      </div>

      {/* Team Stats */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-purple-500 text-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">4</div>
            <div className="text-xs opacity-90">Team Members</div>
            <div className="text-xs opacity-75">MDOs under TSM</div>
            <div className="text-xs opacity-75">All active today</div>
          </div>
          <div className="bg-pink-500 text-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">1374</div>
            <div className="text-xs opacity-90">Activities Done</div>
            <div className="text-xs opacity-75">out of 1620 planned</div>
            <div className="text-xs opacity-75">85% Achievement Rate</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 space-y-4">
        {activeTab === 'home' && (
          <div className="space-y-4">
            {/* Live Meetings */}
            <div className="bg-white rounded-lg p-4 border">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <h3 className="font-semibold text-gray-900">Live Meetings</h3>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-sm font-medium text-green-600">2 Active</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-sm">Rajesh Kumar</p>
                      <p className="text-xs text-gray-600">Ram Kumar Farm</p>
                      <p className="text-xs text-gray-600">Green Valley, Sector 12</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-green-600">25 min</div>
                    <div className="text-xs text-gray-500">Started 10:45 AM</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-sm">Priya Sharma</p>
                      <p className="text-xs text-gray-600">Sunrise Agro Store</p>
                      <p className="text-xs text-gray-600">Market Road, Anand</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-green-600">15 min</div>
                    <div className="text-xs text-gray-500">Started 11:20 AM</div>
                  </div>
                </div>
              </div>
            </div>

            {/* MDO Activity Breakdown */}
            <div className="bg-white rounded-lg p-4 border">
              <h3 className="font-semibold text-gray-900 mb-3">MDO Activity Breakdown</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Rajesh Kumar</p>
                      <p className="text-xs text-gray-600">Farmer Visits: 18/20</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-green-600">90%</div>
                    <div className="text-xs text-gray-500">Achievement</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Amit Singh</p>
                      <p className="text-xs text-gray-600">Dealer Visits: 15/18</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-yellow-600">83%</div>
                    <div className="text-xs text-gray-500">Achievement</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border">
              <h3 className="font-semibold text-gray-900 mb-3">Team Management</h3>
              <div className="space-y-2">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Rajesh Kumar</p>
                      <p className="text-xs text-gray-600">MDO - North Delhi</p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
                  </div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Amit Singh</p>
                      <p className="text-xs text-gray-600">MDO - South Delhi</p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border">
              <h3 className="font-semibold text-gray-900 mb-3">Recent Orders</h3>
              <div className="space-y-2">
                <div className="p-2 border rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">SO-2024-001</span>
                    <span className="text-sm text-green-600">₹15,200</span>
                  </div>
                  <p className="text-xs text-gray-600">Ram Kumar - Approved</p>
                </div>
                <div className="p-2 border rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">SO-2024-002</span>
                    <span className="text-sm text-blue-600">₹9,000</span>
                  </div>
                  <p className="text-xs text-gray-600">Suresh Traders - Pending</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'liquidation' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border">
              <h3 className="font-semibold text-gray-900 mb-3">Liquidation Status</h3>
              <div className="space-y-3">
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-800">28%</div>
                  <div className="text-xs text-purple-600">Overall Rate</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>SRI RAMA SEEDS</span>
                    <span className="font-semibold text-green-600">71%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Ram Kumar</span>
                    <span className="font-semibold text-yellow-600">29%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Green Agro</span>
                    <span className="font-semibold text-red-600">26%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'more' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border">
              <h3 className="font-semibold text-gray-900 mb-3">More Options</h3>
              <div className="space-y-2">
                <button className="w-full bg-gray-100 text-gray-700 p-3 rounded-lg text-sm font-medium text-left">
                  Settings
                </button>
                <button className="w-full bg-gray-100 text-gray-700 p-3 rounded-lg text-sm font-medium text-left">
                  Help & Support
                </button>
                <button className="w-full bg-red-100 text-red-700 p-3 rounded-lg text-sm font-medium text-left">
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* TSM Footer Navigation */}
      <div className="bg-white border-t border-gray-200 p-2 mt-auto">
        <div className="flex justify-around items-center">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              activeTab === 'home' ? 'text-purple-600 bg-purple-50' : 'text-gray-600'
            }`}
          >
            <Home className="w-5 h-5 mb-1" />
            <span className="text-xs">Home</span>
          </button>
          
          <button
            onClick={() => setActiveTab('team')}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              activeTab === 'team' ? 'text-purple-600 bg-purple-50' : 'text-gray-600'
            }`}
          >
            <Users className="w-5 h-5 mb-1" />
            <span className="text-xs">Team</span>
          </button>
          
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              activeTab === 'orders' ? 'text-purple-600 bg-purple-50' : 'text-gray-600'
            }`}
          >
            <ShoppingCart className="w-5 h-5 mb-1" />
            <span className="text-xs">Orders</span>
          </button>
          
          <button
            onClick={() => setActiveTab('liquidation')}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              activeTab === 'liquidation' ? 'text-purple-600 bg-purple-50' : 'text-gray-600'
            }`}
          >
            <Droplets className="w-5 h-5 mb-1" />
            <span className="text-xs">Liquidation</span>
          </button>
          
          <button
            onClick={() => setActiveTab('more')}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              activeTab === 'more' ? 'text-purple-600 bg-purple-50' : 'text-gray-600'
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