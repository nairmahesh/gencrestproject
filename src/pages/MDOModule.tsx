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
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Location Deviations</h3>
                  <p className="text-sm text-gray-600">Activities performed outside assigned locations</p>
                </div>
              </div>
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                {locationDeviations.filter(d => d.status === 'pending').length} Pending Approval
              </span>
            </div>

            <div className="space-y-4">
              {locationDeviations.map((deviation) => (
                <div key={deviation.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        deviation.status === 'pending' ? 'bg-yellow-100' :
                        deviation.status === 'approved' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        <AlertTriangle className={`w-4 h-4 ${
                          deviation.status === 'pending' ? 'text-yellow-600' :
                          deviation.status === 'approved' ? 'text-green-600' : 'text-red-600'
                        }`} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {deviation.deviation.toFixed(1)}km deviation detected
                        </h4>
                        <p className="text-sm text-gray-600">{deviation.mdoName} ({deviation.mdoCode})</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDeviationStatusColor(deviation.status)}`}>
                      {deviation.status.charAt(0).toUpperCase() + deviation.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-red-50 rounded-lg p-3">
                      <h5 className="font-semibold text-red-800 mb-2">Assigned Location</h5>
                      <p className="text-sm text-red-700">{deviation.assignedLocation}</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <h5 className="font-semibold text-blue-800 mb-2">Actual Location</h5>
                      <p className="text-sm text-blue-700">{deviation.actualLocation}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                    <div>
                      <p><strong>Date & Time:</strong> {deviation.date} at {deviation.time}</p>
                      <p><strong>Deviation:</strong> {deviation.deviation.toFixed(1)} km</p>
                    </div>
                    <div>
                      {deviation.approvedBy && (
                        <>
                          <p><strong>Approved by:</strong> {deviation.approvedBy}</p>
                          <p><strong>Approved on:</strong> {deviation.approvedDate}</p>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <h5 className="font-semibold text-gray-900 mb-2">MDO Remarks</h5>
                    <p className="text-sm text-gray-700">{deviation.remarks}</p>
                    {deviation.approverComments && (
                      <>
                        <h5 className="font-semibold text-gray-900 mb-2 mt-3">Approver Comments</h5>
                        <p className="text-sm text-green-700">{deviation.approverComments}</p>
                      </>
                    )}
                  </div>

                  {deviation.status === 'pending' && (
                    <div className="flex space-x-3">
                      <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </button>
                      <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center">
                        <X className="w-4 h-4 mr-2" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {locationDeviations.length === 0 && (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <p className="text-gray-500">No location deviations found</p>
                  <p className="text-sm text-gray-400">All activities performed at assigned locations</p>
                </div>
              )}
            </div>
          </div>

          {/* Other Alert Types */}
          <div className="bg-white rounded-xl p-6 card-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Time Deviations</h3>
                <p className="text-sm text-gray-600">Activities started/ended outside scheduled time</p>
              </div>
            </div>
            <div className="text-center py-8">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-gray-500">No time deviations</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 card-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Target className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Target Deviations</h3>
                <p className="text-sm text-gray-600">Activities with significant target vs actual variance</p>
              </div>
            </div>
            <div className="text-center py-8">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-gray-500">No target deviations</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'schedule' && (
        <div className="space-y-6">
          {/* Work Plan Assignment */}
          <div className="bg-white rounded-xl card-shadow">
            <button
              onClick={() => setShowWorkPlan(!showWorkPlan)}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Calendar className="w-6 h-6 text-purple-600" />
                <div className="text-left">
                  <h2 className="text-xl font-semibold text-gray-900">Work Plan Assignment</h2>
                  <p className="text-sm text-gray-600">Monthly activity plan created by TSM</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  Created by TSM
                </span>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showWorkPlan ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {showWorkPlan && (
              <div className="px-6 pb-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 mt-6">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <User className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold text-blue-800">Plan Creator</h3>
                    </div>
                    <p className="text-lg font-bold text-blue-900">Priya Sharma (TSM)</p>
                    <p className="text-sm text-blue-600">Territory Sales Manager</p>
                  </div>

                  <div className="bg-green-50 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Calendar className="w-5 h-5 text-green-600" />
                      <h3 className="font-semibold text-green-800">Plan Period</h3>
                    </div>
                    <p className="text-lg font-bold text-green-900">January 2024</p>
                    <p className="text-sm text-green-600">Monthly AWP</p>
                  </div>

                  <div className="bg-purple-50 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <CheckCircle className="w-5 h-5 text-purple-600" />
                      <h3 className="font-semibold text-purple-800">Approval Status</h3>
                    </div>
                    <p className="text-lg font-bold text-purple-900">Approved</p>
                    <p className="text-sm text-purple-600">By RBH - Amit Patel</p>
                  </div>
                </div>

                {/* Day-wise Activity Plans */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Day-wise Activity Plans</h3>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                                    deviation.status === 'Clarification Requested' ? 'bg-orange-100 text-orange-800' :
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {new Date(selectedDate).toLocaleDateString('en-IN', { 
                          weekday: 'long', 
                           month: 'long',
                           day: 'numeric'
                         })}
                        </h4>
                        </div>
                        
                        {deviation.approvedDate && (
                                    <p className="text-xs text-gray-500 mt-1">
                                      Approved: {new Date(deviation.approvedDate).toLocaleDateString()}
                                    </p>
                                  )}
                                  {deviation.rejectedDate && (
                                    <p className="text-xs text-gray-500 mt-1">
                                      Rejected: {new Date(deviation.rejectedDate).toLocaleDateString()}
                                    </p>
                                  )}
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                        </h4>
                      </h4>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {dayPlans[selectedDate]?.length || 0} Activities
                      </span>
                    </div>

                    <div className="space-y-4">
                      {dayPlans[selectedDate]?.map((activity) => (
                        <div key={activity.id} className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                <Target className="w-5 h-5 text-purple-600" />
                              </div>
                              <div>
                              {/* Conversation History */}
                              {deviation.conversationHistory && deviation.conversationHistory.length > 0 && (
                                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                  <h5 className="font-medium text-gray-900 mb-3">Conversation History</h5>
                                  <div className="space-y-3">
                                    {deviation.conversationHistory.map((message) => (
                                      <div key={message.id} className={`p-3 rounded-lg ${
                                        message.from === 'MDO' ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-orange-50 border-l-4 border-orange-500'
                                      }`}>
                                        <div className="flex items-center justify-between mb-1">
                                          <span className={`text-sm font-medium ${
                                            message.from === 'MDO' ? 'text-blue-800' : 'text-orange-800'
                                          }`}>
                                            {message.from === 'MDO' ? 'Your Explanation' : 'TSM Remarks'}
                                          </span>
                                          <span className="text-xs text-gray-500">
                                            {new Date(message.timestamp).toLocaleDateString()} {new Date(message.timestamp).toLocaleTimeString()}
                                          </span>
                                        </div>
                                        <p className="text-sm text-gray-700">{message.message}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                                <h5 className="font-semibold text-gray-900">{activity.activityType}</h5>
                                <p className="text-sm text-gray-600">{activity.category}</p>
                              </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                              {activity.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="w-4 h-4 mr-2" />
                              <div>
                                <p className="font-medium">Village: {activity.village}</p>
                                <p className="text-xs">Location</p>
                              </div>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Building className="w-4 h-4 mr-2" />
                              <div>
                                <p className="font-medium">{activity.distributor}</p>
                                <p className="text-xs">Associated Distributor</p>
                              {/* TSM Requested Clarification - MDO Response */}
                              {deviation.status === 'Clarification Requested' && (
                                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                  <h5 className="font-medium text-orange-800 mb-2">TSM Requested Clarification</h5>
                                  <div className="bg-white rounded-lg p-3 mb-3 border border-orange-200">
                                    <p className="text-sm text-orange-700 italic">"{deviation.tsmRemarks}"</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      Asked on: {deviation.tsmRemarksDate && new Date(deviation.tsmRemarksDate).toLocaleDateString()} {deviation.tsmRemarksDate && new Date(deviation.tsmRemarksDate).toLocaleTimeString()}
                                    </p>
                                  </div>
                                  <textarea
                                    value={newMdoResponse[deviation.id] || ''}
                                    onChange={(e) => setNewMdoResponse(prev => ({ ...prev, [deviation.id]: e.target.value }))}
                                    placeholder="Provide additional clarification..."
                                    className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    rows={3}
                                  />
                                  <button
                                    onClick={() => handleMdoResponse(deviation.id)}
                                    disabled={!newMdoResponse[deviation.id]?.trim()}
                                    className="mt-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                  >
                                    Send Response
                                  </button>
                                </div>
                              )}
                              </div>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="w-4 h-4 mr-2" />
                              <div>
                                <p className="font-medium">{activity.time}</p>
                                <p className="text-xs">Duration: {activity.duration} min</p>
                              </div>
                            </div>
                          </div>

                          {/* Target Numbers */}
                          <div className="bg-blue-50 rounded-lg p-4 mb-4">
                            <h6 className="font-semibold text-blue-800 mb-3">Target Numbers</h6>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              {activity.targetNumbers.participants && (
                                <div className="text-center">
                                  <div className="text-lg font-bold text-blue-900">{activity.targetNumbers.participants}</div>
                                  <div className="text-xs text-blue-600">Participants</div>
                                </div>
                              )}
                              {activity.targetNumbers.dealers && (
                                <div className="text-center">
                                    <span className="text-xs text-green-600">
                                      {deviation.approvedDate && new Date(deviation.approvedDate).toLocaleDateString()}
                                    </span>
                                  <div className="text-lg font-bold text-blue-900">{activity.targetNumbers.dealers}</div>
                                  {deviation.tsmRemarks && (
                                    <div className="mt-2 p-2 bg-white rounded border border-green-200">
                                      <p className="text-sm text-green-700 italic">"{deviation.tsmRemarks}"</p>
                                    </div>
                                  )}
                                  <div className="text-xs text-blue-600">Dealers</div>
                                </div>
                              )}
                              {activity.targetNumbers.retailers && (
                                <div className="text-center">
                                  <div className="text-lg font-bold text-blue-900">{activity.targetNumbers.retailers}</div>
                                  <div className="text-xs text-blue-600">Retailers</div>
                                </div>
                              )}
                              {activity.targetNumbers.farmers && (
                                <div className="text-center">
                                  <div className="text-lg font-bold text-blue-900">{activity.targetNumbers.farmers}</div>
                                    <span className="text-xs text-red-600">
                                      {deviation.rejectedDate && new Date(deviation.rejectedDate).toLocaleDateString()}
                                    </span>
                                  <div className="text-xs text-blue-600">Farmers</div>
                                  {deviation.tsmRemarks && (
                                    <div className="mt-2 p-2 bg-white rounded border border-red-200">
                                      <p className="text-sm text-red-700 italic">"{deviation.tsmRemarks}"</p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Actual Numbers (if completed) */}
                          {activity.actualNumbers && (
                            <div className="bg-green-50 rounded-lg p-4 mb-4">
                              <h6 className="font-semibold text-green-800 mb-3">Actual Numbers Achieved</h6>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {activity.actualNumbers.participants && (
                                  <div className="text-center">
                                    <div className="text-lg font-bold text-green-900">{activity.actualNumbers.participants}</div>
                                    <div className="text-xs text-green-600">Participants</div>
                                    <div className="text-xs text-gray-500">
                                      ({Math.round((activity.actualNumbers.participants / (activity.targetNumbers.participants || 1)) * 100)}%)
                                    </div>
                                  </div>
                                )}
                                {activity.actualNumbers.dealers && (
                                  <div className="text-center">
                                    <div className="text-lg font-bold text-green-900">{activity.actualNumbers.dealers}</div>
                                    <div className="text-xs text-green-600">Dealers</div>
                                    <div className="text-xs text-gray-500">
                                      ({Math.round((activity.actualNumbers.dealers / (activity.targetNumbers.dealers || 1)) * 100)}%)
                                    </div>
                                  </div>
                                )}
                                {activity.actualNumbers.retailers && (
                                  <div className="text-center">
                                    <div className="text-lg font-bold text-green-900">{activity.actualNumbers.retailers}</div>
                                    <div className="text-xs text-green-600">Retailers</div>
                                    <div className="text-xs text-gray-500">
                                      ({Math.round((activity.actualNumbers.retailers / (activity.targetNumbers.retailers || 1)) * 100)}%)
                                    </div>
                                  </div>
                                )}
                                {activity.actualNumbers.farmers && (
                                  <div className="text-center">
                                    <div className="text-lg font-bold text-green-900">{activity.actualNumbers.farmers}</div>
                                    <div className="text-xs text-green-600">Farmers</div>
                                    <div className="text-xs text-gray-500">
                                      ({Math.round((activity.actualNumbers.farmers / (activity.targetNumbers.farmers || 1)) * 100)}%)
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          <div className="flex space-x-3">
                            {activity.status === 'Not Started' && (
                              <button
                                onClick={() => startActivity(activity.id)}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                              >
                                <Play className="w-4 h-4 mr-2" />
                                Start Activity
                              </button>
                            )}
                            {activity.status === 'In Progress' && (
                              <button
                                onClick={() => completeActivity(activity.id)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Complete
                              </button>
                            )}
                          </div>
                        </div>
                      )) || (
                        <div className="text-center py-8">
                          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">No activities planned for this date</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ALERTS Tab */}
          {activeTab === 'ALERTS' && (
            <div className="space-y-6">
              {/* Location Deviations */}
              <div className="bg-white rounded-xl p-6 card-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <MapPin className="w-5 h-5 text-red-600 mr-2" />
                    Location Deviations
                  </h3>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                    {locationDeviations.filter(d => d.status === 'Pending').length} Pending
                  </span>
                </div>

                <div className="space-y-4">
                  {locationDeviations.map((deviation) => (
                    <div key={deviation.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{deviation.activityType}</h4>
                          <p className="text-sm text-gray-600">{deviation.date} at {deviation.time}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          deviation.status === 'Approved' ? 'bg-green-100 text-green-800' :
                          deviation.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {deviation.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Assigned Location</p>
                          <p className="font-medium text-gray-900">{deviation.assignedLocation}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Actual Location</p>
                          <p className="font-medium text-blue-600">{deviation.actualLocation}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-1">Deviation: {deviation.deviation.toFixed(1)} km</p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              deviation.deviation <= 2 ? 'bg-green-500' :
                              deviation.deviation <= 5 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(100, (deviation.deviation / 10) * 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* MDO can only view status, not approve/reject */}
                      {deviation.status === 'Pending' && !deviation.remarks && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <h5 className="font-medium text-yellow-800 mb-2">Add Explanation</h5>
                          <textarea
                            placeholder="Explain the reason for location deviation..."
                            className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm"
                            rows={3}
                          />
                          <button className="mt-3 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center">
                            <FileText className="w-4 h-4 mr-2" />
                            Submit Explanation
                          </button>
                        </div>
                      )}
                      
                      {deviation.status !== 'Pending' && (
                        <div className={`p-3 rounded-lg ${
                          deviation.status === 'Approved' ? 'bg-green-50 border border-green-200' :
                          'bg-red-50 border border-red-200'
                        }`}>
                          <div className="flex items-center space-x-2">
                            {deviation.status === 'Approved' ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <X className="w-4 h-4 text-red-600" />
                            )}
                            <span className={`text-sm font-medium ${
                              deviation.status === 'Approved' ? 'text-green-800' : 'text-red-800'
                            }`}>
                              {deviation.status} by {deviation.approvedBy || 'TSM'}
                            </span>
                          </div>
                          {deviation.approvalDate && (
                            <p className="text-xs text-gray-600 mt-1">
                              on {new Date(deviation.approvalDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Location Deviations */}
          {locationDeviations.length > 0 && (
            <div className="bg-white rounded-xl p-6 card-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Location Deviations</h3>
              <div className="space-y-3">
                {locationDeviations.map((deviation) => (
                  <div key={deviation.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <span className="font-medium text-gray-900">
                          {deviation.deviation.toFixed(1)}km deviation
                        </span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDeviationStatusColor(deviation.status)}`}>
                        {deviation.status.charAt(0).toUpperCase() + deviation.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <p><strong>Assigned:</strong> {deviation.assignedLocation}</p>
                        <p><strong>Actual:</strong> {deviation.actualLocation}</p>
                      </div>
                      <div>
                        <p><strong>Date:</strong> {deviation.date} at {deviation.time}</p>
                        {deviation.approvedBy && (
                          <p><strong>Approved by:</strong> {deviation.approvedBy}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700"><strong>Remarks:</strong> {deviation.remarks}</p>
                      {deviation.approverComments && (
                        <p className="text-sm text-green-700 mt-1"><strong>Approver Comments:</strong> {deviation.approverComments}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Day-wise Activity Plans */}
          <div className="bg-white rounded-xl p-6 card-shadow">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Day-wise Activity Plans</h3>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-4">
              {getPlansForDate(selectedDate).map((plan) => (
                <div key={plan.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Activity className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{plan.activityType}</h4>
                        <p className="text-sm text-gray-600">{plan.village} • {plan.associatedDistributor}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(plan.status)}`}>
                      {plan.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{plan.startTime} - {plan.endTime} ({plan.duration} min)</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{plan.assignedLocation.address}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Building className="w-4 h-4 mr-2" />
                      <span>{plan.distributorCode}</span>
                    </div>
                  </div>

                  {/* Target Numbers */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h5 className="font-semibold text-gray-900 mb-3">Target Numbers</h5>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {plan.targetNumbers.participants && (
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-800">{plan.targetNumbers.participants}</div>
                          <div className="text-xs text-blue-600">Participants</div>
                        </div>
                      )}
                      {plan.targetNumbers.farmers && (
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-800">{plan.targetNumbers.farmers}</div>
                          <div className="text-xs text-green-600">Farmers</div>
                        </div>
                      )}
                      {plan.targetNumbers.dealers && (
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-800">{plan.targetNumbers.dealers}</div>
                          <div className="text-xs text-purple-600">Dealers</div>
                        </div>
                      )}
                      {plan.targetNumbers.volume && (
                        <div className="text-center">
                          <div className="text-lg font-bold text-orange-800">{plan.targetNumbers.volume}</div>
                          <div className="text-xs text-orange-600">Volume</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    {plan.status === 'Not Started' && (
                      <button
                        onClick={() => startActivity(plan.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start Activity
                      </button>
                    )}
                    {plan.status === 'In Progress' && (
                      <button
                        onClick={() => completeActivity(plan.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Complete Activity
                      </button>
                    )}
                    <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              ))}

              {getPlansForDate(selectedDate).length === 0 && (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No activities planned for this date</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reports Modal */}
      {showReportsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">MDO Reports</h2>
                <button
                  onClick={() => setShowReportsModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <button
                  onClick={() => generateReport('planned-vs-achieved')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">Planned vs Achieved</h3>
                  </div>
                  <p className="text-sm text-gray-600">Compare planned activities with actual completion</p>
                </button>

                <button
                  onClick={() => generateReport('ytd-totals')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-gray-900">YTD Totals</h3>
                  </div>
                  <p className="text-sm text-gray-600">Year-to-date activity summary</p>
                </button>

                <button
                  onClick={() => generateReport('region-wise')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <MapPin className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-gray-900">Region-wise Roll-ups</h3>
                  </div>
                  <p className="text-sm text-gray-600">Regional performance summary</p>
                </button>
              </div>

              {selectedReport && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {getReportData(selectedReport)?.title}
                  </h3>
                  
                  {selectedReport === 'planned-vs-achieved' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-blue-600">45</div>
                          <div className="text-sm text-gray-600">Total Planned</div>
                        </div>
                        <div className="bg-white rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-green-600">38</div>
                          <div className="text-sm text-gray-600">Total Completed</div>
                        </div>
                        <div className="bg-white rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-purple-600">84%</div>
                          <div className="text-sm text-gray-600">Completion Rate</div>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Category Breakdown</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Farmer BTL Engagement</span>
                            <span className="text-sm font-medium">26/30 (87%)</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Channel BTL Engagement</span>
                            <span className="text-sm font-medium">8/10 (80%)</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Internal Meetings</span>
                            <span className="text-sm font-medium">4/5 (80%)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedReport === 'ytd-totals' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">180</div>
                        <div className="text-sm text-gray-600">YTD Planned</div>
                      </div>
                      <div className="bg-white rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">152</div>
                        <div className="text-sm text-gray-600">YTD Completed</div>
                      </div>
                      <div className="bg-white rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600">84%</div>
                        <div className="text-sm text-gray-600">YTD Completion Rate</div>
                      </div>
                    </div>
                  )}

                  {selectedReport === 'region-wise' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">86%</div>
                        <div className="text-sm text-gray-600">Region Completion</div>
                      </div>
                      <div className="bg-white rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">12</div>
                        <div className="text-sm text-gray-600">Total MDOs</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Location Alert Modal */}
      {showLocationAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Location Deviation Detected</h3>
                  <p className="text-sm text-gray-600">
                    You are {locationDeviation.toFixed(1)}km away from the assigned location
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for deviation (required for approval)
                </label>
                <textarea
                  value={deviationRemarks}
                  onChange={(e) => setDeviationRemarks(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                  placeholder="Please explain why you need to perform this activity at a different location..."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleLocationApproval}
                  disabled={!deviationRemarks.trim()}
                  className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit for Approval
                </button>
                <button
                  onClick={() => setShowLocationAlert(false)}
                  className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MDOModule;