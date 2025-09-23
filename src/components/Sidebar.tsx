import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import RoleBasedAccess from './RoleBasedAccess';
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
  Smartphone,
  Shield,
  UserCheck
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  onClose?: () => void;
}

const MDOModuleNav: React.FC = () => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const { user } = useAuth();
  
  // Only show for MDO role
  if (user?.role !== 'MDO') return null;

  return (
    <div>
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors text-gray-700 hover:bg-gray-100 cursor-pointer"
      >
        <div className="flex items-center">
          <Calendar className="mr-3 h-5 w-5" />
          MDO Module
        </div>
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 text-gray-600" />
        ) : (
          <ChevronRight className="h-4 w-4 text-gray-600" />
        )}
      </div>
      
      {isExpanded && (
        <div className="ml-8 mt-2 space-y-1">
          <NavLink
            to="/field-visits"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <MapPin className="mr-3 h-4 w-4" />
            Field Visits
          </NavLink>
        </div>
      )}
    </div>
  );
};
const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'MDO Module', href: '/mdo-module', icon: Calendar, allowedRoles: ['MDO'], isSubmenu: true },
  { name: 'User Management', href: '/user-management', icon: Shield, allowedRoles: ['MD', 'CHRO', 'VP_SM', 'ZBH', 'MH'] },
  { name: 'Field Visits', href: '/field-visits', icon: MapPin, allowedRoles: ['TSM', 'RBH', 'RMM', 'ZBH', 'MH', 'VP_SM'] },
  { name: 'Sales Orders', href: '/sales-orders', icon: ShoppingCart },
  { name: 'Liquidation', href: '/liquidation', icon: Droplets },
  { name: 'Contacts', href: '/contacts', icon: Users },
  { name: 'Approvals', href: '/approvals', icon: UserCheck, allowedRoles: ['TSM', 'RBH', 'RMM', 'ZBH', 'MH', 'VP_SM'] },
  { name: 'Mobile App Design', href: '/mobile-design', icon: Smartphone, allowedRoles: ['MD', 'VP_SM', 'MH'] },
  { name: 'Mobile App', href: '/mobile', icon: Smartphone },
];

const planningNavigation = [
  { name: 'Planning & Targets', href: '/planning', icon: Calendar, allowedRoles: ['TSM', 'RBH', 'RMM', 'ZBH', 'MH', 'VP_SM'] },
];

const financialNavigation = [
  { name: 'Travel Reimbursement', href: '/travel', icon: CreditCard },
  { name: 'Performance & Incentives', href: '/performance', icon: TrendingUp },
];

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { user } = useAuth();

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
              <RoleBasedAccess 
                key={item.name}
                allowedRoles={item.allowedRoles}
              >
                {item.name === 'MDO Module' && user?.role === 'MDO' ? (
                  <li>
                    <MDOModuleNav />
                  </li>
                ) : (
                  <li>
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
                )}
              </RoleBasedAccess>
            ))}
          </ul>
        </div>

        <RoleBasedAccess allowedRoles={['TSM', 'RBH', 'RMM', 'ZBH', 'MH', 'VP_SM']}>
          <div>
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Planning & Targets
            </h3>
            <ul className="mt-2 space-y-2">
              {planningNavigation.map((item) => (
                <RoleBasedAccess 
                  key={item.name}
                  allowedRoles={item.allowedRoles}
                >
                  <li>
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
                </RoleBasedAccess>
              ))}
            </ul>
          </div>
        </RoleBasedAccess>

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
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-xs">
              {user?.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'GC'}
            </span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-500">{user?.role || 'Role'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;