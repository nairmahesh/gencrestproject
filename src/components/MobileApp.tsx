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
  Navigation,
  CreditCard,
  Receipt,
  Banknote
} from 'lucide-react';
import { useLiquidationCalculation } from '../hooks/useLiquidationCalculation';
import { useGeolocation } from '../hooks/useGeolocation';

const MobileApp: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [liveMeetingsExpanded, setLiveMeetingsExpanded] = useState(true);
  const [monthlyPlanExpanded, setMonthlyPlanExpanded] = useState(false);
  const [show360View, setShow360View] = useState(false);
  const [selected360Distributor, setSelected360Distributor] = useState<any>(null);
  const [activeHistoryTab, setActiveHistoryTab] = useState('Timeline');
  const [selectedDistributor, setSelectedDistributor] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { overallMetrics } = useLiquidationCalculation();
  const { latitude, longitude } = useGeolocation();

  const currentUserRole = user?.role || 'MDO';

  // Sample distributor data
  const distributors = [
    {
      id: 'DIST001',
      name: 'SRI RAMA SEEDS AND PESTICIDES',
      code: '1325',
      product: 'DAP (Di-Ammonium Phosphate)',
      territory: 'North Delhi',
      region: 'Delhi NCR',
      zone: 'North Zone',
      status: 'Active',
      priority: 'High',
      liquidationPercentage: 71,
      openingStock: { volume: 210, value: 2.84 },
      ytdNetSales: { volume: 84, value: 1.13 },
      liquidation: { volume: 210, value: 2.84 },
      balanceStock: { volume: 420, value: 5.67 },
      lastUpdated: '9/18/2025',
      remarks: 'Good progress on liquidation',
      // Additional 360° data
      contactPerson: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      email: 'rajesh@sriramaseeds.com',
      address: 'Green Valley, Sector 12, Delhi NCR',
      establishedYear: 2018,
      businessType: 'Distributor',
      gstNumber: '07AABCU9603R1ZX',
      panNumber: 'AABCU9603R',
      creditLimit: 750000,
      totalPurchases: 300000,
      balanceCreditLimit: 700000,
      totalPayments: 230000,
      assignedMDO: 'Rajesh Kumar (MDO)',
      assignedTSM: 'Priya Sharma (TSM)',
      lastVisitDate: '2024-01-20',
      creditUtilization: 6.7
    },
    {
      id: 'DIST002',
      name: 'Ram Kumar Distributors',
      code: 'DLR001',
      product: 'DAP (Di-Ammonium Phosphate)',
      territory: 'Green Valley',
      region: 'Delhi NCR',
      zone: 'North Zone',
      status: 'Active',
      priority: 'Medium',
      liquidationPercentage: 29,
      openingStock: { volume: 15000, value: 18.75 },
      ytdNetSales: { volume: 6500, value: 8.13 },
      liquidation: { volume: 6200, value: 7.75 },
      balanceStock: { volume: 15300, value: 19.13 },
      lastUpdated: '9/18/2025',
      remarks: 'Needs improvement',
      // Additional 360° data
      contactPerson: 'Ram Kumar',
      phone: '+91 87654 32109',
      email: 'ram@ramkumardist.com',
      address: 'Market Area, Green Valley',
      establishedYear: 2015,
      businessType: 'Distributor',
      gstNumber: '07BBCDE1234F2GH',
      panNumber: 'BBCDE1234F',
      creditLimit: 500000,
      totalPurchases: 450000,
      balanceCreditLimit: 50000,
      totalPayments: 400000,
      assignedMDO: 'Amit Singh (MDO)',
      assignedTSM: 'Priya Sharma (TSM)',
      lastVisitDate: '2024-01-19',
      creditUtilization: 90.0
    },
    {
      id: 'DIST003',
      name: 'Green Agro Solutions',
      code: 'GAS001',
      product: 'DAP (Di-Ammonium Phosphate)',
      territory: 'Sector 8',
      region: 'Delhi NCR',
      zone: 'North Zone',
      status: 'Active',
      priority: 'Medium',
      liquidationPercentage: 26,
      openingStock: { volume: 17620, value: 21.70 },
      ytdNetSales: { volume: 6493, value: 6.57 },
      liquidation: { volume: 6380, value: 7.22 },
      balanceStock: { volume: 17733, value: 21.05 },
      lastUpdated: '9/18/2025',
      remarks: 'Regular follow-up needed',
      // Additional 360° data
      contactPerson: 'Suresh Patel',
      phone: '+91 76543 21098',
      email: 'suresh@greenagro.com',
      address: 'Industrial Area, Sector 8',
      establishedYear: 2020,
      businessType: 'Distributor',
      gstNumber: '07CDEFG5678H3IJ',
      panNumber: 'CDEFG5678H',
      creditLimit: 600000,
      totalPurchases: 380000,
      balanceCreditLimit: 220000,
      totalPayments: 350000,
      assignedMDO: 'Priya Verma (MDO)',
      assignedTSM: 'Vikram Patel (TSM)',
      lastVisitDate: '2024-01-18',
      creditUtilization: 63.3
    }
  ];

  // Activity history data
  const getActivityHistory = (distributorId: string) => {
    const baseActivities = [
      {
        id: 'ACT001',
        date: '2024-07-01',
        type: 'Visit',
        title: 'Visit: Product Demo',
        description: 'Product demonstration and stock review',
        status: 'Scheduled',
        performedBy: 'Rajesh Kumar',
        performedByRole: 'MDO',
        location: 'Green Valley, Sector 12',
        duration: 45
      },
      {
        id: 'ACT002',
        date: '2024-06-30',
        type: 'Payment',
        title: 'Payment Received',
        description: '₹80,000 - Invoice Payment',
        amount: 80000,
        status: 'Completed',
        performedBy: 'Rajesh Kumar',
        performedByRole: 'MDO',
        paymentMode: 'Bank Transfer',
        invoiceNumber: 'INV-2024-156'
      },
      {
        id: 'ACT003',
        date: '2024-06-28',
        type: 'Visit',
        title: 'Visit: Sales Call',
        description: 'Quarterly business review and target discussion',
        status: 'Completed',
        performedBy: 'Rajesh Kumar',
        performedByRole: 'MDO',
        location: 'Distributor Office',
        duration: 90
      },
      {
        id: 'ACT004',
        date: '2024-06-25',
        type: 'Order',
        title: 'Order #SO-001 created',
        description: 'Amount: ₹85,000. Status: delivered',
        amount: 85000,
        status: 'Delivered',
        performedBy: 'System',
        performedByRole: 'Auto',
        orderNumber: 'SO-001',
        invoiceNumber: 'INV-2024-001',
        items: [
          { name: 'Urea Fertilizer 50kg', qty: 100, rate: 650, total: 65000 },
          { name: 'DAP Fertilizer 25kg', qty: 40, rate: 500, total: 20000 }
        ]
      },
      {
        id: 'ACT005',
        date: '2024-06-20',
        type: 'Liquidation',
        title: 'Stock Liquidation Update',
        description: 'Updated liquidation progress to 7.5%',
        status: 'Completed',
        performedBy: 'Rajesh Kumar',
        performedByRole: 'MDO'
      },
      {
        id: 'ACT006',
        date: '2024-06-15',
        type: 'Advance',
        title: 'Advance Payment',
        description: '₹50,000 advance received for upcoming orders',
        amount: 50000,
        status: 'Completed',
        performedBy: 'Priya Sharma',
        performedByRole: 'TSM',
        paymentMode: 'Cash'
      },
      {
        id: 'ACT007',
        date: '2024-05-15',
        type: 'Order',
        title: 'Order #SO-002 created',
        description: 'Amount: ₹125,000. Status: delivered',
        amount: 125000,
        status: 'Delivered',
        performedBy: 'System',
        performedByRole: 'Auto',
        orderNumber: 'SO-002',
        invoiceNumber: 'INV-2024-002',
        items: [
          { name: 'NPK Complex 50kg', qty: 80, rate: 1200, total: 96000 },
          { name: 'Micronutrients 5kg', qty: 12, rate: 2400, total: 28800 }
        ]
      }
    ];
    return baseActivities;
  };

  // Handle distributor click - FIXED
  const handleDistributorClick = (distributor: any) => {
    console.log('Distributor clicked:', distributor.name);
    setSelected360Distributor(distributor);
    setShow360View(true);
  };

  // Ageing buckets data
  const getAgeingBuckets = (distributorId: string) => [
    { range: '0-30 Days', amount: 0, color: 'text-green-600' },
    { range: '31-60 Days', amount: 0, color: 'text-yellow-600' },
    { range: '61-90 Days', amount: 0, color: 'text-orange-600' },
    { range: '91+ Days', amount: 305000, color: 'text-red-600' }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'Visit': return <MapPin className="w-4 h-4" />;
      case 'Order': return <ShoppingCart className="w-4 h-4" />;
      case 'Payment': return <DollarSign className="w-4 h-4" />;
      case 'Advance': return <CreditCard className="w-4 h-4" />;
      case 'Liquidation': return <Droplets className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'Visit': return 'bg-blue-100 text-blue-600';
      case 'Order': return 'bg-purple-100 text-purple-600';
      case 'Payment': return 'bg-green-100 text-green-600';
      case 'Advance': return 'bg-orange-100 text-orange-600';
      case 'Liquidation': return 'bg-teal-100 text-teal-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-green-700 bg-green-100';
      case 'Delivered': return 'text-blue-700 bg-blue-100';
      case 'Scheduled': return 'text-yellow-700 bg-yellow-100';
      case 'Pending': return 'text-orange-700 bg-orange-100';
      case 'Cancelled': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

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
        
        {liveMeetingsExpanded && (
          <div className="space-y-3 mt-3">
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
    </div>
  );

  const renderLiquidationContent = () => (
    <div className="flex-1 p-4 space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-orange-50 rounded-lg p-3 border-l-4 border-orange-500">
          <div className="text-center">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Package className="w-4 h-4 text-white" />
            </div>
            <div className="text-lg font-bold text-gray-900">32,660</div>
            <div className="text-xs text-gray-600 mb-1">Kg/Litre</div>
            <div className="text-xs text-orange-600 font-semibold">₹190.00L</div>
            <div className="text-xs text-orange-700 mt-1">Opening Stock</div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-500">
          <div className="text-center">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <div className="text-lg font-bold text-gray-900">13,303</div>
            <div className="text-xs text-gray-600 mb-1">Kg/Litre</div>
            <div className="text-xs text-blue-600 font-semibold">₹43.70L</div>
            <div className="text-xs text-blue-700 mt-1">YTD Net Sales</div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-3 border-l-4 border-green-500">
          <div className="text-center">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Droplets className="w-4 h-4 text-white" />
            </div>
            <div className="text-lg font-bold text-gray-900">12,720</div>
            <div className="text-xs text-gray-600 mb-1">Kg/Litre</div>
            <div className="text-xs text-green-600 font-semibold">₹55.52L</div>
            <div className="text-xs text-green-700 mt-1">Liquidation</div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-3 border-l-4 border-purple-500">
          <div className="text-center">
            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Target className="w-4 h-4 text-white" />
            </div>
            <div className="text-lg font-bold text-gray-900">33,243</div>
            <div className="text-xs text-gray-600 mb-1">Kg/Litre</div>
            <div className="text-xs text-purple-600 font-semibold">₹178.23L</div>
            <div className="text-xs text-purple-700 mt-1">Balance Stock</div>
          </div>
        </div>
      </div>

      {/* Distributor Entries */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Distributor Entries</h3>
          <span className="text-xs text-gray-500">{distributors.length} distributors</span>
        </div>
        <div className="space-y-3">
          {distributors.map((distributor) => (
            <div key={distributor.id} className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Building className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <button
                      onClick={() => handleDistributorClick(distributor)}
                      className="text-blue-600 font-semibold hover:text-blue-800 transition-colors text-left"
                    >
                      {distributor.name}
                    </button>
                    <p className="text-xs text-gray-600">Code: {distributor.code}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    distributor.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {distributor.status}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    distributor.priority === 'High' ? 'bg-red-100 text-red-800' :
                    distributor.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {distributor.priority}
                  </span>
                </div>
              </div>
              
              {/* Product Info */}
              <div className="mb-3">
                <p className="text-xs text-blue-600 font-medium">{distributor.product}</p>
                <p className="text-xs text-gray-500">{distributor.territory} • {distributor.region}</p>
              </div>
              
              {/* Metrics Grid */}
              <div className="grid grid-cols-4 gap-2 mb-3">
                <div className="bg-orange-50 rounded p-2 text-center border border-orange-200">
                  <div className="text-xs text-orange-600 mb-1">Opening</div>
                  <div className="text-sm font-bold text-orange-800">{distributor.openingStock.volume}</div>
                  <div className="text-xs text-orange-600">₹{distributor.openingStock.value}L</div>
                </div>
                <div className="bg-blue-50 rounded p-2 text-center border border-blue-200">
                  <div className="text-xs text-blue-600 mb-1">YTD Sales</div>
                  <div className="text-sm font-bold text-blue-800">{distributor.ytdNetSales.volume}</div>
                  <div className="text-xs text-blue-600">₹{distributor.ytdNetSales.value}L</div>
                </div>
                <div className="bg-green-50 rounded p-2 text-center border border-green-200">
                  <div className="text-xs text-green-600 mb-1">Liquidation</div>
                  <div className="text-sm font-bold text-green-800">{distributor.liquidation.volume}</div>
                  <div className="text-xs text-green-600">₹{distributor.liquidation.value}L</div>
                </div>
                <div className="bg-purple-50 rounded p-2 text-center border border-purple-200">
                  <div className="text-xs text-purple-600 mb-1">Balance</div>
                  <div className="text-sm font-bold text-purple-800">{distributor.balanceStock.volume}</div>
                  <div className="text-xs text-purple-600">₹{distributor.balanceStock.value}L</div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>% Liquidation</span>
                  <span className="font-semibold">{distributor.liquidationPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${distributor.liquidationPercentage}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleDistributorClick(distributor)}
                  className="flex-1 bg-purple-100 text-purple-700 py-2 px-3 rounded-lg text-xs font-medium hover:bg-purple-200 transition-colors"
                >
                  360° View
                </button>
                <button 
                  onClick={() => {
                    setSelectedDistributor(distributor.id);
                    setShowModal(true);
                  }}
                  className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg text-xs font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verify Stock
                </button>
              </div>
              
              {/* Footer Info */}
              <div className="mt-3 pt-2 border-t border-gray-200 text-xs text-gray-500">
                <div className="flex justify-between">
                  <span>Updated: {distributor.lastUpdated}</span>
                  <span className="flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {distributor.zone}
                  </span>
                </div>
                <p className="mt-1 text-gray-600">{distributor.remarks}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTeamContent = () => (
    <div className="flex-1 p-4 space-y-4">
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Members</h3>
        <div className="space-y-3">
          {[
            { id: '1', name: 'Rajesh Kumar', role: 'MDO', status: 'Active', location: 'North Delhi' },
            { id: '2', name: 'Amit Singh', role: 'MDO', status: 'Active', location: 'South Delhi' },
            { id: '3', name: 'Priya Verma', role: 'MDO', status: 'Active', location: 'East Delhi' }
          ].map((member) => (
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
          {[
            { id: '1', customer: 'Ram Kumar', amount: 45000, status: 'Pending', date: '2024-01-20' },
            { id: '2', customer: 'Suresh Traders', amount: 32000, status: 'Approved', date: '2024-01-19' },
            { id: '3', customer: 'Green Agro', amount: 28000, status: 'Delivered', date: '2024-01-18' }
          ].map((order) => (
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

  const renderTasksContent = () => (
    <div className="flex-1 p-4 space-y-4">
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Tasks</h3>
        <div className="space-y-3">
          {[
            { id: '1', title: 'Visit SRI RAMA SEEDS', time: '10:00 AM', status: 'Pending', priority: 'High' },
            { id: '2', title: 'Stock verification at Ram Kumar', time: '2:30 PM', status: 'Scheduled', priority: 'Medium' },
            { id: '3', title: 'Payment collection - Green Agro', time: '4:00 PM', status: 'Pending', priority: 'High' }
          ].map((task) => (
            <div key={task.id} className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{task.title}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  task.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {task.priority}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {task.time}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  task.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {task.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderReportsContent = () => (
    <div className="flex-1 p-4 space-y-4">
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Reports</h3>
        <div className="space-y-3">
          {[
            { id: '1', title: 'Daily Activity Report', date: '2024-01-20', status: 'Generated' },
            { id: '2', title: 'Weekly Performance Report', date: '2024-01-19', status: 'Pending' },
            { id: '3', title: 'Monthly Liquidation Report', date: '2024-01-18', status: 'Generated' }
          ].map((report) => (
            <div key={report.id} className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{report.title}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  report.status === 'Generated' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {report.status}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>{new Date(report.date).toLocaleDateString()}</span>
                <button 
                  onClick={() => alert(`Downloading ${report.title}`)}
                  className="text-blue-600 hover:text-blue-800 text-xs"
                >
                  Download
                </button>
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
      case 'tasks':
        return renderTasksContent();
      case 'reports':
        return renderReportsContent();
      case 'more':
        return renderMoreContent();
      default:
        return renderHomeContent();
    }
  };

  return (
    <div className="max-w-sm mx-auto bg-white min-h-screen flex flex-col relative">
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
        
        {/* Monthly Plan Section */}
        <div className="bg-white bg-opacity-20 rounded-xl p-3 mb-4 border border-white border-opacity-30">
          <div 
            className="flex items-center justify-between cursor-pointer hover:bg-white hover:bg-opacity-10 -mx-1 px-1 py-1 rounded-lg transition-colors"
            onClick={() => setMonthlyPlanExpanded(!monthlyPlanExpanded)}
          >
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white">Monthly Plan - Approved</span>
            </div>
            {monthlyPlanExpanded ? (
              <ChevronUp className="w-4 h-4 text-white" />
            ) : (
              <ChevronDown className="w-4 h-4 text-white" />
            )}
          </div>
          
          {monthlyPlanExpanded && (
            <div className="mt-3 space-y-2">
              <div className="bg-white bg-opacity-20 rounded-lg p-3">
                <h4 className="font-medium text-white mb-2">January 2024 Plan</h4>
                <div className="text-sm text-white opacity-90 space-y-1">
                  <p>Created by: Priya Sharma (TSM)</p>
                  <p>Approved by: Amit Patel (RBH)</p>
                  <p>Activities: 45 planned, 38 completed</p>
                  <p>Progress: 84%</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Notification Icons */}
        <div className="flex justify-end space-x-2">
          <button 
            onClick={() => alert('Tasks: 4 pending')}
            className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center hover:bg-yellow-600 transition-colors relative"
          >
            <CheckSquare className="w-4 h-4 text-white" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
              4
            </span>
          </button>
          <button 
            onClick={() => alert('Alerts: 3 active')}
            className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors relative"
          >
            <AlertTriangle className="w-4 h-4 text-white" />
            <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
              3
            </span>
          </button>
          <button 
            onClick={() => alert('Messages: 5 unread')}
            className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors relative"
          >
            <Mail className="w-4 h-4 text-white" />
            <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
              5
            </span>
          </button>
          <button 
            onClick={() => alert('Approvals: 2 pending')}
            className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors relative"
          >
            <User className="w-4 h-4 text-white" />
            <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
              2
            </span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      {renderContent()}

      {/* Bottom Navigation */}
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
            onClick={() => setActiveTab('tasks')}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              activeTab === 'tasks' ? 'text-purple-600 bg-purple-50' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <CheckSquare className="w-5 h-5 mb-1" />
            <span className="text-xs">Tasks</span>
          </button>
          
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              activeTab === 'reports' ? 'text-purple-600 bg-purple-50' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FileText className="w-5 h-5 mb-1" />
            <span className="text-xs">Reports</span>
          </button>
        </div>
      </div>

      {/* 360° View Modal - FIXED */}
      {show360View && selected360Distributor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-end">
          <div className="bg-white w-full h-[90vh] rounded-t-2xl overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 text-white flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">{selected360Distributor.name}</h3>
                  <p className="text-sm opacity-90">Code: {selected360Distributor.code}</p>
                  <p className="text-xs opacity-75">{selected360Distributor.businessType}</p>
                </div>
                <button
                  onClick={() => setShow360View(false)}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Contact Information */}
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-600">Contact:</span>
                    <span className="font-medium">{selected360Distributor.contactPerson}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{selected360Distributor.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{selected360Distributor.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-600">Address:</span>
                    <span className="font-medium">{selected360Distributor.address}</span>
                  </div>
                </div>
              </div>

              {/* Financial Overview */}
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Financial Overview</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-200">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <CreditCard className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-sm text-blue-600 mb-1">Total Credit Limit</div>
                    <div className="text-lg font-bold text-blue-800">₹{(selected360Distributor.creditLimit / 100000).toFixed(1)}L</div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-3 text-center border border-green-200">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <ShoppingCart className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-sm text-green-600 mb-1">Total Purchases</div>
                    <div className="text-lg font-bold text-green-800">₹{(selected360Distributor.totalPurchases / 100000).toFixed(1)}L</div>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-3 text-center border border-purple-200">
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Package className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-sm text-purple-600 mb-1">Balance Credit Limit</div>
                    <div className="text-lg font-bold text-purple-800">₹{(selected360Distributor.balanceCreditLimit / 100000).toFixed(1)}L</div>
                  </div>

                  <div className="bg-orange-50 rounded-lg p-3 text-center border border-orange-200">
                    <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Banknote className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-sm text-orange-600 mb-1">Total Payments</div>
                    <div className="text-lg font-bold text-orange-800">₹{(selected360Distributor.totalPayments / 100000).toFixed(1)}L</div>
                  </div>
                </div>
              </div>

              {/* Ageing Analysis */}
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center space-x-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <h4 className="font-semibold text-gray-900">Ageing Analysis</h4>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {getAgeingBuckets(selected360Distributor.id).map((bucket, index) => (
                    <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className={`text-lg font-bold ${bucket.color} mb-1`}>
                        ₹{bucket.amount === 0 ? '0K' : `${(bucket.amount / 1000).toFixed(0)}K`}
                      </div>
                      <div className="text-xs text-gray-600">{bucket.range}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Overview */}
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Performance Overview</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Liquidation Progress</span>
                      <span className="font-semibold">{selected360Distributor.liquidationPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full" 
                        style={{ width: `${selected360Distributor.liquidationPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Credit Utilization</span>
                      <span className="font-semibold">{selected360Distributor.creditUtilization}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full" 
                        style={{ width: `${selected360Distributor.creditUtilization}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 360° Activity History */}
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">360° Activity History</h4>
                
                {/* Activity Tabs */}
                <div className="flex space-x-1 mb-4 bg-gray-100 rounded-lg p-1">
                  {['Timeline', 'Visits', 'Orders', 'Payments', 'Advances', 'Liquidations'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveHistoryTab(tab)}
                      className={`flex-1 py-1 px-2 rounded-md text-xs font-medium transition-colors ${
                        activeHistoryTab === tab
                          ? 'bg-white text-purple-600 shadow-sm'
                          : 'text-gray-600'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Activity Items */}
                <div className="space-y-3">
                  {getActivityHistory(selected360Distributor.id)
                    .filter(activity => {
                      if (activeHistoryTab === 'Timeline') return true;
                      return activity.type === activeHistoryTab.slice(0, -1);
                    })
                    .map((activity) => (
                    <div key={activity.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h5 className="font-medium text-gray-900 text-sm">{activity.title}</h5>
                            <span className="text-xs text-gray-500">{new Date(activity.date).toLocaleDateString()}</span>
                          </div>
                          <p className="text-xs text-gray-600">{activity.description}</p>
                          <p className="text-xs text-gray-500">By: {activity.performedBy} ({activity.performedByRole})</p>
                        </div>
                      </div>
                      
                      {/* Status */}
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                          {activity.status}
                        </span>
                        {activity.amount && (
                          <span className="text-sm font-semibold text-green-600">₹{activity.amount.toLocaleString()}</span>
                        )}
                      </div>

                      {/* Additional Details */}
                      {activity.type === 'Order' && activity.items && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <p className="text-xs font-medium text-gray-900 mb-1">Items Purchased:</p>
                          {activity.items.map((item: any, index: number) => (
                            <div key={index} className="flex justify-between text-xs text-gray-600 mb-1">
                              <span>{item.name}</span>
                              <span>{item.qty} × ₹{item.rate} = ₹{item.total.toLocaleString()}</span>
                            </div>
                          ))}
                          {activity.invoiceNumber && (
                            <p className="text-xs text-gray-500 mt-1">Invoice: {activity.invoiceNumber}</p>
                          )}
                        </div>
                      )}

                      {activity.type === 'Payment' && (
                        <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-600">
                          <div className="flex justify-between">
                            <span>Payment Mode:</span>
                            <span className="font-medium">{activity.paymentMode}</span>
                          </div>
                          {activity.invoiceNumber && (
                            <div className="flex justify-between">
                              <span>Invoice:</span>
                              <span className="font-medium">{activity.invoiceNumber}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {activity.type === 'Visit' && (
                        <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-600">
                          <div className="flex justify-between">
                            <span>Location:</span>
                            <span className="font-medium">{activity.location}</span>
                          </div>
                          {activity.duration && (
                            <div className="flex justify-between">
                              <span>Duration:</span>
                              <span className="font-medium">{activity.duration} minutes</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button className="bg-blue-600 text-white p-3 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="text-sm">Schedule Visit</span>
                  </button>
                  <button className="bg-green-600 text-white p-3 rounded-lg flex items-center justify-center hover:bg-green-700 transition-colors">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    <span className="text-sm">Create Order</span>
                  </button>
                  <button className="bg-purple-600 text-white p-3 rounded-lg flex items-center justify-center hover:bg-purple-700 transition-colors">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <span className="text-sm">Record Payment</span>
                  </button>
                  <button className="bg-orange-600 text-white p-3 rounded-lg flex items-center justify-center hover:bg-orange-700 transition-colors">
                    <FileText className="w-4 h-4 mr-2" />
                    <span className="text-sm">Generate Report</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileApp;