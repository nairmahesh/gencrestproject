import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  MapPin, 
  ShoppingCart, 
  Droplets, 
  Users, 
  Calendar,
  CreditCard,
  TrendingUp,
  X,
  Smartphone
} from 'lucide-react';

interface SidebarProps {
  onClose?: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Field Visits', href: '/field-visits', icon: MapPin },
  { name: 'Sales Orders', href: '/sales-orders', icon: ShoppingCart },
  { name: 'Liquidation', href: '/liquidation', icon: Droplets },
  { name: 'Contacts', href: '/contacts', icon: Users },
  { name: 'Mobile App Design', href: '/mobile-design', icon: Smartphone },
  { name: 'Mobile App', href: '/mobile', icon: Smartphone },
];

const planningNavigation = [
  { name: 'Planning & Targets', href: '/planning', icon: Calendar },
];

const financialNavigation = [
  { name: 'Travel Reimbursement', href: '/travel', icon: CreditCard },
  { name: 'Performance & Incentives', href: '/performance', icon: TrendingUp },
];

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  return (
    <div className="flex flex-col h-full bg-white shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center">
          <img 
            src="/Gencrest logo copy.png" 
            alt="Gencrest" 
            className="h-8 w-auto"
          />
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900">
            <X className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-8">
        <div>
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Planning & Targets
          </h3>
          <ul className="mt-2 space-y-2">
            {planningNavigation.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Financial Management
          </h3>
          <ul className="mt-2 space-y-2">
            {financialNavigation.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <img 
            src="/Gencrest logo copy.png" 
            alt="Gencrest" 
            className="h-8 w-8 rounded-full object-contain bg-white p-1"
          />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">Gencrest</p>
            <p className="text-xs text-gray-500">Sales Team</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;