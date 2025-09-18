import React from 'react';
import { Menu, Bell, Search, User } from 'lucide-react';
import { getRoleByCode } from '../types/hierarchy';

interface HeaderProps {
  onMenuClick: () => void;
  currentUser?: {
    name: string;
    role: string;
    territory?: string;
  };
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, currentUser }) => {
  const userRole = currentUser ? getRoleByCode(currentUser.role) : null;
  
  const getRoleColor = (roleCode: string) => {
    switch (roleCode) {
      case 'MDO': return 'bg-blue-100 text-blue-800';
      case 'TSM': return 'bg-green-100 text-green-800';
      case 'RBH': return 'bg-purple-100 text-purple-800';
      case 'RMM': return 'bg-orange-100 text-orange-800';
      case 'ZBH': return 'bg-indigo-100 text-indigo-800';
      case 'MH': return 'bg-pink-100 text-pink-800';
      case 'VP_SM': return 'bg-red-100 text-red-800';
      case 'MD': return 'bg-gray-900 text-white';
      case 'CHRO': return 'bg-teal-100 text-teal-800';
      case 'CFO': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="hidden sm:flex items-center ml-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-600 hover:text-gray-900">
            <Bell className="h-6 w-6" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="flex items-center space-x-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900">
                {currentUser?.name || 'Rajesh Kumar'}
              </p>
              <div className="flex items-center justify-end space-x-2">
                {userRole && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(currentUser?.role || 'MDO')}`}>
                    {userRole.code}
                  </span>
                )}
                <span className="text-xs text-gray-500">
                  {currentUser?.territory || 'North Delhi'}
                </span>
              </div>
            </div>
            <div className="h-8 w-8 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {currentUser?.name ? currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'RK'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;