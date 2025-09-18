import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Edit
} from 'lucide-react';

interface ActivityData {
  monthly: {
    planned: number;
    done: number;
  };
  annual: {
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
  
  // Current user context - in real app this would come from auth
  const currentUserRole = 'MDO'; // This would come from auth context

  // Sample plan data with creator information
  const currentPlan = {
    id: 'PLAN-2024-01',
    title: 'January 2024 Monthly Plan',
    createdBy: 'Priya Sharma', // TSM name
    createdByRole: 'TSM',
    createdDate: '2024-01-15',
    approvedBy: 'Amit Patel', // RBH name
    approvedDate: '2024-01-16',
    status: 'Approved',
    period: 'January 2024'
  };

  // Sample activity data
  const activityData: ActivityData = {
    monthly: {
      planned: 45,
      done: 38
    },
    annual: {
      planned: 540,
      done: 456
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
      {/* Activity Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Monthly Activities */}
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
          
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{Math.round((activityData.monthly.done / activityData.monthly.planned) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${(activityData.monthly.done / activityData.monthly.planned) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Annual Activities */}
        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Annual Activities</h3>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-800">{activityData.annual.planned}</div>
              <div className="text-sm text-orange-600">Planned</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-800">{activityData.annual.done}</div>
              <div className="text-sm text-green-600">Done</div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{Math.round((activityData.annual.done / activityData.annual.planned) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${(activityData.annual.done / activityData.annual.planned) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

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
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-900">📋 Current Monthly Plan</p>
              <p className="text-xs text-blue-700 mt-1">{currentPlan.title}</p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              currentPlan.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {currentPlan.status}
            </span>
          </div>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-blue-700">
            <div>
              <span className="font-medium">Created by:</span> {currentPlan.createdBy} ({currentPlan.createdByRole})
            </div>
            <div>
              <span className="font-medium">Created on:</span> {new Date(currentPlan.createdDate).toLocaleDateString()}
            </div>
            {currentPlan.status === 'Approved' && (
              <>
                <div>
                  <span className="font-medium">Approved by:</span> {currentPlan.approvedBy}
                </div>
                <div>
                  <span className="font-medium">Approved on:</span> {new Date(currentPlan.approvedDate).toLocaleDateString()}
                </div>
              </>
            )}
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
            Overview
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