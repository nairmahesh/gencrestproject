import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGeolocation } from '../hooks/useGeolocation';
import { 
  ArrowLeft, 
  Calendar, 
  Target, 
  Users, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Camera,
  Video,
  FileText,
  Upload,
  Save,
  X,
  Play,
  Pause,
  Navigation,
  User,
  Building,
  Phone,
  Award,
  Activity,
  Eye,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  Star,
  Plus,
  Edit,
  TrendingUp
} from 'lucide-react';

interface ActivityPlan {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  village: string;
  associatedDistributor: string;
  distributorCode: string;
  activityType: string;
  activityCategory: 'Internal Meetings' | 'Farmer BTL Engagement' | 'Channel BTL Engagement';
  targetNumbers: {
    participants?: number;
    dealers?: number;
    retailers?: number;
    farmers?: number;
    volume?: number;
    value?: number;
  };
  actualNumbers?: {
    participants?: number;
    dealers?: number;
    retailers?: number;
    farmers?: number;
    volume?: number;
    value?: number;
  };
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Cancelled';
  assignedLocation: {
    latitude: number;
    longitude: number;
    address: string;
  };
  actualLocation?: {
    latitude: number;
    longitude: number;
    address: string;
    deviation?: number;
    isValid?: boolean;
  };
  locationApproval?: {
    status: 'pending' | 'approved' | 'rejected';
    approvedBy?: string;
    approvedDate?: string;
    remarks?: string;
  };
  proof?: {
    photos: string[];
    videos: string[];
    signatures: string[];
    timestamp: string;
    capturedBy: string;
  };
  visitType: 'Solo' | 'Accompanied';
  accompaniedBy?: {
    name: string;
    role: 'TSM' | 'RMM' | 'ZH';
  };
  outcome?: string;
  remarks?: string;
}

interface VisitTarget {
  id: string;
  type: 'Retailer' | 'Farmer' | 'Distributor';
  name: string;
  code: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  associatedDistributor: string;
  phone: string;
  lastVisit?: string;
  priority: 'High' | 'Medium' | 'Low';
}

interface LocationDeviation {
  id: string;
  activityId: string;
  mdoName: string;
  mdoCode: string;
  assignedLocation: string;
  actualLocation: string;
  deviation: number;
  date: string;
  time: string;
  status: 'pending' | 'approved' | 'rejected';
  remarks: string;
  approvedBy?: string;
  approvedDate?: string;
  approverComments?: string;
  tsmRemarks?: string;
  tsmRemarksDate?: string;
  mdoResponse?: string;
  mdoResponseDate?: string;
  conversationHistory?: {
    id: string;
    from: 'MDO' | 'TSM';
    message: string;
    timestamp: string;
  }[];
}

