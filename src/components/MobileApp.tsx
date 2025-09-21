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
  ChevronDown
} from 'lucide-react';
import { useLiquidationCalculation } from '../hooks/useLiquidationCalculation';
import { useGeolocation } from '../hooks/useGeolocation';

const MobileApp: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [currentView, setCurrentView] = useState('dashboard');
  const { overallMetrics } = useLiquidationCalculation();
  const { latitude, longitude } = useGeolocation();

  const currentUserRole = user?.role || 'MDO';

  // TSM Mobile Interface (same for both TSM and MDO)
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
        
        {/* Notification Icons */}
        <div className="flex justify-end space-x-2">
          <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">4</span>
          </div>
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">3</span>
          </div>
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">5</span>
          </div>
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">2</span>
          </div>
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

      {/* Main Content */}
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
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-900">Live Meetings</span>
            </div>
            <div className="flex items-center space-x-1 text-green-600">
              <span className="text-sm font-medium">2 Active</span>
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
          
          {/* Meeting Items */}
          <div className="space-y-3">
            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-medium text-gray-900">Rajesh Kumar</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">25 min</div>
                  <div className="text-xs text-gray-500">Started 10:45 AM</div>
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
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="font-medium text-gray-900">Amit Singh</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">15 min</div>
                  <div className="text-xs text-gray-500">Started 11:20 AM</div>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p>Suresh Traders</p>
                <p>Market Area, Sector 8</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-200 p-2">
        <div className="flex justify-around">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center p-2 rounded-lg ${
              activeTab === 'home' ? 'text-purple-600 bg-purple-50' : 'text-gray-600'
            }`}
          >
            <Home className="w-5 h-5 mb-1" />
            <span className="text-xs">Home</span>
          </button>
          
          <button
            onClick={() => setActiveTab('team')}
            className={`flex flex-col items-center p-2 rounded-lg ${
              activeTab === 'team' ? 'text-purple-600 bg-purple-50' : 'text-gray-600'
            }`}
          >
            <Users className="w-5 h-5 mb-1" />
            <span className="text-xs">Team</span>
          </button>
          
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex flex-col items-center p-2 rounded-lg ${
              activeTab === 'orders' ? 'text-purple-600 bg-purple-50' : 'text-gray-600'
            }`}
          >
            <ShoppingCart className="w-5 h-5 mb-1" />
            <span className="text-xs">Orders</span>
          </button>
          
          <button
            onClick={() => setActiveTab('liquidation')}
            className={`flex flex-col items-center p-2 rounded-lg ${
              activeTab === 'liquidation' ? 'text-purple-600 bg-purple-50' : 'text-gray-600'
            }`}
          >
            <Droplets className="w-5 h-5 mb-1" />
            <span className="text-xs">Liquidation</span>
          </button>
          
          <button
            onClick={() => setActiveTab('more')}
            className={`flex flex-col items-center p-2 rounded-lg ${
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