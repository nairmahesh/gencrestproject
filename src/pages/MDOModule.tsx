import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGeolocation } from '../hooks/useGeolocation';
import LiveMeetings from '../components/LiveMeetings';
import { 
  ArrowLeft, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Target, 
  TrendingUp,
  Users,
  MapPin,
  Plus,
  Filter,
  Search,
  Eye,
  Edit,
  Award,
  Activity,
  Building,
  Briefcase,
  Camera,
  Upload,
  FileText,
  Navigation,
  User,
  UserCheck,
  Save,
  X,
  Play,
  Pause,
  StopCircle
} from 'lucide-react';

interface WorkPlanData {
  id: string;
  title: string;
  period: string;
  createdBy: string;
  createdByRole: 'TSM' | 'RMM';
  createdDate: string;
  approvedBy?: string;
  approvedDate?: string;
  status: 'Draft' | 'Approved' | 'Active' | 'Completed';
  assignedToMDO: string;
  ytdActivities: {
    planned: number;
    done: number;
    percentage: number;
    startDate: string; // Date when TM assigned task
  };
  monthly: {
    planned: number;
    done: number;
    pendingPercentage: number;
    completedPercentage: number;
  };
  activityCategories: ActivityCategory[];
  dailyPlans: DailyPlan[];
}

interface DailyPlan {
  id: string;
  date: string;
  dayOfWeek: string;
  activities: DailyActivity[];
  totalTargetNumber: number;
  completedTargetNumber: number;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
}

interface DailyActivity {
  id: string;
  activityType: string;
  activityCategory: 'Internal Meetings' | 'Farmer BTL Engagement' | 'Channel BTL Engagement';
  village: string;
  associatedDistributor: string;
  distributorCode: string;
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
  startTime: string;
  endTime: string;
  estimatedDuration: number; // in minutes
  actualDuration?: number;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  location: {
    latitude?: number;
    longitude?: number;
    address: string;
  };
  notes?: string;
  proof?: {
    photos: string[];
    videos: string[];
    signatures: string[];
  };
}

interface ActivityCategory {
  category: string;
  activities: ActivityItem[];
  totalPlanned: number;
  totalDone: number;
}

interface ActivityItem {
  name: string;
  planned: number;
  done: number;
  status: 'Not Started' | 'In Progress' | 'Completed';
  lastUpdated?: string;
}

// Activity categories from the attachment
const MDO_ACTIVITY_CATEGORIES: { category: string; activities: string[] }[] = [
  {
    category: 'Internal Meetings',
    activities: ['Team Meetings']
  },
  {
    category: 'Farmer BTL Engagement',
    activities: [
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
    ]
  },
  {
    category: 'Channel BTL Engagement',
    activities: ['Trade Merchandise']
  }
];

interface ActivityData {
  monthly: {
    planned: number;
    done: number;
  };
}

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Overdue';
  priority: 'High' | 'Medium' | 'Low';
  type: 'Field Visit' | 'Report' | 'Training' | 'Meeting' | 'Follow-up';
  assignedBy: string;
  location?: string;
}

interface Schedule {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'Visit' | 'Meeting' | 'Training' | 'Demo' | 'Collection';
  location: string;
  participants?: string[];
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Rescheduled';
  notes?: string;
}

const MDOModule: React.FC = () => {
  const navigate = useNavigate();
  const { latitude, longitude, error: locationError } = useGeolocation();
  const [activeView, setActiveView] = useState<'overview' | 'schedule' | 'tasks'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedDate, setSelectedDate] = useState('2024-01-22');
  const [showDayDetails, setShowDayDetails] = useState<string | null>(null);
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [currentVisit, setCurrentVisit] = useState<any>(null);
  const [visitStep, setVisitStep] = useState<'start' | 'activity' | 'proof' | 'complete'>('start');
  const [selectedActivityType, setSelectedActivityType] = useState('');
  const [visitType, setVisitType] = useState<'Solo' | 'Accompanied'>('Solo');
  const [accompaniedBy, setAccompaniedBy] = useState('');
  const [activityOutcome, setActivityOutcome] = useState('');
  const [remarks, setRemarks] = useState('');
  const [uploadedProofs, setUploadedProofs] = useState<any[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [liveMeetings, setLiveMeetings] = useState([
    {
      id: 'LM001',
      participantName: 'Ram Kumar',
      participantRole: 'Distributor',
      location: 'Ram Kumar Farm',
      address: 'Green Valley, Sector 12',
      startTime: '10:45 AM',
      duration: 25,
      status: 'active' as const,
      type: 'Visit' as const,
      phone: '+91 98765 43210',
      notes: 'Product demonstration and stock verification',
      visitType: 'solo',
      autoCapture: {
        startTime: '10:45 AM',
        location: {
          latitude: 28.6139,
          longitude: 77.2090
        },
        systemTimestamp: 'SYS_20240122_104500'
      },
      locationValidation: {
        flagged: false
      }
    }
  ]);
  const { user } = useAuth();

  const currentUserRole = user?.role || 'MDO';

  // Available visit targets (retailers/farmers/distributors)
  const visitTargets = [
    { id: 'RET001', name: 'Green Agro Store', type: 'Retailer', location: 'Green Valley, Sector 12', distributor: 'SRI RAMA SEEDS' },
    { id: 'FARM001', name: 'Ram Kumar Farm', type: 'Farmer', location: 'Village Green Valley', distributor: 'Ram Kumar Distributors' },
    { id: 'DIST001', name: 'SRI RAMA SEEDS AND PESTICIDES', type: 'Distributor', location: 'Market Area, Sector 8', distributor: 'Self' },
    { id: 'RET002', name: 'Suresh Traders', type: 'Retailer', location: 'Industrial Area', distributor: 'Green Agro Solutions' }
  ];

  // Activity types from the categories
  const activityTypes = [
    'Team Meetings',
    'Farmer Meets – Small',
    'Farmer Meets – Large',
    'Farm level demos',
    'Wall Paintings',
    'Jeep Campaigns',
    'Field Days',
    'Distributor Day Training Program (25 dealers max)',
    'Retailer Day Training Program (50 retailers max)',
    'Distributor Connect Meeting (Overnight Stay)',
    'Dealer/Retailer Store Branding',
    'Trade Merchandise'
  ];

  // Activity outcomes (can be expanded later)
  const activityOutcomes = [
    'Successfully completed as planned',
    'Partially completed - weather issues',
    'Completed with higher participation than expected',
    'Rescheduled due to farmer unavailability',
    'Completed with additional product demonstration',
    'Exceeded target numbers',
    'Completed with follow-up required'
  ];

  const startVisit = (target: any) => {
    setCurrentVisit({
      ...target,
      startTime: new Date().toLocaleTimeString('en-IN'),
      startDate: new Date().toLocaleDateString('en-IN'),
      location: {
        latitude: latitude || 0,
        longitude: longitude || 0,
        address: target.location
      }
    });
    setVisitStep('start');
    setShowVisitModal(true);
  };

  const handleActivitySelection = () => {
    if (!selectedActivityType || !visitType || (visitType === 'Accompanied' && !accompaniedBy)) {
      alert('Please fill all required fields');
      return;
    }
    setVisitStep('activity');
  };

  const handleActivityCompletion = () => {
    if (!activityOutcome) {
      alert('Please select activity outcome');
      return;
    }
    setVisitStep('proof');
  };

  const handleProofUpload = (type: 'photo' | 'video' | 'signature') => {
    setIsCapturing(true);
    
    setTimeout(() => {
      const newProof = {
        id: `proof_${Date.now()}`,
        type,
        timestamp: new Date().toISOString(),
        location: {
          latitude: latitude || 0,
          longitude: longitude || 0
        },
        capturedBy: user?.name || 'MDO',
        url: `/placeholder-${type}.jpg`
      };
      
      setUploadedProofs(prev => [...prev, newProof]);
      setIsCapturing(false);
    }, 2000);
  };

  const completeVisit = () => {
    const visitData = {
      ...currentVisit,
      endTime: new Date().toLocaleTimeString('en-IN'),
      visitType,
      accompaniedBy: visitType === 'Accompanied' ? accompaniedBy : null,
      activityType: selectedActivityType,
      activityOutcome,
      remarks,
      proofs: uploadedProofs,
      autoCapture: {
        completedBy: user?.name || 'MDO',
        completedAt: new Date().toISOString(),
        systemTimestamp: new Date().toLocaleString('en-IN'),
        location: {
          latitude: latitude || 0,
          longitude: longitude || 0
        }
      }
    };
    
    console.log('Visit completed:', visitData);
    alert('Visit completed successfully! Data saved with auto-captured details.');
    
    // Reset form
    setShowVisitModal(false);
    setCurrentVisit(null);
    setVisitStep('start');
    setSelectedActivityType('');
    setVisitType('Solo');
    setAccompaniedBy('');
    setActivityOutcome('');
    setRemarks('');
    setUploadedProofs([]);
  };

  // Work Plan Assignment & Validation Data
  const workPlan: WorkPlanData = {
    id: 'AWP-2024-01',
    title: 'January 2024 Advanced Work Plan (AWP)',
    period: 'January 2024',
    createdBy: 'Priya Sharma', // TSM name (or RMM if TSM absent)
    createdByRole: 'TSM', // TSM creates AWP, RMM creates if TSM absent
    createdDate: '2024-01-10',
    approvedBy: 'Amit Patel', // RBH approves TSM plans
    approvedDate: '2024-01-12',
    status: 'Active',
    assignedToMDO: user?.name || 'Rajesh Kumar',
    ytdActivities: {
      planned: 240,
      done: 216,
      percentage: 90,
      startDate: '2024-01-12' // Date when TM assigned task
    },
    monthly: {
      planned: 45,
      done: 38,
      pendingPercentage: 16, // (45-38)/45 * 100
      completedPercentage: 84 // 38/45 * 100
    },
    activityCategories: [
      {
        category: 'Internal Meetings',
        totalPlanned: 4,
        totalDone: 4,
        activities: [
          { name: 'Team Meetings', planned: 4, done: 4, status: 'Completed', lastUpdated: '2024-01-20' }
        ]
      },
      {
        category: 'Farmer BTL Engagement',
        totalPlanned: 38,
        totalDone: 32,
        activities: [
          { name: 'Farmer Meets – Small', planned: 8, done: 7, status: 'In Progress', lastUpdated: '2024-01-19' },
          { name: 'Farmer Meets – Large', planned: 4, done: 4, status: 'Completed', lastUpdated: '2024-01-18' },
          { name: 'Farm level demos', planned: 12, done: 10, status: 'In Progress', lastUpdated: '2024-01-20' },
          { name: 'Wall Paintings', planned: 3, done: 3, status: 'Completed', lastUpdated: '2024-01-15' },
          { name: 'Jeep Campaigns', planned: 2, done: 2, status: 'Completed', lastUpdated: '2024-01-14' },
          { name: 'Field Days', planned: 3, done: 2, status: 'In Progress', lastUpdated: '2024-01-17' },
          { name: 'Distributor Day Training Program (25 dealers max)', planned: 2, done: 1, status: 'In Progress', lastUpdated: '2024-01-16' },
          { name: 'Retailer Day Training Program (50 retailers max)', planned: 2, done: 2, status: 'Completed', lastUpdated: '2024-01-13' },
          { name: 'Distributor Connect Meeting (Overnight Stay)', planned: 1, done: 1, status: 'Completed', lastUpdated: '2024-01-12' },
          { name: 'Dealer/Retailer Store Branding', planned: 1, done: 0, status: 'Not Started' }
        ]
      },
      {
        category: 'Channel BTL Engagement',
        totalPlanned: 3,
        totalDone: 2,
        activities: [
          { name: 'Trade Merchandise', planned: 3, done: 2, status: 'In Progress', lastUpdated: '2024-01-19' }
        ]
      }
    ],
    dailyPlans: [
      {
        id: 'DP001',
        date: '2024-01-22',
        dayOfWeek: 'Monday',
        totalTargetNumber: 45,
        completedTargetNumber: 35,
        status: 'Scheduled',
        activities: [
          {
            id: 'DA001',
            activityType: 'Farmer Meets – Small',
            activityCategory: 'Farmer BTL Engagement',
            village: 'Green Valley',
            associatedDistributor: 'SRI RAMA SEEDS AND PESTICIDES',
            distributorCode: '1325',
            targetNumbers: {
              farmers: 25,
              participants: 25,
              volume: 500,
              value: 50000
            },
            startTime: '10:00 AM',
            endTime: '12:00 PM',
            estimatedDuration: 120,
            status: 'Scheduled',
            location: {
              address: 'Green Valley Community Center, Sector 12'
            }
          },
          {
            id: 'DA002',
            activityType: 'Farm level demos',
            activityCategory: 'Farmer BTL Engagement',
            village: 'Sector 8',
            associatedDistributor: 'Ram Kumar Distributors',
            distributorCode: 'DLR001',
            targetNumbers: {
              farmers: 15,
              participants: 15,
              volume: 300,
              value: 30000
            },
            startTime: '2:30 PM',
            endTime: '4:30 PM',
            estimatedDuration: 120,
            status: 'Scheduled',
            location: {
              address: 'Ram Kumar Farm, Sector 8'
            }
          }
        ]
      },
      {
        id: 'DP002',
        date: '2024-01-23',
        dayOfWeek: 'Tuesday',
        totalTargetNumber: 50,
        completedTargetNumber: 50,
        status: 'Completed',
        activities: [
          {
            id: 'DA003',
            activityType: 'Distributor Day Training Program (25 dealers max)',
            activityCategory: 'Farmer BTL Engagement',
            village: 'Market Area',
            associatedDistributor: 'Green Agro Solutions',
            distributorCode: 'GAS001',
            targetNumbers: {
              dealers: 25,
              participants: 25,
              volume: 1000,
              value: 100000
            },
            actualNumbers: {
              dealers: 28,
              participants: 28,
              volume: 1200,
              value: 120000
            },
            startTime: '9:00 AM',
            endTime: '5:00 PM',
            estimatedDuration: 480,
            actualDuration: 510,
            status: 'Completed',
            location: {
              latitude: 28.6139,
              longitude: 77.2090,
              address: 'Green Agro Solutions Training Hall, Market Area'
            },
            notes: 'Exceeded target participation. Great response from dealers.',
            proof: {
              photos: ['training_session_1.jpg', 'group_photo.jpg'],
              videos: ['demo_video.mp4'],
              signatures: ['attendance_sheet.pdf']
            }
          }
        ]
      },
      {
        id: 'DP003',
        date: '2024-01-24',
        dayOfWeek: 'Wednesday',
        totalTargetNumber: 30,
        completedTargetNumber: 25,
        status: 'In Progress',
        activities: [
          {
            id: 'DA004',
            activityType: 'Wall Paintings',
            activityCategory: 'Farmer BTL Engagement',
            village: 'Industrial Area',
            associatedDistributor: 'SRI RAMA SEEDS AND PESTICIDES',
            distributorCode: '1325',
            targetNumbers: {
              participants: 10,
              volume: 200,
              value: 15000
            },
            actualNumbers: {
              participants: 8,
              volume: 160,
              value: 12000
            },
            startTime: '8:00 AM',
            endTime: '11:00 AM',
            estimatedDuration: 180,
            actualDuration: 165,
            status: 'Completed',
            location: {
              latitude: 28.4089,
              longitude: 77.3178,
              address: 'Industrial Area Main Road'
            },
            proof: {
              photos: ['wall_painting_before.jpg', 'wall_painting_after.jpg'],
              videos: [],
              signatures: ['completion_certificate.pdf']
            }
          },
          {
            id: 'DA005',
            activityType: 'Team Meetings',
            activityCategory: 'Internal Meetings',
            village: 'Regional Office',
            associatedDistributor: 'N/A',
            distributorCode: 'N/A',
            targetNumbers: {
              participants: 5
            },
            startTime: '2:00 PM',
            endTime: '3:00 PM',
            estimatedDuration: 60,
            status: 'Scheduled',
            location: {
              address: 'Regional Office Conference Room'
            }
          }
        ]
      }
    ]
  };

  // Sample activity data
  const activityData: ActivityData = {
    monthly: {
      planned: workPlan.monthly.planned,
      done: workPlan.monthly.done
    }
  };

  // Sample tasks data
  const tasks: Task[] = [
    {
      id: '1',
      title: 'Visit SRI RAMA SEEDS',
      description: 'Stock verification and liquidation tracking',
      dueDate: '2024-01-22',
      status: 'Pending',
      priority: 'High',
      type: 'Field Visit',
      assignedBy: 'TSM001',
      location: 'North Delhi'
    },
    {
      id: '2',
      title: 'Monthly Sales Report',
      description: 'Prepare and submit monthly sales performance report',
      dueDate: '2024-01-25',
      status: 'In Progress',
      priority: 'Medium',
      type: 'Report',
      assignedBy: 'RMM001'
    },
    {
      id: '3',
      title: 'Product Training Session',
      description: 'Attend new product training for fertilizers',
      dueDate: '2024-01-20',
      status: 'Completed',
      priority: 'Medium',
      type: 'Training',
      assignedBy: 'TMM001',
      location: 'Regional Office'
    }
  ];

  // Sample schedule data
  const schedules: Schedule[] = [
    {
      id: '1',
      title: 'Dealer Meeting - Ram Kumar',
      date: '2024-01-22',
      time: '10:00 AM',
      type: 'Meeting',
      location: 'Green Valley, Sector 12',
      participants: ['Ram Kumar', 'Store Manager'],
      status: 'Scheduled',
      notes: 'Discuss Q1 targets and new product launch'
    },
    {
      id: '2',
      title: 'Product Demo at Suresh Traders',
      date: '2024-01-23',
      time: '2:30 PM',
      type: 'Demo',
      location: 'Market Area, Sector 8',
      status: 'Scheduled'
    },
    {
      id: '3',
      title: 'Collection Visit - Amit Agro',
      date: '2024-01-21',
      time: '11:00 AM',
      type: 'Collection',
      location: 'Industrial Area',
      status: 'Completed',
      notes: 'Collected ₹25,000 outstanding payment'
    }
  ];

  const handleEndMeeting = (meetingId: string) => {
    setLiveMeetings(prev => prev.filter(meeting => meeting.id !== meetingId));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'text-green-700 bg-green-100';
      case 'In Progress':
      case 'Scheduled':
        return 'text-blue-700 bg-blue-100';
      case 'Pending':
        return 'text-yellow-700 bg-yellow-100';
      case 'Overdue':
      case 'Cancelled':
        return 'text-red-700 bg-red-100';
      case 'Rescheduled':
        return 'text-purple-700 bg-purple-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'text-red-700 bg-red-100';
      case 'Medium':
        return 'text-yellow-700 bg-yellow-100';
      case 'Low':
        return 'text-green-700 bg-green-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Field Visit':
      case 'Visit':
        return <MapPin className="w-4 h-4" />;
      case 'Meeting':
        return <Users className="w-4 h-4" />;
      case 'Training':
        return <Target className="w-4 h-4" />;
      case 'Report':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || task.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = schedule.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || schedule.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Quick Visit Actions */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Start Visit</h3>
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <Navigation className="w-5 h-5 text-green-600" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visitTargets.map((target) => (
            <div key={target.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{target.name}</h4>
                  <p className="text-sm text-gray-600">{target.type}</p>
                  <p className="text-xs text-gray-500">{target.location}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  target.type === 'Distributor' ? 'bg-blue-100 text-blue-800' :
                  target.type === 'Retailer' ? 'bg-purple-100 text-purple-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {target.type}
                </span>
              </div>
              
              <div className="text-xs text-gray-500 mb-3">
                Associated: {target.distributor}
              </div>
              
              <button
                onClick={() => startVisit(target)}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                <Navigation className="w-4 h-4 mr-2" />
                Start Visit
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Work Plan Assignment & Validation */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Work Plan Assignment & Validation</h3>
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-blue-900">📋 {workPlan.title}</p>
              <p className="text-xs text-blue-700 mt-1">Period: {workPlan.period}</p>
              <p className="text-xs text-blue-600">
                Created by: {workPlan.createdBy} ({workPlan.createdByRole})
                {workPlan.createdByRole === 'RMM' && (
                  <span className="text-orange-600 ml-1">(TSM Absent)</span>
                )}
              </p>
            </div>
            <div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                workPlan.status === 'Active' ? 'bg-green-100 text-green-800' : 
                workPlan.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {workPlan.status}
              </span>
              {workPlan.status === 'Active' && workPlan.approvedBy && (
                <div className="text-xs text-blue-700 mt-2">
                  <div>Approved by: {workPlan.approvedBy}</div>
                  <div>Approved on: {new Date(workPlan.approvedDate!).toLocaleDateString()}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* YTD Activities Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-purple-900">Total Activities YTD</h4>
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-orange-100 rounded-lg">
                <div className="text-2xl font-bold text-orange-800">{workPlan.ytdActivities.planned}</div>
                <div className="text-sm text-orange-600">Planned</div>
                <div className="text-xs text-gray-500 mt-1">Since {new Date(workPlan.ytdActivities.startDate).toLocaleDateString()}</div>
              </div>
              <div className="text-center p-4 bg-green-100 rounded-lg">
                <div className="text-2xl font-bold text-green-800">{workPlan.ytdActivities.done}</div>
                <div className="text-sm text-green-600">Done</div>
                <div className="text-xs text-gray-500 mt-1">{workPlan.ytdActivities.percentage}% Complete</div>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between text-sm text-purple-600 mb-2">
                <span>YTD Progress</span>
                <span>{workPlan.ytdActivities.percentage}%</span>
              </div>
              <div className="w-full bg-purple-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${workPlan.ytdActivities.percentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-blue-900">Monthly Activity</h4>
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-orange-100 rounded-lg">
                <div className="text-2xl font-bold text-orange-800">{workPlan.monthly.planned}</div>
                <div className="text-sm text-orange-600">Planned</div>
              </div>
              <div className="text-center p-4 bg-green-100 rounded-lg">
                <div className="text-2xl font-bold text-green-800">{workPlan.monthly.done}</div>
                <div className="text-sm text-green-600">Done</div>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-red-600">{workPlan.monthly.pendingPercentage}%</div>
                <div className="text-xs text-red-600">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">{workPlan.monthly.completedPercentage}%</div>
                <div className="text-xs text-green-600">Completed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Categories Breakdown */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Activity Categories & Progress</h4>
          <div className="space-y-4">
            {workPlan.activityCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-semibold text-gray-900">{category.category}</h5>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      {category.totalDone}/{category.totalPlanned} activities
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      category.totalDone === category.totalPlanned ? 'bg-green-100 text-green-800' :
                      category.totalDone > 0 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {Math.round((category.totalDone / category.totalPlanned) * 100)}%
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {category.activities.map((activity, activityIndex) => (
                    <div key={activityIndex} className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">{activity.name}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          activity.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          activity.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {activity.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-center p-2 bg-orange-50 rounded">
                          <div className="font-bold text-orange-800">{activity.planned}</div>
                          <div className="text-xs text-orange-600">Planned</div>
                        </div>
                        <div className="text-center p-2 bg-green-50 rounded">
                          <div className="font-bold text-green-800">{activity.done}</div>
                          <div className="text-xs text-green-600">Done</div>
                        </div>
                      </div>
                      
                      {activity.lastUpdated && (
                        <div className="text-xs text-gray-500 mt-2">
                          Last updated: {new Date(activity.lastUpdated).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Summary Cards - Updated */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Monthly Activities Summary */}
        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Activities</h3>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-800">{activityData.monthly.planned}</div>
              <div className="text-sm text-orange-600">Planned</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-800">{activityData.monthly.done}</div>
              <div className="text-sm text-green-600">Done</div>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="text-center p-2 bg-red-50 rounded-lg">
              <div className="text-lg font-bold text-red-600">{workPlan.monthly.pendingPercentage}%</div>
              <div className="text-xs text-red-600">Pending</div>
            </div>
            <div className="text-center p-2 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">{workPlan.monthly.completedPercentage}%</div>
              <div className="text-xs text-green-600">Completed</div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{workPlan.monthly.completedPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${workPlan.monthly.completedPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Category Performance */}
        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Category Performance</h3>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          
          <div className="space-y-3">
            {workPlan.activityCategories.map((category, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{category.category}</p>
                  <p className="text-sm text-gray-600">{category.activities.length} activities</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{category.totalDone}/{category.totalPlanned}</p>
                  <p className="text-xs text-gray-600">
                    {Math.round((category.totalDone / category.totalPlanned) * 100)}% Complete
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Meetings */}
      <LiveMeetings 
        meetings={liveMeetings}
        onEndMeeting={handleEndMeeting}
        userRole="MDO"
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 card-shadow text-center">
          <div className="text-xl font-bold text-blue-600">{tasks.filter(t => t.status === 'Pending').length}</div>
          <div className="text-sm text-gray-600">Pending Tasks</div>
        </div>
        <div className="bg-white rounded-xl p-4 card-shadow text-center">
          <div className="text-xl font-bold text-green-600">{schedules.filter(s => s.status === 'Scheduled').length}</div>
          <div className="text-sm text-gray-600">Scheduled</div>
        </div>
        <div className="bg-white rounded-xl p-4 card-shadow text-center">
          <div className="text-xl font-bold text-yellow-600">{tasks.filter(t => t.status === 'In Progress').length}</div>
          <div className="text-sm text-gray-600">In Progress</div>
        </div>
        <div className="bg-white rounded-xl p-4 card-shadow text-center">
          <div className="text-xl font-bold text-purple-600">{tasks.filter(t => t.status === 'Completed').length + schedules.filter(s => s.status === 'Completed').length}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
        <div className="space-y-3">
          {[...tasks.slice(0, 2), ...schedules.slice(0, 2)].map((item, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                {getTypeIcon('type' in item ? item.type : 'Visit')}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.title}</p>
                <p className="text-sm text-gray-600">
                  {'dueDate' in item ? `Due: ${new Date(item.dueDate).toLocaleDateString()}` : 
                   `${item.date} at ${item.time}`}
                </p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderScheduleAndTasks = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tasks and schedules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Tasks Section */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Tasks</h3>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </button>
        </div>
        
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <div key={task.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    {getTypeIcon(task.type)}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{task.title}</h4>
                    <p className="text-sm text-gray-600">{task.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-4">
                  <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                  {task.location && (
                    <span className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {task.location}
                    </span>
                  )}
                  <span>Assigned by: {task.assignedBy}</span>
                </div>
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-800">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="text-gray-600 hover:text-gray-800">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule Section */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Schedule</h3>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add Schedule
          </button>
        </div>
        
        <div className="space-y-3">
          {filteredSchedules.map((schedule) => (
            <div key={schedule.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    {getTypeIcon(schedule.type)}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{schedule.title}</h4>
                    <p className="text-sm text-gray-600">{schedule.date} at {schedule.time}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(schedule.status)}`}>
                  {schedule.status}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {schedule.location}
                  </span>
                  {schedule.participants && (
                    <span className="flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      {schedule.participants.length} participants
                    </span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-800">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="text-gray-600 hover:text-gray-800">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {schedule.notes && (
                <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-700">
                  {schedule.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">MDO Module</h1>
            <p className="text-gray-600 mt-1">View your activities, tasks, and schedules</p>
          </div>
        </div>
        {/* Note: MDO cannot create plans - only TSM can create plans for MDO */}
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm font-medium text-green-900">✅ Advanced Work Plan (AWP) Active</p>
            <p className="text-xs text-green-700 mt-1">
              Created by {workPlan.createdBy} ({workPlan.createdByRole})
              {workPlan.createdByRole === 'RMM' && (
                <span className="text-orange-600 ml-1">(TSM Absent)</span>
              )}
            </p>
            <p className="text-xs text-green-600 mt-1">
              {workPlan.monthly.completedPercentage}% monthly completion • {workPlan.ytdActivities.percentage}% YTD completion
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl p-2 card-shadow">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveView('overview')}
            className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
              activeView === 'overview'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Work Plan & Overview
          </button>
          <button
            onClick={() => setActiveView('schedule')}
            className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
              activeView === 'schedule'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Daily Plans & Tasks
          </button>
        </div>
      </div>

      {/* Content */}
      {activeView === 'overview' ? renderOverview() : renderScheduleAndTasks()}

      {/* Visit Journey Modal */}
      {showVisitModal && currentVisit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {visitStep === 'start' ? 'Start Visit' :
                   visitStep === 'activity' ? 'Activity Details' :
                   visitStep === 'proof' ? 'Upload Proof' :
                   'Complete Visit'}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {currentVisit.name} - {currentVisit.type}
                </p>
              </div>
              <button
                onClick={() => setShowVisitModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {/* Step 1: Visit Start */}
              {visitStep === 'start' && (
                <div className="space-y-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Visit Details</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-blue-600">Target:</span>
                        <span className="font-medium ml-2">{currentVisit.name}</span>
                      </div>
                      <div>
                        <span className="text-blue-600">Type:</span>
                        <span className="font-medium ml-2">{currentVisit.type}</span>
                      </div>
                      <div>
                        <span className="text-blue-600">Location:</span>
                        <span className="font-medium ml-2">{currentVisit.location}</span>
                      </div>
                      <div>
                        <span className="text-blue-600">Start Time:</span>
                        <span className="font-medium ml-2">{currentVisit.startTime}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Visit Type *
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setVisitType('Solo')}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          visitType === 'Solo' 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-gray-200 hover:border-green-300'
                        }`}
                      >
                        <User className="w-6 h-6 mx-auto mb-2 text-green-600" />
                        <div className="text-center">
                          <div className="font-medium">Solo Visit</div>
                          <div className="text-xs text-gray-600">Independent visit</div>
                        </div>
                      </button>
                      
                      <button
                        onClick={() => setVisitType('Accompanied')}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          visitType === 'Accompanied' 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <Users className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                        <div className="text-center">
                          <div className="font-medium">Accompanied</div>
                          <div className="text-xs text-gray-600">With senior</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {visitType === 'Accompanied' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Accompanied by *
                      </label>
                      <select
                        value={accompaniedBy}
                        onChange={(e) => setAccompaniedBy(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="">Select senior person</option>
                        <option value="TSM">TSM - Territory Sales Manager</option>
                        <option value="RMM">RMM - Regional Marketing Manager</option>
                        <option value="ZH">ZH - Zonal Head</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Activity Type *
                    </label>
                    <select
                      value={selectedActivityType}
                      onChange={(e) => setSelectedActivityType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Select activity type</option>
                      {activityTypes.map((activity) => (
                        <option key={activity} value={activity}>{activity}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleActivitySelection}
                      className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Start Activity
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Activity Execution */}
              {visitStep === 'activity' && (
                <div className="space-y-6">
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-900 mb-2">Activity in Progress</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-purple-600">Activity:</span>
                        <span className="font-medium ml-2">{selectedActivityType}</span>
                      </div>
                      <div>
                        <span className="text-purple-600">Visit Type:</span>
                        <span className="font-medium ml-2">{visitType}</span>
                      </div>
                      {accompaniedBy && (
                        <div>
                          <span className="text-purple-600">With:</span>
                          <span className="font-medium ml-2">{accompaniedBy}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-purple-600">Duration:</span>
                        <span className="font-medium ml-2">In progress...</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Activity Outcome *
                    </label>
                    <select
                      value={activityOutcome}
                      onChange={(e) => setActivityOutcome(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Select outcome</option>
                      {activityOutcomes.map((outcome) => (
                        <option key={outcome} value={outcome}>{outcome}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Remarks
                    </label>
                    <textarea
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="Add any additional notes or observations..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleActivityCompletion}
                      className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Complete Activity
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Proof Upload */}
              {visitStep === 'proof' && (
                <div className="space-y-6">
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 mb-2">Upload Proof</h4>
                    <p className="text-sm text-green-700">
                      All proofs will be automatically tagged with date, time, location, and your details
                    </p>
                  </div>

                  {isCapturing && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                      <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                      <p className="text-sm text-blue-800">Capturing with location and timestamp...</p>
                    </div>
                  )}

                  {/* Location & Time Status */}
                  <div className={`p-4 rounded-lg border ${
                    latitude && longitude 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MapPin className={`w-4 h-4 ${latitude && longitude ? 'text-green-600' : 'text-red-600'}`} />
                        <span className={`text-sm font-medium ${latitude && longitude ? 'text-green-800' : 'text-red-800'}`}>
                          {latitude && longitude 
                            ? `Location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
                            : 'Location access required'
                          }
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className={`w-4 h-4 ${latitude && longitude ? 'text-green-600' : 'text-red-600'}`} />
                        <span className={`text-sm ${latitude && longitude ? 'text-green-700' : 'text-red-700'}`}>
                          {new Date().toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Proof Upload Options */}
                  <div className="grid grid-cols-3 gap-4">
                    <button 
                      onClick={() => handleProofUpload('photo')}
                      disabled={isCapturing || !latitude || !longitude}
                      className="bg-blue-600 text-white py-6 rounded-lg flex flex-col items-center disabled:opacity-50 hover:bg-blue-700 transition-colors"
                    >
                      <Camera className="w-8 h-8 mb-2" />
                      <span className="font-medium">Photo</span>
                      <span className="text-xs opacity-90">With geo-tag</span>
                    </button>
                    
                    <button 
                      onClick={() => handleProofUpload('video')}
                      disabled={isCapturing || !latitude || !longitude}
                      className="bg-purple-600 text-white py-6 rounded-lg flex flex-col items-center disabled:opacity-50 hover:bg-purple-700 transition-colors"
                    >
                      <Play className="w-8 h-8 mb-2" />
                      <span className="font-medium">Video</span>
                      <span className="text-xs opacity-90">With timestamp</span>
                    </button>
                    
                    <button
                      onClick={() => handleProofUpload('signature')}
                      disabled={!latitude || !longitude}
                      className="bg-green-600 text-white py-6 rounded-lg flex flex-col items-center disabled:opacity-50 hover:bg-green-700 transition-colors"
                    >
                      <FileText className="w-8 h-8 mb-2" />
                      <span className="font-medium">Signature</span>
                      <span className="text-xs opacity-90">Digital capture</span>
                    </button>
                  </div>

                  {/* Uploaded Proofs */}
                  {uploadedProofs.length > 0 && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h5 className="font-semibold text-gray-900 mb-3">
                        Uploaded Proofs ({uploadedProofs.length})
                      </h5>
                      <div className="grid grid-cols-3 gap-3">
                        {uploadedProofs.map((proof) => (
                          <div key={proof.id} className="text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                              {proof.type === 'photo' && <Camera className="w-6 h-6 text-blue-600" />}
                              {proof.type === 'video' && <Play className="w-6 h-6 text-purple-600" />}
                              {proof.type === 'signature' && <FileText className="w-6 h-6 text-green-600" />}
                            </div>
                            <p className="text-xs font-medium capitalize">{proof.type}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(proof.timestamp).toLocaleTimeString('en-IN')}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <button
                      onClick={() => setVisitStep('activity')}
                      className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setVisitStep('complete')}
                      className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Complete Visit */}
              {visitStep === 'complete' && (
                <div className="space-y-6">
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 mb-4">Visit Summary</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div>
                          <span className="text-green-600">Target:</span>
                          <span className="font-medium ml-2">{currentVisit.name}</span>
                        </div>
                        <div>
                          <span className="text-green-600">Activity:</span>
                          <span className="font-medium ml-2">{selectedActivityType}</span>
                        </div>
                        <div>
                          <span className="text-green-600">Visit Type:</span>
                          <span className="font-medium ml-2">{visitType}</span>
                        </div>
                        {accompaniedBy && (
                          <div>
                            <span className="text-green-600">With:</span>
                            <span className="font-medium ml-2">{accompaniedBy}</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div>
                          <span className="text-green-600">Start:</span>
                          <span className="font-medium ml-2">{currentVisit.startTime}</span>
                        </div>
                        <div>
                          <span className="text-green-600">End:</span>
                          <span className="font-medium ml-2">{new Date().toLocaleTimeString('en-IN')}</span>
                        </div>
                        <div>
                          <span className="text-green-600">Proofs:</span>
                          <span className="font-medium ml-2">{uploadedProofs.length} uploaded</span>
                        </div>
                        <div>
                          <span className="text-green-600">Location:</span>
                          <span className="font-medium ml-2">Verified</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <h5 className="font-semibold text-blue-900 mb-2">Auto-Captured Data</h5>
                    <div className="text-sm text-blue-800 space-y-1">
                      <div>✓ Date & Time: {new Date().toLocaleString('en-IN')}</div>
                      <div>✓ Person: {user?.name} ({user?.role})</div>
                      <div>✓ Location: {latitude?.toFixed(6)}, {longitude?.toFixed(6)}</div>
                      <div>✓ System Timestamp: Auto-generated</div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-900 mb-2">Activity Outcome</h5>
                    <p className="text-sm text-gray-700">{activityOutcome}</p>
                    {remarks && (
                      <div className="mt-2">
                        <span className="text-sm font-medium text-gray-700">Remarks:</span>
                        <p className="text-sm text-gray-600 mt-1">{remarks}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={() => setVisitStep('proof')}
                      className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Back to Proof
                    </button>
                    <button
                      onClick={completeVisit}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Complete Visit
                    </button>
                  </div>
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