import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calendar, CheckSquare, Droplets, BarChart3, Smartphone } from 'lucide-react';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Schedule', href: '/field-visits', icon: Calendar },
  { name: 'Tasks', href: '/sales-orders', icon: CheckSquare },
  { name: 'Liquidation', href: '/liquidation', icon: Droplets },
  { name: 'Reports', href: '/performance', icon: BarChart3 },
  { name: 'Mobile', href: '/mobile', icon: Smartphone },
];

const MobileNavigation: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 lg:hidden">
      <div className="flex justify-around">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isActive
                  ? 'text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`
            }
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">{item.name}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default MobileNavigation;