import React, { useState } from 'react';
import { Users, LogOut, ChevronDown, Shield, Crown, Award, Target } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getRoleByCode } from '../types/hierarchy';

const UserSwitcher: React.FC = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  if (!user) return null;

  const userRole = getRoleByCode(user.role);

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

  const getLevelIcon = (level: number) => {
    if (level >= 8) return <Crown className="w-4 h-4" />;
    if (level >= 6) return <Award className="w-4 h-4" />;
    if (level >= 3) return <Target className="w-4 h-4" />;
    return <Shield className="w-4 h-4" />;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold text-sm">
            {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </span>
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-gray-900">{user.name}</p>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
              {user.role}
            </span>
            <span className="text-xs text-gray-500">{user.territory}</span>
          </div>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {showDropdown && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.employeeCode}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                    {userRole?.name}
                  </span>
                  <div className="flex items-center text-xs text-gray-500">
                    {getLevelIcon(userRole?.level || 1)}
                    <span className="ml-1">Level {userRole?.level}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium">{user.phone}</span>
              </div>
              {user.territory && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Territory:</span>
                  <span className="font-medium">{user.territory}</span>
                </div>
              )}
              {user.region && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Region:</span>
                  <span className="font-medium">{user.region}</span>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => {
                logout();
                setShowDropdown(false);
              }}
              className="w-full flex items-center justify-center space-x-2 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Switch User</span>
            </button>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default UserSwitcher;