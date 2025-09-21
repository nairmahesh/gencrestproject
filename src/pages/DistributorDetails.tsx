import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  User,
  DollarSign,
  Package,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  Camera,
  CreditCard,
  Target,
  Activity,
  Eye,
  Download,
  Edit,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  Star,
  Award,
  Truck,
  Receipt,
  Banknote,
  ShoppingCart,
  Droplets
} from 'lucide-react';

interface DistributorProfile {
  id: string;
  name: string;
  code: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  territory: string;
  region: string;
  zone: string;
  status: 'Active' | 'Inactive';
  establishedYear: number;
  businessType: 'Distributor' | 'Dealer' | 'Retailer';
  gstNumber: string;
  panNumber: string;
  creditLimit: number;
  totalPurchases: number;
  balanceCreditLimit: number;
  totalPayments: number;
  assignedMDO: string;
  assignedTSM: string;
  lastVisitDate: string;
  liquidationProgress: number;
  creditUtilization: number;
}

interface ActivityHistoryItem {
  id: string;
  date: string;
  type: 'Visit' | 'Order' | 'Payment' | 'Advance' | 'Liquidation';
  title: string;
  description: string;
  amount?: number;
  status: 'Completed' | 'Pending' | 'Scheduled' | 'Delivered' | 'Cancelled';
  performedBy: string;
  performedByRole: string;
  details?: any;
  attachments?: string[];
  location?: string;
  duration?: number;
  orderNumber?: string;
  invoiceNumber?: string;
  paymentMode?: string;
}

interface AgeingBucket {
  range: string;
  amount: number;
  color: string;
}

const DistributorDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Timeline');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [expandedActivity, setExpandedActivity] = useState<string | null>(null);

  // Sample distributor data matching the design
  const distributor: DistributorProfile = {
    id: id || 'DIST001',
    name: 'Southern Suppliers',
    code: '1325',
    contactPerson: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    email: 'rajesh@southernsuppliers.com',
    address: 'Green Valley, Sector 12, Delhi NCR',
    territory: 'South India',
    region: 'Delhi NCR',
    zone: 'North Zone',
    status: 'Active',
    establishedYear: 2018,
    businessType: 'Distributor',
    gstNumber: '07AABCU9603R1ZX',
    panNumber: 'AABCU9603R',
    creditLimit: 750000, // ₹7.5L
    totalPurchases: 300000, // ₹3.0L
    balanceCreditLimit: 700000, // ₹7.0L
    totalPayments: 230000, // ₹2.3L
    assignedMDO: 'Rajesh Kumar (MDO)',
    assignedTSM: 'Priya Sharma (TSM)',
    lastVisitDate: '2024-01-20',
    liquidationProgress: 7.5,
    creditUtilization: 6.7
  };

  // Ageing analysis data matching the design
  const ageingBuckets: AgeingBucket[] = [
    { range: '0-30 Days', amount: 0, color: 'text-green-600' },
    { range: '31-60 Days', amount: 0, color: 'text-yellow-600' },
    { range: '61-90 Days', amount: 0, color: 'text-orange-600' },
    { range: '91+ Days', amount: 305000, color: 'text-red-600' } // ₹3.05K
  ];

  // Activity history matching the design
  const activityHistory: ActivityHistoryItem[] = [
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
      orderNumber: 'SO-001'
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
    }
  ];

  const getActivityIcon = (type: ActivityHistoryItem['type']) => {
    switch (type) {
      case 'Visit': return <MapPin className="w-4 h-4" />;
      case 'Order': return <ShoppingCart className="w-4 h-4" />;
      case 'Payment': return <DollarSign className="w-4 h-4" />;
      case 'Advance': return <CreditCard className="w-4 h-4" />;
      case 'Liquidation': return <Droplets className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: ActivityHistoryItem['type']) => {
    switch (type) {
      case 'Visit': return 'bg-blue-100 text-blue-600';
      case 'Order': return 'bg-purple-100 text-purple-600';
      case 'Payment': return 'bg-green-100 text-green-600';
      case 'Advance': return 'bg-orange-100 text-orange-600';
      case 'Liquidation': return 'bg-teal-100 text-teal-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusColor = (status: ActivityHistoryItem['status']) => {
    switch (status) {
      case 'Completed': return 'text-green-700 bg-green-100';
      case 'Delivered': return 'text-blue-700 bg-blue-100';
      case 'Scheduled': return 'text-yellow-700 bg-yellow-100';
      case 'Pending': return 'text-orange-700 bg-orange-100';
      case 'Cancelled': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const filteredActivities = activityHistory.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || activity.type === filterType;
    return matchesSearch && matchesType;
  });

  const tabs = ['Timeline', 'Visits', 'Orders', 'Payments', 'Advances', 'Liquidations'];

  const getTabActivities = (tab: string) => {
    if (tab === 'Timeline') return filteredActivities;
    return filteredActivities.filter(activity => {
      switch (tab) {
        case 'Visits': return activity.type === 'Visit';
        case 'Orders': return activity.type === 'Order';
        case 'Payments': return activity.type === 'Payment';
        case 'Advances': return activity.type === 'Advance';
        case 'Liquidations': return activity.type === 'Liquidation';
        default: return true;
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <button 
          onClick={() => navigate('/liquidation')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{distributor.name}</h1>
          <p className="text-gray-600">Distributor Profile & Performance</p>
        </div>
      </div>

      {/* Distributor Information Card */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
              <Building className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{distributor.name}</h2>
              <p className="text-gray-600">Code: {distributor.code}</p>
              <p className="text-sm text-gray-500">Established: {distributor.establishedYear}</p>
            </div>
          </div>
          <div className="text-right">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              distributor.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {distributor.status}
            </span>
          </div>
        </div>

        {/* Financial Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2">
              <CreditCard className="w-4 h-4 text-white" />
            </div>
            <div className="text-sm text-blue-600 mb-1">Total Credit Limit</div>
            <div className="text-xl font-bold text-blue-800">₹{(distributor.creditLimit / 100000).toFixed(1)}L</div>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-2">
              <ShoppingCart className="w-4 h-4 text-white" />
            </div>
            <div className="text-sm text-green-600 mb-1">Total Purchases</div>
            <div className="text-xl font-bold text-green-800">₹{(distributor.totalPurchases / 100000).toFixed(1)}L</div>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Package className="w-4 h-4 text-white" />
            </div>
            <div className="text-sm text-purple-600 mb-1">Balance Credit Limit</div>
            <div className="text-xl font-bold text-purple-800">₹{(distributor.balanceCreditLimit / 100000).toFixed(1)}L</div>
          </div>

          <div className="text-center p-4 bg-orange-50 rounded-xl border border-orange-200">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Banknote className="w-4 h-4 text-white" />
            </div>
            <div className="text-sm text-orange-600 mb-1">Total Payments</div>
            <div className="text-xl font-bold text-orange-800">₹{(distributor.totalPayments / 100000).toFixed(1)}L</div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <User className="w-4 h-4 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">{distributor.contactPerson}</p>
                  <p>Contact Person</p>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">{distributor.phone}</p>
                  <p>Primary Phone</p>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">{distributor.email}</p>
                  <p>Email Address</p>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">{distributor.address}</p>
                  <p>Business Address</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Business Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Territory:</span>
                <span className="font-medium text-gray-900">{distributor.territory}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium text-gray-900">{distributor.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">GST Number:</span>
                <span className="font-medium text-gray-900">{distributor.gstNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">PAN Number:</span>
                <span className="font-medium text-gray-900">{distributor.panNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Assigned MDO:</span>
                <span className="font-medium text-gray-900">{distributor.assignedMDO}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Assigned TSM:</span>
                <span className="font-medium text-gray-900">{distributor.assignedTSM}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ageing Analysis */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <div className="flex items-center space-x-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <h3 className="text-lg font-semibold text-gray-900">Ageing Analysis</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {ageingBuckets.map((bucket, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-xl">
              <div className={`text-2xl font-bold ${bucket.color} mb-1`}>
                ₹{bucket.amount === 0 ? '0K' : `${(bucket.amount / 1000).toFixed(0)}K`}
              </div>
              <div className="text-sm text-gray-600">{bucket.range}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Overview */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Liquidation Progress</span>
              <span className="font-semibold">{distributor.liquidationProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full" 
                style={{ width: `${distributor.liquidationProgress}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Credit Utilization</span>
              <span className="font-semibold">{distributor.creditUtilization}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-500 to-teal-500 h-3 rounded-full" 
                style={{ width: `${distributor.creditUtilization}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* 360° Activity History */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">360° Activity History</h3>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            >
              <option value="All">All Types</option>
              <option value="Visit">Visits</option>
              <option value="Order">Orders</option>
              <option value="Payment">Payments</option>
              <option value="Advance">Advances</option>
              <option value="Liquidation">Liquidations</option>
            </select>
          </div>
        </div>

        {/* Activity Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab}
              <span className="ml-1 text-xs">
                ({getTabActivities(tab).length})
              </span>
            </button>
          ))}
        </div>

        {/* Activity Timeline */}
        <div className="space-y-4">
          {getTabActivities(activeTab).map((activity, index) => (
            <div key={activity.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                    {activity.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{new Date(activity.date).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  <div>
                    <p className="font-medium">{activity.performedBy}</p>
                    <p className="text-xs">{activity.performedByRole}</p>
                  </div>
                </div>
                
                {activity.amount && (
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <div>
                      <p className="font-medium">₹{activity.amount.toLocaleString()}</p>
                      {activity.paymentMode && <p className="text-xs">{activity.paymentMode}</p>}
                    </div>
                  </div>
                )}
                
                {activity.location && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    <div>
                      <p className="font-medium">{activity.location}</p>
                      {activity.duration && <p className="text-xs">{activity.duration} min</p>}
                    </div>
                  </div>
                )}
                
                {activity.orderNumber && (
                  <div className="flex items-center">
                    <Receipt className="w-4 h-4 mr-2" />
                    <div>
                      <p className="font-medium">{activity.orderNumber}</p>
                      <p className="text-xs">Order Number</p>
                    </div>
                  </div>
                )}
                
                {activity.invoiceNumber && (
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    <div>
                      <p className="font-medium">{activity.invoiceNumber}</p>
                      <p className="text-xs">Invoice Number</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Expandable Details */}
              <div className="mt-3 pt-3 border-t border-gray-200">
                <button
                  onClick={() => setExpandedActivity(expandedActivity === activity.id ? null : activity.id)}
                  className="flex items-center text-sm text-purple-600 hover:text-purple-800"
                >
                  {expandedActivity === activity.id ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-1" />
                      Hide Details
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 mr-1" />
                      View Details
                    </>
                  )}
                </button>

                {expandedActivity === activity.id && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2">Activity Details</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Date & Time:</span>
                            <span className="font-medium">{new Date(activity.date).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Type:</span>
                            <span className="font-medium">{activity.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <span className="font-medium">{activity.status}</span>
                          </div>
                          {activity.duration && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Duration:</span>
                              <span className="font-medium">{activity.duration} minutes</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2">Performed By</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Name:</span>
                            <span className="font-medium">{activity.performedBy}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Role:</span>
                            <span className="font-medium">{activity.performedByRole}</span>
                          </div>
                          {activity.amount && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Amount:</span>
                              <span className="font-medium text-green-600">₹{activity.amount.toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Additional Details based on activity type */}
                    {activity.type === 'Visit' && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h5 className="font-semibold text-gray-900 mb-2">Visit Outcomes</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                            <span>Stock verification completed</span>
                          </div>
                          <div className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                            <span>Product demonstration conducted</span>
                          </div>
                          <div className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                            <span>Customer feedback collected</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {activity.type === 'Order' && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h5 className="font-semibold text-gray-900 mb-2">Order Details</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Order Number:</span>
                            <span className="font-medium">{activity.orderNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Order Value:</span>
                            <span className="font-medium">₹{activity.amount?.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Delivery Status:</span>
                            <span className="font-medium">{activity.status}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {activity.type === 'Payment' && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h5 className="font-semibold text-gray-900 mb-2">Payment Details</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Payment Mode:</span>
                            <span className="font-medium">{activity.paymentMode}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Invoice Number:</span>
                            <span className="font-medium">{activity.invoiceNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Amount:</span>
                            <span className="font-medium text-green-600">₹{activity.amount?.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {getTabActivities(activeTab).length === 0 && (
          <div className="text-center py-12">
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No {activeTab.toLowerCase()} found</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
            <MapPin className="w-4 h-4 mr-2" />
            Schedule Visit
          </button>
          <button className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Create Order
          </button>
          <button className="bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
            <DollarSign className="w-4 h-4 mr-2" />
            Record Payment
          </button>
          <button className="bg-orange-600 text-white p-3 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center">
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default DistributorDetails;