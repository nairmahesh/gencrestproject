import React from 'react';
import { Plus, MapPin, Camera, FileText, Users, DollarSign, Package, Calendar } from 'lucide-react';

const QuickActions: React.FC = () => {
  const actions = [
    {
      name: 'New Visit',
      icon: Plus,
      color: 'bg-green-500 hover:bg-green-600',
      description: 'Schedule visit'
    },
    {
      name: 'Check In',
      icon: MapPin,
      color: 'bg-blue-500 hover:bg-blue-600',
      description: 'Start location'
    },
    {
      name: 'Capture',
      icon: Camera,
      color: 'bg-purple-500 hover:bg-purple-600',
      description: 'Take photo'
    },
    {
      name: 'Order',
      icon: Package,
      color: 'bg-orange-500 hover:bg-orange-600',
      description: 'Create order'
    },
    {
      name: 'Collection',
      icon: DollarSign,
      color: 'bg-indigo-500 hover:bg-indigo-600',
      description: 'Record payment'
    },
    {
      name: 'Report',
      icon: FileText,
      color: 'bg-teal-500 hover:bg-teal-600',
      description: 'Generate report'
    },
    {
      name: 'Customer',
      icon: Users,
      color: 'bg-pink-500 hover:bg-pink-600',
      description: 'Add customer'
    },
    {
      name: 'Plan',
      icon: Calendar,
      color: 'bg-yellow-500 hover:bg-yellow-600',
      description: 'Create plan'
    },
  ];

  return (
    <div className="bg-white rounded-xl p-6 card-shadow">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-4 lg:grid-cols-8 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            className={`${action.color} text-white p-4 rounded-xl transition-all duration-200 flex flex-col items-center space-y-2 hover:scale-105 hover:shadow-lg`}
            title={action.description}
          >
            <action.icon className="w-6 h-6" />
            <span className="text-xs font-medium text-center leading-tight">{action.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;