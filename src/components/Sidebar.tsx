// frontend.zip/src/components/Sidebar.tsx

import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  MapPin,
  ShoppingCart,
  Droplets,
  Users,
  X,
  Calendar,
  CreditCard,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

interface SidebarProps {
  onClose?: () => void;
}

// Simplified navigation for MDO role
const mdoNavigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'My Activities', href: '/field-visits', icon: MapPin },
  { name: 'Sales Orders', href: '/sales-orders', icon: ShoppingCart },
  { name: 'Liquidation', href: '/liquidation', icon: Droplets },
  { name: 'Contacts', href: '/contacts', icon: Users },
];

const managerNavigation = [
  ...mdoNavigation,
  { name: 'Planning & Targets', href: '/planning', icon: Calendar },
  { name: 'Travel Reimbursement', href: '/travel', icon: CreditCard },
  { name: 'Performance & Incentives', href: '/performance', icon: TrendingUp },
];

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { user } = useAuth();

  // Determine which navigation to display based on role
  const getNavigationForRole = (role: string | undefined) => {
    switch (role) {
      case 'MDO':
      case 'SO':
        return mdoNavigation;
      case 'TSM': // Add other manager roles here
      case 'RMM':
      case 'ZBH':
        return managerNavigation;
      default:
        // Default to MDO navigation or an empty array if no user
        return user ? mdoNavigation : [];
    }
  };

  const navigation = getNavigationForRole(user?.role);
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
          <button onClick={onClose} className=" p-2 rounded-md text-gray-600 hover:text-gray-900">
            <X className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive
                    ? 'bg-purple-50 text-purple-700'
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
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-gray-200">
        {/* User info can be dynamically populated here in the future */}
      </div>
    </div>
  );
};

export default Sidebar;