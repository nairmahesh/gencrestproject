import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import RoleBasedAccess from '../components/RoleBasedAccess';
import { Calendar, Target, Users, Plus, CheckCircle, Clock, AlertCircle, MapPin, ArrowLeft, ChevronDown } from 'lucide-react';
import { ActivityPlan, PlannedActivity } from '../types';
import { RouteTracker } from '../components/RouteTracker';

interface ActivityCategory {
  category: string;
  activities: string[];
}

const MDO_ACTIVITIES: ActivityCategory[] = [
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

export const Planning: React.FC = () => {
  const navigate = useNavigate();
  const { user, hasPermission } = useAuth();
  const [showCreateDropdown, setShowCreateDropdown] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPlanType, setSelectedPlanType] = useState<'MDO' | 'Self' | ''>('');
  const [plans, setPlans] = useState<ActivityPlan[]>([
    {
      id: '1',
      planType: 'Weekly',
      startDate: '2024-01-15',
      endDate: '2024-01-21',
      title: 'North Delhi Territory Coverage',
      description: 'Weekly plan for dealer visits and product demonstrations',
      assignedTo: 'MDO001',
      createdBy: 'TSM001',
      status: 'Approved',
      approvedBy: 'RMM001',
      activities: [
        {
          id: 'A1',
          date: '2024-01-15',
          village: 'Green Valley',
          distributor: 'Ram Kumar',
          activityType: 'Product Demo',
          description: 'Demonstrate new fertilizer line',
          expectedOutcome: 'Generate 5 leads',
          status: 'Completed',
          actualOutcome: '7 leads generated, 2 orders placed'
        },
        {
          id: 'A2',
          date: '2024-01-16',
          village: 'Sector 12',
          distributor: 'Suresh Traders',
          activityType: 'Stock Review',
          description: 'Review inventory and liquidation status',
          expectedOutcome: 'Clear 50% old stock',
          status: 'Pending'
        }
      ],
      targets: [
        {
          id: 'T1',
          metric: 'Dealer Visits',
          targetValue: 15,
          achievedValue: 12,
          unit: 'visits',
          period: 'Weekly'
        },
        {
          id: 'T2',
          metric: 'Sales Volume',
          targetValue: 50000,
          achievedValue: 45000,
          unit: 'INR',
          period: 'Weekly'
        }
      ]
    }
  ]);

  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  
  const currentUserRole = user?.role || 'MDO';
  const canCreatePlans = hasPermission('monthly_plans', 'create');

  const handleCreatePlan = (type: 'MDO' | 'Self') => {
    setSelectedPlanType(type);
    setShowCreateModal(true);
    setShowCreateDropdown(false);
  };

  const getStatusColor = (status: ActivityPlan['status']) => {
    switch (status) {
      case 'Approved': return 'text-green-600 bg-green-100';
      case 'In Progress': return 'text-blue-600 bg-blue-100';
      case 'Pending Approval': return 'text-yellow-600 bg-yellow-100';
      case 'Draft': return 'text-gray-600 bg-gray-100';
      case 'Completed': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getActivityStatusIcon = (status: PlannedActivity['status']) => {
    switch (status) {
      case 'Completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'Cancelled': return <AlertCircle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Planning & Targets</h1>
            <p className="text-gray-600">
              {currentUserRole === 'TSM' ? 'Create monthly plans for your team and yourself' :
               ['RBH', 'RMM'].includes(currentUserRole) ? 'Create monthly plans (no approval needed when TSM absent)' :
               'Manage activity plans and track performance'}
            </p>
          </div>
        </div>
        <RoleBasedAccess allowedRoles={['TSM', 'RBH', 'RMM', 'ZBH', 'MH', 'VP_SM']}>
          <div className="relative">
            {currentUserRole === 'TSM' ? (
              <>
                <button 
                  onClick={() => setShowCreateDropdown(!showCreateDropdown)}
                  className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create Plan
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {showCreateDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="py-2">
                      <button
                        onClick={() => handleCreatePlan('MDO')}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                      >
                        <div className="font-medium text-gray-900">For MDO</div>
                        <div className="text-sm text-gray-600">Create plan for team members</div>
                      </button>
                      <button
                        onClick={() => handleCreatePlan('Self')}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                      >
                        <div className="font-medium text-gray-900">For Self</div>
                        <div className="text-sm text-gray-600">Create your own plan</div>
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <button 
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
              >
                <Plus className="w-4 h-4" />
                Create Plan
              </button>
            )}
          </div>
        </RoleBasedAccess>
      </div>
      
      <div className="grid gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold">{plan.title}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(plan.startDate).toLocaleDateString()} - {new Date(plan.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(plan.status)}`}>
                {plan.status}
              </span>
            </div>
            
            <p className="text-gray-700 mb-4">{plan.description}</p>
            
            {plan.targets && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {plan.targets.map((target) => (
                  <div key={target.id} className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Target className="w-4 h-4 text-purple-600" />
                      <span className="text-sm text-gray-600">{target.metric}</span>
                    </div>
                    <p className="text-lg font-semibold">
                      {target.achievedValue}/{target.targetValue} {target.unit}
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${Math.min((target.achievedValue / target.targetValue) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {plan.activities && plan.activities.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium mb-2">Activities ({plan.activities.length})</h4>
                <div className="space-y-2">
                  {plan.activities.slice(0, 3).map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                      {getActivityStatusIcon(activity.status)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{activity.activityType}</span>
                          <span className="text-sm text-gray-500">- {activity.village}</span>
                        </div>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(activity.date).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                  {plan.activities.length > 3 && (
                    <p className="text-sm text-gray-500 text-center">
                      +{plan.activities.length - 3} more activities
                    </p>
                  )}
                </div>
              </div>
            )}
            
            <div className="flex gap-2 flex-wrap">
              <button 
                onClick={() => setSelectedPlan(selectedPlan === plan.id ? null : plan.id)}
                className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
              >
                {selectedPlan === plan.id ? 'Hide Details' : 'View Details'}
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Update Progress
              </button>
              {plan.status === 'Approved' && (
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Track Route
                </button>
              )}
            </div>
            
            {selectedPlan === plan.id && (
              <div className="mt-6 pt-6 border-t">
                <RouteTracker
                  plannedRoute={plan.activities?.map(activity => ({
                    id: activity.id,
                    name: `${activity.village} - ${activity.distributor}`,
                    latitude: 28.6139 + Math.random() * 0.1,
                    longitude: 77.2090 + Math.random() * 0.1,
                    status: activity.status === 'Completed' ? 'visited' as const : 'pending' as const
                  })) || []}
                  onRouteUpdate={(route) => {
                    console.log('Route updated:', route);
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Create Plan Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Create Monthly Plan {selectedPlanType && `- ${selectedPlanType === 'MDO' ? 'For MDO Team' : 'For Self'}`}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Plan activities based on business requirements
                </p>
              </div>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setSelectedPlanType('');
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-6">
                {/* Plan Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Plan Title</label>
                    <input
                      type="text"
                      placeholder="Enter plan title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                      <option>February 2024</option>
                      <option>March 2024</option>
                      <option>April 2024</option>
                    </select>
                {/* Activity Categories */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Activity Categories</h4>
                  <div className="space-y-4">
                    {MDO_ACTIVITIES.map((category, categoryIndex) => (
                      <div key={categoryIndex} className="bg-gray-50 rounded-xl p-4">
                        <h5 className="font-semibold text-gray-900 mb-3">{category.category}</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {category.activities.map((activity, activityIndex) => (
                            <div key={activityIndex} className="bg-white rounded-lg p-3 border border-gray-200">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-900">{activity}</span>
                                <input
                                  type="number"
                                  placeholder="0"
                                  min="0"
                                  className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                  </div>
                {/* Targets Section */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Monthly Targets</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <label className="block text-sm font-medium text-blue-700 mb-2">Dealer Visits</label>
                      <input
                        type="number"
                        placeholder="Enter target visits"
                        className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <label className="block text-sm font-medium text-green-700 mb-2">Sales Volume (₹)</label>
                      <input
                        type="number"
                        placeholder="Enter sales target"
                        className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <label className="block text-sm font-medium text-purple-700 mb-2">New Customers</label>
                      <input
                        type="number"
                        placeholder="Enter customer target"
                        className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 p-6 border-t">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setSelectedPlanType('');
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle plan creation logic here
                  alert(`Creating plan ${selectedPlanType === 'MDO' ? 'for MDO team' : 'for self'}`);
                  setShowCreateModal(false);
                  setSelectedPlanType('');
                }}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Create Plan
              </button>
            </div>
          </div>
        </div>
      )}
                </div>
      {/* Click outside to close dropdown */}
      {showCreateDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowCreateDropdown(false)}
        />
      )}
    </div>
  );
};