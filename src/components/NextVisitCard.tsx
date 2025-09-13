import React from 'react';
import { MapPin, Clock, AlertCircle, Navigation, Phone, User } from 'lucide-react';

interface Visit {
  id: string;
  customerName: string;
  time: string;
  location: string;
  type: string;
  priority: 'high' | 'medium' | 'low';
  distance?: string;
  estimatedDuration?: string;
}

interface NextVisitCardProps {
  visit: Visit;
}

const NextVisitCard: React.FC<NextVisitCardProps> = ({ visit }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{visit.customerName}</h3>
            <p className="text-sm text-gray-600">{visit.type}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(visit.priority)}`}>
          {visit.priority.toUpperCase()}
        </span>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-2" />
          <span>{visit.time}</span>
          {visit.estimatedDuration && (
            <span className="ml-2 text-gray-500">({visit.estimatedDuration})</span>
          )}
        </div>
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-2" />
          <span>{visit.location}</span>
          {visit.distance && (
            <span className="ml-2 text-gray-500">• {visit.distance}</span>
          )}
        </div>
        <div className="flex items-center">
          <AlertCircle className="w-4 h-4 mr-2" />
          <span>{visit.type}</span>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <button className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
          <Navigation className="w-4 h-4 mr-2" />
          Start Visit
        </button>
        <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Phone className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default NextVisitCard;