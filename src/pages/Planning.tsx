/**
 * File: src/pages/Planning.tsx
 * Author: GSDP INTEGRATION
 *
 * Purpose: This component displays the work plans assigned to the logged-in user.
 * It fetches data from the API and provides navigation to log activity progress.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle, Clock, ArrowLeft, Plus } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../auth/AuthContext';

// --- Interfaces for Data Structures ---

interface IPlannedActivity {
  _id: string;
  date: string;
  village: string;
  distributor: string;
  activityType: string;
  description: string;
  expectedOutcome: string;
  status: 'Pending' | 'Completed' | 'Cancelled';
}

interface IPlan {
  _id: string;
  planType: 'Weekly' | 'Monthly';
  startDate: string;
  endDate: string;
  title: string;
  description: string;
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'In Progress' | 'Completed';
  activities: IPlannedActivity[];
}

export const Planning: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [plans, setPlans] = useState<IPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const fetchPlans = async () => {
        try {
          setLoading(true);
          const fetchedPlans = await api.getPlansForUser(user.id!);
          setPlans(fetchedPlans);
          setError(null);
        } catch (err) {
          setError("Failed to load work plans.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchPlans();
    }
  }, [user]);

  const getStatusColor = (status: IPlan['status']) => {
    switch (status) {
      case 'Approved': return 'text-green-600 bg-green-100';
      case 'In Progress': return 'text-blue-600 bg-blue-100';
      case 'Pending Approval': return 'text-yellow-600 bg-yellow-100';
      case 'Draft': return 'text-gray-600 bg-gray-100';
      case 'Completed': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getActivityStatusIcon = (status: IPlannedActivity['status']) => {
    switch (status) {
      case 'Completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'Cancelled': return <Clock className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading work plans...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-600">{error}</div>;
  }

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
            <h1 className="text-2xl font-bold text-gray-900">My Work Plans</h1>
            <p className="text-gray-600">View and execute your assigned activities.</p>
          </div>
        </div>
        {user?.role === 'TSM' && ( // "Create Plan" is a TSM feature
          <button 
            onClick={() => navigate('/planning/create')} // Navigate to a future create plan page
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            <Plus className="w-4 h-4" />
            Create Plan
          </button>
        )}
      </div>

      <div className="grid gap-6">
        {plans.length > 0 ? (
          plans.map((plan) => (
            <div key={plan._id} className="bg-white rounded-lg border p-6">
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
              
              {plan.activities && plan.activities.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Activities ({plan.activities.length})</h4>
                  <div className="space-y-2">
                    {plan.activities.map((activity) => (
                      <div key={activity._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        {getActivityStatusIcon(activity.status)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{activity.activityType}</span>
                            <span className="text-sm text-gray-500">- {activity.village}</span>
                          </div>
                          <p className="text-sm text-gray-600">{activity.description}</p>
                        </div>
                        <button 
                          onClick={() => navigate(`/field-visits/${activity._id}`)} // Navigate to log progress
                          className="px-4 py-2 border border-gray-300 text-sm rounded-lg hover:bg-gray-100"
                        >
                          Update Progress
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No work plans have been assigned to you yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};