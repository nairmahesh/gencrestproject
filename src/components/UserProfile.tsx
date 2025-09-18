import React from 'react';
import { User, Shield, MapPin, Phone, Mail, Calendar, Building } from 'lucide-react';
import { User as UserType, ROLE_HIERARCHY, getRoleByCode } from '../types/hierarchy';

interface UserProfileProps {
  user: UserType;
  showFullDetails?: boolean;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, showFullDetails = false }) => {
  const role = getRoleByCode(user.role.code);
  const supervisor = user.reportsTo ? ROLE_HIERARCHY.find(r => r.code === user.reportsTo) : null;

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

  const getLevelBadge = (level: number) => {
    if (level <= 2) return 'Field Level';
    if (level <= 4) return 'Regional Level';
    if (level <= 6) return 'Zonal Level';
    return 'Executive Level';
  };

  return (
    <div className="bg-white rounded-xl p-6 card-shadow">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          {user.profileImage ? (
            <img src={user.profileImage} alt={user.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            <span className="text-white font-bold text-xl">
              {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </span>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role.code)}`}>
              {user.role.name}
            </span>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className="flex items-center">
              <Shield className="w-4 h-4 mr-1" />
              Level {user.role.level} - {getLevelBadge(user.role.level)}
            </span>
            <span className="flex items-center">
              <Building className="w-4 h-4 mr-1" />
              {user.employeeCode}
            </span>
          </div>
        </div>
      </div>

      {showFullDetails && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 mr-2" />
                {user.email}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-2" />
                {user.phone}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                Joined: {new Date(user.joinDate).toLocaleDateString()}
              </div>
            </div>
            
            <div className="space-y-2">
              {user.territory && (
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  {user.territory}
                </div>
              )}
              {user.region && (
                <div className="text-sm text-gray-600">
                  Region: {user.region}
                </div>
              )}
              {user.zone && (
                <div className="text-sm text-gray-600">
                  Zone: {user.zone}
                </div>
              )}
            </div>
          </div>

          {supervisor && (
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Reports to:</p>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{supervisor.name}</p>
                  <p className="text-xs text-gray-500">Level {supervisor.level}</p>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Permissions:</p>
            <div className="flex flex-wrap gap-1">
              {user.role.permissions.slice(0, 4).map((permission, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                  {permission.module.replace('_', ' ')}
                </span>
              ))}
              {user.role.permissions.length > 4 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                  +{user.role.permissions.length - 4} more
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};