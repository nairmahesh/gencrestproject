import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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
  Briefcase
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
  const [activeView, setActiveView] = useState<'overview' | 'schedule' | 'tasks'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
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
      notes: 'Product demonstration and stock verification'
    }
  ]);
  const { user } = useAuth();

  const currentUserRole = user?.role || 'MDO';

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
            Schedule & Tasks
          </button>
        </div>
      </div>

      {/* Content */}
      {activeView === 'overview' ? renderOverview() : renderScheduleAndTasks()}
    </div>
  );
};

export default MDOModule;