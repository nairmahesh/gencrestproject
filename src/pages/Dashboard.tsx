import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LiveMeetings from '../components/LiveMeetings';
import TSMDashboard from '../components/TSMDashboard';
import RBHDashboard from '../components/RBHDashboard';
import RMMDashboard from '../components/RMMDashboard';
import RoleBasedAccess from '../components/RoleBasedAccess';
import { useLiquidationCalculation } from '../hooks/useLiquidationCalculation';
import { 
  Calendar, 
  MapPin, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  DollarSign,
  Target,
  Award,
  Bell,
  Activity,
  BarChart3,
  PieChart,
  ArrowUp,
  ArrowDown,
  Package,
  Droplets,
  Building,
  Search,
  Filter,
  Eye,
  Edit,
  ShoppingCart,
  Phone,
  Car,
  FileText,
  Navigation,
  X,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProductDetail {
  id: string;
  productCode: string;
  productName: string;
  category: string;
  skus: SKUDetail[];
  totalVolume: number;
  totalValue: number;
}

interface SKUDetail {
  id: string;
  skuCode: string;
  skuName: string;
  unit: string;
  volume: number;
  value: number;
  unitPrice: number;
}

const Dashboard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState('All');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<string>('');
  const [liveMeetings, setLiveMeetings] = useState([
    {
      id: 'LM001',
      participantName: 'Rajesh Kumar',
      participantRole: 'MDO',
      location: 'Ram Kumar Farm',
      address: 'Green Valley, Sector 12',
      startTime: '10:45 AM',
      duration: 25,
      status: 'active' as const,
      type: 'Visit' as const,
      phone: '+91 98765 43210',
      notes: 'Product demonstration in progress'
    },
    {
      id: 'LM002',
      participantName: 'Amit Singh',
      participantRole: 'MDO',
      location: 'Suresh Traders',
      address: 'Market Area, Sector 8',
      startTime: '11:20 AM',
      duration: 15,
      status: 'active' as const,
      type: 'Demo' as const,
      phone: '+91 87654 32109',
      notes: 'Stock review and liquidation discussion'
    }
  ]);
  const { user, hasPermission } = useAuth();
  
  // Use dynamic liquidation calculation hook
  const { 
    overallMetrics, 
    distributorMetrics, 
    getPerformanceMetrics,
    getFarmerSalesTracking,
    BUSINESS_RULES
  } = useLiquidationCalculation();
  
  const navigate = useNavigate();
  const performanceMetrics = getPerformanceMetrics();
  const farmerSalesTracking = getFarmerSalesTracking();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Show TSM-specific dashboard if user is TSM
  if (user?.role === 'TSM') {
    return <TSMDashboard />;
  }

  // Show RBH-specific dashboard if user is RBH
  if (user?.role === 'RBH') {
    return <RBHDashboard />;
  }

  // Show RMM-specific dashboard if user is RMM
  if (user?.role === 'RMM') {
    return <RMMDashboard />;
  }

  // Sample product and SKU data
  const productData: ProductDetail[] = [
    {
      id: 'P001',
      productCode: 'FERT001',
      productName: 'DAP (Di-Ammonium Phosphate)',
      category: 'Fertilizers',
      totalVolume: 15000,
      totalValue: 18.50,
      skus: [
        {
          id: 'S001',
          skuCode: 'DAP-25KG',
          skuName: 'DAP 25kg Bag',
          unit: 'Kg',
          volume: 7500,
          value: 9.25,
          unitPrice: 1350
        },
        {
          id: 'S002',
          skuCode: 'DAP-50KG',
          skuName: 'DAP 50kg Bag',
          unit: 'Kg',
          volume: 7500,
          value: 9.25,
          unitPrice: 2700
        }
      ]
    },
    {
      id: 'P002',
      productCode: 'UREA001',
      productName: 'Urea',
      category: 'Fertilizers',
      totalVolume: 12000,
      totalValue: 14.40,
      skus: [
        {
          id: 'S003',
          skuCode: 'UREA-25KG',
          skuName: 'Urea 25kg Bag',
          unit: 'Kg',
          volume: 6000,
          value: 7.20,
          unitPrice: 600
        },
        {
          id: 'S004',
          skuCode: 'UREA-50KG',
          skuName: 'Urea 50kg Bag',
          unit: 'Kg',
          volume: 6000,
          value: 7.20,
          unitPrice: 1200
        }
      ]
    },
    {
      id: 'P003',
      productCode: 'NPK001',
      productName: 'NPK Complex',
      category: 'Fertilizers',
      totalVolume: 10000,
      totalValue: 16.00,
      skus: [
        {
          id: 'S005',
          skuCode: 'NPK-25KG',
          skuName: 'NPK Complex 25kg Bag',
          unit: 'Kg',
          volume: 5000,
          value: 8.00,
          unitPrice: 800
        },
        {
          id: 'S006',
          skuCode: 'NPK-50KG',
          skuName: 'NPK Complex 50kg Bag',
          unit: 'Kg',
          volume: 5000,
          value: 8.00,
          unitPrice: 1600
        }
      ]
    },
    {
      id: 'P004',
      productCode: 'MOP001',
      productName: 'MOP (Muriate of Potash)',
      category: 'Fertilizers',
      totalVolume: 8000,
      totalValue: 12.80,
      skus: [
        {
          id: 'S007',
          skuCode: 'MOP-25KG',
          skuName: 'MOP 25kg Bag',
          unit: 'Kg',
          volume: 4000,
          value: 6.40,
          unitPrice: 800
        },
        {
          id: 'S008',
          skuCode: 'MOP-50KG',
          skuName: 'MOP 50kg Bag',
          unit: 'Kg',
          volume: 4000,
          value: 6.40,
          unitPrice: 1600
        }
      ]
    },
    {
      id: 'P005',
      productCode: 'SSP001',
      productName: 'SSP (Single Super Phosphate)',
      category: 'Fertilizers',
      totalVolume: 6000,
      totalValue: 9.60,
      skus: [
        {
          id: 'S009',
          skuCode: 'SSP-25KG',
          skuName: 'SSP 25kg Bag',
          unit: 'Kg',
          volume: 3000,
          value: 4.80,
          unitPrice: 400
        },
        {
          id: 'S010',
          skuCode: 'SSP-50KG',
          skuName: 'SSP 50kg Bag',
          unit: 'Kg',
          volume: 3000,
          value: 4.80,
          unitPrice: 800
        }
      ]
    },
    {
      id: 'P006',
      productCode: 'PEST001',
      productName: 'Insecticide',
      category: 'Pesticides',
      totalVolume: 2000,
      totalValue: 8.00,
      skus: [
        {
          id: 'S011',
          skuCode: 'PEST-500ML',
          skuName: 'Insecticide 500ml',
          unit: 'Litre',
          volume: 1000,
          value: 4.00,
          unitPrice: 200
        },
        {
          id: 'S012',
          skuCode: 'PEST-1L',
          skuName: 'Insecticide 1L',
          unit: 'Litre',
          volume: 1000,
          value: 4.00,
          unitPrice: 400
        }
      ]
    },
    {
      id: 'P007',
      productCode: 'HERB001',
      productName: 'Herbicide',
      category: 'Pesticides',
      totalVolume: 1500,
      totalValue: 7.50,
      skus: [
        {
          id: 'S013',
          skuCode: 'HERB-500ML',
          skuName: 'Herbicide 500ml',
          unit: 'Litre',
          volume: 750,
          value: 3.75,
          unitPrice: 250
        },
        {
          id: 'S014',
          skuCode: 'HERB-1L',
          skuName: 'Herbicide 1L',
          unit: 'Litre',
          volume: 750,
          value: 3.75,
          unitPrice: 500
        }
      ]
    },
    {
      id: 'P008',
      productCode: 'FUNG001',
      productName: 'Fungicide',
      category: 'Pesticides',
      totalVolume: 1200,
      totalValue: 6.00,
      skus: [
        {
          id: 'S015',
          skuCode: 'FUNG-500ML',
          skuName: 'Fungicide 500ml',
          unit: 'Litre',
          volume: 600,
          value: 3.00,
          unitPrice: 300
        },
        {
          id: 'S016',
          skuCode: 'FUNG-1L',
          skuName: 'Fungicide 1L',
          unit: 'Litre',
          volume: 600,
          value: 3.00,
          unitPrice: 600
        }
      ]
    },
    {
      id: 'P009',
      productCode: 'SEED001',
      productName: 'Hybrid Seeds',
      category: 'Seeds',
      totalVolume: 800,
      totalValue: 12.00,
      skus: [
        {
          id: 'S017',
          skuCode: 'SEED-1KG',
          skuName: 'Hybrid Seeds 1kg Pack',
          unit: 'Kg',
          volume: 400,
          value: 6.00,
          unitPrice: 750
        },
        {
          id: 'S018',
          skuCode: 'SEED-5KG',
          skuName: 'Hybrid Seeds 5kg Pack',
          unit: 'Kg',
          volume: 400,
          value: 6.00,
          unitPrice: 3750
        }
      ]
    },
    {
      id: 'P010',
      productCode: 'MICRO001',
      productName: 'Micronutrients',
      category: 'Fertilizers',
      totalVolume: 500,
      totalValue: 5.00,
      skus: [
        {
          id: 'S019',
          skuCode: 'MICRO-1KG',
          skuName: 'Micronutrients 1kg Pack',
          unit: 'Kg',
          volume: 250,
          value: 2.50,
          unitPrice: 500
        },
        {
          id: 'S020',
          skuCode: 'MICRO-5KG',
          skuName: 'Micronutrients 5kg Pack',
          unit: 'Kg',
          volume: 250,
          value: 2.50,
          unitPrice: 2500
        }
      ]
    }
  ];

  const getMetricData = (metric: string) => {
    switch (metric) {
      case 'opening':
        return {
          title: 'Opening Stock Details',
          subtitle: 'Product & SKU wise opening stock breakdown',
          data: productData.map(p => ({
            ...p,
            skus: p.skus.map(s => ({ ...s, volume: s.volume * 0.4, value: s.value * 0.4 }))
          }))
        };
      case 'sales':
        return {
          title: 'YTD Net Sales Details',
          subtitle: 'Product & SKU wise sales performance',
          data: productData.map(p => ({
            ...p,
            skus: p.skus.map(s => ({ ...s, volume: s.volume * 1.8, value: s.value * 1.8 }))
          }))
        };
      case 'liquidation':
        return {
          title: 'Liquidation Details',
          subtitle: 'Product & SKU wise liquidation breakdown',
          data: productData.map(p => ({
            ...p,
            skus: p.skus.map(s => ({ ...s, volume: s.volume * 0.5, value: s.value * 0.5 }))
          }))
        };
      case 'balance':
        return {
          title: 'Balance Stock Details',
          subtitle: 'Product & SKU wise remaining stock',
          data: productData.map(p => ({
            ...p,
            skus: p.skus.map(s => ({ ...s, volume: s.volume * 2.6, value: s.value * 2.6 }))
          }))
        };
      default:
        return { title: '', subtitle: '', data: [] };
    }
  };

  const handleMetricClick = (metric: string) => {
    setSelectedMetric(metric);
    setShowDetailModal(true);
  };

  // Overall Dashboard Stats from All Modules
  const overallStats = {
    // Field Visits Module
    fieldVisits: {
      todayPlanned: 8,
      todayCompleted: 3,
      weeklyTarget: 35,
      weeklyCompleted: 28,
      completionRate: 80
    },
    
    // Sales Orders Module  
    salesOrders: {
      monthlyTarget: 500000, // Rs. 5 Lakhs
      monthlyAchieved: 420000, // Rs. 4.2 Lakhs
      achievementRate: 84,
      pendingOrders: 12,
      totalOrders: 45
    },
    
    // Liquidation Module (TABLE 1 Format)
    liquidation: overallMetrics,
    
    // Contacts Module
    contacts: {
      totalDistributors: performanceMetrics.totalDistributors,
      totalRetailers: 45,
      activeContacts: performanceMetrics.activeDistributors + 45,
      newThisMonth: 8
    },
    
    // Travel & Expenses
    travel: {
      monthlyBudget: 25000,
      monthlySpent: 18500,
      pendingClaims: 3,
      approvedAmount: 15000
    },
    
    // Performance & Targets
    performance: {
      overallScore: performanceMetrics.averageLiquidationRate,
      visitTarget: 85,
      salesTarget: 84,
      liquidationTarget: performanceMetrics.targetAchievementRate
    }
  };

  const moduleCards = [
    {
      title: 'Field Visits',
      icon: MapPin,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      stats: [
        { label: 'Today Planned', value: overallStats.fieldVisits.todayPlanned, unit: 'visits' },
        { label: 'Today Completed', value: overallStats.fieldVisits.todayCompleted, unit: 'visits' },
        { label: 'Weekly Progress', value: `${overallStats.fieldVisits.weeklyCompleted}/${overallStats.fieldVisits.weeklyTarget}`, unit: 'visits' },
        { label: 'Completion Rate', value: overallStats.fieldVisits.completionRate, unit: '%' }
      ],
      route: '/field-visits'
    },
    {
      title: 'Sales Orders',
      icon: ShoppingCart,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      stats: [
        { label: 'Monthly Target', value: '₹5.0L', unit: '' },
        { label: 'Monthly Achieved', value: '₹4.2L', unit: '' },
        { label: 'Achievement Rate', value: overallStats.salesOrders.achievementRate, unit: '%' },
        { label: 'Pending Orders', value: overallStats.salesOrders.pendingOrders, unit: 'orders' }
      ],
      route: '/sales-orders'
    },
    {
      title: 'Contacts Management',
      icon: Users,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      stats: [
        { label: 'Total Distributors', value: overallStats.contacts.totalDistributors, unit: '' },
        { label: 'Total Retailers', value: overallStats.contacts.totalRetailers, unit: '' },
        { label: 'Active Contacts', value: overallStats.contacts.activeContacts, unit: '' },
        { label: 'New This Month', value: overallStats.contacts.newThisMonth, unit: '' }
      ],
      route: '/contacts'
    },
    {
      title: 'Travel & Expenses',
      icon: Car,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      stats: [
        { label: 'Monthly Budget', value: '₹25K', unit: '' },
        { label: 'Monthly Spent', value: '₹18.5K', unit: '' },
        { label: 'Pending Claims', value: overallStats.travel.pendingClaims, unit: 'claims' },
        { label: 'Approved Amount', value: '₹15K', unit: '' }
      ],
      route: '/travel'
    },
    {
      title: 'Performance & Targets',
      icon: Target,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      stats: [
        { label: 'Overall Score', value: overallStats.performance.overallScore, unit: '%' },
        { label: 'Visit Target', value: overallStats.performance.visitTarget, unit: '%' },
        { label: 'Sales Target', value: overallStats.performance.salesTarget, unit: '%' },
        { label: 'Liquidation Target', value: overallStats.performance.liquidationTarget, unit: '%' }
      ],
      route: '/performance'
    },
    {
      title: 'Planning & Targets',
      icon: Calendar,
      color: 'bg-teal-500',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200',
      stats: [
        { label: 'Active Plans', value: 3, unit: 'plans' },
        { label: 'This Week', value: 12, unit: 'activities' },
        { label: 'Completed', value: 8, unit: 'activities' },
        { label: 'Success Rate', value: 92, unit: '%' }
      ],
      route: '/planning'
    }
  ];

  const recentActivities = [
    {
      id: '1',
      type: 'visit_completed',
      title: 'Visit completed at SRI RAMA SEEDS',
      description: 'Stock verification and liquidation tracking',
      time: '2 hours ago',
      icon: CheckCircle,
      color: 'text-green-600',
      module: 'Field Visits'
    },
    {
      id: '2',
      type: 'order_received',
      title: 'New order received',
      description: 'Green Agro Store - ₹45,000 order',
      time: '4 hours ago',
      icon: ShoppingCart,
      color: 'text-blue-600',
      module: 'Sales Orders'
    },
    {
      id: '3',
      type: 'stock_variance',
      title: 'Stock variance detected',
      description: 'GREEN AGRO: 25kg difference found',
      time: '6 hours ago',
      icon: AlertTriangle,
      color: 'text-yellow-600',
      module: 'Liquidation'
    },
    {
      id: '4',
      type: 'travel_claim',
      title: 'Travel claim submitted',
      description: 'Delhi to Hyderabad - ₹2,500',
      time: '1 day ago',
      icon: Car,
      color: 'text-purple-600',
      module: 'Travel'
    }
  ];

  const filteredActivities = selectedModule === 'All' 
    ? recentActivities 
    : recentActivities.filter(activity => activity.module === selectedModule);

  const handleEndMeeting = (meetingId: string) => {
    setLiveMeetings(prev => prev.filter(meeting => meeting.id !== meetingId));
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="gradient-bg rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Good Morning, {user?.name.split(' ')[0] || 'User'}!</h1>
            <p className="text-white/90">
              {currentTime.toLocaleDateString('en-IN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <p className="text-white/80 text-sm mt-1">
              {currentTime.toLocaleTimeString('en-IN', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
            <p className="text-white/80 text-xs mt-1">
              {user?.role} - {user?.territory || user?.region || user?.zone || 'Head Office'}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{overallStats.fieldVisits.todayPlanned}</div>
            <div className="text-white/90 text-sm">Visits planned</div>
            <div className="text-white/80 text-xs mt-1">
              {overallStats.fieldVisits.todayCompleted} Completed
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 card-shadow text-center">
          <div className="text-2xl font-bold text-blue-600">{overallStats.fieldVisits.completionRate}%</div>
          <div className="text-sm text-gray-600">Visit Target</div>
        </div>
        <div className="bg-white rounded-xl p-4 card-shadow text-center">
          <div className="text-2xl font-bold text-green-600">₹4.2L</div>
          <div className="text-sm text-gray-600">Sales MTD</div>
        </div>
        <div className="bg-white rounded-xl p-4 card-shadow text-center">
          <div className="text-2xl font-bold text-purple-600">28%</div>
          <div className="text-sm text-gray-600">Avg Liquidation</div>
        </div>
        <div className="bg-white rounded-xl p-4 card-shadow text-center">
          <div className="text-2xl font-bold text-orange-600">{overallStats.contacts.totalDistributors}</div>
          <div className="text-sm text-gray-600">Distributors</div>
        </div>
      </div>

      {/* Stock Liquidation Overview */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Stock Liquidation Overview</h3>
            <p className="text-sm text-gray-600 mt-1">Last updated: 15 Sept 2025, 10:00 pm</p>
          </div>
          <button 
            onClick={() => handleMetricClick('overview')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div 
            className="bg-orange-50 rounded-xl p-6 border-l-4 border-orange-500 cursor-pointer hover:shadow-md transition-all duration-200"
            onClick={() => handleMetricClick('opening')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Opening Stock</h4>
            <div className="text-3xl font-bold text-gray-900 mb-1">32,660</div>
            <div className="text-sm text-gray-600 mb-2">Kg/Litre</div>
            <div className="text-sm text-gray-500 mb-3">Value: ₹190.00L</div>
            <button className="text-orange-600 text-sm font-medium hover:text-orange-700 flex items-center">
              View Details <ChevronRight className="w-4 h-4 ml-1" />
            </button>
            <div className="text-xs text-gray-500 mt-2">Last updated: Jan 20, 2024</div>
          </div>

          <div 
            className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-500 cursor-pointer hover:shadow-md transition-all duration-200"
            onClick={() => handleMetricClick('sales')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">YTD Net Sales</h4>
            <div className="text-3xl font-bold text-gray-900 mb-1">13,303</div>
            <div className="text-sm text-gray-600 mb-2">Kg/Litre</div>
            <div className="text-sm text-gray-500 mb-3">Value: ₹43.70L</div>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center">
              View Details <ChevronRight className="w-4 h-4 ml-1" />
            </button>
            <div className="text-xs text-gray-500 mt-2">Last updated: Jan 20, 2024</div>
          </div>

          <div 
            className="bg-green-50 rounded-xl p-6 border-l-4 border-green-500 cursor-pointer hover:shadow-md transition-all duration-200"
            onClick={() => handleMetricClick('liquidation')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <Droplets className="w-6 h-6 text-white" />
              </div>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Liquidation</h4>
            <div className="text-3xl font-bold text-gray-900 mb-1">12,720</div>
            <div className="text-sm text-gray-600 mb-2">Kg/Litre</div>
            <div className="text-sm text-gray-500 mb-3">Value: ₹55.52L</div>
            <button className="text-green-600 text-sm font-medium hover:text-green-700 flex items-center">
              View Details <ChevronRight className="w-4 h-4 ml-1" />
            </button>
            <div className="text-xs text-gray-500 mt-2">Last updated: Jan 20, 2024</div>
          </div>

          <div 
            className="bg-purple-50 rounded-xl p-6 border-l-4 border-purple-500 cursor-pointer hover:shadow-md transition-all duration-200"
            onClick={() => handleMetricClick('rate')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Liquidation Rate</h4>
            <div className="text-3xl font-bold text-gray-900 mb-1">28%</div>
            <div className="text-sm text-gray-600 mb-2">Overall</div>
            <div className="text-sm text-gray-500 mb-3">Performance</div>
            <button className="text-purple-600 text-sm font-medium hover:text-purple-700 flex items-center">
              View Details <ChevronRight className="w-4 h-4 ml-1" />
            </button>
            <div className="text-xs text-gray-500 mt-2">Last updated: Jan 20, 2024</div>
          </div>
        </div>
      </div>

      {/* Live Meetings */}
      <LiveMeetings 
        meetings={liveMeetings}
        onEndMeeting={handleEndMeeting}
        userRole={user?.role || 'MDO'}
      />

      {/* Module Cards - All Sections */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900">Module Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {moduleCards.map((module, index) => (
            <div 
              key={index} 
              className={`${module.bgColor} ${module.borderColor} border rounded-xl p-6 card-hover cursor-pointer`}
              onClick={() => navigate(module.route)}
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">{module.title}</h4>
                <div className={`w-10 h-10 ${module.color} rounded-full flex items-center justify-center`}>
                  <module.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {module.stats.map((stat, statIndex) => (
                  <div key={statIndex} className="text-center">
                    <div className="text-lg font-bold text-gray-900">
                      {stat.value} {stat.unit}
                    </div>
                    <div className="text-xs text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Activity className="w-5 h-5 text-purple-600 mr-2" />
            Recent Activities
          </h3>
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="All">All Modules</option>
            <option value="Field Visits">Field Visits</option>
            <option value="Sales Orders">Sales Orders</option>
            <option value="Liquidation">Liquidation</option>
            <option value="Travel">Travel</option>
          </select>
        </div>
        <div className="space-y-4">
          {filteredActivities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activity.color === 'text-green-600' ? 'bg-green-100' :
                activity.color === 'text-blue-600' ? 'bg-blue-100' :
                activity.color === 'text-yellow-600' ? 'bg-yellow-100' :
                'bg-purple-100'
              }`}>
                <activity.icon className={`w-4 h-4 ${activity.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {activity.module}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{activity.description}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product & SKU Details Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{getMetricData(selectedMetric).title}</h3>
                <p className="text-sm text-gray-600 mt-1">{getMetricData(selectedMetric).subtitle}</p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-6">
                {getMetricData(selectedMetric).data.map((product) => (
                  <div key={product.id} className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{product.productName}</h4>
                        <p className="text-sm text-gray-600">Code: {product.productCode} | Category: {product.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">{product.totalVolume.toLocaleString()} Kg/L</p>
                        <p className="text-sm text-gray-600">₹{product.totalValue.toFixed(2)}L</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {product.skus.map((sku) => (
                        <div key={sku.id} className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-gray-900">{sku.skuName}</h5>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              {sku.skuCode}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-3 text-sm">
                            <div className="text-center">
                              <p className="text-gray-600">Volume</p>
                              <p className="font-semibold">{sku.volume.toLocaleString()}</p>
                              <p className="text-xs text-gray-500">{sku.unit}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-gray-600">Value</p>
                              <p className="font-semibold">₹{sku.value.toFixed(2)}L</p>
                            </div>
                            <div className="text-center">
                              <p className="text-gray-600">Unit Price</p>
                              <p className="font-semibold">₹{sku.unitPrice}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;