const MDOModule: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { latitude, longitude, error: locationError } = useGeolocation();
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeVisit, setActiveVisit] = useState<string | null>(null);
  const [visitType, setVisitType] = useState<'Solo' | 'Accompanied'>('Solo');
  const [accompaniedBy, setAccompaniedBy] = useState<{ name: string; role: 'TSM' | 'RMM' | 'ZH' } | null>(null);
  const [selectedActivity, setSelectedActivity] = useState('');
  const [activityOutcome, setActivityOutcome] = useState('');
  const [visitRemarks, setVisitRemarks] = useState('');
  const [uploadedProofs, setUploadedProofs] = useState<any[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showLocationAlert, setShowLocationAlert] = useState(false);
  const [showWorkPlan, setShowWorkPlan] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [locationDeviation, setLocationDeviation] = useState<number>(0);
  const [deviationRemarks, setDeviationRemarks] = useState('');
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState('');

  // Sample visit targets
  const visitTargets: VisitTarget[] = [
    {
      id: 'VT001',
      type: 'Retailer',
      name: 'Green Agro Store',
      code: 'GAS001',
      location: {
        latitude: 28.6139,
        longitude: 77.2090,
        address: 'Green Valley, Sector 12, Delhi'
      },
      associatedDistributor: 'SRI RAMA SEEDS',
      phone: '+91 98765 43210',
      lastVisit: '2024-01-15',
      priority: 'High'
    },
    {
      id: 'VT002',
      type: 'Farmer',
      name: 'Ramesh Kumar',
      code: 'FAR001',
      location: {
        latitude: 28.5355,
        longitude: 77.3910,
        address: 'Village Khera, Sector 8, Delhi'
      },
      associatedDistributor: 'Ram Kumar Distributors',
      phone: '+91 87654 32109',
      priority: 'Medium'
    },
    {
      id: 'VT003',
      type: 'Distributor',
      name: 'SRI RAMA SEEDS AND PESTICIDES',
      code: '1325',
      location: {
        latitude: 28.4089,
        longitude: 77.3178,
        address: 'Industrial Area, Delhi'
      },
      associatedDistributor: 'Self',
      phone: '+91 76543 21098',
      lastVisit: '2024-01-18',
      priority: 'High'
    }
  ];

  // Activity categories from attachment
  const activityCategories = {
    'Internal Meetings': ['Team Meetings'],
    'Farmer BTL Engagement': [
      'Farmer Meets – Small',
      'Farmer Meets – Large',
      'Farm level demos',
      'Wall Paintings',
      'Jeep Campaigns',
      'Field Days',
      'Distributor Day Training Program (25 dealers max)',
      'Retailer Day Training Program (50 retailers max)',
      'Distributor Connect Meeting (Overnight Stay)',
      'Dealer/Retailer Store Branding'
    ],
    'Channel BTL Engagement': ['Trade Merchandise']
  };

  const activityOutcomes = [
    'Successfully completed as planned',
    'Partially completed - weather issues',
    'Completed with additional participants',
    'Rescheduled due to unavailability',
    'Cancelled - force majeure',
    'Exceeded target numbers',
    'Below target - market conditions'
  ];

  // Sample daily plans
  const [dailyPlans, setDailyPlans] = useState<ActivityPlan[]>([
    {
      id: 'AP001',
      date: '2024-01-22',
      startTime: '09:00',
      endTime: '11:00',
      duration: 120,
      village: 'Green Valley',
      associatedDistributor: 'SRI RAMA SEEDS',
      distributorCode: '1325',
      activityType: 'Farmer Meets – Small',
      activityCategory: 'Farmer BTL Engagement',
      targetNumbers: {
        participants: 25,
        farmers: 25,
        volume: 500,
        value: 50000
      },
      actualNumbers: {
        participants: 28,
        farmers: 28,
        volume: 560,
        value: 56000
      },
      status: 'Completed',
      assignedLocation: {
        latitude: 28.6139,
        longitude: 77.2090,
        address: 'Green Valley, Sector 12, Delhi'
      },
      actualLocation: {
        latitude: 28.6145,
        longitude: 77.2095,
        address: 'Green Valley Community Center',
        deviation: 0.8,
        isValid: true
      },
      visitType: 'Solo',
      outcome: 'Successfully completed as planned',
      remarks: 'Good farmer participation, exceeded target numbers'
    },
    {
      id: 'AP002',
      date: '2024-01-22',
      startTime: '14:00',
      endTime: '16:30',
      duration: 150,
      village: 'Khera Village',
      associatedDistributor: 'Ram Kumar Distributors',
      distributorCode: 'DLR001',
      activityType: 'Farm level demos',
      activityCategory: 'Farmer BTL Engagement',
      targetNumbers: {
        participants: 15,
        farmers: 15,
        volume: 200,
        value: 25000
      },
      status: 'In Progress',
      assignedLocation: {
        latitude: 28.5355,
        longitude: 77.3910,
        address: 'Village Khera, Sector 8, Delhi'
      },
      visitType: 'Accompanied',
      accompaniedBy: {
        name: 'Priya Sharma',
        role: 'TSM'
      }
    },
    {
      id: 'AP003',
      date: '2024-01-23',
      startTime: '10:00',
      endTime: '12:00',
      duration: 120,
      village: 'Industrial Area',
      associatedDistributor: 'Green Agro Solutions',
      distributorCode: 'GAS001',
      activityType: 'Distributor Day Training Program (25 dealers max)',
      activityCategory: 'Farmer BTL Engagement',
      targetNumbers: {
        participants: 25,
        dealers: 25,
        volume: 1000,
        value: 100000
      },
      status: 'Not Started',
      assignedLocation: {
        latitude: 28.4089,
        longitude: 77.3178,
        address: 'Industrial Area Training Center, Delhi'
      },
      visitType: 'Solo'
    }
  ]);

  // Location deviations requiring approval
  const [locationDeviations] = useState<LocationDeviation[]>([
    {
      id: 'LD001',
      activityId: 'AP004',
      mdoName: 'Rajesh Kumar',
      mdoCode: 'MDO001',
      assignedLocation: 'Green Valley, Sector 12',
      actualLocation: 'Sector 15 Community Hall',
      deviation: 6.2,
      date: '2024-01-20',
      time: '10:30 AM',
      status: 'pending',
      remarks: 'Venue changed due to local festival, community hall was more accessible for farmers'
    },
    {
      id: 'LD002',
      activityId: 'AP005',
      mdoName: 'Rajesh Kumar',
      mdoCode: 'MDO001',
      assignedLocation: 'Village Khera',
      actualLocation: 'Highway Rest Stop',
      deviation: 8.5,
      date: '2024-01-19',
      time: '2:15 PM',
      status: 'approved',
      remarks: 'Emergency meeting with distributor due to urgent stock issue',
      approvedBy: 'TSM - Priya Sharma',
      approvedDate: '2024-01-19',
      approverComments: 'Approved due to emergency nature of stock issue'
    }
  ]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const startVisit = (targetId: string) => {
    const target = visitTargets.find(t => t.id === targetId);
    if (!target) return;

    // Check location deviation
    if (latitude && longitude) {
      const deviation = calculateDistance(
        latitude, 
        longitude, 
        target.location.latitude, 
        target.location.longitude
      );
      
      setLocationDeviation(deviation);
      
      if (deviation > 5) {
        setShowLocationAlert(true);
        return;
      }
    }

    setActiveVisit(targetId);
  };

  const handleLocationApproval = () => {
    if (deviationRemarks.trim()) {
      // Submit for approval
      alert(`Location deviation submitted for approval. Deviation: ${locationDeviation.toFixed(1)}km`);
      setShowLocationAlert(false);
      setActiveVisit(visitTargets[0].id); // Continue with visit
    }
  };

  const handleProofCapture = (type: 'photo' | 'video' | 'signature') => {
    setIsCapturing(true);
    
    setTimeout(() => {
      const newProof = {
        id: `proof_${Date.now()}`,
        type,
        url: '/placeholder-image.jpg',
        timestamp: new Date().toISOString(),
        location: {
          latitude: latitude || 0,
          longitude: longitude || 0,
          address: 'Current Location'
        },
        capturedBy: user?.name || 'MDO',
        metadata: {
          accuracy: 5,
          deviceInfo: 'Mobile App'
        }
      };
      
      setUploadedProofs(prev => [...prev, newProof]);
      setIsCapturing(false);
      alert(`${type.charAt(0).toUpperCase() + type.slice(1)} captured with location and timestamp!`);
    }, 2000);
  };

  const completeVisit = () => {
    if (!selectedActivity || !activityOutcome) {
      alert('Please select activity type and outcome before completing visit');
      return;
    }

    // Update the daily plan with actual data
    setDailyPlans(prev => prev.map(plan => {
      if (plan.id === activeVisit) {
        return {
          ...plan,
          status: 'Completed' as const,
          actualNumbers: plan.targetNumbers, // In real app, this would be user input
          outcome: activityOutcome,
          remarks: visitRemarks,
          actualLocation: {
            latitude: latitude || 0,
            longitude: longitude || 0,
            address: 'Current Location',
            deviation: locationDeviation,
            isValid: locationDeviation <= 5
          },
          proof: {
            photos: uploadedProofs.filter(p => p.type === 'photo').map(p => p.url),
            videos: uploadedProofs.filter(p => p.type === 'video').map(p => p.url),
            signatures: uploadedProofs.filter(p => p.type === 'signature').map(p => p.url),
            timestamp: new Date().toISOString(),
            capturedBy: user?.name || 'MDO'
          }
        };
      }
      return plan;
    }));

    alert('Visit completed successfully!');
    setActiveVisit(null);
    setSelectedActivity('');
    setActivityOutcome('');
    setVisitRemarks('');
    setUploadedProofs([]);
    setLocationDeviation(0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Not Started': return 'bg-gray-100 text-gray-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDeviationStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlansForDate = (date: string) => {
    return dailyPlans.filter(plan => plan.date === date);
  };

  const startActivity = (activityId: string) => {
    setDailyPlans(prev => prev.map(plan => 
      plan.id === activityId 
        ? { ...plan, status: 'In Progress' as const }
        : plan
    ));
  };

  const completeActivity = (activityId: string) => {
    setDailyPlans(prev => prev.map(plan => 
      plan.id === activityId 
        ? { ...plan, status: 'Completed' as const }
        : plan
    ));
  };

  const generateReport = (reportType: string) => {
    setSelectedReport(reportType);
  };

  const getReportData = (reportType: string) => {
    switch (reportType) {
      case 'planned-vs-achieved':
        return {
          title: 'Planned vs Achieved Report',
          data: {
            totalPlanned: 45,
            totalCompleted: 38,
            completionRate: 84,
            categoryBreakdown: [
              { category: 'Farmer BTL Engagement', planned: 30, completed: 26 },
              { category: 'Channel BTL Engagement', planned: 10, completed: 8 },
              { category: 'Internal Meetings', planned: 5, completed: 4 }
            ]
          }
        };
      case 'ytd-totals':
        return {
          title: 'Year-to-Date Totals',
          data: {
            ytdPlanned: 180,
            ytdCompleted: 152,
            ytdCompletionRate: 84
          }
        };
      case 'region-wise':
        return {
          title: 'Region-wise Roll-ups',
          data: {
            regionCompletion: 86,
            totalMDOs: 12
          }
        };
      default:
        return null;
    }
  };

  // Sample day plans data
  const dayPlans: { [key: string]: any[] } = {
    [selectedDate]: getPlansForDate(selectedDate).map(plan => ({
      id: plan.id,
      activityType: plan.activityType,
      category: plan.activityCategory,
      village: plan.village,
      distributor: plan.associatedDistributor,
      time: `${plan.startTime} - ${plan.endTime}`,
      duration: plan.duration,
      status: plan.status,
      targetNumbers: plan.targetNumbers,
      actualNumbers: plan.actualNumbers
    }))
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">MDO Module</h1>
            <p className="text-sm text-gray-600">Market Development Officer Activities</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowReportsModal(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Reports
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl p-2 card-shadow">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-3 px-4 rounded-lg transition-colors font-medium ${
              activeTab === 'overview'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex-1 py-3 px-4 rounded-lg transition-colors font-medium ${
              activeTab === 'schedule'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Schedule & Tasks
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`flex-1 py-3 px-4 rounded-lg transition-colors font-medium ${
              activeTab === 'alerts'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            ALERTS
            {locationDeviations.filter(d => d.status === 'pending').length > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {locationDeviations.filter(d => d.status === 'pending').length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Monthly and Annual Activities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Monthly Activities */}
            <div className="bg-white rounded-xl p-6 card-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Monthly Activities</h3>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">45</div>
                  <div className="text-sm text-orange-600">Planned</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">38</div>
                  <div className="text-sm text-green-600">Done</div>
                </div>
              </div>
              
              <div className="mb-2">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>84%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '84%' }}></div>
                </div>
              </div>
            </div>

            {/* Annual Activities */}
            <div className="bg-white rounded-xl p-6 card-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Annual Activities</h3>
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">540</div>
                  <div className="text-sm text-orange-600">Planned</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">456</div>
                  <div className="text-sm text-green-600">Done</div>
                </div>
              </div>
              
              <div className="mb-2">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>84%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '84%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'alerts' && (
        <div className="space-y-6">
          {/* Location Deviations */}
          <div className="bg-white rounded-xl p-6 card-shadow">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounde