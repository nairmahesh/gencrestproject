import React, { useState } from 'react';
import { 
  Home, 
  Users, 
  ShoppingCart, 
  Droplets, 
  FileText, 
  Bell, 
  DollarSign, 
  AlertTriangle, 
  Route,
  ArrowLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  MapPin,
  Calendar,
  Target,
  TrendingUp,
  Package,
  Building,
  User,
  Phone,
  Mail,
  Navigation,
  Car,
  Plus,
  Filter,
  Search,
  Eye,
  Edit,
  X
} from 'lucide-react';
import { useLiquidationCalculation } from '../hooks/useLiquidationCalculation';

const MobileApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showCriticalAlerts, setShowCriticalAlerts] = useState(false);
  const [selectedAlertCategory, setSelectedAlertCategory] = useState('All');
  const [showTravelModal, setShowTravelModal] = useState(false);

  const { distributorMetrics } = useLiquidationCalculation();

  const criticalAlerts = [
    {
      id: '1',
      type: 'Stock Variance',
      message: 'GREEN AGRO: 25kg difference detected',
      severity: 'High',
      time: '2 hours ago',
      module: 'Liquidation'
    },
    {
      id: '2',
      type: 'Route Deviation',
      message: 'MDO deviated from planned route',
      severity: 'Medium',
      time: '4 hours ago',
      module: 'Field Visits'
    },
    {
      id: '3',
      type: 'Missing Proof',
      message: '3 visits without photos',
      severity: 'High',
      time: '6 hours ago',
      module: 'Field Visits'
    },
    {
      id: '4',
      type: 'Payment Overdue',
      message: 'Ram Kumar: ₹25,000 overdue',
      severity: 'High',
      time: '1 day ago',
      module: 'Collections'
    }
  ];

  const filteredAlerts = selectedAlertCategory === 'All' 
    ? criticalAlerts 
    : criticalAlerts.filter(alert => alert.module === selectedAlertCategory);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const renderDashboard = () => (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">SK</span>
              </div>
              <div>
                <h2 className="font-bold">Sandeep</h2>
                <p className="text-sm opacity-90">Kumar</p>
              </div>
            </div>
            <p className="text-xs opacity-80">TSM - Delhi Region</p>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setShowTravelModal(true)}
              className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center hover:bg-yellow-600 transition-colors relative"
            >
              <DollarSign className="w-3 h-3 text-white" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">4</span>
            </button>
            <button 
              onClick={() => setShowCriticalAlerts(true)}
              className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors relative"
            >
              <AlertTriangle className="w-3 h-3 text-white" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">3</span>
            </button>
            <button className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
              <Route className="w-3 h-3 text-white" />
            </button>
            <button className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors relative">
              <Bell className="w-3 h-3 text-white" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">3</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-purple-500 rounded-lg p-4 text-white">
          <h3 className="text-sm opacity-90 mb-1">YTD Achievement</h3>
          <div className="text-2xl font-bold">85%</div>
          <p className="text-xs opacity-80">1374/1620</p>
          <p className="text-xs opacity-70">Planned vs. Done Activities</p>
        </div>
        <div className="bg-pink-500 rounded-lg p-4 text-white">
          <h3 className="text-sm opacity-90 mb-1">Team Performance</h3>
          <div className="text-2xl font-bold">87%</div>
          <p className="text-xs opacity-80">Average Score</p>
          <p className="text-xs opacity-70">4 MDOs under management</p>
        </div>
      </div>

      {/* Live Meetings Section */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <h3 className="font-semibold text-sm text-gray-900">Live Meetings</h3>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-green-600 font-semibold text-sm">2 Active</span>
            <button className="text-gray-400">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="space-y-3">
          {/* Rajesh Kumar Meeting */}
          <div className="bg-green-50 rounded-lg p-3 border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-semibold text-sm text-gray-900">Rajesh Kumar</span>
              </div>
              <div className="text-right">
                <div className="text-green-600 font-semibold text-sm">25 min</div>
                <div className="text-xs text-gray-500">Started 10:45 AM</div>
              </div>
            </div>
            <div className="text-xs text-gray-600">
              <p className="font-medium">Ram Kumar Farm</p>
              <p>Green Valley, Sector 12</p>
            </div>
          </div>

          {/* Priya Sharma Meeting */}
          <div className="bg-green-50 rounded-lg p-3 border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-semibold text-sm text-gray-900">Priya Sharma</span>
              </div>
              <div className="text-right">
                <div className="text-green-600 font-semibold text-sm">15 min</div>
                <div className="text-xs text-gray-500">Started 11:20 AM</div>
              </div>
            </div>
            <div className="text-xs text-gray-600">
              <p className="font-medium">Sunrise Agro Store</p>
              <p>Market Road, Anand</p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Performance */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="font-semibold text-sm text-gray-900 mb-3">MDO Activity Breakdown</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Rajesh Kumar</p>
                <p className="text-xs text-blue-600">Farmer Visits: 18/20</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-green-600">90%</p>
              <p className="text-xs text-blue-500">Achievement</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Priya Sharma</p>
                <p className="text-xs text-green-600">Product Demos: 14/16</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-green-600">88%</p>
              <p className="text-xs text-green-500">Achievement</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Amit Singh</p>
                <p className="text-xs text-purple-600">Dealer Meetings: 10/12</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-green-600">83%</p>
              <p className="text-xs text-purple-500">Achievement</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Neha Gupta</p>
                <p className="text-xs text-orange-600">Stock Reviews: 8/10</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-green-600">80%</p>
              <p className="text-xs text-orange-500">Achievement</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTracker = () => (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-bold text-gray-900">Team Tracker</h2>
      
      <div className="space-y-3">
        {[
          { name: 'Rajesh Kumar', location: 'Green Valley', status: 'Active', time: '2h 15m' },
          { name: 'Priya Sharma', location: 'Market Road', status: 'Active', time: '1h 45m' },
          { name: 'Amit Singh', location: 'Industrial Area', status: 'Break', time: '15m' },
        ].map((member, index) => (
          <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  member.status === 'Active' ? 'bg-green-500' : 'bg-yellow-500'
                }`}></div>
                <div>
                  <p className="font-medium text-sm">{member.name}</p>
                  <p className="text-xs text-gray-600">{member.location}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">{member.time}</p>
                <p className="text-xs text-gray-500">{member.status}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTasks = () => (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-bold text-gray-900">Orders</h2>
      
      <div className="space-y-3">
        {[
          { id: 'SO-001', customer: 'Ram Kumar', amount: '₹45,000', status: 'Pending' },
          { id: 'SO-002', customer: 'Green Agro', amount: '₹32,000', status: 'Approved' },
          { id: 'SO-003', customer: 'Suresh Traders', amount: '₹28,000', status: 'Delivered' },
        ].map((order, index) => (
          <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{order.id}</p>
                <p className="text-xs text-gray-600">{order.customer}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">{order.amount}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                  order.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLiquidation = () => (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-bold text-gray-900">Liquidation</h2>
      
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-orange-50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-orange-600">32,660</div>
          <div className="text-xs text-orange-600">Opening Stock</div>
        </div>
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-green-600">28%</div>
          <div className="text-xs text-green-600">Liquidation Rate</div>
        </div>
      </div>

      <div className="space-y-3">
        {distributorMetrics.slice(0, 3).map((distributor) => (
          <div key={distributor.id} className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-medium text-sm">{distributor.distributorName}</p>
                <p className="text-xs text-gray-600">{distributor.distributorCode}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-purple-600">{distributor.metrics.liquidationPercentage}%</p>
                <p className="text-xs text-gray-500">Liquidation</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full" 
                style={{ width: `${distributor.metrics.liquidationPercentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-bold text-gray-900">More</h2>
      
      <div className="grid grid-cols-2 gap-3">
        <button className="bg-white rounded-lg p-4 shadow-sm text-center">
          <FileText className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <p className="text-sm font-medium">Reports</p>
        </button>
        <button className="bg-white rounded-lg p-4 shadow-sm text-center">
          <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <p className="text-sm font-medium">Contacts</p>
        </button>
        <button className="bg-white rounded-lg p-4 shadow-sm text-center">
          <Calendar className="w-6 h-6 text-purple-600 mx-auto mb-2" />
          <p className="text-sm font-medium">Planning</p>
        </button>
        <button className="bg-white rounded-lg p-4 shadow-sm text-center">
          <Car className="w-6 h-6 text-orange-600 mx-auto mb-2" />
          <p className="text-sm font-medium">Travel</p>
        </button>
      </div>
    </div>
  );

  // Critical Alerts Modal
  const renderCriticalAlertsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-sm max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowCriticalAlerts(false)}
                className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-white" />
              </button>
              <div>
                <h3 className="text-lg font-semibold">Critical Alerts</h3>
                <p className="text-sm opacity-90">{criticalAlerts.length} active alerts</p>
              </div>
            </div>
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
        
        <div className="p-4">
          {/* Filter */}
          <div className="mb-4">
            <select
              value={selectedAlertCategory}
              onChange={(e) => setSelectedAlertCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="All">All Modules</option>
              <option value="Liquidation">Liquidation</option>
              <option value="Field Visits">Field Visits</option>
              <option value="Collections">Collections</option>
            </select>
          </div>
          
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {filteredAlerts.map((alert) => (
              <div key={alert.id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                        {alert.severity}
                      </span>
                      <span className="text-xs text-gray-500">{alert.module}</span>
                    </div>
                    <h4 className="font-medium text-sm text-gray-900">{alert.type}</h4>
                    <p className="text-xs text-gray-600 mt-1">{alert.message}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{alert.time}</span>
                  <button className="text-blue-600 text-xs hover:text-blue-800">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Travel Reimbursement Modal
  const renderTravelReimbursementModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-sm max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowTravelModal(false)}
                className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-white" />
              </button>
              <div>
                <h3 className="text-lg font-semibold">Team Travel</h3>
                <p className="text-sm opacity-90">Reimbursement</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <DollarSign className="w-4 h-4" />
              <AlertTriangle className="w-4 h-4" />
              <Route className="w-4 h-4" />
              <Bell className="w-4 h-4" />
            </div>
          </div>
        </div>
        
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">1895</div>
              <div className="text-xs text-blue-600">Total KMs</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-600">1850</div>
              <div className="text-xs text-green-600">Approved KMs</div>
            </div>
          </div>

          {/* Pending Approval Alert */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              <span className="font-semibold text-sm text-orange-800">Pending Approval</span>
            </div>
            <p className="text-sm text-orange-700">45 KMs awaiting team approval</p>
          </div>

          {/* Cost Breakdown */}
          <div className="mb-4">
            <h4 className="font-semibold text-sm text-gray-900 mb-3">Cost Breakdown (Team)</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Fuel Cost:</span>
                <span className="font-semibold text-gray-900">₹8,527</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Daily Allowance:</span>
                <span className="font-semibold text-gray-900">₹12,000</span>
              </div>
              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-900">Total Team Claim:</span>
                  <span className="font-bold text-green-600">₹20,527</span>
                </div>
              </div>
            </div>
          </div>

          {/* TSM Personal Travel */}
          <div className="mb-4 bg-purple-50 rounded-lg p-3 border border-purple-200">
            <h4 className="font-semibold text-sm text-purple-900 mb-3">Your Travel (Sandeep Kumar)</h4>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="text-center p-2 bg-white rounded">
                <div className="text-lg font-bold text-purple-600">285</div>
                <div className="text-xs text-purple-600">Your KMs</div>
              </div>
              <div className="text-center p-2 bg-white rounded">
                <div className="text-lg font-bold text-green-600">₹3,420</div>
                <div className="text-xs text-green-600">Your Claim</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-purple-700">Fuel Cost:</span>
                <span className="font-semibold">₹1,710</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-purple-700">Daily Allowance:</span>
                <span className="font-semibold">₹1,710</span>
              </div>
              <div className="border-t border-purple-200 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-purple-900">Your Total:</span>
                  <span className="font-bold text-purple-600">₹3,420</span>
                </div>
              </div>
            </div>
          </div>

          {/* Team Recent Days */}
          <div>
            <h4 className="font-semibold text-sm text-gray-900 mb-3">Team Recent Days</h4>
            <div className="space-y-2">
              {/* TSM's own travel first */}
              <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-purple-900">Sandeep Kumar (You)</span>
                  <span className="text-xs text-purple-600">Jan 21</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-purple-700">Delhi → Regional Office (35 km)</span>
                  <span className="text-sm font-semibold text-purple-600">₹420</span>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-900">Rajesh Kumar</span>
                  <span className="text-xs text-gray-500">Jan 20</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Delhi → Gurgaon (45 km)</span>
                  <span className="text-sm font-semibold text-green-600">₹540</span>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-900">Priya Sharma</span>
                  <span className="text-xs text-gray-500">Jan 19</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Delhi → Noida (32 km)</span>
                  <span className="text-sm font-semibold text-green-600">₹384</span>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-900">Amit Singh</span>
                  <span className="text-xs text-gray-500">Jan 18</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Delhi → Faridabad (28 km)</span>
                  <span className="text-sm font-semibold text-yellow-600">₹336</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'tracker':
        return renderTracker();
      case 'tasks':
        return renderTasks();
      case 'liquidation':
        return renderLiquidation();
      case 'reports':
        return renderReports();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="max-w-sm mx-auto bg-gray-100 min-h-screen flex flex-col">
      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-white border-t border-gray-200 px-4 py-2 z-40">
        <div className="flex justify-around">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              activeTab === 'dashboard' ? 'text-purple-600 bg-purple-50' : 'text-gray-600'
            }`}
          >
            <Home className="w-5 h-5 mb-1" />
            <span className="text-xs">Home</span>
          </button>
          
          <button
            onClick={() => setActiveTab('tracker')}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              activeTab === 'tracker' ? 'text-purple-600 bg-purple-50' : 'text-gray-600'
            }`}
          >
            <Users className="w-5 h-5 mb-1" />
            <span className="text-xs">Team</span>
          </button>
          
          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              activeTab === 'tasks' ? 'text-purple-600 bg-purple-50' : 'text-gray-600'
            }`}
          >
            <ShoppingCart className="w-5 h-5 mb-1" />
            <span className="text-xs">Orders</span>
          </button>
          
          <button
            onClick={() => setActiveTab('liquidation')}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              activeTab === 'liquidation' ? 'text-purple-600 bg-purple-50' : 'text-gray-600'
            }`}
          >
            <Droplets className="w-5 h-5 mb-1" />
            <span className="text-xs">Liquidation</span>
          </button>
          
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              activeTab === 'reports' ? 'text-purple-600 bg-purple-50' : 'text-gray-600'
            }`}
          >
            <FileText className="w-5 h-5 mb-1" />
            <span className="text-xs">More</span>
          </button>
        </div>
      </div>

      {/* Critical Alerts Modal */}
      {showCriticalAlerts && renderCriticalAlertsModal()}
      
      {/* Travel Reimbursement Modal */}
      {showTravelModal && renderTravelReimbursementModal()}
    </div>
  );
};

export default MobileApp;