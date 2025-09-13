import React, { useState } from 'react';
import { Calendar, Target, Users, Plus, CheckCircle, Clock, AlertCircle, MapPin } from 'lucide-react';
import { ActivityPlan, PlannedActivity } from '../types';
import { RouteTracker } from '../components/RouteTracker';

export const Planning: React.FC = () => {
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
  const [showCreatePlan, setShowCreatePlan] = useState(false);

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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Planning & Targets</h1>
          <p className="text-gray-600">Manage activity plans and track performance</p>
        </div>
        <button 
          onClick={() => setShowCreatePlan(true)}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          <Plus className="w-4 h-4" />
          Create Plan
        </button>
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
    </div>
  );
};