import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGeolocation } from '../hooks/useGeolocation';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Target,
  Users,
  Activity,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Plus,
  Edit,
  Save,
  X,
  Bell,
  Navigation,
  Phone,
  Camera,
  FileText
} from 'lucide-react';

interface WorkActivity {
  id: string;
  date: string;
  time: string;
  activityType: string;
  village: string;
  distributor: string;
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
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  assignedLocation: string;
  actualLocation?: string;
  locationDeviation?: number;
  hasLocationDeviation?: boolean;
  deviationExplanation?: string;
  deviationStatus?: 'Pending' | 'Approved' | 'Rejected';
  approvedBy?: string;
  approvedDate?: string;
}

interface LocationDeviation {
  id: string;
  activityId: string;
  activityType: string;
  date: string;
  time: string;
  assignedLocation: string;
  actualLocation: string;
  deviation: number;
  isValid: boolean;
  status: 'Pending' | 'Approved' | 'Rejected';
  remarks?: string;
  submittedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  rejectionReason?: string;
}

const MDOModule: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { latitude, longitude } = useGeolocation();
  const [activeTab, setActiveTab] = useState('Overview');
  const [showWorkPlan, setShowWorkPlan] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [newRemarks, setNewRemarks] = useState<Record<string, string>>({});

  // Sample work activities
  const [workActivities, setWorkActivities] = useState<WorkActivity[]>([
    {
      id: 'WA001',
      date: '2024-01-20',
      time: '10:00 AM',
      activityType: 'Farmer Meets – Small',
      village: 'Green Valley',
      distributor: 'Ram Kumar Distributors',
      assignedLocation: 'Green Valley, Sector 12',
      actualLocation: 'Sector 15 Community Hall',
      locationDeviation: 6.2,
      hasLocationDeviation: true,
      deviationExplanation: 'Venue changed due to local festival, community hall was more accessible for farmers',
      deviationStatus: 'Approved',
      approvedBy: 'Priya Sharma (TSM)',
      approvedDate: '2024-01-21',
      targetNumbers: {
        farmers: 25,
        volume: 500,
        value: 50000
      },
      actualNumbers: {
        farmers: 28,
        volume: 520,
        value: 52000
      },
      status: 'Completed'
    },
    {
      id: 'WA002',
      date: '2024-01-21',
      time: '2:00 PM',
      activityType: 'Farm level demos',
      village: 'Sector 8',
      distributor: 'Suresh Traders',
      assignedLocation: 'Sector 8 Market',
      actualLocation: 'Sector 9 Farm',
      locationDeviation: 3.8,
      hasLocationDeviation: true,
      deviationStatus: 'Pending',
      targetNumbers: {
        farmers: 15,
        volume: 200,
        value: 20000
      },
      status: 'Scheduled'
    },
    {
      id: 'WA003',
      date: '2024-01-22',
      time: '11:00 AM',
      activityType: 'Retailer Day Training Program',
      village: 'Industrial Area',
      distributor: 'Amit Agro Solutions',
      assignedLocation: 'Industrial Area Training Center',
      targetNumbers: {
        retailers: 50,
        volume: 1000,
        value: 100000
      },
      status: 'Scheduled'
    }
  ]);

  // Location deviations for ALERTS tab
  const locationDeviations: LocationDeviation[] = workActivities
    .filter(activity => activity.hasLocationDeviation)
    .map(activity => ({
      id: `DEV_${activity.id}`,
      activityId: activity.id,
      activityType: activity.activityType,
      date: activity.date,
      time: activity.time,
      assignedLocation: activity.assignedLocation,
      actualLocation: activity.actualLocation || '',
      deviation: activity.locationDeviation || 0,
      isValid: (activity.locationDeviation || 0) <= 5,
      status: activity.deviationStatus || 'Pending',
      remarks: activity.deviationExplanation,
      submittedDate: activity.date,
      approvedBy: activity.approvedBy,
      approvedDate: activity.approvedDate
    }));

  const pendingAlertsCount = locationDeviations.filter(d => d.status === 'Pending').length;

  const completeActivity = (activityId: string) => {
    setWorkActivities(prev => prev.map(activity => 
      activity.id === activityId 
        ? { ...activity, status: 'Completed' as const }
        : activity
    ));
  };

  const submitRemarks = (deviationId: string) => {
    const remarks = newRemarks[deviationId];
    if (!remarks?.trim()) return;

    setWorkActivities(prev => prev.map(activity => {
      const deviation = locationDeviations.find(d => d.id === deviationId);
      if (deviation && activity.id === deviation.activityId) {
        return {
          ...activity,
          deviationExplanation: remarks,
          deviationStatus: 'Pending' as const
        };
      }
      return activity;
    }));

    setNewRemarks(prev => ({ ...prev, [deviationId]: '' }));
  };

  const tabs = [
    { id: 'Overview', label: 'Overview' },
    { id: 'Schedule & Tasks', label: 'Schedule & Tasks' },
    { id: 'ALERTS', label: 'ALERTS', badge: pendingAlertsCount }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <button 
          onClick={() => navigate('/')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">MDO Module</h1>
          <p className="text-gray-600">View your activities, tasks, and schedules</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl p-2 card-shadow">
        <div className="flex space-x-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-4 rounded-lg transition-colors relative ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
              {tab.badge && tab.badge > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'Overview' && (
        <div className="space-y-6">
          {/* Activity Progress Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Monthly Activities */}
            <div className="bg-white rounded-xl p-6 card-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Monthly Activities</h3>
                <Calendar className="w-6 h-6 text-blue-600" />
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
                  <span className="font-semibold">84%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-blue-600 h-3 rounded-full" style={{ width: '84%' }}></div>
                </div>
              </div>
            </div>

            {/* Annual Activities */}
            <div className="bg-white rounded-xl p-6 card-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Annual Activities</h3>
                <TrendingUp className="w-6 h-6 text-purple-600" />
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
                  <span className="font-semibold">84%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-purple-600 h-3 rounded-full" style={{ width: '84%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="bg-white rounded-xl p-6 card-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">92%</div>
                <div className="text-sm text-blue-600">Visit Completion</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">₹4.2L</div>
                <div className="text-sm text-green-600">Sales MTD</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">28</div>
                <div className="text-sm text-purple-600">New Customers</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">85%</div>
                <div className="text-sm text-orange-600">Target Achievement</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule & Tasks Tab */}
      {activeTab === 'Schedule & Tasks' && (
        <div className="space-y-6">
          {/* Work Assignment Plan */}
          <div className="bg-white rounded-xl card-shadow">
            <button
              onClick={() => setShowWorkPlan(!showWorkPlan)}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Calendar className="w-6 h-6 text-purple-600" />
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-gray-900">Work Assignment Plan</h3>
                  <p className="text-sm text-gray-600">January 2024 Monthly Activities</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                  {workActivities.length} Activities
                </span>
                {showWorkPlan ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </button>

            {showWorkPlan && (
              <div className="px-6 pb-6">
                <div className="space-y-4">
                  {workActivities.map((activity) => (
                    <div key={activity.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            activity.status === 'Completed' ? 'bg-green-500' :
                            activity.status === 'In Progress' ? 'bg-blue-500' :
                            activity.status === 'Cancelled' ? 'bg-red-500' :
                            'bg-yellow-500'
                          }`}></div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{activity.activityType}</h4>
                            <p className="text-sm text-gray-600">{activity.village} • {activity.distributor}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{activity.date}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                        {activity.targetNumbers.farmers && (
                          <div className="text-center p-2 bg-blue-50 rounded">
                            <div className="text-lg font-bold text-blue-800">
                              {activity.actualNumbers?.farmers || 0}/{activity.targetNumbers.farmers}
                            </div>
                            <div className="text-xs text-blue-600">Farmers</div>
                          </div>
                        )}
                        {activity.targetNumbers.volume && (
                          <div className="text-center p-2 bg-green-50 rounded">
                            <div className="text-lg font-bold text-green-800">
                              {activity.actualNumbers?.volume || 0}/{activity.targetNumbers.volume}
                            </div>
                            <div className="text-xs text-green-600">Volume</div>
                          </div>
                        )}
                        {activity.targetNumbers.value && (
                          <div className="text-center p-2 bg-purple-50 rounded">
                            <div className="text-lg font-bold text-purple-800">
                              ₹{((activity.actualNumbers?.value || 0) / 1000).toFixed(0)}K/₹{(activity.targetNumbers.value / 1000).toFixed(0)}K
                            </div>
                            <div className="text-xs text-purple-600">Value</div>
                          </div>
                        )}
                      </div>

                      {activity.hasLocationDeviation && (
                        <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <AlertTriangle className="w-4 h-4 text-yellow-600" />
                            <span className="text-sm font-medium text-yellow-800">Location Deviation: {activity.locationDeviation?.toFixed(1)} km</span>
                          </div>
                          <div className="text-xs text-yellow-700">
                            <p>Assigned: {activity.assignedLocation}</p>
                            <p>Actual: {activity.actualLocation}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex space-x-2">
                        {activity.status === 'Scheduled' && (
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
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Today's Schedule */}
          <div className="bg-white rounded-xl p-6 card-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h3>
            <div className="space-y-3">
              {workActivities.filter(a => a.date === '2024-01-20').map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">{activity.time}</p>
                      <p className="text-sm text-gray-600">{activity.activityType}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    activity.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    activity.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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

                  {/* MDO Interface - Add remarks or view status */}
                  {deviation.status === 'Pending' && !deviation.remarks && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h5 className="font-medium text-yellow-800 mb-2">Add Explanation</h5>
                      <textarea
                        value={newRemarks[deviation.id] || ''}
                        onChange={(e) => setNewRemarks(prev => ({ ...prev, [deviation.id]: e.target.value }))}
                        placeholder="Explain reason for location deviation..."
                        className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        rows={3}
                      />
                      <button
                        onClick={() => submitRemarks(deviation.id)}
                        disabled={!newRemarks[deviation.id]?.trim()}
                        className="mt-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Submit Explanation
                      </button>
                    </div>
                  )}

                  {/* Show status for submitted/processed deviations */}
                  {(deviation.status !== 'Pending' || deviation.remarks) && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h5 className="font-medium text-gray-800 mb-2">MDO Explanation</h5>
                      <p className="text-sm text-gray-700 mb-3">{deviation.remarks}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          Submitted: {new Date(deviation.submittedDate).toLocaleDateString()}
                        </div>
                        <div className="text-sm">
                          {deviation.status === 'Pending' && (
                            <span className="text-yellow-600 font-medium">Yet to approve</span>
                          )}
                          {deviation.status === 'Approved' && (
                            <span className="text-green-600 font-medium">
                              Approved by {deviation.approvedBy}
                            </span>
                          )}
                          {deviation.status === 'Rejected' && (
                            <span className="text-red-600 font-medium">
                              Rejected by {deviation.approvedBy}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Time Deviations */}
          <div className="bg-white rounded-xl p-6 card-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Clock className="w-5 h-5 text-orange-600 mr-2" />
                Time Deviations
              </h3>
              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm font-medium">
                0 Pending
              </span>
            </div>
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No time deviations found</p>
            </div>
          </div>

          {/* Target Alerts */}
          <div className="bg-white rounded-xl p-6 card-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Target className="w-5 h-5 text-purple-600 mr-2" />
                Target Alerts
              </h3>
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm font-medium">
                0 Pending
              </span>
            </div>
            <div className="text-center py-8">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No target alerts found</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MDOModule;