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
  Edit
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
  const [locationDeviation, setLocationDeviation] = useState<number>(0);
  const [deviationRemarks, setDeviationRemarks] = useState('');
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState('');
  const [showWorkPlan, setShowWorkPlan] = useState(false);

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

  // Sample day plans
  const dayPlans: { [key: string]: any[] } = {
    [selectedDate]: [
      {
        id: 'DP001',
        activityType: 'Farmer Meets – Small',
        category: 'Farmer BTL Engagement',
        village: 'Green Valley',
        distributor: 'SRI RAMA SEEDS',
        time: '09:00 - 11:00',
        duration: 120,
        status: 'Completed',
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
        }
      }
    ]
  };

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

  const startActivity = (activityId: string) => {
    setActiveVisit(activityId);
  };

  const completeActivity = (activityId: string) => {
    setActiveVisit(activityId);
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
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Not Started':
        return 'bg-gray-100 text-gray-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDeviationStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlansForDate = (date: string) => {
    return dailyPlans.filter(plan => plan.date === date);
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
            <p className="text-sm text-gray-600">Market Development Officer Dashboard</p>
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
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {new Date(selectedDate).toLocaleDateString('en-IN', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
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
                            <h5 className="font-semibold text-gray-900">{activity.activityType}</h5>
                            <p className="text-sm text-gray-600">{activity.category}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          activity.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          activity.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
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
                              <div className="text-lg font-bold text-blue-900">{activity.targetNumbers.dealers}</div>
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
                              <div className="text-xs text-blue-600">Farmers</div>
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
                        {activity.status === 'Scheduled' && (
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
                            Complete Activity
                          </button>
                        )}
                        <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                          View Details
                        </button>
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
                      <div className="text-xs text-orange-600">Volume (Kg)</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actual Numbers (if completed) */}
              {plan.actualNumbers && (
                <div className="bg-green-50 rounded-lg p-4 mb-4">
                  <h5 className="font-semibold text-green-900 mb-3">Actual Achievement</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {plan.actualNumbers.participants && (
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-800">{plan.actualNumbers.participants}</div>
                        <div className="text-xs text-green-600">Participants</div>
                        <div className="text-xs text-gray-500">
                          ({Math.round((plan.actualNumbers.participants / (plan.targetNumbers.participants || 1)) * 100)}%)
                        </div>
                      </div>
                    )}
                    {plan.actualNumbers.farmers && (
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-800">{plan.actualNumbers.farmers}</div>
                        <div className="text-xs text-green-600">Farmers</div>
                        <div className="text-xs text-gray-500">
                          ({Math.round((plan.actualNumbers.farmers / (plan.targetNumbers.farmers || 1)) * 100)}%)
                        </div>
                      </div>
                    )}
                    {plan.actualNumbers.volume && (
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-800">{plan.actualNumbers.volume}</div>
                        <div className="text-xs text-green-600">Volume (Kg)</div>
                        <div className="text-xs text-gray-500">
                          ({Math.round((plan.actualNumbers.volume / (plan.targetNumbers.volume || 1)) * 100)}%)
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Location Validation */}
              {plan.actualLocation && (
                <div className={`p-3 rounded-lg mb-4 ${
                  plan.actualLocation.isValid 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-center space-x-2 mb-1">
                    <MapPin className={`w-4 h-4 ${plan.actualLocation.isValid ? 'text-green-600' : 'text-red-600'}`} />
                    <span className={`text-sm font-medium ${plan.actualLocation.isValid ? 'text-green-800' : 'text-red-800'}`}>
                      Location: {plan.actualLocation.isValid ? 'Validated' : `${plan.actualLocation.deviation?.toFixed(1)}km deviation`}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Actual: {plan.actualLocation.address}
                  </p>
                </div>
              )}

              {plan.status === 'Not Started' && (
                <button
                  onClick={() => startVisit(plan.id)}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Start Activity
                </button>
              )}
            </div>
          ))}
        </div>

        {getPlansForDate(selectedDate).length === 0 && (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No activities planned for this date</p>
          </div>
        )}
      </div>

      {/* Visit Targets */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Visit Targets</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {visitTargets.map((target) => (
            <div key={target.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    target.type === 'Distributor' ? 'bg-blue-100' :
                    target.type === 'Retailer' ? 'bg-green-100' : 'bg-orange-100'
                  }`}>
                    {target.type === 'Distributor' ? <Building className="w-4 h-4 text-blue-600" /> :
                     target.type === 'Retailer' ? <Users className="w-4 h-4 text-green-600" /> :
                     <User className="w-4 h-4 text-orange-600" />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{target.name}</h4>
                    <p className="text-xs text-gray-600">{target.code}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  target.priority === 'High' ? 'bg-red-100 text-red-800' :
                  target.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {target.priority}
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <MapPin className="w-3 h-3 mr-2" />
                  <span>{target.location.address}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-3 h-3 mr-2" />
                  <span>{target.phone}</span>
                </div>
                <div className="flex items-center">
                  <Building className="w-3 h-3 mr-2" />
                  <span>{target.associatedDistributor}</span>
                </div>
              </div>

              <button
                onClick={() => startVisit(target.id)}
                className="w-full bg-purple-600 text-white py-2 px-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
              >
                <Navigation className="w-4 h-4 mr-2" />
                Start Visit
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Active Visit Modal */}
      {activeVisit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">MDO Visit Journey</h3>
                <p className="text-sm text-gray-600 mt-1">Complete your visit with proper documentation</p>
              </div>
              <button
                onClick={() => setActiveVisit(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-6">
                {/* Visit Type Selection */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Visit Type</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div 
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        visitType === 'Solo' 
                          ? 'border-purple-500 bg-purple-50' 
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                      onClick={() => setVisitType('Solo')}
                    >
                      <div className="text-center">
                        <User className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                        <h5 className="font-semibold text-gray-900">Solo Visit</h5>
                        <p className="text-sm text-gray-600">Independent visit by MDO</p>
                      </div>
                    </div>
                    
                    <div 
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        visitType === 'Accompanied' 
                          ? 'border-purple-500 bg-purple-50' 
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                      onClick={() => setVisitType('Accompanied')}
                    >
                      <div className="text-center">
                        <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                        <h5 className="font-semibold text-gray-900">Accompanied Visit</h5>
                        <p className="text-sm text-gray-600">With senior supervision</p>
                      </div>
                    </div>
                  </div>

                  {visitType === 'Accompanied' && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                      {[
                        { name: 'Priya Sharma', role: 'TSM' as const },
                        { name: 'Sunita Gupta', role: 'RMM' as const },
                        { name: 'Vikram Singh', role: 'ZH' as const }
                      ].map((senior, index) => (
                        <button
                          key={index}
                          onClick={() => setAccompaniedBy(senior)}
                          className={`p-3 rounded-lg border transition-colors ${
                            accompaniedBy?.name === senior.name
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-300 hover:border-purple-300'
                          }`}
                        >
                          <div className="text-center">
                            <div className="font-medium text-gray-900">{senior.name}</div>
                            <div className="text-sm text-gray-600">{senior.role}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Activity Selection */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Select Activity Type</h4>
                  <div className="space-y-4">
                    {Object.entries(activityCategories).map(([category, activities]) => (
                      <div key={category} className="bg-gray-50 rounded-xl p-4">
                        <h5 className="font-semibold text-gray-900 mb-3">{category}</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {activities.map((activity) => (
                            <button
                              key={activity}
                              onClick={() => setSelectedActivity(activity)}
                              className={`p-3 text-left rounded-lg border transition-colors ${
                                selectedActivity === activity
                                  ? 'border-purple-500 bg-purple-50'
                                  : 'border-gray-200 hover:border-purple-300 bg-white'
                              }`}
                            >
                              <div className="font-medium text-gray-900">{activity}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Activity Outcome */}
                {selectedActivity && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Activity Outcome</h4>
                    <select
                      value={activityOutcome}
                      onChange={(e) => setActivityOutcome(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-4"
                    >
                      <option value="">Select outcome...</option>
                      {activityOutcomes.map((outcome) => (
                        <option key={outcome} value={outcome}>{outcome}</option>
                      ))}
                    </select>
                    
                    <textarea
                      value={visitRemarks}
                      onChange={(e) => setVisitRemarks(e.target.value)}
                      placeholder="Add remarks about the activity..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>
                )}

                {/* Proof Upload */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Upload Proof</h4>
                  
                  {isCapturing && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center mb-4">
                      <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                      <p className="text-sm text-blue-800">Capturing with location and timestamp...</p>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <button 
                      onClick={() => handleProofCapture('photo')}
                      disabled={isCapturing || !latitude || !longitude}
                      className="bg-blue-600 text-white py-4 rounded-lg flex flex-col items-center disabled:opacity-50 hover:bg-blue-700 transition-colors"
                    >
                      <Camera className="w-6 h-6 mb-2" />
                      <span className="text-sm font-medium">Photo</span>
                    </button>
                    
                    <button 
                      onClick={() => handleProofCapture('video')}
                      disabled={isCapturing || !latitude || !longitude}
                      className="bg-purple-600 text-white py-4 rounded-lg flex flex-col items-center disabled:opacity-50 hover:bg-purple-700 transition-colors"
                    >
                      <Video className="w-6 h-6 mb-2" />
                      <span className="text-sm font-medium">Video</span>
                    </button>
                    
                    <button
                      onClick={() => handleProofCapture('signature')}
                      disabled={!latitude || !longitude}
                      className="bg-green-600 text-white py-4 rounded-lg flex flex-col items-center disabled:opacity-50 hover:bg-green-700 transition-colors"
                    >
                      <FileText className="w-6 h-6 mb-2" />
                      <span className="text-sm font-medium">Signature</span>
                    </button>
                  </div>

                  {/* Auto-Capture Info */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h5 className="font-semibold text-gray-900 mb-3">Auto-Captured Information</h5>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-600">Date:</span>
                          <span className="font-medium">{new Date().toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-600">Time:</span>
                          <span className="font-medium">{new Date().toLocaleTimeString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Person:</span>
                          <span className="font-medium">{user?.name} ({user?.role})</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-600">Latitude:</span>
                          <span className="font-medium">{latitude?.toFixed(6) || 'Getting...'}</span>
                        </div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-600">Longitude:</span>
                          <span className="font-medium">{longitude?.toFixed(6) || 'Getting...'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Accuracy:</span>
                          <span className="font-medium">±5m</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Uploaded Proofs */}
                  {uploadedProofs.length > 0 && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h5 className="font-semibold text-gray-900 mb-3">Uploaded Proofs ({uploadedProofs.length})</h5>
                      <div className="grid grid-cols-3 gap-3">
                        {uploadedProofs.map((proof) => (
                          <div key={proof.id} className="relative">
                            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border">
                              {proof.type === 'video' ? (
                                <div className="w-full h-full flex items-center justify-center bg-purple-100">
                                  <Video className="w-6 h-6 text-purple-600" />
                                </div>
                              ) : proof.type === 'signature' ? (
                                <div className="w-full h-full flex items-center justify-center bg-green-100">
                                  <FileText className="w-6 h-6 text-green-600" />
                                </div>
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-blue-100">
                                  <Camera className="w-6 h-6 text-blue-600" />
                                </div>
                              )}
                            </div>
                            <div className="absolute top-1 right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-2 h-2 text-white" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 p-6 border-t">
              <button
                onClick={() => setActiveVisit(null)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={completeVisit}
                disabled={!selectedActivity || !activityOutcome}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Complete Visit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Location Alert Modal */}
      {showLocationAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Location Deviation Detected</h3>
                  <p className="text-sm text-gray-600">You are {locationDeviation.toFixed(1)}km from assigned location</p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Explain reason for location deviation:
                </label>
                <textarea
                  value={deviationRemarks}
                  onChange={(e) => setDeviationRemarks(e.target.value)}
                  placeholder="Provide detailed explanation for the deviation..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows={3}
                  required
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-yellow-800">
                  This deviation will be sent to your supervisor for approval before the visit can proceed.
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowLocationAlert(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel Visit
                </button>
                <button
                  onClick={handleLocationApproval}
                  disabled={!deviationRemarks.trim()}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Submit for Approval
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reports Modal */}
      {showReportsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Activity Reports</h3>
                <p className="text-sm text-gray-600 mt-1">Comprehensive activity tracking and analysis</p>
              </div>
              <button
                onClick={() => setShowReportsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <button
                  onClick={() => generateReport('planned-vs-achieved')}
                  className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors text-left"
                >
                  <Target className="w-8 h-8 text-purple-600 mb-2" />
                  <h4 className="font-semibold text-gray-900">Planned vs Achieved</h4>
                  <p className="text-sm text-gray-600">Activity completion analysis</p>
                </button>
                
                <button
                  onClick={() => generateReport('ytd-totals')}
                  className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors text-left"
                >
                  <Calendar className="w-8 h-8 text-blue-600 mb-2" />
                  <h4 className="font-semibold text-gray-900">YTD Totals</h4>
                  <p className="text-sm text-gray-600">Year-to-date performance</p>
                </button>
                
                <button
                  onClick={() => generateReport('region-wise')}
                  className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors text-left"
                >
                  <MapPin className="w-8 h-8 text-green-600 mb-2" />
                  <h4 className="font-semibold text-gray-900">Region-wise Roll-ups</h4>
                  <p className="text-sm text-gray-600">Regional performance summary</p>
                </button>
              </div>

              {selectedReport && (
                <div className="bg-gray-50 rounded-xl p-6">
                  {(() => {
                    const reportData = getReportData(selectedReport);
                    if (!reportData) return null;

                    return (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">{reportData.title}</h4>
                        
                        {selectedReport === 'planned-vs-achieved' && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4 text-center">
                              <div className="bg-blue-100 rounded-lg p-4">
                                <div className="text-2xl font-bold text-blue-800">{reportData.data.totalPlanned}</div>
                                <div className="text-sm text-blue-600">Total Planned</div>
                              </div>
                              <div className="bg-green-100 rounded-lg p-4">
                                <div className="text-2xl font-bold text-green-800">{reportData.data.totalCompleted}</div>
                                <div className="text-sm text-green-600">Total Completed</div>
                              </div>
                              <div className="bg-purple-100 rounded-lg p-4">
                                <div className="text-2xl font-bold text-purple-800">{reportData.data.completionRate}%</div>
                                <div className="text-sm text-purple-600">Completion Rate</div>
                              </div>
                            </div>
                            
                            <div>
                              <h5 className="font-semibold text-gray-900 mb-3">Category Breakdown</h5>
                              {reportData.data.categoryBreakdown.map((cat: any) => (
                                <div key={cat.category} className="flex items-center justify-between py-2 border-b border-gray-200">
                                  <span className="text-gray-700">{cat.category}</span>
                                  <span className="font-medium">{cat.completed}/{cat.planned}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {selectedReport === 'ytd-totals' && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4 text-center">
                              <div className="bg-blue-100 rounded-lg p-4">
                                <div className="text-2xl font-bold text-blue-800">{reportData.data.ytdPlanned}</div>
                                <div className="text-sm text-blue-600">YTD Planned</div>
                              </div>
                              <div className="bg-green-100 rounded-lg p-4">
                                <div className="text-2xl font-bold text-green-800">{reportData.data.ytdCompleted}</div>
                                <div className="text-sm text-green-600">YTD Completed</div>
                              </div>
                              <div className="bg-purple-100 rounded-lg p-4">
                                <div className="text-2xl font-bold text-purple-800">{reportData.data.ytdCompletionRate}%</div>
                                <div className="text-sm text-purple-600">YTD Rate</div>
                              </div>
                            </div>
                          </div>
                        )}

                        {selectedReport === 'region-wise' && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-center">
                              <div className="bg-green-100 rounded-lg p-4">
                                <div className="text-2xl font-bold text-green-800">{reportData.data.regionCompletion}%</div>
                                <div className="text-sm text-green-600">Region Completion</div>
                              </div>
                              <div className="bg-blue-100 rounded-lg p-4">
                                <div className="text-2xl font-bold text-blue-800">{reportData.data.totalMDOs}</div>
                                <div className="text-sm text-blue-600">Total MDOs</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MDOModule;