import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  bgColor,
}) => {
  return (
    <div className="bg-white rounded-xl p-4 card-shadow card-hover">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 ${bgColor} rounded-full flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
        <div className="text-sm text-gray-600">{subtitle}</div>
      </div>
    </div>
  );
};

export default StatsCard;