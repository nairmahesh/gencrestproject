import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Shield, Crown, Award, Target, Users, Building } from 'lucide-react';
import { getRoleByCode } from '../types/hierarchy';

const RoleBanner: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const userRole = getRoleByCode(user.role);

  const getRoleColor = (roleCode: string) => {
    switch (roleCode) {
      case 'MDO': return 'from-blue-500 to-blue-600';
      case 'TSM': return 'from-green-500 to-green-600';
      case 'RBH': return 'from-purple-500 to-purple-600';
      case 'RMM': return 'from-orange-500 to-orange-600';
      case 'ZBH': return 'from-indigo-500 to-indigo-600';
      case 'MH': return 'from-pink-500 to-pink-600';
      case 'VP_SM': return 'from-red-500 to-red-600';
      case 'MD': return 'from-gray-800 to-gray-900';
      case 'CHRO': return 'from-teal-500 to-teal-600';
      case 'CFO': return 'from-yellow-500 to-yellow-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getLevelIcon = (level: number) => {
    if (level >= 8) return <Crown className="w-5 h-5" />;
    if (level >= 6) return <Award className="w-5 h-5" />;
    if (level >= 3) return <Target className="w-5 h-5" />;
    return <Shield className="w-5 h-5" />;
  };

  const getLevelDescription = (level: number) => {
    if (level <= 2) return 'Field Level';
    if (level <= 4) return 'Regional Level';
    if (level <= 6) return 'Zonal Level';
    return 'Executive Level';
  };

  return (
    <div className={`bg-gradient-to-r ${getRoleColor(user.role)} text-white p-4 rounded-xl mb-6`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            {getLevelIcon(userRole?.level || 1)}
          </div>
          <div>
            <h2 className="text-lg font-bold">{user.name}</h2>
            <p className="text-white/90 text-sm">{userRole?.name}</p>
            <p className="text-white/80 text-xs">
              Level {userRole?.level} - {getLevelDescription(userRole?.level || 1)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-white/90 text-sm">
            {user.territory || user.region || user.zone || 'Head Office'}
          </div>
          <div className="text-white/80 text-xs">
            {user.employeeCode}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleBanner;